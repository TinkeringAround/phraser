import React, { FC } from "react";
import styled from "styled-components";
import Icon from "./icon";

export const StyledInput = styled.div<{ disabled: boolean }>`
  --height: 2.5rem;

  position: relative;

  flex: 1;
  height: var(--height);

  box-sizing: border-box;

  svg {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;

    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    transition: color 0.15s ease-in-out;

    &:hover {
      color: ${({ theme: { yellow } }) => yellow};
    }
  }

  input {
    width: 100%;
    height: 100%;
    padding: 0.25rem 2.25rem 0.25rem 0.5rem;

    font-family: "Roboto", sans-serif;
    font-size: calc(var(--height) / 2.5);
    background: ${({ theme: { light } }) => light};

    border-radius: 2px;
    border: solid 2px transparent;
    outline: none;
    box-sizing: border-box;

    transition: border 0.2s ease-in-out;

    &:hover {
      border: solid 2px ${({ theme: { medium } }) => medium};
      background: ${({ theme }) => theme.hexToRgbA(theme.light, "0.5")};
    }

    &:active,
    &:focus {
      border: solid 2px ${({ theme: { yellow } }) => yellow};
    }

    &:disabled {
      border: solid 2px transparent;
      color: ${({ theme: { light } }) => light};
      background: ${({ theme: { hexToRgbA, light } }) =>
        hexToRgbA(light, "0.25")};
    }
  }
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  onReset?: () => void;
}

const Input: FC<Props> = (props) => (
  <StyledInput disabled={!!props.disabled}>
    <Icon
      icon="close"
      iconSize="25px"
      color="medium"
      click={props.disabled ? undefined : props.onReset}
    />
    <input {...{ reset: undefined, ...props }} />
  </StyledInput>
);

export default Input;
