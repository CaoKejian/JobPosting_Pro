export const Debounce = (fn: Function, time: number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  
  return (...args: any) => {
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      fn(...args);
      timer = undefined;
    }, time);
  };
};
