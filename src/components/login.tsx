import { FC, useCallback, useState } from "react";
import Dialog from "./dialog";
import { usePhraser } from "../store";
import styled from "styled-components";
import Input from "./input";
import Button from "./button";
import configuration from "../libs/configuration";

const StyledLogin = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: min-content minmax(0, 1fr);
  row-gap: 0.75rem;

  span {
    text-align: center;

    font-family: "Roboto", sans-serif;
    font-size: 1.25rem;
    font-weight: bold;
    color: ${({ theme }) => theme.dark};
  }
`;

const StyledButton = styled(Button)`
  color: ${({ theme: { dark } }) => dark};
  background: ${({ theme: { white } }) => white};
`;

const Login: FC = () => {
  const { login, loggedIn } = usePhraser();
  const [key, setKey] = useState<string>("");

  const onChange = useCallback(
    ({ target: { value } }) => {
      setKey(value);
    },
    [setKey]
  );

  const onLogin = useCallback(() => {
    if (key === configuration.loginKey) {
      login();
    }
  }, [key, login]);

  const onReset = useCallback(() => {
    setKey("");
  }, [setKey]);

  return (
    <Dialog visible={!loggedIn} noButtons={true}>
      <StyledLogin>
        <span>Enter Login-Key</span>
        <Input
          placeholder="Enter Key"
          value={key}
          onChange={onChange}
          onReset={onReset}
        />
        <StyledButton onClick={onLogin}>Login</StyledButton>
      </StyledLogin>
    </Dialog>
  );
};

export default Login;
