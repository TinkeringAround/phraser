import { FC } from "react";
import styled from "styled-components";
import { Breakpoint, useBreakpoint } from "../hooks/useBreakpoint";

const StyledPage = styled.section<{ large: boolean }>`
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  grid-template-columns: minmax(0, 1fr);

  padding: ${({ large }) => (large ? "0.5rem" : "0")};
  background: ${({ theme }) => theme.light};

  scroll-snap-align: center;

  > div {
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    grid-template-columns: minmax(0, 1fr);

    padding: 1rem;

    background: ${({ theme }) => theme.white};
    border-radius: ${({ large }) => (large ? "3px" : "0")};;
  }
`;

const Slide: FC = ({ children }) => {
  const breakPoint = useBreakpoint();

  return (
    <StyledPage large={breakPoint >= Breakpoint.m}>
      <div>{children}</div>
    </StyledPage>
  );
};

export default Slide;
