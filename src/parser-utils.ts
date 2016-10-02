const urlParser = require('url');
import { Url } from 'url';

const createTagRegex = (tag: string, attribute: string): RegExp => {
    return new RegExp(`<${tag}\\s[^>]*${attribute}=\"([^\"]*)\"[^>]*>`, 'gmi');
}

const regexes = {
    link: createTagRegex('a', 'href'),
    href: /href=\"([^\"]*)/,
    images: createTagRegex('img', 'src'),
    scripts: createTagRegex('script', 'src'),
    styles: createTagRegex('link', 'href')
};

export function parseAssets(page: string) {
    const styles = page.match(regexes.styles);
    const scripts = page.match(regexes.scripts);
    const images = page.match(regexes.images);

    return {scripts, styles, images};
}

/**
 * @name parseLinks
 * @param page
 * @returns {string[]}
 */
function parseLinks(page: string): string[] {
    const matches = page.match(regexes.link);

    if (!matches) {
        return [];
    }

    return matches.map(item => {
        const hrefs = item.match(regexes.href);

        if (hrefs && hrefs[1]) {
            return hrefs[1];
        }

        return undefined;
    }).filter(url => !!url);
}

/**
 * @name urlify
 * @param url
 * @returns {Url}
 */
export function urlify(url: string): Url {
    return urlParser.parse(url);
}

/**
 * name isExternalDomain
 * @param url
 * @param hostname
 * @returns {boolean}
 */
export function isExternalDomain(url: Url, hostname: string): boolean {
    return url.hostname === hostname || !url.hostname;
}

/**
 * @name isInternalLink
 * @param url
 * @returns {boolean}
 */
function isInternalLink(url: Url): boolean {
    return !url.hash;
}

/**
 * @name link
 * @param protocol
 * @returns {boolean}
 */
function isExternalProtocol(protocol: string): boolean {
    return protocol !== 'mailto:' && protocol !== 'tel:';
}

/**
 * @name formatInternalUrl
 * @param baseUrl
 * @param path
 * @returns {string}
 */
function formatInternalUrl(baseUrl: string, path: string): string {
    const url = urlify(baseUrl);
    if (url.pathname === '/') {
        path = path.substring(1, path.length);
    }

    return `${url.href}${path}`;
}

/**
 * @name getLinksFromPage
 * @param page
 * @param baseUrl
 * @returns {any[]}
 */
export function getLinksFromPage(page: string, baseUrl: string): string[] {
    const hostname = urlify(baseUrl).hostname;

    return parseLinks(page).
        map((url: string) => urlify(url)).
        filter((url: Url) =>
            isExternalDomain(url, hostname) &&
            isExternalProtocol(url.protocol) &&
            isInternalLink(url)
        ).
        map(url => {
            if (!url.hostname) {
                return formatInternalUrl(baseUrl, url.href);
            }
            return url.href;
        });
}


/**
 * @name isHttps
 * @param url
 * @returns {boolean}
 */
export function isHttps(url: string): boolean {
    return urlParser.parse(url).protocol === 'https:';
}
