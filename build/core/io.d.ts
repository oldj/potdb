/**
 * io
 * @author: oldj
 * @homepage: https://oldj.net
 */
declare type DataType = 'dict' | 'list' | 'set' | 'collection';
interface IIOOptions {
    debug?: boolean;
    data_path: string;
    data_type: DataType;
    dump_delay: number;
    formative?: boolean;
}
export default class IO {
    private options;
    private data_path;
    private data_type;
    private _dump_delay;
    private _last_dump_ts;
    private _t_dump;
    private _is_dir_ensured;
    private _dump_status;
    constructor(options: IIOOptions);
    private load_file;
    private load_dict;
    private load_list;
    private load_set;
    load<T>(): Promise<T>;
    private dump_file;
    dump(data: any): Promise<void>;
    getDumpStatus(): number;
    remove(): Promise<void>;
}
export {};
