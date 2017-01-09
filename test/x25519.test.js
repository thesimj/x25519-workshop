import test from 'ava';

import X25519 from '../src/x25519';
import TEST_VECTORS from './tests_vectors';

test('create function should exist', t => {
    const x = X25519;

    t.is(typeof x.create, 'function');
});

test('class should exists', t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);

    t.true(x instanceof X25519);
});

test('public key should be Uint8 array if type is bytes', t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);
    const secret = x.getPrivate(X25519.BYTES);

    t.true(secret instanceof Uint8Array);
});

test('public key should be hex string if type is hex', t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);
    const secret = x.getPrivate(X25519.HEX);

    t.is(typeof secret, 'string');
    t.skip.not(secret.length, TEST_VECTORS.secrets.hex[0].length);
});

/** SECRET KEY **/

test('private key should be exist', t => {
    for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
        const hex = TEST_VECTORS.secrets.hex[i];
        const bytes = TEST_VECTORS.secrets.bytes[i];

        const x = X25519.create(hex);
        t.is(x.getPrivate(X25519.HEX), hex);
        t.deepEqual(x.getPrivate(X25519.BYTES), bytes);
    }
});

/** HELPER FUNCTION TEST **/

test('hex string should be converted to byte array', t => {
    for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
        const hex = TEST_VECTORS.secrets.hex[i];
        const bytes = TEST_VECTORS.secrets.bytes[i];

        t.deepEqual(X25519._hexToBytes(hex), bytes);
    }
});

test('bytes array should be converted to hex string', t => {
    for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
        const hex = TEST_VECTORS.secrets.hex[i];
        const bytes = TEST_VECTORS.secrets.bytes[i];

        t.is(X25519._bytesToHex(bytes), hex);
    }
});