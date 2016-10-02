#!/usr/bin/env node

var program = require('commander');
var Crawler = require('./dist/crawler').default;

function action(url, concurrency) {
    new Crawler(url).
        setConcurrency(parseInt(concurrency) || 5).
        enableDebug().
        run();
}

program
  .description('Crawler')
  .option('--url', 'URL that will be crawled')
  .option('--concurrency', 'Sets how many concurrent links will be crawled')
  .action(action)
  .parse(process.argv);
