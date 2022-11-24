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
