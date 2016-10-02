import { isHttps, getLinksFromPage, isExternalDomain, urlify } from '../src/parser-utils';

describe('Parser Utils', () => {
    describe('isHttps', () => {
        it('returns false for http URL', () => {
            const URL = 'http://google.com';
            expect(isHttps(URL)).toBe(false);
        });

        it('returns true for https URL', () => {
            const URL = 'https://google.com';
            expect(isHttps(URL)).toBe(true);
        });
    });

    describe('isExternalDomain', () => {
        const domain = urlify('https://google.com').hostname;

        it('returns true for a domain without hostname', () => {
            const URL = urlify('/about');
            expect(isExternalDomain(URL, domain)).toBe(true);
        });

        it('returns true for a page', () => {
            const URL = urlify('https://google.com/about');
            expect(isExternalDomain(URL, domain)).toBe(true);
        });

        it('returns true for a hash URL', () => {
            const URL = urlify('https://google.com/about/#team');
            expect(isExternalDomain(URL, domain)).toBe(true);
        });

        it('returns false for a different website', () => {
            const URL = urlify('https://google.com');
            expect(isExternalDomain(URL, domain)).toBe(false);
        });
    });

    describe('getLinksFromText', () => {
        it('returns a list of links matching the provided hostname', () => {
            const text = `
                <a href="https://google.com">Google Indeed<a/>
                <a href="https://google.com" class="google">Google<a/>
                <a ng-something href="https://facebook.com">Facebook<a/>
                <a class="link" href="https://facebook.com">Facebook<a/>
            `;

            const hostname = urlify('https://google.com').hostname;
            const links = getLinksFromPage(text, 'https://google.com').
                filter(link => isExternalDomain(urlify(link), hostname));

            expect(links.length).toEqual(1);
        });
    });
});

