import React, { FC } from "react";
import styled from "styled-components";

const StyledSelect = styled.select`
  --height: 2.5rem;

  height: var(--height);
  flex: 1;
  padding: 0.25rem 0.5rem;

  background: ${({ theme }) => theme.light};
  border: none;
  border-radius: 2px;

  appearance: none;
  outline: none;

  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.dark};
  text-align: center;

  transition: all 0.15s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.hexToRgbA(theme.light, "0.5")};
  }
  
  ::-ms-expand {
    display: none;
  }
`;

interface Props {
  options: Array<string>;
  value: string;
  select: (selection: string) => void;
}

const Dropdown: FC<Props> = ({ options, value, select }) => (
  <StyledSelect
    id={"selection-" + value}
    value={value}
    onChange={(event: any) => select(event.target.value)}
  >
    {options.map((option: string, index: number) => (
      <option key={"Option-" + index}>{option}</option>
    ))}
  </StyledSelect>
);

export default Dropdown;
