import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useDebounce } from "../hooks/useDebounce";
import If from "./if";
import For from "./for";
import Input from "./input";
import Dropdown from "./dropdown";
import { usePhraser } from "../store";
import { getRhymesFor } from "../libs/rhyme";
import {Language, languages} from "../libs/util";

const StyledRhymes = styled.div`
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

const Rhymes: FC = () => {
  const {
    rhymeSearch: { search, language },
    updateRhymeSearch,
    setIsProcessing,
    addError,
  } = usePhraser();
  const debouncedSearch = useDebounce(search.trim(), 500);
  const [suggestedRhymes, setSuggestedRhymes] = useState<string[]>([]);

  const onChange = useCallback(
    ({ target: { value } }) => {
      updateRhymeSearch({ search: value });
    },
    [updateRhymeSearch]
  );

  const onSelect = useCallback(
    (value: string) => {
      updateRhymeSearch({ language: value as Language });
    },
    [updateRhymeSearch]
  );

  const onReset = useCallback(() => {
    updateRhymeSearch({ search: "" });
  }, [updateRhymeSearch]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setSuggestedRhymes([]);
    } else {
      setIsProcessing(true);
      getRhymesFor(debouncedSearch, language)
        .then((rhymes) => setSuggestedRhymes(rhymes))
        .catch((error) => addError(error))
        .finally(() => setIsProcessing(false));
    }
  }, [
    search,
    language,
    debouncedSearch,
    setSuggestedRhymes,
    addError,
    setIsProcessing,
  ]);

  return (
    <StyledRhymes>
      <div>
        <Input
          value={search}
          placeholder="Search for Rhymes..."
          onChange={onChange}
          onReset={onReset}
        />
        <Dropdown options={languages} value={language} select={onSelect} />
      </div>
      <div>
        <If condition={suggestedRhymes.length > 0}>
          <For
            values={suggestedRhymes}
            projector={(rhyme, i) => (
              <span key={`suggestion-${i}`}>{rhyme}</span>
            )}
          />
        </If>
      </div>
    </StyledRhymes>
  );
};

export default Rhymes;
