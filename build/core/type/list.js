"use strict";
/**
 * list
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = tslib_1.__importStar(require("path"));
var clone_1 = require("../../utils/clone");
var io_1 = tslib_1.__importDefault(require("../io"));
var List = /** @class */ (function () {
    function List(name, root_dir, options) {
        this._data = null;
        this._path = path.join(root_dir, name + '.json');
        this.name = name;
        this._io = new io_1.default({
            data_type: 'list',
            data_path: this._path,
            debug: options.debug,
            dump_delay: options.dump_delay,
        });
    }
    List.prototype.ensure = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this._data === null)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this._io.load()];
                    case 1:
                        _a._data = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this._data];
                }
            });
        });
    };
    List.prototype.dump = function () {
        if (this._data === null)
            return;
        this._io.dump(tslib_1.__spreadArray([], this._data))
            .catch(function (e) { return console.error(e); });
    };
    List.prototype.rpush = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data.push(value);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.rpop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, v;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        v = this._data.pop();
                        this.dump();
                        return [2 /*return*/, v];
                }
            });
        });
    };
    List.prototype.rextend = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data = tslib_1.__spreadArray(tslib_1.__spreadArray([], this._data), values);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.lpush = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data.unshift(value);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.lpop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, v;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        v = this._data.shift();
                        this.dump();
                        return [2 /*return*/, v];
                }
            });
        });
    };
    List.prototype.lextend = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        this._data = tslib_1.__spreadArray(tslib_1.__spreadArray([], values), this._data);
                        this.dump();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.push = function (value) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpush(value)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.pop = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpop()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    List.prototype.extend = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rextend.apply(this, values)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.all = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.ensure()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    List.prototype.find = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        return [2 /*return*/, this._data.find(predicate)];
                }
            });
        });
    };
    List.prototype.filter = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        return [2 /*return*/, this._data.filter(predicate)];
                }
            });
        });
    };
    List.prototype.map = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        return [2 /*return*/, this._data.map(predicate)];
                }
            });
        });
    };
    List.prototype.index = function (index) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, idx, length_1;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        if (index < 0) {
                            idx = Math.abs(index);
                            length_1 = this._data.length;
                            if (length_1 < idx) {
                                return [2 /*return*/, undefined];
                            }
                            index = length_1 - idx;
                        }
                        return [2 /*return*/, this._data[index]];
                }
            });
        });
    };
    List.prototype.indexOf = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, i;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _b.sent();
                        if (typeof predicate === 'function') {
                            for (i = 0; i < this._data.length; i++) {
                                if (predicate(this._data[i])) {
                                    return [2 /*return*/, i];
                                }
                            }
                            return [2 /*return*/, -1];
                        }
                        else {
                            return [2 /*return*/, this._data.indexOf(predicate)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.slice = function (start, end) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, args;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _c.sent();
                        args = [start];
                        if (typeof end === 'number') {
                            args.push(end);
                        }
                        return [2 /*return*/, (_b = this._data).slice.apply(_b, args)];
                }
            });
        });
    };
    List.prototype.splice = function (start, delete_count) {
        var insert_items = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            insert_items[_i - 2] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, v;
            var _b;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.ensure()];
                    case 1:
                        _a._data = _c.sent();
                        v = (_b = this._data).splice.apply(_b, tslib_1.__spreadArray([start, delete_count], insert_items));
                        this.dump();
                        return [2 /*return*/, v];
                }
            });
        });
    };
    List.prototype.delete = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.filter(function (i) { return !predicate(i); })];
                    case 1:
                        _a._data = _b.sent();
                        this.dump();
                        return [2 /*return*/, this._data];
                }
            });
        });
    };
    List.prototype.set = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = data;
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    List.prototype.clear = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = [];
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    List.prototype.remove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._data = [];
                        return [4 /*yield*/, this._io.remove()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    List.prototype.update = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this._data = data;
                this.dump();
                return [2 /*return*/];
            });
        });
    };
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "rpush", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "rpop", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "rextend", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "lpush", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "lpop", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "lextend", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "all", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "find", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "filter", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "map", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "index", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "slice", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "splice", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "delete", null);
    tslib_1.__decorate([
        clone_1.clone
    ], List.prototype, "set", null);
    return List;
}());
exports.default = List;
//# sourceMappingURL=list.js.map