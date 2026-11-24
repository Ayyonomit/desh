import { T } from "@/lib/i18n";

export default function Badge({ s, lang }) {
  const t = T[lang];
  const text = s.verdict === "confirmed" ? t.confirmed(s.n)
    : s.verdict === "factcheck" ? t.factcheck(s.factcheckBy) : t.unverified(s.n);
  return <span className={`badge ${s.verdict}`}>{text}</span>;
}
