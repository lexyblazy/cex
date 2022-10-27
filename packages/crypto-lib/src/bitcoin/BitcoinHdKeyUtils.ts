import * as bitcoinJS from "bitcoinjs-lib";
import { HdKeyUtils } from "../common";
import * as constants from "./constants";
import { AddressType } from "./types";

export class BitcoinHdKeyUtils extends HdKeyUtils {
  xpub: string;
  derivationPath: string;
  network?: bitcoinJS.networks.Network;

  constructor(
    mnemonic: string,
    network?: bitcoinJS.networks.Network,
    password?: string
  ) {
    super();
    this.derivationPath = constants.DEFAULT_DERIVATION_PATH;
    this.xpub = this.getXpub(mnemonic, this.derivationPath, password);
    this.network = network ?? bitcoinJS.networks.bitcoin;
  }

  deriveAddress(index: number, type: AddressType = "legacy") {
    const node = this.bip32.fromBase58(this.xpub, this.network);
    const params: bitcoinJS.payments.Payment = {
      pubkey: node.derive(index).publicKey,
      network: this.network,
    };

    switch (type) {
      case "legacy":
        return bitcoinJS.payments.p2pkh(params).address;
      case "segwitNative":
        return bitcoinJS.payments.p2wpkh(params).address;
    }
  }
}
