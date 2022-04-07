import { FC, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRefCallback } from "../hooks/useRefCallback";
import { usePhraser } from "../store";
import { Breakpoint, useBreakpoint } from "../hooks/useBreakpoint";
import { pageCount } from "../libs/util";

const StyledSlider = styled.div<{ large: boolean }>`
  position: relative;

  display: grid;
  grid-template-columns: repeat(
    ${pageCount},
    ${({ large }) => (large ? "calc(100% / 3)" : "100%")}
  );
  grid-template-rows: minmax(0, 1fr);

  scroll-snap-type: x mandatory;
  overflow: auto;
`;

interface Props {
  slide?: number;
}

const Slider: FC<Props> = ({ children, slide = 0 }) => {
  const { ref, setRef } = useRefCallback();
  const { song } = usePhraser();
  const breakPoint = useBreakpoint();

  const slideTo = useCallback(
    (slide: number = 0) => {
      if (ref) {
        const slider = ref as HTMLElement;
        slider.scrollTo({
          left: slide * slider.clientWidth,
          behavior: "smooth",
        });
      }
    },
    [ref]
  );

  useEffect(() => {
    slideTo(slide);
  }, [slideTo, slide]);

  useEffect(() => {
    if (song) slideTo(1);
  }, [song, slideTo]);

  return (
    <StyledSlider ref={setRef} large={breakPoint >= Breakpoint.m}>
      {children}
    </StyledSlider>
  );
};

export default Slider;
