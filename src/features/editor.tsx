import { FC, useCallback } from "react";
import styled from "styled-components";
import StyledFeature from "./feature";
import Slide from "../components/slide";
import Separator from "../components/separator";
import IconButton from "../components/icon-button";
import Input from "../components/input";
import { usePhraser } from "../store";
import {
  createContentfulSnippet,
  updateContentfulSong,
} from "../libs/contentful";
import { useRefCallback } from "../hooks/useRefCallback";
import TextArea from "../components/textarea";
import { copyFromClipboard } from "../libs/clipboard";

const StyledEditor = styled(StyledFeature)`
  header {
    column-gap: 0.5rem;
  }

  main {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Editor: FC = () => {
  const { song, updateSong, createSnippet, setIsProcessing } = usePhraser();
  const { ref, setRef } = useRefCallback();

  const onNameChange = useCallback(
    ({ target: { value } }) => {
      song && updateSong({ ...song, name: value });
    },
    [song, updateSong]
  );

  const onReset = useCallback(() => {
    song && updateSong({ ...song, name: "" });
  }, [song, updateSong]);

  const onUpdateSong = useCallback(async () => {
    if (song) {
      setIsProcessing(true);
      const patchedSong = await updateContentfulSong(song);
      updateSong(patchedSong);

      setIsProcessing(false);
    }
  }, [song, updateSong, setIsProcessing]);

  const onTextChange = useCallback(
    ({ target: { value } }) => {
      song && updateSong({ ...song, text: value });
    },
    [song, updateSong]
  );

  const onCreateSnippet = useCallback(async () => {
    if (ref) {
      setIsProcessing(true);
      const textArea = ref as HTMLTextAreaElement;
      const start = textArea.selectionStart;
      const finish = textArea.selectionEnd;

      const snippetText = textArea.value.substring(start, finish);

      const snippet = await createContentfulSnippet(snippetText);
      createSnippet(snippet);
      setIsProcessing(false);
    }
  }, [ref, createSnippet, setIsProcessing]);

  const onPasteFromClipboard = useCallback(() => {
    if (ref) {
      const textArea = ref as HTMLTextAreaElement;
      let songText = textArea.value;
      const clipboardText = copyFromClipboard();

      if (textArea.selectionStart !== textArea.selectionEnd) {
        const firstPart = songText.substring(0, textArea.selectionStart);
        const secondPart = songText.substring(
          textArea.selectionEnd,
          songText.length
        );

        songText = `${firstPart}${clipboardText}${secondPart}`;
      } else {
        songText += clipboardText;
      }

      onTextChange({
        target: { value: songText },
      });
    }
  }, [song, onTextChange]);

  return (
    <Slide>
      <StyledEditor>
        <header>
          <Input
            placeholder="Enter Song Name..."
            disabled={!song}
            value={song?.name ?? ""}
            onChange={onNameChange}
            onReset={onReset}
          />
          <IconButton
            icon="clipboard"
            disabled={!song}
            onClick={onPasteFromClipboard}
          />
          <IconButton icon="pin" disabled={!song} onClick={onCreateSnippet} />
          <IconButton icon="save" disabled={!song} onClick={onUpdateSong} />
        </header>
        <Separator />
        <main>
          <TextArea
            ref={setRef}
            disabled={!song}
            value={song?.text ?? ""}
            onChange={onTextChange}
          />
        </main>
      </StyledEditor>
    </Slide>
  );
};

export default Editor;
