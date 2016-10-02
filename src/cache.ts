/**
 * @Cache
 */

export default class Cache {
    private items = {};

    /**
     * @name get
     * @param item
     * @returns {any}
     */
    public get(item: string): any {
        return this.items[item];
    }

    /**
     * @name put
     * @param item
     * @param value
     * @returns {any}
     */
    public put(item: string, value = true): void {
        this.items[item] = value;
    }

    /**
     * @name toArray
     * @returns {string[]}
     */
    public toArray(): string[] {
        return Object.keys(this.items);
    }
}
