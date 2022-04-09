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
import { getRhymesFor } from "../libs/rhyme";

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

      &.section {
        font-size: 1.25rem;
        font-weight: bold;
        color: ${({ theme }) => theme.medium};
      }

      &:not(.section) {
        padding-left: 0.5rem;
      }
    }
  }
`;

const limit = 2500;

const Dictionary: FC = () => {
  const { dictionary, addError, setIsProcessing } = usePhraser();
  const [search, setSearch] = useState<string>("");
  const [language, setLanguage] = useState<Language>(Language.english);
  const debouncedSearch = useDebounce(search.toLowerCase().trim(), 500);
  const [filteredWords, setFilteredWords] = useState<string[]>(
    dictionary[Language.german]
  );
  const [suggestedRhymes, setSuggestedRhymes] = useState<string[]>([]);

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
      setSuggestedRhymes([]);
      setFilteredWords([]);
    } else {
      setIsProcessing(true);
      getRhymesFor(debouncedSearch, language)
        .then((words) => {
          setSuggestedRhymes(words);
          setFilteredWords(
            dictionary[language].filter((word) =>
              word.toLowerCase().includes(debouncedSearch)
            )
          );
        })
        .catch((error) => addError(error))
        .finally(() => setIsProcessing(false));
    }
  }, [
    language,
    dictionary,
    debouncedSearch,
    setFilteredWords,
    setSuggestedRhymes,
    setIsProcessing,
  ]);

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
          <If
            condition={
              filteredWords.length === 0 &&
              suggestedRhymes.length === 0 &&
              debouncedSearch !== ""
            }
          >
            No words found, adjust your search.
          </If>
          <If condition={suggestedRhymes.length > 0}>
            <span className="section">Rhymes</span>
            <For
              values={suggestedRhymes}
              projector={(rhyme, i) => (
                <span key={`suggestion-${i}`}>{rhyme}</span>
              )}
            />
          </If>
          <If condition={filteredWords.length > limit}>
            Too many result, specify your search.
          </If>
          <If
            condition={
              filteredWords.length > 0 && filteredWords.length <= limit
            }
          >
            <span className="section" style={{ marginTop: "1rem" }}>
              Words
            </span>
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
