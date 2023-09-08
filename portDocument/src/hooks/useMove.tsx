import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

interface Options {
  beforeStart?: (e: React.TouchEvent) => void;
  afterStart?: (e: React.TouchEvent) => void;
  beforeMove?: (e: React.TouchEvent) => void;
  afterMove?: (e: React.TouchEvent) => void;
  beforeEnd?: (e: React.TouchEvent) => void;
  afterEnd?: (e: React.TouchEvent) => void;
  element: React.RefObject<HTMLElement>;
}

const useSwipe = (options: Options) => {
  const start = useRef<Point | null>(null);
  const end = useRef<Point | null>(null);
  const [swiping, setSwiping] = useState(false);
  const onStart = (e: any) => {
    if (options.beforeStart && shouldPreventDefault(e)) {
      e.preventDefault();
      options.beforeStart(e);
    }
    setSwiping(true);
    end.current = start.current = { x: e.touches[0].screenX, y: e.touches[0].screenY };
    if (options.afterStart) options.afterStart(e);
  };

  const onMove = (e: any) => {
    if (options.beforeMove) options.beforeMove(e);
    if (!start.current) return;
    end.current = { x: e.touches[0].screenX, y: e.touches[0].screenY };
    if (options.afterMove) options.afterMove(e);
  };

  const onEnd = (e: any) => {
    if (options.beforeEnd) options.beforeEnd(e);
    setSwiping(false);
    if (options.afterEnd) options.afterEnd(e);
  };

  useEffect(() => {
    const element = options.element.current;
    if (!element) return;

    element.addEventListener('touchstart', onStart);
    element.addEventListener('touchmove', onMove);
    element.addEventListener('touchend', onEnd);

    return () => {
      element.removeEventListener('touchstart', onStart);
      element.removeEventListener('touchmove', onMove);
      element.removeEventListener('touchend', onEnd);
    };
  }, [options.element]);

  const distance = {
    get x() {
      if (!start.current || !end.current) return null;
      return end.current.x - start.current.x;
    },
    get y() {
      if (!start.current || !end.current) return null;
      return end.current.y - start.current.y;
    }
  };

  const direction = (() => {
    if (!distance.x || !distance.y) return '';
    if (Math.abs(distance.x) > Math.abs(distance.y)) {
      return distance.x > 0 ? 'right' : 'left';
    } else {
      return distance.y > 0 ? 'down' : 'up';
    }
  })();
  const shouldPreventDefault = (e: React.TouchEvent) => {
    const threshold = 10; // 自定义阈值
    return Math.abs(distance.x!) > threshold || Math.abs(distance.y!) > threshold;
  };
  return {
    swiping,
    direction,
    distance
  };
};

export default useSwipe;
