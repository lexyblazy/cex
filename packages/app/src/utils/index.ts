import { exec } from "child_process";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isDev = () => process.env.NODE_ENV !== "production";

export const getCurrentCommitHash = () => {
  return new Promise((resolve, reject) => {
    exec("git rev-parse HEAD | tr -d '\n'", (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }

      console.log({ stdout });

      resolve(stdout);
    });
  });
};

export const isValidUUid = (input: string) => {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

  return regexExp.test(input);
};
