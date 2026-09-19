import { useEffect, useState } from "react";

export const LANGUAGES = [
  { code: "vi", label: "Tiếng Việt", shortLabel: "VN", flag: "/flags/vn.svg" },
  { code: "en", label: "English", shortLabel: "EN", flag: "/flags/gb.svg" },
  { code: "zh", label: "中文", shortLabel: "中文", flag: "/flags/cn.svg" },
  { code: "ko", label: "한국어", shortLabel: "KO", flag: "/flags/kr.svg" },
  { code: "ja", label: "日本語", shortLabel: "JA", flag: "/flags/jp.svg" },
  { code: "ar", label: "العربية", shortLabel: "AR", flag: "/flags/ae.svg" },
  { code: "fr", label: "Français", shortLabel: "FR", flag: "/flags/fr.svg" },
  { code: "de", label: "Deutsch", shortLabel: "DE", flag: "/flags/de.svg" },
];

function storedLanguage(fallback) {
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem("rosic-language");
  return LANGUAGES.some((language) => language.code === saved) ? saved : fallback;
}

export function useSiteLanguage(fallback = "vi") {
  const [language, setLanguage] = useState(() => storedLanguage(fallback));

  useEffect(() => {
    window.localStorage.setItem("rosic-language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return [language, setLanguage];
}
