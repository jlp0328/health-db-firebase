import * as express from "express";
import db from "../../fb";

export let measurementRouter = express.Router();

//Client: Add daily macros
measurementRouter.post("/monthly-measurements", async (req, res) => {
  try {
    const {
      client,
      date,
      chest,
      waist,
      hips,
      arm,
      thigh,
      other,
      bodyFat
    } = req.body;

    const data = {
      date,
      chest,
      waist,
      hips,
      arm,
      thigh,
      other,
      bodyFat
    };

    const clientsRef = await db
      .collection("clients")
      .doc(client)
      .collection("monthlyMeasurements")
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

//Admin & Client: Get all daily macro records for individual
measurementRouter.get("/monthly-measurements/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const allMeasurementLog: any = [];

    await db
      .collection("clients")
      .doc(clientId)
      .collection("monthlyMeasurements")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const indvRecord = doc.data();
          indvRecord.id = doc.id;
          allMeasurementLog.push(indvRecord);
        });
      });

    res.json({
      allMeasurementLog
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
