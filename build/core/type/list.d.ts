/**
 * list
 * @author: oldj
 * @homepage: https://oldj.net
 */
import { IBasicOptions } from '../../typings';
interface Options extends IBasicOptions {
}
declare type FilterPredicate = (item: any) => boolean;
declare type MapFunction = (item: any) => any;
export default class List {
    private _data;
    private _io;
    private _path;
    name: string;
    constructor(name: string, root_dir: string, options: Options);
    private ensure;
    private dump;
    rpush(value: any): Promise<void>;
    rpop(): Promise<any>;
    rextend(...values: any[]): Promise<void>;
    lpush(value: any): Promise<void>;
    lpop(): Promise<any>;
    lextend(...values: any[]): Promise<void>;
    push(value: any): Promise<void>;
    pop(): Promise<any>;
    extend(...values: any[]): Promise<void>;
    all(): Promise<any[]>;
    find(predicate: FilterPredicate): Promise<any | undefined>;
    filter(predicate: FilterPredicate): Promise<any[]>;
    map(predicate: MapFunction): Promise<any[]>;
    index(index: number): Promise<any | undefined>;
    indexOf(predicate: string | number | boolean | null | FilterPredicate): Promise<number>;
    slice(start: number, end?: number): Promise<any[]>;
    splice(start: number, delete_count: number, ...insert_items: any[]): Promise<any[]>;
    delete(predicate: FilterPredicate): Promise<any[]>;
    set(data: any[]): Promise<void>;
    clear(): Promise<void>;
    remove(): Promise<void>;
    update(data: any[]): Promise<void>;
}
export {};
