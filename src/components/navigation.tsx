import { FC, useCallback } from "react";
import styled from "styled-components";
import IconButton from "./icon-button";
import { Page, pageCount } from "../libs/util";

const StyledSliderNavigation = styled.div`
  width: 100%;
  padding: 1.5rem 0;

  display: grid;
  grid-template-columns: repeat(${pageCount}, min-content);
  grid-template-rows: min-content;
  grid-column-gap: 2rem;
  justify-content: center;

  background: ${({ theme: { yellow } }) => yellow};
`;

interface Props {
  onClick: (page: Page) => void;
}

const Navigation: FC<Props> = ({ onClick }) => {
  const onSongsClick = useCallback(() => onClick(Page.songs), [onClick]);
  const onEditorClick = useCallback(() => onClick(Page.editor), [onClick]);
  const onSnippetsClick = useCallback(() => onClick(Page.snippets), [onClick]);
  const onSettingsClick = useCallback(() => onClick(Page.settings), [onClick]);

  return (
    <StyledSliderNavigation>
      <IconButton icon="rows" title="Songs" onClick={onSongsClick} />
      <IconButton icon="quillPen" title="Editor" onClick={onEditorClick} />
      <IconButton icon="pin" title="Snippets" onClick={onSnippetsClick} />
      <IconButton icon="settings" title="Snippets" onClick={onSettingsClick} />
    </StyledSliderNavigation>
  );
};

export default Navigation;
