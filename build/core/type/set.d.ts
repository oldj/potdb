/**
 * set
 * @author: oldj
 * @homepage: https://oldj.net
 */
import { DataTypeSetItem, IBasicOptions } from '../../typings';
interface Options extends IBasicOptions {
}
export default class LatSet {
    private _data;
    private _io;
    private _path;
    name: string;
    constructor(name: string, root_dir: string, options: Options);
    private ensure;
    private dump;
    add(value: DataTypeSetItem): Promise<void>;
    delete(value: DataTypeSetItem): Promise<void>;
    has(value: DataTypeSetItem): Promise<boolean>;
    all(): Promise<DataTypeSetItem[]>;
    clear(): Promise<void>;
    set(data: any[]): Promise<void>;
    remove(): Promise<void>;
    update(data: DataTypeSetItem[]): Promise<void>;
}
export {};
