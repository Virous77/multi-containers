import redis from "ioredis";
import { redisConfig } from "./config.js";
import dotenv from "dotenv";
dotenv.config();

const client = redis.createClient(redisConfig);

const sub = client.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel, message) => {
  client.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
