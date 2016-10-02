import request from '../src/request';
const nock = require('nock');
const URL = 'https://google.com';

describe('request', () => {
   it('sends successful request to the specified URL', done => {
       nock(URL)
           .get('/')
           .reply(200, 'result');

       request(URL).then(data => {
           expect(data).toBe('result');
           done();
       });
   });
});
