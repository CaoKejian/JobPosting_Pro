import React, { useEffect, useState } from 'react';
import { debounce } from '../share/Debounce';

function useScrollDown(isAllowUp?: boolean, isAllowDown?: boolean, isMobile?: boolean) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const debouncedOnMove = debounce((e: WheelEvent) => {
    if (!isMobile) {
      if (e.deltaY > 10 && isAllowDown) {
        setCanScrollDown(true);
        setTimeout(() => {
          setCanScrollDown(false);
        }, 500);
      } else if (e.deltaY < -100 && isAllowUp) {
        setCanScrollUp(true);
        setTimeout(() => {
          setCanScrollUp(false);
        }, 500);
      }
    }
  }, 200);
  useEffect(() => {
    if (!isMobile) {
      window.addEventListener('wheel', debouncedOnMove);
      return () => {
        window.removeEventListener('wheel', debouncedOnMove);
      };
    }
  }, [isMobile]);

  return { canScrollUp, canScrollDown };
}

export default useScrollDown;
