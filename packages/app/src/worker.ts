// address worker
// transaction worker
// session worker - revalidate sessions

import throng from "throng";
import { addressWorker } from "./workers";

const main = async () => {
  addressWorker.start();
};

throng({ start: main });
