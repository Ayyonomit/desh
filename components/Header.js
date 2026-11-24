import Link from "next/link";
import { CATS, T } from "@/lib/i18n";

export default function Header({ lang, cat = "" }) {
  const t = T[lang];
  const q = (l, c) => `/?lang=${l}${c ? `&cat=${c}` : ""}`;
  return (
    <header>
      <div className="wrap">
        <div className="top">
          <Link className="logo" href={q(lang, "")}>Desh<b>Dispatch</b></Link>
          <div className="lang">
            <Link className={lang === "en" ? "on" : ""} href={q("en", cat)}>English</Link>
            <Link className={lang === "hi" ? "on" : ""} href={q("hi", cat)}>हिन्दी</Link>
          </div>
        </div>
        <nav>
          <Link className={!cat ? "on" : ""} href={q(lang, "")}>{t.top}</Link>
          {CATS.map((c) => (
            <Link key={c} className={cat === c ? "on" : ""} href={q(lang, c)}>{t.cats[c]}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
