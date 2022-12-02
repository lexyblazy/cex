import Redis from "ioredis";

const main = async () => {
  const { REDIS_URL } = process.env;

  if (!REDIS_URL) {
    throw new Error("REDIS_URL is undefined");
  }

  const subscriber = new Redis(REDIS_URL);
  const publisher = new Redis(REDIS_URL);

  const UNSIGNED_TRANSACTION_CHANNEL = "unsigned_transaction_channel";
  const SIGNED_TRANSACTION_CHANNEL = "signed_transaction_channel";

  subscriber.subscribe(UNSIGNED_TRANSACTION_CHANNEL, (err, count) => {
    if (err) {
      console.error("Failed to subscribe: %s", err.message);
    } else {
      console.log(`[${UNSIGNED_TRANSACTION_CHANNEL}] : Subscribed successfully!`);
    }
  });

  subscriber.on("message", (channel, message) => {
    console.log(`Received unsigned transaction `, message);

    // code that signs transactions goes here.

    // then publish signed transaction back to app service for broadcasting to blockchain
    const unsignedTransaction = JSON.parse(message);
    const signedTransaction = JSON.stringify({ ...unsignedTransaction, signed: true });

    publisher.publish(SIGNED_TRANSACTION_CHANNEL, signedTransaction, (err) => {
      if (!err) {
        console.log("Published signed transaction", signedTransaction);
      }
    });
  });
};

main()
  .then(() => {
    console.log("Signer is up and running");
  })
  .catch(console.error);
