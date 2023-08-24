import React, { useEffect, useState } from 'react';

function useScrollDown() {
  const [canScroll, setCanScroll] = useState(false);

  const debouncedOnMove = (e: WheelEvent) => {
    if (e.deltaY > 0) {
      setCanScroll(true);
      setTimeout(() => {
        setCanScroll(false);
      }, 1000);
    }
  }
  useEffect(() => {
    window.addEventListener('wheel', debouncedOnMove);
    return () => {
      window.removeEventListener('wheel', debouncedOnMove);
    };
  }, []);

  return canScroll;
}

export default useScrollDown;
