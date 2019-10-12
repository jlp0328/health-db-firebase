import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

// const helper = require("./helper.js");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();
main.use("/api/v1", app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

//Admin: Get all clients general data
app.get("/all-clients", async (req, res) => {
  try {
    const clientList: any = [];

    await db
      .collection("clients")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const indv = doc.data();
          indv.id = doc.id;
          clientList.push(indv);
        });
      });

    res.json({
      clientList
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Admin: Add a new client
app.post("/add-client", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dob,
      phone,
      email,
      checkin,
      monthCheckin,
      coach
    } = req.body;

    const data = {
      firstName,
      lastName,
      dob,
      phone,
      email,
      checkin,
      monthCheckin,
      coach
    };

    const clientsRef = await db.collection("clients").add(data);
    const person = await clientsRef.get();

    res.json({
      id: clientsRef.id,
      data: person.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Client: Get all data for single client on log-in
app.get("/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    const client = await db
      .collection("clients")
      .doc(clientId)
      .get();

    res.json({
      client
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Client: Add daily weight
app.post("/clients/weight-log", async (req, res) => {
  try {
    const { client, date, weight } = req.body;

    const data = {
      client,
      date,
      weight
    };

    const clientsRef = await db
      .collection("clients")
      .doc(data.client)
      .collection("dailyWeight")
      .add(data);

    const collection = await clientsRef.get();

    res.json({
      id: clientsRef.id,
      data: collection.data()
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

//Admin & Client: Get all daily weight records
app.get("/clients/weight-log/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const allWeightLog: any = [];

    await db
      .collection("clients")
      .doc(clientId)
      .collection("dailyWeight")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const indvRecord = doc.data();
          indvRecord.id = doc.id;
          allWeightLog.push(indvRecord);
        });
      });

    res.json({
      allWeightLog
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
