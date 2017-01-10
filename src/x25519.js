/**
 * Created by Mykola Bubelich
 * 2017-01-09
 *
 * License: MIT
 */


class X25519 {
    /**
     * Default constructor
     *
     * @private
     */
    constructor() {
        this._secret = new ArrayBuffer(32);
    }

    /** Create instance
     *
     * @param {String} seed
     * @return {X25519}
     */
    static create(seed) {
        const instance = new X25519();

        if (seed.length !== 64) {
            throw new Error("Seed wrong length. Should be 64 hex string");
        }

        const _secret = X25519._hexToBytes(seed);
        const _view = new Uint8Array(_secret);

        // clamp //
        _view[0] = _view[0] & 0xf8;
        _view[31] = _view[31] & 0x7f | 0x40;

        instance._secret = _secret;

        return instance;
    }

    /**
     * Get secret key
     *
     * @return {String}
     */
    getSecret() {
        return X25519._bytesToHex(this._secret);
    }


    /**
     *
     * @param {ArrayBuffer} augent
     * @param {ArrayBuffer} addend
     * @return {ArrayBuffer}
     * @private
     */
    _sum(augent, addend) {
        // shout be the same size //
        if (augent.byteLength !== 32 || addend.byteLength !== 32) {
            throw new Error("Arguments in sum should have the same size of byte length.");
        }

        const _view_augent = new Uint32Array(augent);
        const _view_addend = new Uint32Array(addend);
        const _view_sum = new Uint32Array(4);

        _view_sum[0] = _view_augent[0] + _view_addend[0];
        _view_sum[1] = _view_augent[1] + _view_addend[1];
        _view_sum[2] = _view_augent[2] + _view_addend[2];
        _view_sum[3] = _view_augent[3] + _view_addend[3];

        return _view_sum.buffer;
    }

    /**
     *
     * @param {ArrayBuffer} bytes
     * @returns {String}
     * @private
     */
    static _bytesToHex(bytes) {
        return new Uint8Array(bytes).reduce((carry, e) => {
            // const hex = e.toString(16);
            // const char = hex.length === 1 ? "0" + hex : hex;
            return carry + ("00" + e.toString(16)).substr(-2, 2);
        }, "");
    }

    /**
     * Convert hex string to Bytes (ArrayBuffer)
     *
     * @param {String} hexi
     * @return {ArrayBuffer}
     * @private
     */
    static _hexToBytes(hexi) {
        const len = hexi.length / 2;

        if (len % 2 !== 0) {
            throw Error("Hex wrong length");
        }

        const _array = new ArrayBuffer(len);
        const _view = new Uint8Array(_array);
        let _view_index = 0;

        for (let start = 0; start < hexi.length; start += 2) {
            const number = parseInt(hexi.substr(start, 2), 16);
            //_array.push(number);
            _view[_view_index++] = number;
        }

        return _array;
    }

    /**
     * Convert hex string to Bytes (ArrayBuffer)
     *
     * @param {String} hexi
     * @return {ArrayBuffer}
     */
    static hex2Bytes(hexi){
        return X25519._hexToBytes(hexi);
    }
}

// const a = X25519.create('0');

/** test **/
const a = X25519.create("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");
const secret = X25519.hex2Bytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");


module.exports = X25519;
