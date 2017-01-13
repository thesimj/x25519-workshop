/**
 * Created by Mykola Bubelich
 * 2017-01-09
 */
const Hexi = require('./hexi');

const _X25519_ZERO = new Uint32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const _X25519_ONE = new Uint32Array([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const _X25519_NINE = new Uint32Array([9, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

class X25519 {
    /**
     * Default constructor
     *
     * @private
     */
    constructor() {
        this._secret = null;
    }

    /** Create instance
     *
     * @param {String|ArrayBuffer} seed
     * @return {X25519}
     */
    static create(seed) {
        const instance = new X25519();

        if (seed.length !== 64) {
            throw new Error("Seed wrong length. Should be 64 hex string");
        }

        const _secret = new Uint32Array(10); // 320 bits, 32 bytes x 10

        // copy seed to secret //
        //const x = new Uint32Array(_secret).set(new Uint32Array(Hexi.hexToBytes(seed)));
        const sec = new Uint32Array(Hexi.hexToBytes(seed));
        const tmp = new Uint32Array(_secret);

        tmp.set(sec);

        // clamp //
        instance._secret = this.clamp(tmp);

        return instance;
    }

    /**
     * Generate and return public key
     *
     */
    getPublic() {
        return this._scalarMul(this._secret, _X25519_NINE);
    }

    /**
     *  Addition
     *
     * @param {Uint32Array} augent
     * @param {Uint32Array} addend
     * @return {Uint32Array}
     * @private
     */
    _sum(augent, addend) {
        const sum = new Uint32Array(10);

        for (let i = 0; i < sum.length; i++) {
            sum[i] = augent[i] + addend[i];
        }

        return sum;
    }

    /**
     * Subtraction
     *
     * @param {Uint32Array} minuend
     * @param {Uint32Array} subtrahend
     * @return {Uint32Array}
     * @private
     */
    _sub(minuend, subtrahend) {
        const sub = new Uint32Array(10);

        let carry = 0;

        const fSub = (prefix, m, s, c, postfix) => {
            // store carry //
            carry = prefix + m - s + c;
            // return result and postfix
            return carry & postfix;
        };

        for (let i = 0; i < 10; i += 2) {
            sub[i] = fSub(0x7ffffda, minuend[i], subtrahend[i], carry >> 25, 0x3ffffff);
            sub[i + 1] = fSub(0x3fffffe, minuend[i + 1], subtrahend[i + 1], carry >> 26, 0x1ffffff);
        }

        // final step //
        sub[0] += 19 * (carry >> 25);

        return sub;
    }

    /**
     *  Multiplication
     *
     * @param {Uint32Array} multiplier
     * @param {Uint32Array} multiplicand
     * @return {Uint32Array}
     * @private
     */
    _mul(multiplier, multiplicand) {
        const mul = new Uint32Array(10);
        //
        // const mul_matrix = [
        //     // column 0 //
        //     [
        //         multiplicand[0] * multiplier[0],
        //         multiplicand[0] * multiplier[1],
        //         multiplicand[0] * multiplier[2],
        //         multiplicand[0] * multiplier[3],
        //         multiplicand[0] * multiplier[4],
        //         multiplicand[0] * multiplier[5],
        //         multiplicand[0] * multiplier[6],
        //         multiplicand[0] * multiplier[7],
        //         multiplicand[0] * multiplier[8],
        //         multiplicand[0] * multiplier[9],
        //     ],
        //     [
        //         multiplicand[1] * multiplier[9] * 38,
        //         multiplicand[1] * multiplier[0],
        //         multiplicand[1] * multiplier[1] * 2,
        //         multiplicand[1] * multiplier[2],
        //         multiplicand[1] * multiplier[3] * 2,
        //         multiplicand[1] * multiplier[4],
        //         multiplicand[1] * multiplier[5] * 2,
        //         multiplicand[1] * multiplier[6],
        //         multiplicand[1] * multiplier[7] * 2,
        //         multiplicand[1] * multiplier[8],
        //     ],
        //     [
        //         multiplicand[2] * multiplier[8] * 38,
        //         multiplicand[2] * multiplier[9],
        //         multiplicand[2] * multiplier[0] * 2,
        //         multiplicand[2] * multiplier[1],
        //         multiplicand[2] * multiplier[2] * 2,
        //         multiplicand[2] * multiplier[3],
        //         multiplicand[2] * multiplier[4] * 2,
        //         multiplicand[2] * multiplier[5],
        //         multiplicand[2] * multiplier[6] * 2,
        //         multiplicand[2] * multiplier[7],
        //     ]
        // ];
        //
        const mult_matrix = [
            [0, [[0, 0x01], [1, 0x01], [2, 0x01], [3, 0x01], [4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01]], 0x00, 0x3ffffff],
            [1, [[9, 0x26], [0, 0x01], [1, 0x02], [2, 0x01], [3, 0x02], [4, 0x01], [5, 0x02], [6, 0x01], [7, 0x02], [8, 0x01]], 0x1A, 0x1ffffff],
            [2, [[8, 0x13], [9, 0x13], [0, 0x01], [1, 0x01], [2, 0x01], [3, 0x01], [4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01]], 0x19, 0x3ffffff],
            [3, [[7, 0x26], [8, 0x13], [9, 0x26], [0, 0x01], [1, 0x02], [2, 0x01], [3, 0x02], [4, 0x01], [5, 0x02], [6, 0x01]], 0x1A, 0x1ffffff],
            [4, [[6, 0x13], [7, 0x13], [8, 0x13], [9, 0x13], [0, 0x01], [1, 0x01], [2, 0x01], [3, 0x01], [4, 0x01], [5, 0x01]], 0x19, 0x3ffffff],
            [5, [[5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01], [0, 0x01], [1, 0x01], [2, 0x01], [3, 0x01], [4, 0x01]], 0x1A, 0x1ffffff],
            [6, [[4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01], [0, 0x01], [1, 0x01], [2, 0x01], [3, 0x01]], 0x19, 0x3ffffff],
            [7, [[3, 0x01], [4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01], [0, 0x01], [1, 0x01], [2, 0x01]], 0x1A, 0x1ffffff],
            [8, [[2, 0x01], [3, 0x01], [4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01], [0, 0x01], [1, 0x01]], 0x19, 0x3ffffff],
            [9, [[1, 0x01], [2, 0x01], [3, 0x01], [4, 0x01], [5, 0x01], [6, 0x01], [7, 0x01], [8, 0x01], [9, 0x01], [0, 0x01]], 0x1A, 0x1ffffff],
        ];

        // let carry = 0;
        //
        mul[0] = multiplicand[mult_matrix[0][0]] * mult_matrix[0][1][1];
        //

        return mul;
    }

    /**
     *
     * @param {Uint32Array} multiplier
     * @param {Uint32Array} multiplicand
     * @private
     */
    _scalarMul(multiplier, multiplicand) {
        let t = _X25519_ONE.slice(0);
        let u = _X25519_ZERO.slice(0);
        let v = _X25519_ONE.slice(0);
        let w = multiplicand.slice(0);

        let ret = new Uint32Array(10);

        let x = null;
        let y = null;

        let bitswap = 1;

        let index = 254;

        while (index-- > 2) {
            x = this._sum(w, v);
            v = this._sub(w, v);
            y = this._sum(t, u);
            u = this._sub(t, u);
            t = this._mul(y, v);
        }


        return ret.buffer;
    }

    /**
     *
     * @param {Uint32Array} bytes
     * @return {Uint32Array}
     * @private
     */
    static clamp(bytes) {
        bytes[0] = bytes[0] & 0xFFFFFFF8;
        bytes[7] = bytes[7] & 0x7FFFFFFF | 0x40000000;

        return bytes;
    }


    /**
     * Get copy of private key
     *
     * @return {ArrayBuffer}
     */
    getSecret() {
        return this._secret.slice(0).buffer;
    }
}

const x = X25519.create("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

console.log(Hexi.bytesToHex(x.getSecret()));
console.log(Hexi.bytesToHex(x.getPublic()));

module.exports = X25519;