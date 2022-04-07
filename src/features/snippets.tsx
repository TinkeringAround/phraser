import { FC, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import StyledFeature from "./feature";
import Slide from "../components/slide";
import { usePhraser } from "../store";
import Input from "../components/input";
import Separator from "../components/separator";
import For from "../components/for";
import Snippet from "../components/snippet";
import { useDebounce } from "../hooks/useDebounce";
import { TSnippet } from "../libs/util";
import If from "../components/if";

const StyledSnippets = styled(StyledFeature)`
  grid-template-rows: min-content min-content min-content minmax(0, 1fr);

  header {
    display: flex;
    align-items: flex-start;
    row-gap: 0.75rem;
  }

  main {
    flex-direction: column;
    row-gap: 1rem;

    color: ${({ theme }) => theme.dark};
  }
`;

const Snippets: FC = () => {
  const { snippets } = usePhraser();
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search.toLowerCase(), 150);
  const [filteredSnippets, setFilteredSnippets] =
    useState<TSnippet[]>(snippets);

  const onChange = useCallback(
    ({ target: { value } }) => {
      setSearch(value);
    },
    [setSearch]
  );

  const onReset = useCallback(() => {
    setSearch("");
  }, [setSearch]);

  useEffect(() => {
    setFilteredSnippets(
      snippets.filter((snippet) =>
        snippet.text.toLowerCase().includes(debouncedSearch)
      )
    );
  }, [snippets, setFilteredSnippets, debouncedSearch]);

  return (
    <Slide>
      <StyledSnippets>
        <header>
          <Input
            value={search}
            placeholder="Search for Snippets..."
            disabled={snippets.length === 0}
            onChange={onChange}
            onReset={onReset}
          />
        </header>
        <Separator />
        <main>
          <If condition={snippets.length === 0}>
            No snippets, start creating some.
          </If>
          <For
            values={filteredSnippets}
            projector={(snippet, i) => (
              <Snippet key={`snippet-${i}`} snippet={snippet} />
            )}
          />
        </main>
      </StyledSnippets>
    </Slide>
  );
};

export default Snippets;
