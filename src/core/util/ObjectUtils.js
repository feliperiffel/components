
function splitPath(path) {
    if (!(typeof path === 'string')) {
        console.error("Only strings are accepted into path");
        return;
    }

    let splitterRegex = /[\.\[\]]/;
    return path.split(splitterRegex).filter((piece) => piece.length > 0);
}

function setValue(object, path, value) {
    let pathMembers = splitPath(path);

    if (pathMembers) {
        let pointer = object;
        while (pathMembers.length > 1) {
            let currentPath = pathMembers.shift();
            pointer = pointer[currentPath];
        }
        let currentPath = pathMembers.shift();
        pointer[currentPath] = value;
    }
}

function getValue(object, path) {
    let pathMembers = splitPath(path);

    if (pathMembers) {
        let pointer = object;
        while (pathMembers.length > 1) {
            let currentPath = pathMembers.shift();
            pointer = pointer[currentPath];
        }
        let currentPath = pathMembers.shift();
        return pointer[currentPath];
    }
}

const ObjectUtils = {
    splitPath: splitPath,
    setValue: setValue,
    getValue: getValue
};

export default ObjectUtils;