function getRandomItem(el, el2) {
    if (el instanceof Array) {
        return el[Math.floor(Math.random() * el.length)];
    } else if (typeof el === 'string') {
        return el[Math.floor(Math.random() * el.length)];
    } else if (el instanceof Object) {
        const keys = Object.keys(el);

        const key = keys[Math.floor(Math.random() * keys.length)];

        return el[key];
    } else if (el2) {
        if (el2 > el) {
            return Math.floor(Math.random() * (el2 - el + 1) + el);
        } else {
            return Math.floor(Math.random() * (el - el2 + 1) + el2);
        }
    }
    else if (!el) {
        return Math.floor(Math.random() * 100);
    }
}

module.exports = getRandomItem
