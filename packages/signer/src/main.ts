import Redis from "ioredis";

const main = async () => {
  const { REDIS_URL } = process.env;
  console.log({ REDIS_URL });

  const redisSubscriber = new Redis(REDIS_URL!);

  //   redisSubscriber.subscribe();
};

main()
  .then(() => {
    console.log("Signer is up and running");
  })
  .catch(console.error);
