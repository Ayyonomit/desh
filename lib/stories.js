import { db } from "@/lib/db";

function shape(rows, lang) {
  const byCluster = new Map();
  for (const r of rows) {
    if (!byCluster.has(r.cluster_id)) byCluster.set(r.cluster_id, []);
    byCluster.get(r.cluster_id).push(r);
  }
  const out = [];
  for (const [id, items] of byCluster) {
    items.sort((a, b) => new Date(a.published_at) - new Date(b.published_at));
    const head = items.find((i) => i.processed && i.image) || items.find((i) => i.processed) || items[0];
    const names = [...new Set(items.map((i) => i.source))];
    const fc = items.find((i) => i.is_factcheck);
    out.push({
      id, head, items, sources: names, n: names.length,
      verdict: fc ? "factcheck" : names.length >= 3 ? "confirmed" : "unverified",
      factcheckBy: fc?.source,
      title: (lang === "hi" ? head.title_hi : head.title_en) || head.title,
      summary: (lang === "hi" ? head.summary_hi : head.summary_en) || head.snippet || "",
      category: head.category,
      image: items.find((i) => i.image)?.image || null,
      published_at: items[items.length - 1].published_at,
      breaking: items.some((i) => i.breaking),
      video: items.find((i) => i.video_id)?.video_id || null,
    });
  }
  return out.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
}

export async function getStories(lang) {
  const since = new Date(Date.now() - 48 * 3600 * 1000).toISOString();
  const { data } = await db.from("stories").select("*").eq("lang", lang).gte("published_at", since).limit(400);
  return shape(data || [], lang);
}

export async function getStory(clusterId, lang) {
  const { data } = await db.from("stories").select("*").eq("cluster_id", clusterId);
  if (!data?.length) return null;
  return shape(data, lang)[0];
}
