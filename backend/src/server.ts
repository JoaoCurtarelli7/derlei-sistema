import app from "./app";

const initializeServer = async () => {
  app
    .listen({
      host: "0.0.0.0",
      port: 3333,
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

initializeServer();
