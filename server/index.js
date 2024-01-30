import express from "express";
import cors from "cors";
import redis from "ioredis";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
import { redisConfig, pgConfig } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());

const redisClient = new redis(redisConfig);
const pgPool = new pg.Pool(pgConfig);

pgPool.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisPublisher = redisClient.duplicate();

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.post("/values", async (req, res) => {
  const { index } = req.body;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }
  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgPool.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.get("/values/all", async (req, res) => {
  const values = await pgPool.query("SELECT * FROM values");
  res.send(values.rows);
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
