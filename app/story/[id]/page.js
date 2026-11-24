import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Badge from "@/components/Badge";
import { getStory } from "@/lib/stories";
import { T } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function StoryPage({ params, searchParams }) {
  const lang = searchParams.lang === "hi" ? "hi" : "en";
  const t = T[lang];
  const s = await getStory(params.id, lang);
  if (!s) notFound();

  return (
    <>
      <Header lang={lang} />
      <main className="wrap">
        <article>
          <Link className="back" href={`/?lang=${lang}`}>{t.back}</Link>
          <div className="meta" style={{ marginTop: 14 }}>
            {s.category && <span className="tag">{t.cats[s.category] || s.category}</span>}
            <Badge s={s} lang={lang} />
          </div>
          <h1>{s.title}</h1>
          <p className="lede">{s.summary}</p>
          {s.image && <div className="img" style={{ marginTop: 18 }}><img src={s.image} alt="" referrerPolicy="no-referrer" /></div>}
          {s.video && (
            <div className="vid">
              <iframe src={`https://www.youtube-nocookie.com/embed/${s.video}`} title="Video" allowFullScreen loading="lazy" />
            </div>
          )}
          <div className="box">
            <h4>{t.sources}</h4>
            <ul>
              {s.items.map((i) => (
                <li key={i.id}>
                  {i.source}: <a href={i.link} target="_blank" rel="noopener noreferrer">{t.read}</a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </main>
    </>
  );
}
