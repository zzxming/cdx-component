export const useSameClickTarget = (callback: (e: MouseEvent) => void) => {
    let mouseDownTarget = false;
    let mouseUpTarget = false;
    let mouseDownTime = 0;
    let mousUpTime = 0;
    const onMouseDown = (e: MouseEvent) => {
        mouseDownTarget = e.currentTarget === e.target;
        mouseDownTime = Date.now();
    };
    const onMouseUp = (e: MouseEvent) => {
        mouseUpTarget = e.currentTarget === e.target;
        mousUpTime = Date.now();
    };
    const onClick = (e: MouseEvent) => {
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
