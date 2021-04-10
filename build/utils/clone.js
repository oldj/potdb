"use strict";
/**
 * clone
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = void 0;
var tslib_1 = require("tslib");
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var clone = function (target, propertyName, descriptor) {
    var method = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var result;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, method.apply(this, args.map(function (i) {
                            return (i && typeof i === 'object') ? lodash_1.default.cloneDeep(i) : i;
                        }))];
                    case 1:
                        result = _a.sent();
                        if (result && typeof result === 'object') {
                            result = lodash_1.default.cloneDeep(result);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return descriptor;
};
exports.clone = clone;
//# sourceMappingURL=clone.js.map