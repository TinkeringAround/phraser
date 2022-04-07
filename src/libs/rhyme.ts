enum Language {
  de = "de",
  en = "en-us",
}

export const getRhymesFor = (
  search: string,
  language: Language = Language.de
): Promise<string[]> => {
  return fetch(`https://double-rhyme.com/?hl=${language}&s=${search}`)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const table = doc.querySelector("div.table") as HTMLDivElement;
      const elements = table.querySelectorAll(
        "div.td"
      ) as NodeListOf<HTMLElement>;

      const results = Array.from(elements)
        .filter((element) => element.innerText !== "")
        .map((element) => element.innerText);

      console.info(results);
      return results;
    });
};
