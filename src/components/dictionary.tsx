import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import Input from "./input";
import Dropdown from "./dropdown";
import { usePhraser } from "../store";
import { useDebounce } from "../hooks/useDebounce";
import If from "./if";
import For from "./for";
import {Language, languages} from "../libs/util";

const StyledDictionary = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  row-gap: 1rem;

  > :first-child {
    display: grid;
    grid-template-columns: minmax(0, 1fr) min-content;
    grid-template-rows: minmax(0, 1fr);
    column-gap: 0.5rem;
  }

  > :last-of-type {
    display: flex;
    flex-direction: column;
    row-gap: 0.25rem;

    overflow: auto;
  }
`;

const limit = 2500;

const Dictionary: FC = () => {
  const {
    dictionary,
    dictionarySearch: { search, language },
    updateDictionarySearch,
  } = usePhraser();
  const debouncedSearch = useDebounce(search.toLowerCase().trim(), 150);
  const [filteredWords, setFilteredWords] = useState<string[]>(
    dictionary[Language.german]
  );

  const onChange = useCallback(
    ({ target: { value } }) => {
      updateDictionarySearch({ search: value });
    },
    [updateDictionarySearch]
  );

  const onSelect = useCallback(
    (value: string) => {
      updateDictionarySearch({ language: value as Language });
    },
    [updateDictionarySearch]
  );

  const onReset = useCallback(() => {
    updateDictionarySearch({ search: "" });
  }, [updateDictionarySearch]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setFilteredWords([]);
    } else {
      setFilteredWords(
        dictionary[language].filter((word) =>
          word.toLowerCase().includes(debouncedSearch)
        )
      );
    }
  }, [language, dictionary, debouncedSearch, setFilteredWords]);

  return (
    <StyledDictionary>
      <div>
        <Input
          value={search}
          placeholder="Search for Words..."
          onChange={onChange}
          onReset={onReset}
        />
        <Dropdown options={languages} value={language} select={onSelect} />
      </div>
      <div>
        <If condition={filteredWords.length === 0 && debouncedSearch !== ""}>
          No words found, adjust your search.
        </If>
        <If condition={filteredWords.length > limit}>
          Too many result, specify your search.
        </If>
        <If
          condition={filteredWords.length > 0 && filteredWords.length <= limit}
        >
          <For
            values={filteredWords}
            projector={(word, i) => <span key={`word-${i}`}>{word}</span>}
          />
        </If>
      </div>
    </StyledDictionary>
  );
};

export default Dictionary;
