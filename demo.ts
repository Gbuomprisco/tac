import Crawler from './src/crawler';

const URL = 'https://google.com/';

new Crawler(URL).run().then(() => {
    console.log('Website crawled');
});
