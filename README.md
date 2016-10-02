# Tac - Node Assets Crawler written in Typescript

**Do please make sure you installed Node 6.x. I used Node v6.3.1. (Sorry in advance)**

## Install
To install the dependencies, run the following command:

    npm install
    
The typings install and code build should run automatically. 

A `dist` folder should have been created with the dist files in it.

### CLI script
I also provided a CLI script. Before being able to run the CLI utility run:

    npm link
    
And then you'll be able to run:
    
    crawler <url> <concurrency>
    // ex. crawler https://google.com


The default value for concurrency is 5.

## Test
To run the unit tests, please run:
    
    npm test
    
## Code examples

    import Crawler from './src/crawler';
    
    const URL = 'https://google.com/';
    
    new Crawler(URL).run().then(() => {
        console.log('Website crawled');
    });
    
    // or set some settings like concurrency and debug mode (prints some info)
    
    const crawler = new Crawler(URL);
    
    crawler.
        setConcurrency(3).
        enableDebug().
        run();
