import { BaseContract, getBytes, LogDescription, Provider, Signer, TransactionReceipt } from "ethers"
import {
    type BlocklockSender,
    BlocklockSender__factory
} from "./generated"
import { keccak_256 } from '@noble/hashes/sha3';
import {
    Ciphertext,
    decrypt_towards_identity_g1, deserializeCiphertext,
    encrypt_towards_identity_g1, G1,
    G2,
    IbeOpts,
    serializeCiphertext
} from "./crypto/ibe_bn254"

export const BLOCKLOCK_IBE_OPTS: IbeOpts = {
    hash: keccak_256,
    k: 128,
    expand_fn: "xmd",
    dsts: {
        H1_G1: Buffer.from('BLOCKLOCK_BN254G1_XMD:KECCAK-256_SVDW_RO_H1_'),
        H2: Buffer.from('BLOCKLOCK_BN254_XMD:KECCAK-256_H2_'),
        H3: Buffer.from('BLOCKLOCK_BN254_XMD:KECCAK-256_H3_'),
        H4: Buffer.from('BLOCKLOCK_BN254_XMD:KECCAK-256_H4_'),
    }
}

const BLOCKLOCK_TESTNET_ADDR = "0x588ac0c6fb691e6bf3817f46eb0c834d967156af"
export class Blocklock {
    private blocklockSender: BlocklockSender

    constructor(provider: Signer | Provider, contractAddr: string = BLOCKLOCK_TESTNET_ADDR) {
        this.blocklockSender = BlocklockSender__factory.connect(contractAddr, provider)
    }

    /**
     * Request a blocklock decryption at block number blockHeight.
     * @param blockHeight time at which the decryption should key should be released
     * @param ciphertext encrypted message to store on chain
     * @returns blocklock request id as a string
     */
    async requestBlocklock(blockHeight: bigint, ciphertext: Uint8Array): Promise<string> {
        // Request a blocklock at blockHeight
        const tx = await this.blocklockSender.requestBlocklock(blockHeight, ciphertext)
        const receipt = await tx.wait(1)
        if (!receipt) {
            throw new Error("transaction has not been mined")
        }

        const logs = parseLogs(receipt, this.blocklockSender, "BlocklockRequested")
        if (logs.length === 0) {
            throw Error("`requestBlocklock` didn't emit the expected log")
        }

        const [requestID,] = logs[0].args
        return requestID
    }

    /**
     * Fetch the details of a blocklock request, decryption key / signature excluded.
     * This function should be called to fetch pending blocklock requests.
     * @param sRequestID blocklock request id
     * @returns details of the blocklock request, undefined if not found
     */
    async fetchBlocklockRequest(sRequestID: string): Promise<BlocklockRequest | undefined> {
        const requestID = BigInt(sRequestID)

        // Query BlocklockRequested event with correct requestID
        const callbackFilter = this.blocklockSender.filters.BlocklockRequested(requestID)
        const events = await this.blocklockSender.queryFilter(callbackFilter)

        // We get exactly one result if it was successful
        if (events.length === 0) {
            return undefined;
        } else if (events.length > 1) {
            throw new Error("BlocklockRequested filter returned more than one result")
        }
        return {
            id: events[0].args.requestID.toString(),
            blockHeight: events[0].args.blockHeight,
            ciphertext: getBytes(events[0].args.ciphertext)
        }
    }

    /**
     * Fetch all blocklock requests, decryption keys / signatures excluded.
     * @returns a map with the details of each blocklock request
     */
    async fetchAllBlocklockRequests(): Promise<Map<string, BlocklockRequest>> {
        const requestFilter = this.blocklockSender.filters.BlocklockRequested()
        const requests = await this.blocklockSender.queryFilter(requestFilter)

        return new Map(Array.from(
            requests.map((event) => {
                const requestID = event.args.requestID.toString()

                return [requestID, {
                    id: requestID,
                    blockHeight: event.args.blockHeight,
                    ciphertext: getBytes(event.args.ciphertext),
                }]
            })
        ))
    }

    /**
     * Fetch the status of a blocklock request, including the decryption key / signature if available.
     * This function should be called to fetch blocklock requests that have been fulfilled, or to check
     * whether it has been fulfilled or not.
     * @param sRequestID blocklock request id
     * @returns details of the blocklock request, undefined if not found
     */
    async fetchBlocklockStatus(sRequestID: string): Promise<BlocklockStatus | undefined> {
        const requestID = BigInt(sRequestID)
        const callbackFilter = this.blocklockSender.filters.BlocklockCallbackSuccess(requestID)
        const events = await this.blocklockSender.queryFilter(callbackFilter)

        // We get exactly one result if it was successful
        if (events.length == 0) {
            // No callback yet, query the BlocklockRequested events instead
            return await this.fetchBlocklockRequest(sRequestID)
        } else if (events.length > 1) {
            throw new Error("BlocklockCallbackSuccess filter returned more than one result")
        }

        return {
            id: events[0].args.requestID.toString(),
            blockHeight: events[0].args.blockHeight,
            signature: events[0].args.signature,
            ciphertext: getBytes(events[0].args.ciphertext),
        }
    }

    /**
     * Encrypt a message that can be decrypted once a certain blockHeight is reached.
     * @param message plaintext to encrypt
     * @param blockHeight time at which the decryption key should be released
     * @param pk public key of the scheme
     * @returns encrypted message
     */
    encrypt(message: Uint8Array, blockHeight: bigint, pk: G2): Ciphertext {
        const identity = blockHeightToBEBytes(blockHeight)
        return encrypt_towards_identity_g1(message, identity, pk, BLOCKLOCK_IBE_OPTS)
    }

    /**
     * Decrypt a ciphertext using a decryption key.
     * @param ciphertext the ciphertext to decrypt
     * @param key decryption key
     * @returns plaintext
     */
    decrypt(ciphertext: Ciphertext, key: G1): Uint8Array {
        return decrypt_towards_identity_g1(ciphertext, key, BLOCKLOCK_IBE_OPTS)
    }

    /**
     * Encrypt a message that can be decrypted once a certain blockHeight is reached.
     * @param message plaintext to encrypt
     * @param blockHeight time at which the decryption key should be released
     * @param pk public key of the scheme
     * @returns the identifier of the blocklock request, and the ciphertext
     */
    async encryptAndRegister(message: Uint8Array, blockHeight: bigint, pk: G2): Promise<{ id: string, ct: Ciphertext }> {
        const ct = this.encrypt(message, blockHeight, pk)
        const id = await this.requestBlocklock(blockHeight, serializeCiphertext(ct))
        return {
            id: id.toString(),
            ct,
        }
    }

    /**
     * Try to decrypt a ciphertext with a specific blocklock id.
     * @param sRequestID blocklock id of the ciphertext to decrypt
     * @returns the plaintext if the decryption key is available, undefined otherwise
     */
    async decryptWithId(sRequestID: string): Promise<Uint8Array | undefined> {
        const status = await this.fetchBlocklockStatus(sRequestID)
        if (!status) {
            throw new Error("cannot find a request with this identifier")
        }

        // Signature has not been delivered yet, return
        if (!status.signature) {
            return
        }

        // Deserialize ciphertext
        const ct = deserializeCiphertext(status.ciphertext)

        // Decrypt the ciphertext with the provided signature
        const x = BigInt('0x' + status.signature.slice(2, 66))
        const y = BigInt('0x' + status.signature.slice(66, 130))
        return this.decrypt(ct, { x, y })
    }
}

export type BlocklockRequest = {
    id: string,
    blockHeight: bigint,
    ciphertext: Uint8Array,
}

export type BlocklockStatus = BlocklockRequest & {
    signature?: string,
}

function blockHeightToBEBytes(blockHeight: bigint) {
    const buffer = new ArrayBuffer(32)
    const dataView = new DataView(buffer)
    dataView.setBigUint64(0, (blockHeight >> 192n) & 0xffff_ffff_ffff_ffffn)
    dataView.setBigUint64(8, (blockHeight >> 128n) & 0xffff_ffff_ffff_ffffn)
    dataView.setBigUint64(16, (blockHeight >> 64n) & 0xffff_ffff_ffff_ffffn)
    dataView.setBigUint64(24, blockHeight & 0xffff_ffff_ffff_ffffn)

    return new Uint8Array(buffer)
}

function parseLogs(receipt: TransactionReceipt, contract: BaseContract, eventName: string): Array<LogDescription> {
    return receipt.logs
        .map(log => {
            try {
                return contract.interface.parseLog(log)
            } catch {
                return null
            }
        })
        .filter(log => log !== null)
        .filter(log => log?.name === eventName)
}
