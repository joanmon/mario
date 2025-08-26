
export function applyAcceleration(v, a, dt, dir = 1, maxSpeed = Infinity) {
    const newV = v + a * dir * dt;
    return Math.max(Math.min(newV, maxSpeed), -maxSpeed);
}

export function applyDeceleration(v, a, dt) {
    return v > 0
        ? Math.max(v - a * dt, 0)
        : Math.min(v + a * dt, 0);
}

export function applyMovement(p, v, dt) {
    return p + v * dt;
}