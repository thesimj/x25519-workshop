/**
 * Created by Mykola Bubelich
 * 2017-01-09
 *
 * License: MIT
 */

class X25519_OLD {
    static BYTES = "bytes";
    static HEX = "hex";
    static BASE64 = "base64";

    static _ZERO = Uint8Array;

    _q = 57896044618658097711785492504343953926634992332820282019728792003956564819949;

    /** private */
    _secret = new Uint8Array(16);

    /**
     * @private
     */
    constructor() {
    }

    /**
     *
     * @param {String} seed
     * @returns {X25519}
     */
    static create(seed) {
        const instance = new X25519();
        instance._secret = new Uint8Array(X25519._hexToBytes(seed));

        // Clamp
        // These appear to be performance related adjustments for Curve25519
        // http://crypto.stackexchange.com/questions/11810/when-using-curve25519-why-does-the-private-key-always-have-a-fixed-bit-at-2254
        // instance._secret[0]  &= 0xFFF8;
        // instance._secret[15] = (( instance._secret[15] & 0x7FFF ) | 0x4000) & 0x7FFF;

        instance._secret = instance.clamp(instance._secret);

        return instance;
    }

    /**
     * @param {Uint8Array}
     * @param bytes
     * @private
     */
    clamp(bytes) {
        bytes[0] &= 0xF8;
        bytes[31] &= 0x7F;
        bytes[31] |= 0x40;

        return bytes;
    }

    /**
     * Get Private(Secret) key
     *
     * @param {String} type
     * @returns {Uint8Array | String}
     */
    getPrivate(type = X25519.BYTES) {
        switch (type) {
            case X25519.BYTES: {
                return this._secret.slice(0);
            }

            default: {
                return X25519._bytesToHex(this._secret);
            }
        }
    }

    /**
     *
     * @param {Uint8Array} uint
     * @returns {String}
     * @private
     */
    static _bytesToHex(uint) {
        return uint.reduce((carry, e) => {
            const hex = e.toString(16);
            const char = hex.length === 1 ? "0" + hex : hex;
            return carry + char;
        }, "");
    }

    /**
     *
     * @param {String} hex
     * @return {Uint8Array}
     * @private
     */
    static _hexToBytes(hex) {
        const len = hex.length / 2;

        if (len % 2 !== 0) {
            throw Error("Hex wrong length");
        }

        const _array = [];

        for (let start = 0; start < hex.length; start += 2) {
            const number = parseInt(hex.substr(start, 2), 16);
            _array.push(number);

        }

        return new Uint8Array(_array);
    }
}