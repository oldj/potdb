/**
 * collection
 * @author: oldj
 * @homepage: https://oldj.net
 */
import { DataTypeDocument } from '../../typings';
import PotDb from '../db';
declare type FilterPredicate = (item: any) => boolean;
interface Options {
}
export default class Collection {
    name: string;
    private _db;
    private _path;
    private _path_data;
    private options;
    private _meta;
    private _ids;
    private _docs;
    constructor(db: PotDb, name: string);
    updateConfig(options: Partial<Options>): void;
    private makeId;
    private getDoc;
    count(): Promise<number>;
    insert<T>(doc: T): Promise<T & {
        _id: string;
    }>;
    /**
     * 类似 insert 方法，但不同的是如果传入的 doc 包含 _id 参数，侧会尝试更新对应的文档
     * 如果不存在 _id 参数，或者 _id 对应的文档不存在，则新建
     * 这个方法一般用在 db.loadJSON() 等场景
     */
    _insert(doc: DataTypeDocument): Promise<void>;
    all<T>(keys?: string | string[]): Promise<T[]>;
    index<T>(index: number, keys?: string | string[]): Promise<T | undefined>;
    find<T>(predicate: FilterPredicate, keys?: string | string[]): Promise<T | undefined>;
    filter<T>(predicate: FilterPredicate, keys?: string | string[]): Promise<T[]>;
    update<T>(predicate: FilterPredicate, data: T): Promise<T[]>;
    delete(predicate: FilterPredicate): Promise<void>;
    remove(): Promise<void>;
    _getMeta(): Promise<DataTypeDocument>;
    _setMeta(data: any): Promise<void>;
}
export {};
