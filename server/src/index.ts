import fastify from "fastify";

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/", async (request, reply) => {
  return "Hello\n";
});

server.listen({ port: 8000, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Hello!!!! Chatter server listening at ${address}`);
});
