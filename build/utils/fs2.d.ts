/**
 * ensureDir
 * @author: oldj
 * @homepage: https://oldj.net
 */
export declare const isDir: (dir_path: string) => boolean;
export declare const isFile: (dir_path: string) => boolean;
export declare const ensureDir: (dir_path: string) => Promise<void>;
