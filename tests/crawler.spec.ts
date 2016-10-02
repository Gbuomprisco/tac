import Crawler from '../src/crawler';
import { pages } from './helpers';

const URL = 'https://google.com';
const nock = require('nock');

nock.disableNetConnect();

describe('Crawler', () => {
    let crawler: Crawler;

    beforeEach(() => {
        crawler = new Crawler(URL);
    });

    describe('basic properties', () => {
        it('accepts a URL as parameter', () => {
            expect(crawler.url).toEqual(URL);
        });
    });

    describe('promise result', () => {
        it('returns a promise when finished', done => {

            // the crawler will crawl these 3 pages

            nock(URL)
                .get('/')
                .reply(200, pages.google);

            // return same URLs, but they will not be crawled
            nock(URL)
                .get('/home')
                .reply(200, pages.google);

            nock(URL)
                .get('/about')
                .reply(200, '<html>');

            crawler.run().then(result => {
                console.log(result);
                expect(result).toEqual(
                    [
                        'https://google.com',
                        'https://google.com/home',
                        'https://google.com/about'
                    ]
                );
                done();
            });
        });
    });
});
