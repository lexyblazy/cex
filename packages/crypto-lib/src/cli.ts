import readline from "readline";
import chalk from "chalk";
import commander from "commander";
import { HdWallet } from "./wallet";
import { getDerivationPath } from "./utils";
import { SUPPORTED_COINS } from "./types";
import * as constants from "./constants";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const program = new commander.Command();

const question = async (question: string) => {
  const answer = new Promise((resolve, reject) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });

  return await answer;
};

program.name("crypto-lib").description("CLI for some crypto-lib utilities").version("0.1.0");

program
  .command("generateExtendedKeys")
  .description("Generate extended keys (xpub and xprv) from the mnemonic phrase")
  .action(async () => {
    try {
      const mnemonic = (await question(
        chalk.green.bold(`Enter your mnemonic phrase: \n`)
      )) as string;
      const password = (await question(
        chalk.red(`Enter your password (Leave blank if N/A): \n`)
      )) as string;
      const coinSymbol = (await question(
        chalk.blue(`Enter coin symbol (e.g ${constants.SUPPORTED_COINS.join()}) : \n`)
      )) as SUPPORTED_COINS;

      if (!constants.SUPPORTED_COINS.includes(coinSymbol)) {
        throw new Error(`Unsupported coin ${coinSymbol}`);
      }

      const hdWallet = new HdWallet(mnemonic, password ? password : undefined);

      const derivationPath = getDerivationPath(coinSymbol);

      const xpub = hdWallet.getXpub(derivationPath);
      const xprv = hdWallet.getXprv(derivationPath);

      console.log({ coinSymbol, xpub, xprv: xprv });

      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
