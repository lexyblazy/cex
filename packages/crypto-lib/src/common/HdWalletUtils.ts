import { BIP32Factory, BIP32API } from "bip32";
import * as ecc from "tiny-secp256k1";

export class HdWalletUtils {
  bip32: BIP32API;

  constructor() {
    this.bip32 = BIP32Factory(ecc);
  }

  getPublicKey(xpub: string, index: number) {
    const node = this.bip32.fromBase58(xpub).derivePath(index.toString());

    return node.publicKey;
  }

  getPrivateKey(xprv: string, index: number) {
    const node = this.bip32.fromBase58(xprv).derivePath(index.toString());

    if (!node.privateKey) {
      throw new Error(
        node.isNeutered()
          ? "Node is neutered, cannot generate private key"
          : "Failed to get private key"
      );
    }

    return node.privateKey.toString("hex");
  }
}
