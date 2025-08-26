
export default function animate(state, image, animations, frameDuration, ctx, blinkDuration = 0) {
    const frame = Math.floor(performance.now() / frameDuration) % animations.length;

    if (blinkDuration !== 0) {
        if (Math.floor(performance.now() / blinkDuration) % 2 === 0 ) {
            return;
        }
    }

    ctx.save();

    if (state.facingLeft) {
        ctx.translate(state.x + state.width, state.y);
        ctx.scale(-1, 1);
    } else {
        ctx.translate(state.x, state.y);
    }

    ctx.drawImage(
        image,
        animations[frame].x,
        animations[frame].y,
        state.width,
        state.height,
        0,
        0,
        state.width,
        state.height,
    );

    ctx.restore();
}