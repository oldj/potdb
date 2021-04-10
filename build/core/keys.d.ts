/**
 * keys
 * @author: oldj
 * @homepage: https://oldj.net
 */
export interface IKeys {
    dict: string[];
    list: string[];
    set: string[];
    collection: string[];
}
declare const getKeys: (dir: string) => Promise<IKeys>;
export default getKeys;
