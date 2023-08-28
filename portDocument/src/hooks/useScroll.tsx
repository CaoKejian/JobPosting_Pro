import React, { useEffect, useState } from 'react';
import { debounce } from '../share/Debounce';

function useScrollDown(isAllowUp: boolean, isAllowDown: boolean) {
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const debouncedOnMove = debounce((e: WheelEvent) => {
    if (e.deltaY > 10 && isAllowDown) {
      setCanScrollDown(true);
      setTimeout(() => {
        setCanScrollDown(false);
      }, 2000);
    } else if (e.deltaY < -100 && isAllowUp) {
      setCanScrollUp(true);
      setTimeout(() => {
        setCanScrollUp(false);
      }, 2000);
    }
  },500);
  useEffect(() => {
    window.addEventListener('wheel', debouncedOnMove);
    return () => {
      window.removeEventListener('wheel', debouncedOnMove);
    };
  }, []);

  return { canScrollUp, canScrollDown };
}

export default useScrollDown;
