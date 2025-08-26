
export function isColliding(a, b) {
    const overlapX = overlap(a.x, a.x + a.width, b.x, b.x + b.width)
    const overlapY = overlap(a.y, a.y + a.height, b.y, b.y + b.height);

    return overlapX && overlapY;
}

export function overlap(a0, a1, b0, b1)
{
    return a1 >= b0 && a0 <= b1;
}