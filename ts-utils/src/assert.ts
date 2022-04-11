export function assert(condition: any): asserts condition {
    if (!condition) {
        throw new TypeError(`Assertion failed for ${condition}`);
    }
}
