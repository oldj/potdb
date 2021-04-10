"use strict";
/**
 * asType
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.asInt = void 0;
var asInt = function (value, default_value) {
    value = parseInt(value);
    return isNaN(value) ? default_value : value;
};
exports.asInt = asInt;
//# sourceMappingURL=asType.js.map