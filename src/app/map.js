import { MAP } from "./config.js";

// 1 ground
// 4 question block (Mushroom)
const SOLID_ELEMENTS = [1, 4]

export function isMapSolidElement(row, col) {
    return SOLID_ELEMENTS.includes(MAP[row]?.[col]);
}
