import * as ethers from "ethers";

import { HdKeyUtils } from "../common";
import * as constants from "./constants";

export class EthereumHdKeyUtils extends HdKeyUtils {
  private derivationPath: string;
  xpub: string;

  constructor(mnemonic: string, password?: string) {
    super();
    this.derivationPath = constants.DEFAULT_DERIVATION_PATH;
    this.xpub = this.getXpub(mnemonic, this.derivationPath, password);
  }

  deriveAddress(index: number) {
    const node = ethers.utils.HDNode.fromExtendedKey(this.xpub);

    const { publicKey } = node.derivePath(index.toString());
    return ethers.utils.computeAddress(publicKey);
  }
}
