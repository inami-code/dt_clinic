"use strict";
// Create CSS selectors to paste
Object.defineProperty(exports, "__esModule", { value: true });
const setCssSelectors = ({ classes, insertString }) => {
    let selectors = '';
    classes.forEach((text) => {
        selectors += `${text} {
${insertString
            .map((str, index) => {
            if (index === insertString.length - 1) {
                return str;
            }
            return str + '\n';
        })
            .join('')}
}`;
        selectors += '\n\n';
    });
    return selectors;
};
exports.default = setCssSelectors;
//# sourceMappingURL=setCssSelectors.js.map