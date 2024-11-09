// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IDecryptionReceiver} from "./IDecryptionReceiver.sol";

abstract contract AbstractDecryptionReceiver {
    address public immutable DECRYPTION_PROVIDER = 0x11045878Ed62Ec3aCC91cE36A46F4EF61d4616e1;

    error NotAuthorizedDecryptionProvider();

    modifier onlyDecryptionProvider(){
        if (msg.sender != DECRYPTION_PROVIDER) revert NotAuthorizedDecryptionProvider();
        _;
    }
}
