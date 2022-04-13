import { FC, useCallback, useState } from "react";
import styled from "styled-components";
import { ISnippet } from "../libs/util";
import {
  deleteContentfulSnippet,
  updateContentfulSnippet,
} from "../libs/contentful";
import { usePhraser } from "../store";
import IconButton from "./icon-button";
import TextArea from "./textarea";
import { copyToClipboard } from "../libs/clipboard";

const StyledSnippet = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 50px;
  grid-template-rows: minmax(0, 1fr);
  column-gap: 0.5rem;

  width: 100%;
  padding: 0.5rem;
  margin: 0;

  font-family: "Roboto", sans-serif;
  background: ${({ theme }) => theme.light};
  color: ${({ theme }) => theme.dark};
  border-radius: 2px;

  transition: all 0.15s ease-in-out;
  cursor: pointer;

  div.tools {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    row-gap: 0.25rem;
  }
`;

const StyledTextArea = styled(TextArea)`
  &:hover,
  :active,
  :focus {
    background: ${({ theme }) => theme.white};
  }
`;

interface Props {
  snippet: ISnippet;
}

const Snippet: FC<Props> = ({ snippet }) => {
  const { deleteSnippet, setIsProcessing, updateSnippet } = usePhraser();
  const [text, setText] = useState<string>(snippet.text);

  const onDeleteSnippet = useCallback(async () => {
    setIsProcessing(true);
    await deleteContentfulSnippet(snippet.id);
    deleteSnippet(snippet.id);
    setIsProcessing(false);
  }, [snippet, deleteSnippet, setIsProcessing]);

  const onCopyToClipboard = useCallback(() => {
    copyToClipboard(text);
    // if (!isMobileEnv()) {
    //   navigator?.clipboard
    //     .writeText(snippet.text)
    //     .catch((error) => addError(error));
    // }
  }, [text]);

  const onUpdateSnippet = useCallback(async () => {
    setIsProcessing(true);
    const patchedSnippet = await updateContentfulSnippet({ ...snippet, text });
    updateSnippet(patchedSnippet);

    setIsProcessing(false);
  }, [snippet, text, updateSnippet, setIsProcessing]);

  const onTextChange = useCallback(
    async ({ target: { value } }) => {
      setText(value);
    },
    [snippet, setText]
  );

  return (
    <StyledSnippet>
      <StyledTextArea value={text} onChange={onTextChange} />
      <div className="tools">
        <IconButton
          disabled={snippet.text === text}
          onClick={onUpdateSnippet}
          title="Update Snippet"
          icon="save"
          color="white"
          size="30px"
          iconSize="20px"
        />
        <IconButton
          disabled={text === ""}
          onClick={onCopyToClipboard}
          title="Copy Snippet to Clipboard"
          icon="clipboard"
          color="white"
          size="30px"
          iconSize="20px"
        />
        <IconButton
          onClick={onDeleteSnippet}
          title="Delete Snippet"
          icon="delete"
          color="white"
          size="30px"
          iconSize="20px"
        />
      </div>
    </StyledSnippet>
  );
};

export default Snippet;
