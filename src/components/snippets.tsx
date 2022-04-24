import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { usePhraser } from "../store";
import Input from "./input";
import For from "./for";
import Snippet from "./snippet";
import { useDebounce } from "../hooks/useDebounce";
import { ISnippet } from "../libs/util";
import If from "./if";
import IconButton from "./icon-button";
import { createContentfulSnippet } from "../libs/contentful";

const StyledSnippets = styled.div`
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

const Snippets: FC = () => {
  const {
    snippets,
    snippetSearch,
    updateSnippetSearch,
    createSnippet,
    setIsProcessing,
  } = usePhraser();
  const debouncedSearch = useDebounce(snippetSearch.toLowerCase(), 150);
  const [filteredSnippets, setFilteredSnippets] =
    useState<ISnippet[]>(snippets);

  const onChange = useCallback(
    ({ target: { value } }) => {
      updateSnippetSearch(value);
    },
    [updateSnippetSearch]
  );

  const onReset = useCallback(() => {
    updateSnippetSearch("");
  }, [updateSnippetSearch]);

  const onAddSnippet = useCallback(async () => {
    setIsProcessing(true);
    const createdSnippet = await createContentfulSnippet("");
    createSnippet(createdSnippet);

    setIsProcessing(false);
  }, [createSnippet, setIsProcessing]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setFilteredSnippets(snippets);
    } else {
      setFilteredSnippets(
        snippets.filter((snippet) =>
          snippet.text.toLowerCase().includes(debouncedSearch)
        )
      );
    }
  }, [snippets, setFilteredSnippets, debouncedSearch]);

  return (
    <StyledSnippets>
      <div>
        <Input
          value={snippetSearch}
          placeholder="Search for Snippets..."
          disabled={snippets.length === 0}
          onChange={onChange}
          onReset={onReset}
        />
        <IconButton icon="add" onClick={onAddSnippet} />
      </div>
      <div>
        <If condition={snippets.length === 0}>
          No snippets, start creating some.
        </If>
        <For
          values={filteredSnippets}
          projector={(snippet, i) => (
            <Snippet key={`snippet-${i}-${snippet.id}`} snippet={snippet} />
          )}
        />
      </div>
    </StyledSnippets>
  );
};

export default Snippets;
