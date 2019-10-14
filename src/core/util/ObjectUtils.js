
function getSplittedPath(path) {
    if (!(typeof path === 'string')) {
        console.error("Only strings are accepted into path");
        return;
    }

    let splitterRegex = /[\.\[\]]/;
    return path.split(splitterRegex).filter((piece) => piece.length > 0);
}

function setValue(object, path, value) {
    let splittedPath = getSplittedPath(path);

    if (splittedPath) {
        let pointer = object;
        while (splittedPath.length > 1) {
            let currentPath = splittedPath.shift();
            pointer = pointer[currentPath];
        }
        let currentPath = splittedPath.shift();
        pointer[currentPath] = value;
    }
}

function getValue(object, path) {
    let splittedPath = getSplittedPath(path);

    if (splittedPath) {
        let pointer = object;
        while (splittedPath.length > 1) {
            let currentPath = splittedPath.shift();
            pointer = pointer[currentPath];
        }
        let currentPath = splittedPath.shift();
        return pointer[currentPath];
    }
}

const ObjectUtils = {
    getSplittedPath: getSplittedPath,
    setValue: setValue,
    getValue: getValue
};

export default ObjectUtils;