import { useCallback, useEffect, useState } from 'react';

export enum Breakpoint {
  xS,
  s,
  m,
  l,
  xL
}

export const useBreakpoint = () => {
  const [breakpoint, setBreakPoint] = useState<Breakpoint>(Breakpoint.m);
  const [width, setWidth] = useState<number>(0);

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth);
  }, [setWidth]);

  useEffect(() => {
    if (0 < width && width < 600)
      setBreakPoint(Breakpoint.xS);
    else if (600 < width && width < 960)
      setBreakPoint(Breakpoint.s);
    else if (960 < width && width < 1280)
      setBreakPoint(Breakpoint.m);
    else if (1280 < width && width < 1920)
      setBreakPoint(Breakpoint.l);
    else
      setBreakPoint(Breakpoint.xL);
  }, [width, setBreakPoint]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return breakpoint;
};
