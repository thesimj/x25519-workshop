const TEST_VECTORS = {
    secrets: {
        hex: [
            "77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a"
        ],
        clamp : [
            "70076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c6a"
        ]
    },

    public: {
        hex: [
            "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a",
        ],
        bytes: [
            new Uint8Array([133, 32, 240, 9, 137, 48, 167, 84, 116, 139, 125, 220, 180, 62, 247, 90, 13, 191, 58, 13, 38, 56, 26, 244, 235, 164, 169, 142, 170, 155, 78, 106])
        ],
        base64: [
            ""
        ]
    }
};

module.exports = TEST_VECTORS;