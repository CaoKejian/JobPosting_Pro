export const throttle = (time:number,fn:Function) => {
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