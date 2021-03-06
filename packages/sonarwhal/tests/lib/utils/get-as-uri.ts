import * as url from 'url';
import { URL } from 'url'; // this is necessary to avoid TypeScript mixes types.

import test from 'ava';

import { getAsUri, getAsUris } from '../../../src/lib/utils/get-as-uri';

const normalize = (path) => {
    const prefix = path.indexOf('/') === 0 ? '' : '/';

    return prefix + path.replace(/\\/g, '/');
};

const targets = [
    [__filename, `file://${normalize(__filename)}`],
    ['localhost', 'http://localhost/'],
    ['https://www.wikipedia.org', 'https://www.wikipedia.org/'],
    ['www.wikipedia.org', 'http://www.wikipedia.org/'],
    [`file://${normalize(__filename)}`, `file://${normalize(__filename)}`],
    [`${__filename}noexists`, null]
];

test('getAsUri converts http, file and path strings to valid URL objects', (t) => {
    targets.forEach((target) => {
        const uri = getAsUri(target[0]);

        if (target[1]) {
            t.true(uri instanceof URL);
            t.is(url.format(uri).toLowerCase(), target[1].toLowerCase());
        } else {
            t.falsy(uri);
        }
    });
});

test('getAsUris converts to URL and removes invalid entries', (t) => {
    const urls = targets.map((entry) => {
        return entry[0];
    });

    const results = getAsUris(urls);

    t.is(results.length, 5);
    results.forEach((result) => {
        t.true(result instanceof URL);
    });
});
