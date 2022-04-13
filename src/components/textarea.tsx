import styled from "styled-components";

const TextArea = styled.textarea`
  padding: 1rem;
  margin: 0;

  font-family: "Roboto", sans-serif;
  color: ${({ theme: { dark } }) => dark};
  font-size: 1rem;

  border: 2px solid ${({ theme: { light } }) => light};
  border-radius: 2px;
  box-sizing: border-box;
  background: transparent;
  outline: none;

  resize: none;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    border: 2px solid ${({ theme: { medium } }) => medium};
  }

  &:active,
  :focus {
    &:not(:disabled) {
      border: 2px solid ${({ theme: { yellow } }) => yellow};
    }
  }
`;

export default TextArea;
