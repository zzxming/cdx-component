import { isServer } from './types';

export const raf = (fn: (t: number) => void) => {
  if (isServer) {
    let lastTime = 0;
    const currTime = Date.now();
    const timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
    return setTimeout(() => {
      fn(currTime + timeToCall);
      lastTime = currTime + timeToCall;
    }, timeToCall);
  }
  else {
    return window.requestAnimationFrame(fn);
  }
};

export const caf = (id: ReturnType<typeof raf>) => isServer ? clearTimeout(id) : window.cancelAnimationFrame(id as number);
