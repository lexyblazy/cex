import * as ethers from "ethers";

import { HdWalletUtils } from "../../common/HdWalletUtils";

export class EthereumHdWallet extends HdWalletUtils {
  private xpub: string;
  private xprv?: string;

  constructor(xpub: string, xprv?: string) {
    super();
    this.xpub = xpub;
    this.xprv = xprv;
  }

  deriveAddress(index: number) {
    const publicKey = this.getPublicKey(this.xpub, index);

    return ethers.utils.computeAddress(publicKey);
  }

  getSigningKey(index: number) {
    if (!this.xprv) {
      throw new Error("xprv is required to retrieve signing key");
    }

    return this.getPrivateKey(this.xprv, index);
  }
}
