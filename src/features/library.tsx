import { FC, useCallback, useState } from "react";
import Slide from "../components/slide";
import styled from "styled-components";
import StyledFeature from "./feature";
import Separator from "../components/separator";
import If from "../components/if";
import SegmentedButton from "../components/segmented-button";
import Snippets from "../components/snippets";
import Dictionary from "../components/dictionary";
import Rhymes from "../components/rhymes";

const StyledLibrary = styled(StyledFeature)`
  header {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);
  }

  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr);

    color: ${({ theme }) => theme.dark};
  }
`;

const Library: FC = () => {
  const [subpage, setSubpage] = useState<number>(0);

  const onChange = useCallback(
    (index) => {
      setSubpage(index);
    },
    [setSubpage]
  );

  return (
    <Slide>
      <StyledLibrary>
        <header>
          <SegmentedButton
            options={["Dictionary", "Rhyme", "Snippet"]}
            selected={subpage}
            onSelect={onChange}
          />
        </header>
        <Separator />
        <main>
          <If condition={subpage === 0}>
            <Dictionary />
          </If>
          <If condition={subpage === 1}>
            <Rhymes />
          </If>
          <If condition={subpage === 2}>
            <Snippets />
          </If>
        </main>
      </StyledLibrary>
    </Slide>
  );
};

export default Library;
