export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const isDev = () => process.env.NODE_ENV !== "production";
