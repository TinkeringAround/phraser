import { FC, useCallback, useState } from "react";
import { ISong } from "../libs/util";
import styled from "styled-components";
import { usePhraser, PhraserState } from "../store";
import { deleteContentfulSong } from "../libs/contentful";
import Dialog from "./dialog";
import IconButton from "./icon-button";

const StyledSong = styled.div<{ selected: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) min-content;
  grid-template-rows: minmax(0, 1fr);
  column-gap: 0.25rem;

  margin: 0;

  background: ${({ theme, selected }) =>
    selected ? theme.hexToRgbA(theme.yellow, "0.25") : theme.light};
  color: ${({ theme }) => theme.dark};
  border-radius: 2px;
  border-left: ${({ selected }) => (selected ? "10px" : "0")} solid
    ${({ selected, theme }) => theme[selected ? "yellow" : "light"]};

  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hexToRgbA(theme.light, "0.6")};
  }

  div {
    display: flex;
    align-items: center;

    h2 {
      display: block;

      padding: 0.5rem 0 0.5rem 0.75rem;
      margin: 0;

      font-family: "Roboto", sans-serif;
      font-size: 1rem;
      text-align: center;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  button {
    border-radius: 0 2px 2px 0;
  }
`;

const StyledDialogContent = styled.h2`
  padding-top: 2rem;
  margin: 0;

  font-family: "Roboto", sans-serif;
  font-weight: normal;
  text-align: center;

  cursor: default;
`;

interface Props {
  song: ISong;
}

export const Song: FC<Props> = ({ song }) => {
  const { setSong, deleteSong, setIsProcessing } = usePhraser();
  const selected = usePhraser(
    useCallback((state: PhraserState) => state.song?.id === song.id, [song])
  );
  const [deleteIsVisible, setDeleteIsVisible] = useState<boolean>(false);

  const onSetSong = useCallback(
    ({ target }) => {
      const deleteButtonTags = ["button", "svg", "polygon"];
      const eventTarget = target as HTMLElement;

      if (deleteButtonTags.includes(eventTarget.tagName)) {
        setDeleteIsVisible(true);
        return;
      }
      setSong(song);
    },
    [song, setSong, setDeleteIsVisible]
  );

  const onDeleteRequested = useCallback(() => {
    setDeleteIsVisible(true);
  }, [setDeleteIsVisible]);

  const onDeleteCancelled = useCallback(() => {
    setDeleteIsVisible(false);
  }, [setDeleteIsVisible]);

  const onDeleteConfirmed = useCallback(async () => {
    setDeleteIsVisible(false);
    setIsProcessing(true);
    await deleteContentfulSong(song.id);
    deleteSong(song.id);
    setIsProcessing(false);
  }, [song, setDeleteIsVisible, deleteSong, setIsProcessing]);

  return (
    <StyledSong selected={selected}>
      <div onClick={onSetSong}>
        <h2>{song.name}</h2>
      </div>
      <IconButton
        onClick={onDeleteRequested}
        title="Delete Song"
        icon="delete"
        size="60px"
        iconSize="25px"
        color="white"
        background={selected ? "yellow" : "light"}
      />
      <Dialog
        visible={deleteIsVisible}
        onReset={onDeleteCancelled}
        onConfirm={onDeleteConfirmed}
      >
        <StyledDialogContent>Delete Song?</StyledDialogContent>
      </Dialog>
    </StyledSong>
  );
};
