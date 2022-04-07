import { FC, useCallback, useEffect, useState } from "react";
import Slide from "../components/slide";
import styled from "styled-components";
import StyledFeature from "./feature";
import Input from "../components/input";
import Separator from "../components/separator";
import If from "../components/if";
import { useDebounce } from "../hooks/useDebounce";
import { usePhraser } from "../store";
import { Language, languages } from "../libs/dictionary";
import For from "../components/for";
import Dropdown from "../components/dropdown";

const StyledDictionary = styled(StyledFeature)`
  header {
    display: grid;
    grid-template-columns: 4fr minmax(min-content, 1fr);
    grid-template-rows: minmax(0, 1fr);
    column-gap: 0.5rem;
  }

  main {
    flex-direction: column;
    row-gap: 0.5rem;

    color: ${({ theme }) => theme.dark};

    span {
      display: block;
    }
  }
`;

const limit = 2500;

const Dictionary: FC = () => {
  const { dictionary } = usePhraser();
  const [search, setSearch] = useState<string>("");
  const [language, setLanguage] = useState<Language>(Language.english);
  const debouncedSearch = useDebounce(search.toLowerCase(), 150);
  const [filteredWords, setFilteredWords] = useState<string[]>(
    dictionary[Language.german]
  );

  const onChange = useCallback(
    ({ target: { value } }) => {
      setSearch(value);
    },
    [setSearch]
  );

  const onSelect = useCallback(
    (value: string) => {
      setLanguage(value as Language);
    },
    [setLanguage]
  );

  const onReset = useCallback(() => {
    setSearch("");
  }, [setSearch]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setFilteredWords([]);
    } else
      setFilteredWords(
        dictionary[language].filter((word) =>
          word.toLowerCase().includes(debouncedSearch)
        )
      );
  }, [language, dictionary, debouncedSearch, setFilteredWords]);

  return (
    <Slide>
      <StyledDictionary>
        <header>
          <Input
            value={search}
            placeholder="Search for Words..."
            onChange={onChange}
            onReset={onReset}
          />
          <Dropdown options={languages} value={language} select={onSelect} />
        </header>
        <Separator />
        <main>
          <If condition={filteredWords.length === 0 && debouncedSearch !== ""}>
            No words found, adjust your search.
          </If>
          <If condition={filteredWords.length > limit}>
            Too many result, specify your search.
          </If>
          <If condition={filteredWords.length <= limit}>
            <For
              values={filteredWords}
              projector={(word, i) => <span key={`word-${i}`}>{word}</span>}
            />
          </If>
        </main>
      </StyledDictionary>
    </Slide>
  );
};

export default Dictionary;
