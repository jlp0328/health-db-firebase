import * as express from "express";
import db from "../../fb";

export let macroRouter = express.Router();

//Client: Add daily macros
macroRouter.post("/daily-macros", async (req, res) => {
  try {
    const { client, date, protein, carbs, fat, fiber } = req.body;

    const data = {
      date,
      protein,
      carbs,
      fat,
      fiber
    };

    const clientsRef = await db
      .collection("clients")
      .doc(client)
      .collection("dailyMacros")
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
macroRouter.get("/daily-macros/:id", async (req, res) => {
  try {
    const clientId = req.params.id;
    const allMacroLog: any = [];

    await db
      .collection("clients")
      .doc(clientId)
      .collection("dailyMacros")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const indvRecord = doc.data();
          indvRecord.id = doc.id;
          allMacroLog.push(indvRecord);
        });
      });

    res.json({
      allMacroLog
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
