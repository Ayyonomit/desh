export const CATS = ["India", "World", "Politics", "Business", "Sports", "Entertainment", "Tech"];
export const T = {
  en: {
    top: "Top stories", breaking: "BREAKING", back: "Back to front page", sources: "Sources", read: "Read original",
    confirmed: (n) => `Confirmed by ${n} sources`, unverified: (n) => `Unverified: ${n} source`,
    factcheck: (s) => `Fact-check by ${s}`, empty: "No stories yet. The first update runs within 15 minutes of going live.",
    how: "How we check: each story is compared across several outlets. Confirmed means three or more independent sources. Sources are always listed.",
    cats: { India: "India", World: "World", Politics: "Politics", Business: "Business", Sports: "Sports", Entertainment: "Entertainment", Tech: "Tech" },
  },
  hi: {
    top: "मुख्य खबरें", breaking: "ब्रेकिंग", back: "मुख्य पृष्ठ पर लौटें", sources: "स्रोत", read: "मूल खबर पढ़ें",
    confirmed: (n) => `${n} स्रोतों से पुष्टि`, unverified: (n) => `अपुष्ट: ${n} स्रोत`,
    factcheck: (s) => `${s} द्वारा फैक्ट-चेक`, empty: "अभी कोई खबर नहीं है। लाइव होने के 15 मिनट के भीतर पहला अपडेट आएगा।",
    how: "हम कैसे जांचते हैं: हर खबर को कई समाचार स्रोतों से मिलाया जाता है। तीन या अधिक स्वतंत्र स्रोत होने पर खबर 'पुष्ट' मानी जाती है। स्रोत हमेशा दिखाए जाते हैं।",
    cats: { India: "भारत", World: "दुनिया", Politics: "राजनीति", Business: "कारोबार", Sports: "खेल", Entertainment: "मनोरंजन", Tech: "टेक" },
  },
};
