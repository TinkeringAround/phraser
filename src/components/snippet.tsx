import { FC, useCallback } from "react";
import styled from "styled-components";
import { TSnippet } from "../libs/util";
import { deleteContentfulSnippet } from "../libs/contentful";
import { usePhraser } from "../store";
import IconButton from "./icon-button";

const StyledSnippet = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 50px;
  grid-template-rows: minmax(0, 1fr);
  column-gap: 0.5rem;

  width: 100%;
  padding: 0.75rem 1rem;
  margin: 0;

  font-family: "Roboto", sans-serif;
  background: ${({ theme }) => theme.light};
  color: ${({ theme }) => theme.dark};
  border-radius: 2px;

  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hexToRgbA(theme.light, "0.6")};
  }

  p {
    display: flex;
    align-items: center;

    margin: 0;
  }

  div.tools {
    display: flex;
    justify-content: flex-end;
  }
`;

interface Props {
  snippet: TSnippet;
}

const Snippet: FC<Props> = ({ snippet }) => {
  const { deleteSnippet, addError, setIsProcessing } = usePhraser();

  const onDeleteSnippet = useCallback(async () => {
    setIsProcessing(true);
    await deleteContentfulSnippet(snippet.id);
    deleteSnippet(snippet.id);
    setIsProcessing(false);
  }, [snippet, deleteSnippet, setIsProcessing]);

  const onCopyToClipboard = useCallback(() => {
    navigator?.clipboard &&
      navigator?.clipboard
        .writeText(snippet.text)
        .catch((error) => addError(error));
  }, [snippet, addError]);

  return (
    <StyledSnippet
      onClick={onCopyToClipboard}
      onPointerDown={onCopyToClipboard}
      title="Click to Copy"
    >
      <p>{snippet.text}</p>
      <div className="tools">
        <IconButton
          onClick={onDeleteSnippet}
          title="Delete Snippet"
          icon="delete"
          color="white"
        />
      </div>
    </StyledSnippet>
  );
};

export default Snippet;
