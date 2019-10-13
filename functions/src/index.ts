import * as functions from "firebase-functions";
import * as express from "express";
import * as bodyParser from "body-parser";

//Routes
const clientInfo = require("./api/user/index");
const weightInfo = require("./api/weight/index");
const macroInfo = require("./api/macros/index");
const measurementInfo = require("./api/measurements/index");

const app = express();
const main = express();
main.use("/api/v1", app);
main.use(bodyParser.json());

app.use("/clients", clientInfo.userRouter);
app.use("/weight", weightInfo.weightRouter);
app.use("/macros", macroInfo.macroRouter);
app.use("/measurements", measurementInfo.measurementRouter);

export const webApi = functions.https.onRequest(main);
