import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { usePhraser } from "../store";
import Input from "./input";
import For from "./for";
import Snippet from "./snippet";
import { useDebounce } from "../hooks/useDebounce";
import { ISnippet } from "../libs/util";
import If from "./if";

const StyledSnippets = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  row-gap: 1rem;

  > div {
    display: flex;
    flex-direction: column;
    row-gap: 0.5rem;

    overflow: auto;
  }
`;

const Snippets: FC = () => {
  const { snippets, snippetSearch, updateSnippetSearch } = usePhraser();
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

  useEffect(() => {
    setFilteredSnippets(
      snippets.filter((snippet) =>
        snippet.text.toLowerCase().includes(debouncedSearch)
      )
    );
  }, [snippets, setFilteredSnippets, debouncedSearch]);

  return (
    <StyledSnippets>
      <Input
        value={snippetSearch}
        placeholder="Search for Snippets..."
        disabled={snippets.length === 0}
        onChange={onChange}
        onReset={onReset}
      />
      <div>
        <If condition={snippets.length === 0}>
          No snippets, start creating some.
        </If>
        <For
          values={filteredSnippets}
          projector={(snippet, i) => (
            <Snippet key={`snippet-${i}`} snippet={snippet} />
          )}
        />
      </div>
    </StyledSnippets>
  );
};

export default Snippets;
