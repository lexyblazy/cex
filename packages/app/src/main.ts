import express from "express";

const app = express();
const { PORT } = process.env;

app.get("/", (_req, res) => {
  res.send("Hello there");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on ${PORT} 🚀🚀`);
});
