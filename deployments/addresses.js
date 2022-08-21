const addresses = {
    "diamondAddress": {
        43113: "0x95034449E6cD17330E62D8e33a75a39927Fb02cb",
        42261: "0x5121B5E7E076c16570A541C68549b4C0C76275BD"
    },
    "bondDepo": {
        43113: "0x2479902372c1cd91e2d9d3c1ebed0940167efca2",
        42261: "0x628Ef1FE0A45be404c451c613c0B2c901452684f"
    },
    "callBondDepo": {
        43113: "0x37bb1Aa8A339B65aeD51B6354a2518011F668A9B"
    },
    "digitalCallBondDepo": {
        43113: "0xfBE3B3E624a00f9f7BB6bb13b3757848088a583F",
        42261: "0xfA56e0AEf409B8D3A497deb1Db64Ae0264DCD420"
    },
    "callableBondDepo": {
        43113: "0xb7879d3bbE48838a0436AE9CE75bEE1F6eb7282E",
        42261: "0x42cA2a6eD9f519B4aB1E99159cAe370F1fCCC3bc"
    },
    "diamondInitAddress": {
        43113: "0xdb409149AA3C2f2Bb3580994e1637f3e918D5413",
        42261: "0x716701Df25C51e523747E4f043795C78d55EFa83"
    },
    "reqImplementationAddress": {
        43113: "0xD27388BA6b3A44003A85E336e2Fd76d6e331EF87",
        42261: "0xEB27293faE88Dd5AF0C29f598efa86aEF044A0A9"
    },
    "reqAddress": {
        43113: "0x337AaE5Dd7e0b98d3F558E2eeeA6cE5b9A5b3E63",
        42261: "0xe01a4418477d0Dce744Ee6aa3C2D89b48408fD0D"
    },
    "reqAdminAddress": {
        43113: "0x3FB5Dc8B6792943c6b6d42Bd0Aaec3bF539b31a9",
        42261: "0x940Da782D3a18a8deB36a3712F866d991b59794E"
    },
    "assets": {
        "WETH": {
            43113: "0x70dC2c5F81BC18e115759398aF197e99f228f713",
            42261: "0xe3B60b4b30AB59c749f4f7edb859F7E8b735CC40"
        },
        "WBTC": {
            43113: "0x31AbD3aA54cb7bdda3f52e304A5Ed9c1a783D289",
            42261: "0xB5421Ef8e226D9Dd8C210B62a2d919DF6Bf5Af53"
        },
        "BUSD": {
            42261: "0x8391032ef5654B796A7719D106ee74c2e48e03aa"
        },
        "TUSD": {
            43113: "0xccf7ed44c5a0f3cb5c9a9b9f765f8d836fb93ba1"
        },
        "DAI": {
            43113: "0xaea51e4fee50a980928b4353e852797b54deacd8",
            42261: "0xBe06eF2E4a0891CA2761012523af75769bDB2668"
        },
        "USDC": {
            43113: "0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA",
            42261: "0x2AD57C6d4144e218c02760640685cdF6CB58669E"
        },
        "USDT": {
            43113: "0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e",
            42261: "0x24A9FFA6A525F87F37fAb756cA0D47632f2cD107"
        },
        "STABLELP": {
            43113: "0x99674285c50CdB86AE423aac9be7917d7D054994",
            42261: "0xc1876F6B14dC9ce6481Cf35782aCc5Bee3F63b22"
        },
        "PAIR_REQ_DAI": {
            43113: ""
        },
        "PAIR_ABREQ_USDC": {
            42261: "0x3fA5E1F85E0be4bf7A1cA3d641f2bd718378A76C"
        },
        "PAIR_AVAX_USDC": {
            43113: "0xa89488b2Edb65e6F5600a57774371F5D4e6eD1eD"
        },
        "WEIGHTED_POOL_CLASSIC": {
            43113: "0xa63a39F656E0890857987Dfc0AEB90654Bc231B1",
            42261: "0x1FDc773CDeA6beb576AcF0CD58dd6f70732Fb098"
        },
        "PAIR_ABREQ_DAI": {
            43113: "0x273C1825E3aEf331F2C490d5B70103Ec2A2e9283"
        }

    },
    "oracles": {
        "ETHUSD": {
            43113: "0x86d67c3D38D2bCeE722E601025C25a575021c6EA"
        },
        "AVAXUSD": {
            43113: "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"
        }
    },
    "facets": {
        "DiamondCutFacet": {
            43113: "0xb443854fE3EC4e165Fd9C9b254874A04f8A961fB",
            42261: "0xc0Fb7067acada8E1148cfc943d5486D146a3b49B"
        },
        "DiamondLoupeFacet": {
            43113: "0xE83CcaC0FbD853bBf6AEEEA39cb7B94109Ea9fcd",
            42261: "0xD862508b73E4BA63F6f50Dd6554CBf2710B0205E"
        },
        "OwnershipFacet": {
            43113: "0x22D2f800D6ef1DBB02E8fBb95cDc2DF19451e790",
            42261: "0x12F79252cee268E81e6cd491EdcC72041296bb39"
        },
        "TreasuryFacet": {
            43113: "0xdad13c4b17b76ac307e35536e6ff89bab4529a9e",
            42261: "0x953dbB9940d5B670761A4E923d1b32b143CAA401"
        },
        "ManagementFacet": {
            43113: "0x53f54c22Ae77706bCCC7Ebc2078851EB42f95c17",
            42261: "0x11B45A9F88C0d1a47eeD0d867D1aD738152b33E6"
        }
    },
    "pricers": {
        "STABLE": {
            43113: "0xbA2B783cB21726E454eCa3712CE9E1b5806bAFC5",
            42261: "0x3b5f0eC8a1249828BC94869eBF1F7a65f19B5601"
        },
        "WEIGHTED": {
            43113: "0x5ad0Dd39cbd3a6Ef4E1f47D3b0Dce9e3A62CEf99",
            42261: "0x2b9Ca9C976247727457EcA3ce4D0B0488957427b"
        },
        "PAIR": {
            43113: "0x1A5855aAE72411bC19bcAE9c282B5cdBbEAf20aF",
            42261: "0x3DA0279c923aCC709BD6513EEFD13c599797ED44"
        },
        "TRIVIAL": {
            43113: "0x197F855676D830661f54aEB591dEA84f1d629838",
            42261: "0x246f99c63c99E8FDDdED853f050df223fA0ae91b"
        },
        "ABREQ_PAIR": {
            43113: "0xb6111cB73CC8dC4E5e231745c286f60FBb31Ba02"
        },
        "ROSE_USDC": {
            42261: "0xA1FA791BA61C03D84cD8ca7cD44DAB7F89fe3f01"
        }
    },
    "quotes": {
        "DAI": {
            43113: "0xaea51e4fee50a980928b4353e852797b54deacd8",
            42261: "0xBe06eF2E4a0891CA2761012523af75769bDB2668"
        },
        "USDC": {
            43113: "0xCa9eC7085Ed564154a9233e1e7D8fEF460438EEA",
            42261: "0x2AD57C6d4144e218c02760640685cdF6CB58669E"
        },
        "BUSD": {
            42261: "0x8391032ef5654B796A7719D106ee74c2e48e03aa"
        },
        "USDT": {
            43113: "0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e",
            42261: "0x24A9FFA6A525F87F37fAb756cA0D47632f2cD107"
        }
    },
    "register": {
        42261: {
            "admin": "0x619359d5E5a96878CF2515794dB2E4C3b17bC9Eb",
            "logic": "0xf95c9041cccdfe27f06da7be62257b50994d0fd1",
            "proxy": "0x98d64e2457cB508630e38A3b9e700e6985F49fAd"
        }
    },
    "pair": {
        42261: {
            "pairAdmin": '0xa1387be92727A59e8B20E8E74B99803e2ed517a1',
            "formula": '0x7B514a86382f4482C23FdE9c8128f0ca757AfAdE',
            "creator": '0x6EDba060B6597237A9a68a74b83b13044c634D4f',
            "factory": '0xB0c904E2aD98c78FF9Bc5d61006c6E5ab123CDfA',
            "router": '0x9959c550652c8F0f08cE655828DE0285f9322407'


        }
    },
    "weighted": {
        42261: {
            "library": '0x81ad70c7B7a0d8A8E353a9b6aE07C62e02fFaC57',
            "poolCreator": '0x25DD19981C5C4F51F1749ED650A7E5Dd0aE5213b',
            "factory": '0xbFb0Da817176F7Ca37F888A6ED73cB523330e049',
            "pools": [
                '0xb288d26a17aab729a64d8320836c2ea4794b3baf' // WETH-WBTC-USDT
            ]

        }
    },
    "stable": {
        42261: {
            "library": '0xC6f31c0b56b32E24B851FD79C5E852A304FE0c77',
            "poolCreator": '0x542109224a295aAAd53EF53C2d1030CF656494dB',
            "factory": '0x910498C01C98f4254a214316e4f5557D05250366',
            "pools": [
                "0x9912aafb08f9c018bd0317c673951a5f4967831f" // BUSD-USDC-USDT
            ]

        }
    },
    "pairs": {
        42261: {
            "ROSE_USDC": '0x3B2b78e1F16985a77AFbdf63Fa594119E5D7629D'
        }
    }
}

module.exports = { addresses }