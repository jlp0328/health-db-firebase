import * as express from "express";
import db from "../../fb";

export let weightRouter = express.Router();

//Client: Add daily weight
weightRouter.post("/weight-log", async (req, res) => {
  try {
    const { client, date, weight } = req.body;

    const data = {
      date,
      weight
    };

    const clientsRef = await db
      .collection("clients")
      .doc(client)
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
weightRouter.get("/weight-log/:id", async (req, res) => {
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
