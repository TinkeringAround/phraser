export interface Configuration {
  apiKey: string;
  environment: string;
  space: string;
  loginKey: string;
}

const config: Configuration = {
  apiKey: `${process.env.REACT_APP_CONTENTFUL_API_KEY}`,
  environment: `${process.env.REACT_APP_CONTENTFUL_ENVIRONMENT_ID}`,
  space: `${process.env.REACT_APP_CONTENTFUL_SPACE_ID}`,
  loginKey: `${process.env.REACT_APP_LOGIN_KEY}`
};

export default config;
