export const useSameClickTarget = (callback: EventListener) => {
  let mouseDownTarget = false;
  let mouseUpTarget = false;
  let mouseDownTime = 0;
  let mousUpTime = 0;
  const onMouseDown = (e: Event) => {
    mouseDownTarget = e.currentTarget === e.target;
    mouseDownTime = Date.now();
  };
  const onMouseUp = (e: Event) => {
    mouseUpTarget = e.currentTarget === e.target;
    mousUpTime = Date.now();
  };
  const onClick = (e: Event) => {
    if (mouseDownTarget && mouseUpTarget && mousUpTime - mouseDownTime < 200) {
      callback(e);
    }
    e.stopPropagation();
    mouseDownTarget = mouseUpTarget = false;
  };

  return {
    onMouseDown,
    onMouseUp,
    onClick,
  };
};
