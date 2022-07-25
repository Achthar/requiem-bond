const addresses = {
    "diamondAddress": {
        43113: "0x95034449E6cD17330E62D8e33a75a39927Fb02cb",
        42261: "0x5121B5E7E076c16570A541C68549b4C0C76275BD"
    },
    "bondDepo": {
        43113: "0x2479902372c1cd91e2d9d3c1ebed0940167efca2",
        42261: "0x5e72a633D544e74f8B80c6a5A8bc4674E3b7a504"
    },
    "callBondDepo": {
        43113: "0x37bb1Aa8A339B65aeD51B6354a2518011F668A9B"
    },
    "digitalCallBondDepo": {
        43113: "0xfBE3B3E624a00f9f7BB6bb13b3757848088a583F",
        42261: "0xA7b5c1Fb20B4886B6C2242f7b1E3D3b423406711"
    },
    "callableBondDepo": {
        43113: "0xb7879d3bbE48838a0436AE9CE75bEE1F6eb7282E",
        42261: "0xA3Df8603e964611464297464c25A2815a341FB1D"
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
            42261: "0x3effC2e12D4E10F7cEe599f8D72c8Ae355e09d05"
        },
        "ManagementFacet": {
            43113: "0x53f54c22Ae77706bCCC7Ebc2078851EB42f95c17",
            42261: "0x11B45A9F88C0d1a47eeD0d867D1aD738152b33E6"
        }
    },
    "pricers": {
        "STABLE": {
            43113: "0xbA2B783cB21726E454eCa3712CE9E1b5806bAFC5",
            42261: "0x2D81E7dFe6B20e3ffb75dcfC359920ff8FaBa35e"
        },
        "WEIGHTED": {
            43113: "0x5ad0Dd39cbd3a6Ef4E1f47D3b0Dce9e3A62CEf99",
            42261: "0x3B362751aB869dC6E71c40c6fb0C02E091F8F6c7"
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
        "USDT": {
            43113: "0xffb3ed4960cac85372e6838fbc9ce47bcf2d073e",
            42261: "0x24A9FFA6A525F87F37fAb756cA0D47632f2cD107"
        }
    }
}

module.exports = { addresses }