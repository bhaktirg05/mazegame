const random = function (st, end) {
    return st + Math.floor(Math.random() * (end + 1 - st));
};

function type(a) {
    if (Array.isArray(a)) return "array";
    if (Number.isNaN(a)) return "NaN";
    if (a === null) return null;
    return typeof a;
}

function areOfSameType(a, b) {
    return type(a) === type(b);
}

function areValuesEqual(a, b) {
    return a === b;
}

function areLengthUnequal(a, b) {
    return (
        Object.keys(a).length !== Object.keys(b).length || a.length !== b.length
    );
}

function areObjectEqual(a, b) {
    if (areLengthUnequal(a, b)) return false;

    for (const key in a) {
        if (!isEqual(a[key], b[key]) || !(key in b)) return false;
    }
    return true;
}

function isEqual(a, b) {
    if (!areOfSameType(a, b)) return false;

    switch (type(a)) {
        case "array":
            return areObjectEqual(a, b);
        case "object":
            return areObjectEqual(a, b);
        case "undefined":
            return areValuesEqual(a, b);
        case "NaN":
        case "null":
            return true;
    }
    return areValuesEqual(a, b);
}

module.exports = {
    isEqual,
    random,
};
