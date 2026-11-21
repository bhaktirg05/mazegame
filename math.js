const random = function (st, end) {
    return st + Math.floor(Math.random() * (end + 1 - st));
};

module.exports = {
    random,
};
