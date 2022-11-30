import axios from "axios";
import BigNumber from "bignumber.js";
import * as typeorm from "typeorm";
import { addressEntity, assetEntity } from "#/db/schemas";
import { initTypeorm } from "#/init";

const main = async () => {
  await initTypeorm(process.env.DATABASE_URL_HOST);

  const typeormConnection = typeorm.getConnection();
  const addressesRepository = typeormConnection.getRepository(addressEntity);
  const assetsRepository = typeormConnection.getRepository(assetEntity);

  const btcAsset = await assetsRepository.findOne({
    where: { networkSymbol: "BTC", symbol: "BTC" },
  });

  if (!btcAsset) {
    throw new Error("btc asset does not exist");
  }

  const btcAddressEntities = await addressesRepository.find({
    where: {
      asset: btcAsset,
    },
  });

  const axiosInstance = axios.create({
    baseURL: process.env.NIGIRI_CHOP_STICKS_URL,
  });

  for (const { address } of btcAddressEntities) {
    const amount = new BigNumber(Math.random() * 0.01).decimalPlaces(5).toNumber();
    const response = await axiosInstance.post(`/faucet`, {
      address,
      amount,
    });

    console.log({ address, amount, ...response.data });
  }
};

main()
  .then(() => console.log("DONE"))
  .catch(console.error);
