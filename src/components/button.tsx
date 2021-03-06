import styled from "styled-components";

const Button = styled.button<{
  color?: string;
  hoverColor?: string;
  background?: string;
  hoverBackground?: string;
}>`
  --color: ${({ theme, color }) => theme[color ?? "white"]};
  --backgroundColor: ${({ theme, background }) =>
    theme[background ?? "yellow"]};

  position: relative;

  display: grid;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  border-radius: 2px;
  padding: 0.75rem;

  font-family: "Roboto-Bold", sans-serif;
  font-size: 1.25rem;
  background: var(--backgroundColor);
  color: var(--color);

  outline: none;
  border: none;

  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &[disabled] {
    background: ${({ theme: { light, hexToRgbA } }) => hexToRgbA(light, "0.4")};
    color: ${({ theme: { grey } }) => grey};

    cursor: default;
  }

  &:not([disabled]) {
    &:hover {
      background: ${({ theme, hoverBackground }) =>
        theme.hexToRgbA(theme[hoverBackground ?? "yellow"], "0.75")};
    }
  }
`;

export default Button;
