import { FC, useCallback } from "react";
import styled from "styled-components";
import For from "./for";

const StyledSegmentedButton = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-template-rows: minmax(0, 1fr);
  height: 100%;
  border-radius: 2px;

  button {
    display: grid;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    font-family: "Roboto-Bold", sans-serif;
    font-size: calc(2.5rem / 2.5);
    background: ${({ theme: { light } }) => light};
    color: ${({ theme: { white } }) => white};

    margin: 0;
    padding: 0;
    outline: none;
    border: none;

    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:first-of-type {
      border-radius: 2px 0 0 2px;
    }

    &:last-of-type {
      border-radius: 0 2px 2px 0;
    }

    &[is="selected"] {
      background: ${({ theme }) => theme.yellow};
    }

    &:hover {
      background: ${({ theme }) => theme.medium};
    }
  }
`;

interface Props {
  options: string[];
  selected: number;
  onSelect: (option: number) => void;
}

const SegmentedButton: FC<Props> = ({ options, selected, onSelect }) => {
  const onClick = useCallback(
    (event) => {
      const button = event.target as HTMLButtonElement;
      const index = Number(button.name);

      if (selected !== index) {
        onSelect(index);
      }
    },
    [selected]
  );

  return (
    <StyledSegmentedButton>
      <For
        values={options}
        projector={(option, index) => (
          <button
            key={`segmented-button-option-${index}`}
            is={index === selected ? "selected" : undefined}
            name={`${index}`}
            onClick={onClick}
          >
            {option}
          </button>
        )}
      />
    </StyledSegmentedButton>
  );
};

export default SegmentedButton;
