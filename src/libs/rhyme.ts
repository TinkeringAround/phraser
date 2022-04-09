import { Language } from "./dictionary";

export enum RhymeLanguage {
  de = "de",
  en = "en-us",
  fr = "fr",
}

interface HasHTML {
  html: string;
}

export const transpose = (language: Language): RhymeLanguage => {
  switch (language) {
    case Language.german:
      return RhymeLanguage.de;
    case Language.english:
      return RhymeLanguage.en;
    default:
      return RhymeLanguage.fr;
  }
};

export const getRhymesFor = (
  search: string,
  language: Language
): Promise<string[]> => {
  const rhymeLanguage = transpose(language);

  return fetch(
    `./.netlify/functions/rhyme?language=${rhymeLanguage}&search=${search}`
  )
    .then((response) => response.json())
    .then((body) => {
      console.log(body);
      const { html } = body as HasHTML;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const table = doc.querySelector("div.table") as HTMLDivElement;
      const elements = table.querySelectorAll(
        "div.td"
      ) as NodeListOf<HTMLElement>;

      const results = Array.from(elements)
        .map((element) => element.innerText.trim())
        .filter((word) => word !== "");

      console.info(results);
      return results;
    });
};
