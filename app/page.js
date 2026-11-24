import Link from "next/link";
import Header from "@/components/Header";
import Badge from "@/components/Badge";
import { getStories } from "@/lib/stories";
import { T } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function ago(d, lang) {
  const m = Math.max(1, Math.round((Date.now() - new Date(d)) / 60000));
  if (lang === "hi") return m < 60 ? `${m} मिनट पहले` : `${Math.round(m / 60)} घंटे पहले`;
  return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} hr ago`;
}

export default async function Home({ searchParams }) {
  const lang = searchParams.lang === "hi" ? "hi" : "en";
  const cat = searchParams.cat || "";
  const t = T[lang];
  let list = await getStories(lang);
  if (cat) list = list.filter((s) => s.category === cat);
  const [hero, ...rest] = list;
  const href = (s) => `/story/${s.id}?lang=${lang}`;

  return (
    <>
      <Header lang={lang} cat={cat} />
      <main className="wrap">
        {!hero && <p className="empty">{t.empty}</p>}
        {hero && (
          <Link className="hero" href={href(hero)}>
            {hero.image && <div className="img"><img src={hero.image} alt="" referrerPolicy="no-referrer" /></div>}
            <h1>{hero.breaking && <span className="tag">{t.breaking}<br /></span>}{hero.title}</h1>
            <p>{hero.summary}</p>
            <div className="meta" style={{ marginTop: 10 }}>
              <Badge s={hero} lang={lang} /><span>{hero.head.source}</span><span>{ago(hero.published_at, lang)}</span>
            </div>
          </Link>
        )}
        {rest.length > 0 && (
          <div className="grid">
            {rest.slice(0, 30).map((s) => (
              <Link key={s.id} className="card" href={href(s)}>
                {s.image && <div className="img"><img src={s.image} alt="" loading="lazy" referrerPolicy="no-referrer" /></div>}
                <h3>{s.title}</h3>
                <div className="meta"><Badge s={s} lang={lang} /><span>{ago(s.published_at, lang)}</span></div>
              </Link>
            ))}
          </div>
        )}
        <div className="how">{t.how}</div>
      </main>
      <footer><div className="wrap">Desh Dispatch</div></footer>
    </>
  );
}
