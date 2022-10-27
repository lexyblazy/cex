import { BIP32Factory, BIP32API } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bip39 from "bip39";

export class HdKeyUtils {
  bip32: BIP32API;
  constructor() {
    this.bip32 = BIP32Factory(ecc);
  }

  getXpub(mnemonic: string, derivationPath: string, password?: string) {
    const seed = bip39.mnemonicToSeedSync(mnemonic, password);

    const root = this.bip32.fromSeed(seed);

    return root.derivePath(derivationPath).neutered().toBase58();
  }

  getXpriv(mnemonic: string, derivationPath: string, password?: string) {
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonic, password);

    const root = this.bip32.fromSeed(seedBuffer);

    return root.derivePath(derivationPath).toBase58();
  }
}
