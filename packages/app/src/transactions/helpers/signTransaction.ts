import { getClient, constants } from "#/redisHelper";

export const signTransaction = (payload: {} = {}) => {
  const publisher = getClient(constants.REDIS_CLIENT_NAME_SIGNER_PUBLISHER);

  const UNSIGNED_TRANSACTION_CHANNEL = "unsigned_transaction_channel";

  const message = JSON.stringify(payload);

  publisher.publish(UNSIGNED_TRANSACTION_CHANNEL, message, (err) => {
    if (err) {
      console.log(
        `Failed to publish message to channel=${UNSIGNED_TRANSACTION_CHANNEL}, message = ${message}`
      );
    } else {
      console.log("publishing unsigned transaction to signer", message);
    }
  });
};
