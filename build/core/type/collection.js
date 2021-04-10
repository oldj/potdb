"use strict";
/**
 * collection
 * @author: oldj
 * @homepage: https://oldj.net
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = tslib_1.__importStar(require("fs"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var path = tslib_1.__importStar(require("path"));
var asType_1 = require("../../utils/asType");
var clone_1 = require("../../utils/clone");
var dict_1 = tslib_1.__importDefault(require("./dict"));
var list_1 = tslib_1.__importDefault(require("./list"));
var Collection = /** @class */ (function () {
    function Collection(db, name) {
        this.options = {};
        this._docs = {};
        this._db = db;
        this.name = name;
        this._path = path.join(db.dir, 'collection', name);
        this._path_data = path.join(this._path, 'data');
        this._meta = new dict_1.default('meta', this._path, db.options);
        this._ids = new list_1.default('ids', this._path, db.options);
    }
    Collection.prototype.updateConfig = function (options) {
        this.options = tslib_1.__assign(tslib_1.__assign({}, this.options), options);
    };
    Collection.prototype.makeId = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var index, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = asType_1.asInt;
                        return [4 /*yield*/, this._meta.get('index')];
                    case 1:
                        index = _a.apply(void 0, [_b.sent(), 0]);
                        if (index < 0)
                            index = 0;
                        index++;
                        return [4 /*yield*/, this._meta.set('index', index)
                            // let ts = ((new Date()).getTime() % 1000).toString().padStart(3, '0')
                            // return `${index}${ts}`
                        ];
                    case 2:
                        _b.sent();
                        // let ts = ((new Date()).getTime() % 1000).toString().padStart(3, '0')
                        // return `${index}${ts}`
                        return [2 /*return*/, index.toString()];
                }
            });
        });
    };
    Collection.prototype.getDoc = function (_id) {
        if (!this._docs[_id]) {
            this._docs[_id] = new dict_1.default(_id, this._path_data, this._db.options);
        }
        return this._docs[_id];
    };
    Collection.prototype.count = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ids.all()];
                    case 1: return [2 /*return*/, (_a.sent()).length];
                }
            });
        });
    };
    Collection.prototype.insert = function (doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _id, doc2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.makeId()];
                    case 1:
                        _id = _a.sent();
                        doc2 = tslib_1.__assign(tslib_1.__assign({}, doc), { _id: _id });
                        return [4 /*yield*/, this._insert(doc2)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, doc2];
                }
            });
        });
    };
    /**
     * 类似 insert 方法，但不同的是如果传入的 doc 包含 _id 参数，侧会尝试更新对应的文档
     * 如果不存在 _id 参数，或者 _id 对应的文档不存在，则新建
     * 这个方法一般用在 db.loadJSON() 等场景
     */
    Collection.prototype._insert = function (doc) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _id, d;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = doc._id;
                        return [4 /*yield*/, this._ids.push(_id)];
                    case 1:
                        _a.sent();
                        d = this.getDoc(_id);
                        return [4 /*yield*/, d.update(doc)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Collection.prototype.all = function (keys) {
        if (keys === void 0) { keys = '*'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var data, _a, _b;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = Promise).all;
                        return [4 /*yield*/, this._ids.all()];
                    case 1: return [4 /*yield*/, _b.apply(_a, [(_c.sent()).map(function (_id) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var d, doc;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            d = this.getDoc(_id);
                                            return [4 /*yield*/, d.toJSON()];
                                        case 1:
                                            doc = _a.sent();
                                            if (Array.isArray(keys)) {
                                                doc = lodash_1.default.pick(doc, keys);
                                            }
                                            return [2 /*return*/, doc];
                                    }
                                });
                            }); })])];
                    case 2:
                        data = _c.sent();
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Collection.prototype.index = function (index, keys) {
        if (keys === void 0) { keys = '*'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _id;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ids.index(index)];
                    case 1:
                        _id = _a.sent();
                        if (!_id)
                            return [2 /*return*/];
                        return [4 /*yield*/, this.find(function (i) { return i._id === _id; }, keys)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Collection.prototype.find = function (predicate, keys) {
        if (keys === void 0) { keys = '*'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _ids, _i, _ids_1, _id, d, doc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ids.all()];
                    case 1:
                        _ids = _a.sent();
                        _i = 0, _ids_1 = _ids;
                        _a.label = 2;
                    case 2:
                        if (!(_i < _ids_1.length)) return [3 /*break*/, 5];
                        _id = _ids_1[_i];
                        d = this.getDoc(_id);
                        return [4 /*yield*/, d.toJSON()];
                    case 3:
                        doc = _a.sent();
                        if (predicate(doc)) {
                            if (Array.isArray(keys)) {
                                doc = lodash_1.default.pick(doc, keys);
                            }
                            return [2 /*return*/, doc];
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Collection.prototype.filter = function (predicate, keys) {
        if (keys === void 0) { keys = '*'; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _ids, list, _i, _ids_2, _id, d, doc;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._ids.all()];
                    case 1:
                        _ids = _a.sent();
                        list = [];
                        _i = 0, _ids_2 = _ids;
                        _a.label = 2;
                    case 2:
                        if (!(_i < _ids_2.length)) return [3 /*break*/, 5];
                        _id = _ids_2[_i];
                        d = this.getDoc(_id);
                        return [4 /*yield*/, d.toJSON()];
                    case 3:
                        doc = _a.sent();
                        if (predicate(doc)) {
                            if (Array.isArray(keys)) {
                                doc = lodash_1.default.pick(doc, keys);
                            }
                            list.push(doc);
                        }
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, list];
                }
            });
        });
    };
    Collection.prototype.update = function (predicate, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var items, out, _i, items_1, item, _id, d, doc, i;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.filter(predicate)];
                    case 1:
                        items = _a.sent();
                        out = [];
                        _i = 0, items_1 = items;
                        _a.label = 2;
                    case 2:
                        if (!(_i < items_1.length)) return [3 /*break*/, 6];
                        item = items_1[_i];
                        _id = item._id;
                        d = this.getDoc(_id);
                        return [4 /*yield*/, d.toJSON()];
                    case 3:
                        doc = _a.sent();
                        doc = tslib_1.__assign(tslib_1.__assign(tslib_1.__assign({}, doc), data), { _id: _id });
                        return [4 /*yield*/, d.update(doc)];
                    case 4:
                        i = _a.sent();
                        out.push(i);
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, out];
                }
            });
        });
    };
    Collection.prototype.delete = function (predicate) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var item, index, d;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.find(predicate)];
                    case 1:
                        item = _a.sent();
                        if (!item)
                            return [3 /*break*/, 5];
                        return [4 /*yield*/, this._ids.indexOf(item._id)];
                    case 2:
                        index = _a.sent();
                        if (index === -1)
                            return [3 /*break*/, 0];
                        return [4 /*yield*/, this._ids.splice(index, 1)];
                    case 3:
                        _a.sent();
                        d = this.getDoc(item._id);
                        return [4 /*yield*/, d.remove()];
                    case 4:
                        _a.sent();
                        delete this._docs[item._id];
                        return [3 /*break*/, 0];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Collection.prototype.remove = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // remove current collection
                    return [4 /*yield*/, this._meta.remove()];
                    case 1:
                        // remove current collection
                        _a.sent();
                        return [4 /*yield*/, this._ids.remove()];
                    case 2:
                        _a.sent();
                        this._docs = {};
                        return [4 /*yield*/, fs.promises.rmdir(this._path, { recursive: true })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Collection.prototype._getMeta = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._meta.all()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Collection.prototype._setMeta = function (data) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var keys, _i, keys_1, k;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        keys = Object.keys(data);
                        _i = 0, keys_1 = keys;
                        _a.label = 1;
                    case 1:
                        if (!(_i < keys_1.length)) return [3 /*break*/, 4];
                        k = keys_1[_i];
                        return [4 /*yield*/, this._meta.set(k, data[k])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        clone_1.clone
    ], Collection.prototype, "_getMeta", null);
    tslib_1.__decorate([
        clone_1.clone
    ], Collection.prototype, "_setMeta", null);
    return Collection;
}());
exports.default = Collection;
//# sourceMappingURL=collection.js.map