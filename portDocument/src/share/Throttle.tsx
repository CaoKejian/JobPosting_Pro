export const throttle = (fn:Function, time:number) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args:any) => {
    if(timer){
      return
    }else{
      fn(...args)
      timer = setTimeout(() => {
        timer = undefined
      }, time)
    }
  }
}