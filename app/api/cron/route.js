import Parser from "rss-parser";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";
import { FEEDS } from "@/lib/feeds";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const parser = new Parser({
  timeout: 8000,
  customFields: { item: [["media:content", "media"], ["media:thumbnail", "thumb"]] },
});

const toks = (t) =>
  new Set(t.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3));
const jaccard = (a, b) => {
  let i = 0;
  for (const x of a) if (b.has(x)) i++;
  return i / (a.size + b.size - i || 1);
};
const clean = (s = "") => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim().slice(0, 500);

async function collect() {
  const found = [];
  await Promise.all(
    FEEDS.map(async (f) => {
      try {
        const feed = await parser.parseURL(f.url);
        for (const it of feed.items.slice(0, 15)) {
          if (!it.link || !it.title) continue;
          found.push({
            lang: f.lang, source: f.name, is_factcheck: !!f.factcheck, link: it.link, title: clean(it.title),
            snippet: clean(it.contentSnippet || it.content || ""),
            image: it.enclosure?.url || it.media?.$?.url || it.thumb?.$?.url || null,
            published_at: new Date(it.isoDate || it.pubDate || Date.now()).toISOString(),
          });
        }
      } catch (e) {
        console.log("feed failed:", f.name, e.message);
      }
    })
  );
  if (!found.length) return 0;

  const { data: have } = await db.from("stories").select("link").in("link", found.map((x) => x.link));
  const seen = new Set((have || []).map((h) => h.link));
  const fresh = found.filter((x) => !seen.has(x.link));
  if (!fresh.length) return 0;

  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  const { data: recent } = await db.from("stories").select("lang,title,cluster_id").gte("published_at", since);
  const pool = (recent || []).map((r) => ({ lang: r.lang, t: toks(r.title), cid: r.cluster_id }));

  const rows = [];
  for (const x of fresh) {
    const t = toks(x.title);
    const m = pool.find((p) => p.lang === x.lang && jaccard(t, p.t) >= 0.45);
    const cid = m ? m.cid : crypto.randomUUID();
    pool.push({ lang: x.lang, t, cid });
    rows.push({ ...x, cluster_id: cid });
  }
  const { error } = await db.from("stories").upsert(rows, { onConflict: "link", ignoreDuplicates: true });
  if (error) console.log("insert error:", error.message);
  return rows.length;
}

async function findVideo(q) {
  if (!process.env.YOUTUBE_API_KEY) return null;
  try {
    const u = new URL("https://www.googleapis.com/youtube/v3/search");
    u.search = new URLSearchParams({
      part: "snippet", type: "video", maxResults: "1", videoEmbeddable: "true", q,
      publishedAfter: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), key: process.env.YOUTUBE_API_KEY,
    });
    const j = await (await fetch(u)).json();
    return j.items?.[0]?.id?.videoId || null;
  } catch { return null; }
}

async function enrich() {
  if (!process.env.ANTHROPIC_API_KEY) return 0;
  const ai = new Anthropic();
  const { data: todo } = await db.from("stories").select("*").eq("processed", false)
    .order("published_at", { ascending: false }).limit(6);
  if (!todo?.length) return 0;

  await Promise.all(todo.map(async (s) => {
    try {
      const msg = await ai.messages.create({
        model: process.env.AI_MODEL || "claude-haiku-5-5",
        max_tokens: 700,
        system:
          "You are a careful news editor for an Indian news site. Use ONLY the headline and snippet given. Never add facts, names, numbers or quotes that are not in them. Reply with JSON only, no markdown.",
        messages: [{ role: "user", content:
          `Source: ${s.source}\nHeadline: ${s.title}\nSnippet: ${s.snippet || "(none)"}\n\n` +
          `Return JSON with keys: title_en, title_hi (neutral headline in English and Hindi), ` +
          `summary_en, summary_hi (2 sentences each, plain wording, Hindi in Devanagari), ` +
          `category (one of: India, World, Politics, Business, Sports, Entertainment, Tech), ` +
          `breaking (true only for a major, developing event).` }],
      });
      const txt = msg.content.map((c) => c.text || "").join("").replace(/```json|```/g, "").trim();
      const j = JSON.parse(txt);
      const recent = Date.now() - new Date(s.published_at) < 3 * 3600 * 1000;
      const breaking = !!j.breaking && recent;
      const video_id = breaking ? await findVideo(j.title_en) : null;
      await db.from("stories").update({
        title_en: j.title_en, title_hi: j.title_hi, summary_en: j.summary_en, summary_hi: j.summary_hi,
        category: j.category, breaking, video_id, processed: true,
      }).eq("id", s.id);
    } catch (e) {
      console.log("enrich failed:", s.id, e.message);
    }
  }));
  return todo.length;
}

export async function GET(req) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
    return new Response("Unauthorized", { status: 401 });
  const added = await collect();
  const processed = await enrich();
  return Response.json({ added, processed });
}
