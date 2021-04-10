/**
 * hash
 * @author: oldj
 * @homepage: https://oldj.net
 */
import { IBasicOptions } from '../../typings';
interface Options extends IBasicOptions {
}
export default class Dict {
    private _data;
    private _io;
    private _path;
    name: string;
    constructor(name: string, dir: string, options: Options);
    private ensure;
    private dump;
    get<T>(key: string, default_value?: any): Promise<T>;
    set(key: string, value: any): Promise<void>;
    update<T>(obj: {
        [key: string]: any;
    }): Promise<T>;
    keys(): Promise<string[]>;
    all<T>(): Promise<T>;
    toJSON<T>(): Promise<T>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    remove(): Promise<void>;
}
export {};
