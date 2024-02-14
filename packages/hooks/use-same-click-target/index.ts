export const useSameClickTarget = (callback: (e: MouseEvent) => void) => {
    let mouseDownTarget = false;
    let mouseUpTarget = false;
    const onMouseDown = (e: MouseEvent) => {
        mouseDownTarget = e.currentTarget === e.target;
    };
    const onMouseUp = (e: MouseEvent) => {
        mouseUpTarget = e.currentTarget === e.target;
    };
    const onClick = (e: MouseEvent) => {
        if (mouseDownTarget && mouseUpTarget) {
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
