import React, { FC, Fragment, useContext, useState } from "react";
import styled, { ThemeContext } from "styled-components";
import ReactDOM from "react-dom";
import { fadeIn } from "../styles/animations";

const StyledSpinner = styled.div`
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100vh;

  overflow: hidden;
  background: ${({ theme: { hexToRgbA, black } }) => hexToRgbA(black, "0.75")};

  animation: fadeIn 0.5s ease-in-out;
  ${fadeIn};

  div {
    --c: linear-gradient(currentColor 0 0);

    width: 60px;
    height: 80px;
    background: var(--c) 0 50%, var(--c) 50% 50%, var(--c) 100% 50%;

    background-size: 9px 50%;
    background-repeat: no-repeat;

    animation: spinner-animation 1s infinite linear alternate;

    @keyframes spinner-animation {
      20% {
        background-size: 9px 20%, 9px 50%, 9px 50%;
      }
      40% {
        background-size: 9px 100%, 9px 20%, 9px 50%;
      }
      60% {
        background-size: 9px 50%, 9px 100%, 9px 20%;
      }
      80% {
        background-size: 9px 50%, 9px 50%, 9px 100%;
      }
    }
  }
`;

interface Props {
  show: boolean;
  color?: string;
}

const Spinner: FC<Props> = ({ show, color = "yellow" }) => {
  const theme = useContext(ThemeContext);
  const [spinnerDOMElement] = useState(document.getElementById("spinner"));

  return spinnerDOMElement && show ? (
    ReactDOM.createPortal(
      <StyledSpinner>
        <div className="spinner" style={{ color: theme[color] }} />
      </StyledSpinner>,
      spinnerDOMElement
    )
  ) : (
    <Fragment />
  );
};

export default Spinner;
