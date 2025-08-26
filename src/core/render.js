export default function render(objects, deltaTime, ctx, paused = false) {

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


    for (let object of objects) {
        if ( typeof object.update === 'function' ) {
            if (!paused) {
                object.update(deltaTime);
            }
        }
    }

    for (let object of objects) {
        if ( typeof object.render === 'function' ) {
            object.render(ctx);
        }
    }
}