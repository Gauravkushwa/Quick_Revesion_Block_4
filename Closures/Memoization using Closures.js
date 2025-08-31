function memoize(fn, maxSize = 5) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);
        cache.set(key, result);

        if (cache.size > maxSize) {
            const firstKey = cache.keys().next().value;
            cache.delete(firstKey);
        }

        return result;
    };
}

function slowAdd(a, b) {
    console.log("Calculating...");
    return a + b;
}

const memoizedAdd = memoize(slowAdd, 3);

console.log(memoizedAdd(1, 2));
console.log(memoizedAdd(1, 2));
console.log(memoizedAdd(2, 3));
console.log(memoizedAdd(3, 4));
console.log(memoizedAdd(4, 5));
console.log(memoizedAdd(1, 2));
