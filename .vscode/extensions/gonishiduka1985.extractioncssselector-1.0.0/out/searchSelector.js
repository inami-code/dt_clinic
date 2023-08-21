"use strict";
// Extract class and id attributes from the string and make them into an array
Object.defineProperty(exports, "__esModule", { value: true });
const searchSelector = ({ text, isIncludeId, excludeRegex }) => {
    //  const regex = /(class|className)=(["'])(.+?)\2/g;
    const regexId = isIncludeId ? '|id' : '';
    const selectorRegex = new RegExp(`(class|className${regexId})=(["'])(.+?)\\2`, 'g');
    const spaceRegex = /\s{2,}/;
    const excludeRegexVal = new RegExp(excludeRegex);
    let matches;
    const twoDimensionalClassArray = [];
    while ((matches = selectorRegex.exec(text)) !== null) {
        const selector = matches[1];
        const trimString = matches[3].trim().replace(/　/g, ' ').replace(spaceRegex, ' ');
        const selectorsArray = trimString
            .split(' ')
            .map((str) => (selector === 'id' ? `#` : '.') + str);
        const filteredSelecorsArray = excludeRegex
            ? selectorsArray.filter((selector) => !excludeRegexVal.test(selector))
            : selectorsArray;
        twoDimensionalClassArray.push(filteredSelecorsArray);
    }
    const classArray = twoDimensionalClassArray.flat();
    const uniqueClassArray = Array.from(new Set(classArray));
    return uniqueClassArray;
};
exports.default = searchSelector;
//# sourceMappingURL=searchSelector.js.map