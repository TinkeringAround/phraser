import styled from "styled-components";

const Button = styled.button`
  --color: ${({ theme: { white } }) => white};
  --backgroundColor: ${({ theme: { yellow } }) => yellow};

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
    :hover {
      background: ${({ theme: { hexToRgbA, yellow } }) =>
        hexToRgbA(yellow, "0.75")};
    }
  }
`;

export default Button;
