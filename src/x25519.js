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
    _sum8(augent, addend) {

        if (augent.byteLength !== addend.byteLength && augent.byteLength % 2 === 0) {
            throw new Error('Byte length not match!');
        }
        const byte_len = augent.byteLength;

        const _view_augent  = new Uint8Array(augent);
        const _view_addend  = new Uint8Array(addend);
        const _view_sum     = new Uint8Array(byte_len);

        let carry = 0, value = 0, sum = 0;

        for (let i = byte_len - 1; i >= 0; i--) {
            sum = _view_augent[i] + _view_addend[i] + carry;
            carry = sum >>> byte_len;

            _view_sum[i] = sum;
        }

        return _view_sum.buffer;
    }

    /**
     *
     * @param {ArrayBuffer} augent
     * @param {ArrayBuffer} addend
     * @return {ArrayBuffer}
     * @private
     */
    _sum16(augent, addend) {

        if (augent.byteLength !== addend.byteLength && augent.byteLength % 16 === 0) {
            throw new Error('Byte length not match!');
        }
        const byte_len = augent.byteLength / 2 ;

        const _view_augent  = new Uint16Array(augent);
        const _view_addend  = new Uint16Array(addend);
        const _view_sum     = new Uint16Array(byte_len);

        let carry = 0, value = 0, sum = 0;

        for (let i = byte_len - 1; i >= 0; i--) {
            sum = _view_augent[i] + _view_addend[i] + carry;
            carry = sum >>> byte_len;

            _view_sum[i] = sum;
        }

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
        const bytes = 2;
        const len = hexi.length / bytes;

        if (hexi.length % bytes !== 0) {
            throw Error("Hex wrong length");
        }

        const _view = new Uint8Array(len);
        let _view_index = 0;

        for (let start = 0; start < hexi.length; start += bytes) {
            const number = parseInt(hexi.substr(start, bytes), 16);
            //_array.push(number);
            _view[_view_index++] = number;
        }

        return _view.buffer;
    }

    /**
     * Convert hex string to Bytes (ArrayBuffer)
     *
     * @param {String} hexi
     * @return {ArrayBuffer}
     */
    static hex2Bytes(hexi) {
        return X25519._hexToBytes(hexi);
    }
}

// const a = X25519.create('0');

/** test **/
const va = X25519._hexToBytes("0101010101010101010110101111111111111111111111111111111111111111");
const vb = X25519._hexToBytes("0101010101010101010110101111111111111111111111111111111111111111");

const a = X25519.create("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");
//const secret = X25519.hex2Bytes("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a");
const sum = X25519._bytesToHex(a._sum8(va, vb));
console.log("sum", sum);

const timer = new Date().getTime();

for(let i=0; i < 1000000 ;i++){
    a._sum16(va,vb);
}

console.log('sum time: ', new Date().getTime() - timer);

module.exports = X25519;
