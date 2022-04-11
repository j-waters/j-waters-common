export function groupBy<T, K>(
    array: T[],
    keyGetter: (item: T) => K,
): Map<K, T[]> {
    const map = new Map<K, T[]>();
    array.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

export function flatGroupBy<T, K>(
    array: T[],
    keyGetter: (item: T) => K,
): T[][] {
    return Array.from(groupBy(array, keyGetter).values());
}

export function pairwiseFold<T, R>(
    arr: T[],
    func: (current: T, next: T) => R,
): R[] {
    const out: R[] = [];
    for (let i = 0; i < arr.length - 1; i++) {
        out.push(func(arr[i], arr[i + 1]));
    }
    return out;
}

