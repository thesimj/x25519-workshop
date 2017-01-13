const test = require("ava");
const X25519 = require("../src/x25519");
const TEST_VECTORS = require("./tests_vectors");

// import test from "ava";
//
// import X25519 from "../src/x25519";
// import TEST_VECTORS from "./tests_vectors";

/** GENERAL **/
test("create function should exist", t => {
    t.is(typeof X25519.create, "function");
});

test("class should exists", t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);

    t.true(x instanceof X25519);
});

test("secret key should exist", t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);

    t.is(x.getSecret(), TEST_VECTORS.secrets.clamp[0]);

});

/** arithmetic **/
test("sum should compute right value", t => {
    const x = X25519.create(TEST_VECTORS.secrets.hex[0]);

    const a = X25519._hexToBytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");
    const b = X25519._hexToBytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");

    const c = x._sum(a,b);

    console.log(new Uint8Array(c));
});

/** BENCHMARK **/
// test("benchmark for dataview", t => {
//     t.pass();
//
//     const start = new Date().getTime();
//
//     for (let i = 0; i < 10000; i++) {
//         X25519.create(TEST_VECTORS.secrets.hex[0]);
//     }
//
//     const elapsed = new Date().getTime() - start;
//     console.log("elapsed ", elapsed, " ms");
// });


// test("public key should be Uint8 array if type is bytes", t => {
//     const x = X25519.create(TEST_VECTORS.secrets.hex[0]);
//     const secret = x.getPrivate(X25519.BYTES);
//
//     t.true(secret instanceof Uint8Array);
// });
//
// test("public key should be hex string if type is hex", t => {
//     const x = X25519.create(TEST_VECTORS.secrets.hex[0]);
//     const secret = x.getPrivate(X25519.HEX);
//
//     t.is(typeof secret, "string");
//     t.is(secret.length, TEST_VECTORS.secrets.hex[0].length);
// });
//
// /** SECRET KEY **/
//
// test("private key should be exist", t => {
//     for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
//         const hex = TEST_VECTORS.secrets.hex[i];
//         const bytes = TEST_VECTORS.secrets.bytes[i];
//
//         const x = X25519.create(hex);
//         t.is(x.getPrivate(X25519.HEX), hex);
//         t.deepEqual(x.getPrivate(X25519.BYTES), bytes);
//     }
// });
//
// /** HELPER FUNCTION TEST **/
//
// test("hex string should be converted to byte array", t => {
//     for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
//         const hex = TEST_VECTORS.secrets.hex[i];
//         const bytes = TEST_VECTORS.secrets.bytes[i];
//
//         t.deepEqual(X25519._hexToBytes(hex), bytes);
//     }
// });
//
// test("bytes array should be converted to hex string", t => {
//     for (let i = 0; i < TEST_VECTORS.secrets.hex.length; i++) {
//         const hex = TEST_VECTORS.secrets.hex[i];
//         const bytes = TEST_VECTORS.secrets.bytes[i];
//
//         t.is(X25519._bytesToHex(bytes), hex);
//     }
// });