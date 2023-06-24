dotenv.config({ path: "./config.env" });
import dotenv from "dotenv";
import express from "express";
import router from "./routes/auth.js";
import privateRouter from "./routes/private.js";
import db from "./config/db.js";
import errorHandle from "./middleware/error.js";

//connect db
db();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', router);
app.use('/api/private', privateRouter);

app.use(errorHandle);

app.get("/", (req, res) => {
  res.send("HEHEH");
});

const server = app.listen(port, () => {
  console.log("running on port : ", port);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error from Server.js: ${err}`);
  server.close(()=> process.exit(1))
})