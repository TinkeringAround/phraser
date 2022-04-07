import React, { FC, Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import { fadeIn, fadeOut, fromTop } from "../styles/animations";
import { delay } from "../libs/util";
import If from "./if";
import ReactDOM from "react-dom";
import Button from "./button";

const SDialog = styled.div<Props & { leaving: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: fixed;
  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
  padding: 2rem;

  overflow: hidden;
  background: ${({ theme: { hexToRgbA, yellow } }) => hexToRgbA(yellow, "1")};

  box-sizing: border-box;

  animation: fadeIn 0.5s ease-in-out;
  ${fadeIn};

  ${({ leaving }) =>
    leaving
      ? `
        > * {
          opacity: 0;
          animation: fadeOut 0.15s ease-in-out !important;
       
          ${fadeOut};
        }`
      : ""};

  .content {
    position: relative;

    display: grid;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: minmax(0, 1fr) min-content;
    row-gap: 2rem;

    flex: 1;
    max-width: 450px;
    height: fit-content;

    border-radius: 3px;
    animation: fromTop 0.3s ease-in-out, fadeIn 0.3s ease-in-out;
    ${fromTop("-5rem", "0rem")}
    ${fadeIn};

    footer {
      display: flex;
      justify-content: center;
      column-gap: 1rem;
    }
  }
`;

const StyledButton = styled(Button)`
  color: ${({ theme: { dark } }) => dark};
  background: ${({ theme: { white } }) => white};
`;

const StyledCancelButton = styled(Button)`
  color: ${({ theme: { white } }) => white};
  background: ${({ theme: { dark } }) => dark};
`;

interface Props {
  visible: boolean;
  onReset?: () => void;
  onConfirm?: () => void;
  noButtons?: boolean;
}

const Dialog: FC<Props> = ({
  visible,
  onConfirm,
  onReset,
  noButtons = false,
  children,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [dialogDOMElement] = useState(document.getElementById("dialog"));

  useEffect(() => {
    if (visible) setShow(true);
    else {
      delay(() => {
        setShow(false);
      }, 500);
    }
  }, [visible, setShow]);

  return dialogDOMElement && show ? (
    ReactDOM.createPortal(
      <SDialog visible={show} leaving={!visible && show}>
        <If condition={show}>
          <div className="content">
            {children}
            <If condition={!noButtons}>
              <footer>
                <StyledCancelButton onClick={onReset}>
                  Cancel
                </StyledCancelButton>
                <StyledButton onClick={onConfirm}>Confirm</StyledButton>
              </footer>
            </If>
          </div>
        </If>
      </SDialog>,
      dialogDOMElement
    )
  ) : (
    <Fragment />
  );
};

export default Dialog;
