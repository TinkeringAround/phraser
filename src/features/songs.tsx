import { FC, useCallback } from "react";
import Slide from "../components/slide";
import styled from "styled-components";
import For from "../components/for";
import { usePhraser } from "../store";
import { Song } from "../components/song";
import Separator from "../components/separator";
import { createContentfulSong } from "../libs/contentful";
import StyledFeature from "./feature";
import IconButton from "../components/icon-button";

const StyledSongs = styled(StyledFeature)`
  header {
    justify-content: flex-end;

    span {
      margin-right: 0.5rem;

      color: ${({ theme }) => theme.medium};
      font-size: 0.8rem;
    }
  }

  main {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: repeat(auto-fill, min-content);
    align-content: flex-start;

    row-gap: 1rem;
    column-gap: 1rem;
  }
`;

const Songs: FC = () => {
  const { songs, createSong } = usePhraser();

  const onCreateSong = useCallback(async () => {
    const createdSong = await createContentfulSong("Untitled", "");
    createSong(createdSong);
  }, [createSong]);

  return (
    <Slide>
      <StyledSongs>
        <header>
          <span>Add new Song</span>
          <IconButton onClick={onCreateSong} title="New Song" icon="add" />
        </header>
        <Separator />
        <main>
          <For
            values={songs}
            projector={(song, i) => <Song key={`song-${i}`} song={song} />}
          />
        </main>
      </StyledSongs>
    </Slide>
  );
};

export default Songs;
