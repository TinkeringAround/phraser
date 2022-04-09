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

  const isLarge = useCallback(() => {
    return breakPoint >= Breakpoint.m;
  }, [breakPoint])

  const slideTo = useCallback(
    (slide: number = 0) => {
      if (ref) {
        const slider = ref as HTMLElement;
        const blockWidth = isLarge() ? slider.clientWidth / 3 : slider.clientWidth;
        slider.scrollTo({
          left: slide * blockWidth,
          behavior: "smooth",
        });
      }
    },
    [ref, isLarge]
  );

  useEffect(() => {
    slideTo(slide);
  }, [slideTo, slide]);

  useEffect(() => {
    if (song && !isLarge()) slideTo(1);
  }, [song, slideTo, isLarge]);

  return (
    <StyledSlider ref={setRef} large={breakPoint >= Breakpoint.m}>
      {children}
    </StyledSlider>
  );
};

export default Slider;
