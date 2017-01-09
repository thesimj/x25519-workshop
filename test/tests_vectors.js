const TEST_VECTORS = {
    secrets: {
        hex: [
            '6a2cb91da5fb77b12a99c0eb872f4cdf4566b25172c1163c7da518730a6d0770'
        ],
        bytes: [
            new Uint8Array([106, 44, 185, 29, 165, 251, 119, 177, 42, 153, 192, 235, 135, 47, 76, 223, 69, 102, 178, 81, 114, 193, 22, 60, 125, 165, 24, 115, 10, 109, 7, 112])
        ],
        base64: [
            'dwdtCnMYpX08FsFyUbJmRd9ML4frwJkqsXf7pR25LCo='
        ]
    },

    public: {
        hex: [
            '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a',
        ],
        bytes: [
            new Uint8Array([133, 32, 240, 9, 137, 48, 167, 84, 116, 139, 125, 220, 180, 62, 247, 90, 13, 191, 58, 13, 38, 56, 26, 244, 235, 164, 169, 142, 170, 155, 78, 106])
        ],
        base64: [
            ''
        ]
    }
};

export default TEST_VECTORS;