const dotenv = require("dotenv");
const app = require("./app");
const connectToDB = require("./config/database");

// Resolve uncaught errors;
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    process.exit(1);
});

// config file path for dotenv;
dotenv.config({ path: "./config/config.env" });

// calling database connection after loading config port so that it can get the port number through config file;
connectToDB();

// Defining the server;
const server = app.listen(process.env.PORT, () => {
    console.log(`Server working on http://localhost:${process.env.PORT}`);
});

// Resolve unhandled promise rejection
process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    // close the server by exiting the process
    server.close(() => {
        process.exit(1);
    });
});
