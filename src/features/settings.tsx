import { FC, useCallback } from "react";
import styled from "styled-components";
import StyledFeature from "./feature";
import Slide from "../components/slide";
import Separator from "../components/separator";
import { usePhraser } from "../store";
import For from "../components/for";
import IconButton from "../components/icon-button";
import { loadSongsAndSnippets } from "../libs/contentful";
import If from "../components/if";

const StyledSettings = styled(StyledFeature)`
  header {
    justify-content: flex-end;

    span {
      margin-right: 0.5rem;

      color: ${({ theme }) => theme.medium};
      font-size: 0.8rem;
    }
  }

  main {
    flex-direction: column;
    row-gap: 0.5rem;

    color: ${({ theme }) => theme.dark};

    h4 {
      margin: 0;

      font-size: 1rem;
      font-weight: bold;
    }

    p {
      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;

      margin: 0;

      font-style: italic;
      overflow: auto;

      span {
        display: block;
        padding: 0.5rem;

        font-size: 0.8rem;
        border-radius: 2px;

        background: ${({ theme }) => theme.light};
      }
    }
  }
`;

const Settings: FC = () => {
  const { errors, setIsProcessing, addError, setSongs, setSnippets, setSong } =
    usePhraser();

  const onReload = useCallback(async () => {
    setIsProcessing(true);

    await loadSongsAndSnippets(setSongs, setSnippets)
      .catch((error) => addError(error))
      .finally(() => {
        setSong(null);
        setIsProcessing(false);
      });
  }, [setIsProcessing, setSongs, setSnippets, setSong, addError]);

  return (
    <Slide>
      <StyledSettings>
        <header>
          <span>Reload</span>
          <IconButton icon="refresh" onClick={onReload} />
        </header>
        <Separator />
        <main>
          <If condition={errors.length > 0}>
            <h4>Error Log</h4>
          </If>
          <If condition={errors.length === 0}>
            No errors, everything is fine.
          </If>
          <p>
            <For
              values={errors}
              projector={(error, index) => (
                <span key={`error-${index}`}>{error}</span>
              )}
            />
          </p>
        </main>
      </StyledSettings>
    </Slide>
  );
};

export default Settings;
