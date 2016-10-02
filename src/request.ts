import { isHttps } from './parser-utils';
import { IncomingMessage, get as httpGet } from 'http';
import { get as httpsGet } from 'https';

/**
 * - Creates request and returns a callback () => (err, data)
 * @name request
 * @param url
 * @param callback
 */
function request(url: string): Promise<string> {
    const requestMethod = isHttps(url) ? httpsGet : httpGet;

    return new Promise((resolve: (value: string) => any, reject) => {
        requestMethod(url, (response: IncomingMessage) => {
            let body: string = '';

            response.setEncoding('utf8');

            response.on('data', (chunk: string) => {
                body += chunk;
            }).on('end', () => {
                resolve(body);
            });

        }).on('error', error => {
            console.log(error);
            reject(error);
        });
    });
}

export default request;
