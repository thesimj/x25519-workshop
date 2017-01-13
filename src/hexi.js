/**
 * Created by Mykola Bubelich
 * 2017-01-13.
 */

/**
 *  Helper class
 */
class Hexi {

    /**
     * Convert hex string to bytes (ArrayBuffer)
     *
     * @param {String} hex
     * @return {ArrayBuffer}
     */
    static hexToBytes(hex) {
        if (typeof hex !== "string") {
            throw new Error("Argument should be a string type.");
        }

        if (hex.length % 2 !== 0) {
            throw new Error("Argument should have odd length");
        }

        const buff = new Uint8Array(hex.length / 2);
        let index = 0;

        for (let start = 0; start < hex.length; start += 2) {
            buff[index++] = parseInt(hex.substr(start, 2), 16);
        }

        return buff.buffer;
    }

    /**
     * Convert bytes to hex string
     *
     * @param {ArrayBuffer} bytes
     * @return {String}
     */
    static bytesToHex(bytes) {
        return new Uint8Array(bytes).reduce((carry, byte) => {
            return carry + ("00" + byte.toString(16)).substr(-2, 2);
        }, "");
    }

    /**
     * Compare two bytes arrays
     * Compare time is constant and depends only on arrays length
     *
     * @param {ArrayBuffer} one
     * @param {ArrayBuffer} two
     * @return {Boolean}
     */
    static equal(one, two) {
        let eq = 0;

        if (one.byteLength != two.byteLength) {
            return false;
        }

        const w_one = new Uint8Array(one);
        const w_two = new Uint8Array(two);

        for (let i = 0; i < one.byteLength; i++) {
            eq += (w_one[i] != w_two[i]);
        }

        return eq == 0;
    }
}

module.exports = Hexi;