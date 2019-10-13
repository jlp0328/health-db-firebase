import * as express from "express";
import db from "../../fb";

export let userRouter = express.Router();

//Admin: Get all clients general data
userRouter.get("/all-clients", async (req, res) => {
  try {
    const clientList: any = [];

    await db
      .collection("clients")
      .get()
      .then((snapshot: any) => {
        snapshot.forEach((doc: any) => {
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
userRouter.post("/add-client", async (req, res) => {
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
userRouter.get("/:id", async (req, res) => {
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
