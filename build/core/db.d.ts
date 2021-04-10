/**
 * db
 * @author: oldj
 * @homepage: https://oldj.net
 */
import { IKeys } from './keys';
import { IBasicOptions, IDbDataJSON } from '../typings';
import Collection from './type/collection';
import Dict from './type/dict';
import List from './type/list';
import LatSet from './type/set';
interface IDBOptions extends IBasicOptions {
}
export default class PotDb {
    dir: string;
    options: IDBOptions;
    dict: {
        [key: string]: Dict;
    };
    list: {
        [key: string]: List;
    };
    set: {
        [key: string]: LatSet;
    };
    collection: {
        [key: string]: Collection;
    };
    private _dict;
    private _list;
    private _set;
    private _collection;
    constructor(root_dir: string, options?: Partial<IDBOptions>);
    private getDefaultOptions;
    keys(): Promise<IKeys>;
    toJSON(): Promise<IDbDataJSON>;
    loadJSON(data: IDbDataJSON): Promise<void>;
}
export {};
