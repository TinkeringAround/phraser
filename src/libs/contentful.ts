import { createClient, PlainClientAPI } from "contentful-management";
import config from "./configuration";
import { TLocalized, TSnippet, TSong } from "./util";

const baseParams = {
  spaceId: config.space,
  environmentId: config.environment,
};

const client: PlainClientAPI = createClient(
  { accessToken: config.apiKey },
  { type: "plain" }
);

export const localized = <T>(value: T): TLocalized<T> => ({ "en-US": value });

export const loadSongsAndSnippets = async (
  setSongs: (songs: TSong[]) => void,
  setSnippets: (snippets: TSnippet[]) => void
): Promise<any> => {
  return Promise.all([
    getContentfulSongs().then((songs) => setSongs(songs)),
    getContentfulSnippets().then((snippets) => setSnippets(snippets)),
  ]);
};

export const getContentfulSongs = async (): Promise<TSong[]> => {
  const localizedSongs = await client.entry.getMany({
    query: { content_type: "song" },
    ...baseParams,
  });

  return localizedSongs.items.map(({ fields, sys }) => {
    const localizedSong = fields as TSong<TLocalized<string>>;

    return {
      id: sys.id,
      version: sys.version,
      name: localizedSong.name["en-US"],
      text: localizedSong.text["en-US"],
    } as TSong;
  });
};

export const createContentfulSong = async (
  name: string,
  text: string
): Promise<TSong> => {
  const { sys } = await client.entry.create(
    { ...baseParams, contentTypeId: "song" },
    {
      fields: {
        name: localized(name),
        text: localized(text),
      },
    }
  );

  return { id: sys.id, version: sys.version, name, text } as TSong;
};

export const deleteContentfulSong = async (id: string): Promise<boolean> => {
  await client.entry.delete({
    ...baseParams,
    contentTypeId: "song",
    entryId: id,
  });

  return true;
};

export const getContentfulSnippets = async (): Promise<TSnippet[]> => {
  const localizedSnippets = await client.entry.getMany({
    query: { content_type: "snippet" },
    ...baseParams,
  });

  return localizedSnippets.items.map(({ fields, sys }) => {
    const localizedSnippet = fields as TSnippet<TLocalized<string>>;

    return {
      id: sys.id,
      text: localizedSnippet.text["en-US"],
    };
  });
};

export const deleteContentfulSnippet = async (id: string): Promise<boolean> => {
  await client.entry.delete({
    ...baseParams,
    contentTypeId: "snippet",
    entryId: id,
  });

  return true;
};

export const updateContentfulSong = async (song: TSong): Promise<TSong> => {
  const { sys } = await client.entry.patch(
    {
      ...baseParams,
      contentTypeId: "snippet",
      entryId: song.id,
    },
    [
      {
        op: "add",
        path: "/fields/name/en-US",
        value: song.name,
      },
      {
        op: "add",
        path: "/fields/text/en-US",
        value: song.text,
      },
    ],
    {
      "X-Contentful-Version": song.version,
    }
  );

  return { ...song, version: sys.version };
};

export const createContentfulSnippet = async (
  text: string
): Promise<TSnippet> => {
  const { sys } = await client.entry.create(
    { ...baseParams, contentTypeId: "snippet" },
    {
      fields: {
        text: localized(text),
      },
    }
  );

  return { id: sys.id, text } as TSnippet;
};
