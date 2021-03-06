import React, { FC, useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import Slider from "./components/slider";
import theme from "./styles/theme";
import Songs from "./features/songs";
import "./styles/index.css";
import "./store";
import { loadSongsAndSnippets } from "./libs/contentful";
import { usePhraser } from "./store";
import Editor from "./features/editor";
import Spinner from "./components/spinner";
import Navigation from "./components/navigation";
import Layout from "./components/layout";
import { Page } from "./libs/util";
import Settings from "./features/settings";
import { loadDictionary } from "./libs/dictionary";
import Library from "./features/library";
import Login from "./components/login";
import If from "./components/if";
import { initializeRhymes } from "./libs/rhyme";
import { createDb } from "./libs/database";

const App: FC = () => {
  const {
    setSongs,
    setSnippets,
    addError,
    isProcessing,
    setIsProcessing,
    setDictionary,
    loggedIn,
  } = usePhraser();
  const [slide, setSlide] = useState<number>(0);

  const onSlideChange = useCallback(
    (page: Page) => {
      setSlide(page);
    },
    [setSlide]
  );

  useEffect(() => {
    if (loggedIn) {
      setIsProcessing(true);

      createDb()
        .then(() => loadSongsAndSnippets(setSongs, setSnippets))
        .then(() => loadDictionary(setDictionary))
        .then(() => initializeRhymes())
        .catch((error) => addError(error))
        .finally(() => setIsProcessing(false));
    }
  }, [
    loggedIn,
    setIsProcessing,
    setSongs,
    addError,
    setSnippets,
    setDictionary,
  ]);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => addError(event.message);
    window.addEventListener("error", handleError);

    return () => window.removeEventListener("error", handleError);
  }, [addError]);

  return (
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <If condition={loggedIn}>
          <Layout>
            <Slider slide={slide}>
              <Songs />
              <Editor />
              <Library />
              <Settings />
            </Slider>
            <Navigation onClick={onSlideChange} />
          </Layout>
        </If>
        <Login />
        <Spinner show={isProcessing} />
      </ThemeProvider>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
