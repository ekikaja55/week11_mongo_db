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

const createIndexes = async () => {
  await Mhs.createIndex({ nrp: 1 }, { unique: true });
  await Dosen.createIndex({ nid: 1 }, { unique: true });
  await Matkul.createIndex({ kode: 1 }, { unique: true });
  await Pengumuman.createIndex({ kode: 1 }, { unique: true });
  console.log("berhasil create index");
}
const connect = async () => {
  try {
    await client.connect(dbname);
    console.log("berhasil connect ke mongo db semoga");
    await createIndexes();
  } catch (error) {
    console.log(error);
    await client.close();
  }
};

const mhsRoute = () => {

  //find all dan finone berdasarkan query nrp atau sks
  app.get("/api/mhs", async (req, res) => {
    const { nrp, sks } = req.query;
    let param = nrp ?? sks;
    let result;
    if (!nrp && !sks) {
      result = await Mhs.find().toArray();
      return res.status(200).json(result);
    }
    result = await Mhs.findOne({ sks: Number(param) }) ?? await Mhs.findOne({ nrp: Number(param) }) ;
    if (!result) {
      return res.status(200).json({ message: `${param} tidak ditemukan ` });
    }
    return res.status(200).json({
      param: param,
      data: result
    });


  });


  app.get("/api/mhs/seeder", async (req, res) => {
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
  app.get("/api/dosen/", async (req, res) => {

  });
  app.get("/api/dosen/seeder", async (req, res) => {
    const result = await seeder(10, Dosen, "dosen");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");

    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });
};

const matkulRoute = () => {
  app.get("/api/matkul/", async (req, res) => { });
  app.get("/api/matkul/seeder", async (req, res) => {
    const result = await seeder(10, Matkul, "matkul");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });
};

const pengumumanRoute = () => {
  app.get("/api/pengumuman/", async (req, res) => { });
  app.get("/api/pengumuman/seeder", async (req, res) => {
    const result = await seeder(10, Pengumuman, "pengumuman");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });

  });
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
