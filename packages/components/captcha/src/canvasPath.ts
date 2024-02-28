export interface CaptchaHollowOptions {
    ctx: CanvasRenderingContext2D;
    x: number;
    y: number;
    width: number;
    height: number;
}
export const squarePath = ({ ctx, x, y, width, height }: CaptchaHollowOptions) => {
    const side = Math.min(width, height) * 0.25;
    const halfSide = side * 0.5;

    ctx.moveTo(x - halfSide, y - halfSide);
    ctx.lineTo(x + halfSide, y - halfSide);
    ctx.lineTo(x + halfSide, y + halfSide);
    ctx.lineTo(x - halfSide, y + halfSide);
    ctx.closePath();

    return [x - halfSide - 2, y - halfSide - 2, side + 4, side + 4];
};
