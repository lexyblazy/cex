import * as ethers from "ethers";

import { HdWallet } from "../common";
import * as constants from "./constants";

export class EthereumHdWallet extends HdWallet {
  private derivationPath: string;
  private xpub: string;
  private xprv: string;

  constructor(mnemonic: string, password?: string) {
    super();
    this.derivationPath = constants.DEFAULT_DERIVATION_PATH;
    this.xpub = this.getXpub(mnemonic, this.derivationPath, password);
    this.xprv = this.getXprv(mnemonic, this.derivationPath, password);
  }

  deriveAddress(index: number) {
    const publicKey = this.getPublicKey(this.xpub, index);

    return ethers.utils.computeAddress(publicKey);
  }

  getSigningKey(index: number): string {
    return this.getPrivateKey(this.xprv, index);
  }
}
