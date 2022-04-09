import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

export const handler: Handler = async (event) => {
  const { language = "de", search = "" } = event.queryStringParameters;

  const response = await fetch(
    `https://double-rhyme.com/?hl=${language}&s=${search}`
  );
  const html = await response.text();

  return {
    statusCode: 200,
    body: JSON.stringify({ html }),
  };
};
