/*
 * @Crawler
 * Usage:
 *
 * const crawler = new Crawler('https://google.com').run();
 * const crawler = new Crawler('https://google.com').run().then(...);
*/

import { queue } from 'async';
import { getLinksFromPage, parseAssets } from './parser-utils';
``
import request from './request';
import Cache from './cache';

export default class Crawler {
    /**
     * @name concurrency
     * @type {number}
     */
    private concurrency: number = 5;

    /**
     * @name queue
     * @type {AsyncQueue<string>}
     */
    private queue = queue(this.fetch.bind(this), this.concurrency);

    /**
     * @name debug
     * @type {boolean}
     */
    private debug: boolean = false;

    // inject dependencies (defaults are provided)
    constructor(public url: string,
                private cache = new Cache(),
                private extractor = getLinksFromPage) {

        // of course it would not be needed if we all used TS :)
        if (!url || typeof url !== 'string') {
            throw new Error('An URL is required as parameter');
        }

        this.url = url;
    }

    /**
     * - sets preferred concurrency [default: 5]
     * @name setConcurrency
     * @param concurrency
     */
    public setConcurrency(concurrency: number): Crawler {
        this.concurrency = concurrency;
        return this;
    }

    /**
     * @name enableDebug
     */
    public enableDebug(): Crawler {
        this.debug = true;
        return this;
    }

    /**
     * - launches crawler starting from the URL entered as the parameter
     * @name run
     * @returns {Promise<any>}
     */
    public run(): Promise<any> {

        // launch queue from root URL
        this.queue.push(this.url);

        // return a promise that will
        // fullfill when all jobs are done

        return new Promise((resolve: () => any) => {
            this.queue.drain = () => {
                resolve();
            };
        });
    }

    /**
     * - creates request, if successful => process internal links
     * @name fetch
     * @param callback
     * @param url
     */
    private async fetch(url: string, callback: () => any): Promise<any> {
        const cache = this.cache;

        // stop if link is cached
        if (cache.get(url)) {
            return callback();
        }

        // cache link
        cache.put(url);

        if (this.debug) {
            console.info(`fetching ${url}`);
            console.time(url);
        }

        // fetching page
        const page = await this.getPage(url);

        // if error, exit early
        // and remove item from cache
        if (!page) {
            cache.put(url, false);
        } else {
            if (this.debug) {
                console.info(`${url} fetched`);
                console.timeEnd(url);
            }

            console.log(`\nPage URL: ${url}`);
            this.process(page);
        }

        // tell queue job is done :)
        callback();
    }

    /**
    * fetches page and returnes its content using async/await
    * @name getPage
    * @returns {Promise<string>}
    */
    private async getPage(url: string): Promise<string> {
        // execute request
        return await request(url);
    }

    /**
     * - extracts links from a page and launches a new job with the links extracted
     * @name process
     * @param page
     * @returns {void}
     */
    private process(page: string) {

        // extract links from HTML page
        const links = this.
            extractor(page, this.url).
            filter(link => !this.cache.get(link));

        // parse and then render assets
        this.renderAssets(parseAssets(page));

        // push new job that will crawl links
        this.queue.push(links);
    }

    /**
     * @name renderAssets
     * @param assets
     */
    private renderAssets(assets) {
        Object.keys(assets).forEach((type: string) => {
            if (!assets[type]) {
                return;
            }


            console.log(`\n- ${type}:`);

            assets[type].forEach(asset => {
                console.log(`-- ${asset}`);
            });
        });
    }
}
