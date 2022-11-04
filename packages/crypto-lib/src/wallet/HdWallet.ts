import { HdWalletUtils } from "../common/HdWalletUtils";
import * as bip39 from "bip39";

export class HdWallet extends HdWalletUtils {
  mnemonic: string;
  password?: string;

  constructor(mnemonic: string, password?: string) {
    super();
    this.mnemonic = mnemonic;
    this.password = password;
  }

  private getRootNode() {
    const seed = bip39.mnemonicToSeedSync(this.mnemonic, this.password);

    return this.bip32.fromSeed(seed);
  }

  getXpub(derivationPath: string) {
    const root = this.getRootNode();

    return root.derivePath(derivationPath).neutered().toBase58();
  }

  getXprv(derivationPath: string) {
    const root = this.getRootNode();

    return root.derivePath(derivationPath).toBase58();
  }
}
