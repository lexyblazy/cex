import * as bitcoinJS from "bitcoinjs-lib";
import { HdWallet } from "../common";
import * as constants from "./constants";
import { AddressType } from "./types";

export class BitcoinHdWallet extends HdWallet {
  private xpub: string;
  private xprv: string;
  private derivationPath: string;
  network?: bitcoinJS.networks.Network;

  constructor(
    mnemonic: string,
    network?: bitcoinJS.networks.Network,
    password?: string
  ) {
    super();
    this.derivationPath = constants.DEFAULT_DERIVATION_PATH;
    this.xpub = this.getXpub(mnemonic, this.derivationPath, password);
    this.xprv = this.getXprv(mnemonic, this.derivationPath, password);

    this.network = network ?? bitcoinJS.networks.bitcoin;
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
    return this.getPrivateKey(this.xprv, index);
  }
}
