import { HasHTML, Language, Rhyme, RhymeLanguage } from "./util";
import { createStore, loadEntry, setEntry } from "./database";

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

export const initializeRhymes = async () =>
  createStore("rhymes", { keyPath: "word" }, (_, resolve) => resolve(true));

export const getRhymesFor = async (
  search: string,
  language: Language
): Promise<string[]> => {
  search = search.toLowerCase().trim();
  const entry = await loadEntry<Rhyme>(search, "rhymes");

  if (entry && entry[language]) {
    return entry[language] ?? [];
  }

  const rhymeLanguage = transpose(language);
  return fetch(
    `./.netlify/functions/rhyme?language=${rhymeLanguage}&search=${search}`
  )
    .then((response) => response.json())
    .then(async (body) => {
      const { html = "" } = body as HasHTML;
      const doc = new DOMParser().parseFromString(html, "text/html");
      const table = doc.querySelector("div.table") as HTMLDivElement;
      const elements = table.querySelectorAll(
        "div.td"
      ) as NodeListOf<HTMLElement>;

      const words = Array.from(elements)
        .map((element) => element.innerText.trim())
        .filter((word) => word !== "");

      let rhyme: Rhyme = { word: search };
      if (entry) {
        rhyme = { ...entry };
      }
      rhyme[language] = words;

      await setEntry(rhyme, "rhymes");
      return words;
    });
};
