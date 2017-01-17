"use strict";

/**
 * Created by Mykola Bubelich
 * 2017-01-17
 */

const test = require("ava");
const Hexi = require("../src/hexi");
const X25519 = require("../src/x25519");
const TEST_VECTORS = require("./tests_vectors");

/**
 * Keys generation
 */

test("Should generate valid public key", t => {
    for (let i = 0; i < TEST_VECTORS.length; i++) {
        const secret = Hexi.hexToBytes(TEST_VECTORS.secrets[i]);
        const pub = Hexi.hexToBytes(TEST_VECTORS.public[i]);

        t.deepEqual(X25519.getPublic(secret), pub);
    }
});

test("Should generate valid shared key", t => {
    for (let i = 0; i < TEST_VECTORS.length; i++) {
        const secret = Hexi.hexToBytes(TEST_VECTORS.secrets[i]);
        //const pub = Hexi.hexToBytes(TEST_VECTORS.public[i]);
        const pub = X25519.getPublic(secret);
        const shared = X25519.getSharedKey(secret, pub);

        t.deepEqual(shared, Hexi.hexToBytes(TEST_VECTORS.shared[i]));
    }
});

/**
 * Errors
 */

test("Should throw error when secret key wrong size", t => {
    const error = t.throws(() => {
        X25519.getPublic(new Uint8Array(31));
    }, Error);

    t.is(error.message, "Secret wrong length, should be 32 bytes.");
});

test("Should throw error when secret or public key wrong size", t => {
    const error = t.throws(() => {
        X25519.getSharedKey(new Uint8Array(10), new Uint8Array(20));
    }, Error);

    t.is(error.message, "Secret key or public key wrong length, should be 32 bytes.");
});

/**
 * Benchmarks
 */

test("Benchmark for public key generation", t => {
    const iters = 100;
    const secret = Hexi.hexToBytes(TEST_VECTORS.secrets[0]);

    let result;
    const t1 = new Date().getTime();

    for (let i = 0; i < iters; i++) {
        result = X25519.getPublic(secret);
    }

    const t2 = new Date().getTime() - t1;

    // Generation check //
    t.deepEqual(result, Hexi.hexToBytes(TEST_VECTORS.public[0]));

    t._test.title += ` Iteration: ${iters}, time: ${t2}, ${t2 / iters} ms to gen key`;
});

test("Benchmark for shared generation", t => {
    const iters = 100;

    const secret = Hexi.hexToBytes(TEST_VECTORS.secrets[0]);
    const pub = Hexi.hexToBytes(TEST_VECTORS.public[0]);

    let result;

    const t1 = new Date().getTime();

    for (let i = 0; i < iters; i++) {
        result = X25519.getSharedKey(secret, pub);
    }

    const t2 = new Date().getTime() - t1;

    // Generation check //
    t.deepEqual(result, Hexi.hexToBytes(TEST_VECTORS.shared[0]));

    t._test.title += ` Iteration: ${iters}, time: ${t2}, ${t2 / iters} ms to gen key`;
});