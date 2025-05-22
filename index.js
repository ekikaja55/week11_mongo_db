const { MongoClient } = require("mongodb");
const express = require("express");
const seeder = require("./seeder/helper");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbname = "db_kampus";
const db = client.db(dbname);

const Mhs = db.collection("Mahasiswa");
const Dosen = db.collection("Dosen");
const Matkul = db.collection("MataKuliah");
const Pengumuman = db.collection("Pengumuman");

const connect = async () => {
  try {
    await client.connect(dbname);
    console.log("berhasil connect ke mongo db semoga");
  } catch (error) {
    console.log(error);
    await client.close();
  }
};

const mhsRoute = () => {

  //query find All, dan find one by nrp lewat query param
  app.get("/api/mhs", async (req, res) => {
    const { nrp } = req.query;
    let result;    
    if (!nrp) {
      result = await Mhs.find().toArray();
      return res.status(200).json(result);
    }
    result = await Mhs.findOne({ nrp: nrp });
    if (!result) {
      return res.status(200).json({ message: `nrp: ${nrp} tidak ditemukan ` });
    }
    return res.status(200).json(result);
  });

  app.post("/api/mhs/insert", async (req, res) => {
    await Mhs.createIndex({ nrp: 1 }, { unique: true });
    const result = await seeder(10, Mhs, "mhs");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });
};

const dosenRoute = () => {
  app.get("/api/dosen/", async (req, res) => {});
  app.post("/api/dosen/insert", async (req, res) => {});
};

const matkulRoute = () => {
  app.get("/api/matkul/", async (req, res) => {});
  app.post("/api/matkul/insert", async (req, res) => {});
};

const pengumumanRoute = () => {
  app.get("/api/pengumuman/", (req, res) => {});
  app.post("/api/pengumuman/insert", (req, res) => {});
};

const main = async () => {
  try {
    await connect();
    mhsRoute();
    dosenRoute();
    matkulRoute();
    pengumumanRoute();

    app.listen(port, () => {
      console.log(`nyambung di port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
