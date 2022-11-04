import * as bitcoinJS from "bitcoinjs-lib";
import { HdWalletUtils } from "../../common/HdWalletUtils";
import { AddressType } from "./types";

export class BitcoinHdWalletUtils extends HdWalletUtils {
  private xpub: string;
  private xprv?: string;
  network?: bitcoinJS.networks.Network;

  constructor(xpub: string, xprv?: string) {
    super();
    this.xpub = xpub;
    this.xprv = xprv;

    this.network = bitcoinJS.networks.bitcoin;
  }

  deriveAddress(index: number, type: AddressType = "legacy") {
    const publicKey = this.getPublicKey(this.xpub, index);

    const params: bitcoinJS.payments.Payment = {
      pubkey: publicKey,
      network: this.network,
    };

    switch (type) {
      case "legacy":
        return bitcoinJS.payments.p2pkh(params).address;
      case "segwitNative":
        return bitcoinJS.payments.p2wpkh(params).address;
    }
  }

  getSigningKey(index: number): string {
    if (!this.xprv) {
      throw new Error("xprv is required to retrieve signing key");
    }

    return this.getPrivateKey(this.xprv, index);
  }
}
