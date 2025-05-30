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
  app.get("/api/mhs/seeder", async (req, res) => {
    const result = await seeder(40, Mhs, "mhs");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });

  app.get("/api/mhs", async (req, res) => {
    const { nrp, sks } = req.query;
    let param = nrp || sks;
    let result;

    if (!nrp && !sks || nrp && sks) {
      result = await Mhs.find({}, { projection: { "createdAt": 0, "lastModified": 0 } }).sort({ sks: 1 }).toArray();
      return res.status(200).json({
        param: "Find All",
        data: result
      });
    } else if (!sks && nrp) {
      result = await Mhs.findOne({ nrp: Number(nrp) }, { projection: { "createdAt": 0, "lastModified": 0 } })
      if (!result) {
        return res.status(200).json({ message: `nrp : ${nrp} tidak ditemukan ` });
      }
    } else if (!nrp && sks) {
      result = await Mhs.find({
        sks: { $lt: Number(sks) }
      }, { projection: { "createdAt": 0, "lastModified": 0 } }).sort({ sks: 1 }).toArray()
      if (!result) {
        return res.status(200).json({ message: `sks : ${sks} tidak ditemukan ` });
      }
    }

    return res.status(200).json({
      param: param,
      data: result
    });


  });

  app.get("/api/mhs/:notelp", async (req, res) => {
    const { notelp } = req.params
    const result = await Mhs.findOne({ no_hp: Number(notelp) }, { projection: { "createdAt": 0, "lastModified": 0 } })
    if (!result) {
      return res.status(200).json({ message: `no hp : ${notelp} tidak ditemukan ` });
    }
    return res.status(200).json({
      param: notelp,
      data: result
    });
  })


};

const dosenRoute = () => {

  app.get("/api/dosen/seeder", async (req, res) => {
    const result = await seeder(40, Dosen, "dosen");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });

  app.get("/api/dosen/", async (req, res) => {
    const { nid, gender } = req.query
    let param = nid || gender;
    let result;
    if (!nid && !gender || nid && gender) {
      result = await Dosen.find({}, {
        projection: {
          "createdAt": 0,
          "lastModified": 0,
        }
      }).toArray()
      return res.status(200).json({
        param: "Find All",
        data: result
      });
    } else if (!nid && gender) {
      result = await Dosen.find({ gender: gender }, {
        projection: {
          "createdAt": 0,
          "lastModified": 0,
        }
      }).toArray();
    } else if (nid && !gender) {
      result = await Dosen.findOne({ nid: Number(nid) }, {
        projection: {
          "createdAt": 0,
          "lastModified": 0,
        }
      })
      if (!result) {
        return res.status(404).json({ message: `${param} tidak ditemukan` })
      }
    }
    return res.status(200).json({
      param: param,
      data: result
    });
  });

  app.get("/api/dosen/:notelp", async (req, res) => {
    const { notelp } = req.params
    const result = await Dosen.findOne({ no_hp: Number(notelp) }, {
      projection: {
        "createdAt": 0,
        "lastModified": 0
      }
    })
    if (!result) {
      return res.status(404).json({ message: `${notelp} tidak ditemukan` })
    }
    return res.status(200).json({
      param: notelp,
      data: result
    });
  })
};

const matkulRoute = () => {
  app.get("/api/matkul/seeder", async (req, res) => {
    const daftarNama = await Dosen.find({}, {
      projection: {
        nid: 1,
        nama: 1,
        _id: 0
      }
    }).toArray()
    const result = await seeder(40, Matkul, "matkul", daftarNama);
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });
  });
  app.get("/api/matkul/", async (req, res) => {
    const { kode, sks } = req.query
    let param = kode || sks;
    let result;
    if (!kode && !sks || kode && sks) {
      result = await Matkul.find({}, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      }).toArray()
      return res.status(200).json({
        param: "Find All",
        result: result
      })
    } else if (!kode && sks) {
      result = await Matkul.find({ sks: { $lt: Number(sks) } }, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      }).sort({ sks: 1 }).toArray()
      if (!result) {
        return res.status(404).json({ message: `${param} tidak ditemukan` })
      }
    } else if (kode && !sks) {
      result = await Matkul.findOne({ kode: kode }, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      })
      if (!result) {
        return res.status(404).json({ message: `${param} tidak ditemukan` })
      }
    }
    return res.status(200).json({
      param: param,
      result: result
    })
  });

  app.get("/api/matkul/:nama_pengajar", async (req, res) => {
    const { nama_pengajar } = req.params
    const result = await Matkul.find({ "data_pengajar.nama": nama_pengajar }, {
      projection: {
        createdAt: 0,
        lastModified: 0
      }
    }).toArray()
    if (!result) {
      return res.status(404).json({ message: `${nama_pengajar} tidak ditemukan` })
    }
    return res.status(200).json(result)
  })
};

const pengumumanRoute = () => {
  app.get("/api/pengumuman/seeder", async (req, res) => {
    const result = await seeder(40, Pengumuman, "pengumuman");
    if (result === undefined) {
      return res.status(404).json("param tidak boleh kosong");
    }
    return res.status(200).json({
      message: result.message,
      result: result.data,
    });

  });
  app.get("/api/pengumuman/", async (req, res) => {
    const { judul, sumber } = req.query
    const param = judul || sumber
    let result;

    if ((!judul && !sumber) || (judul && sumber)) {
      result = await Pengumuman.find({}, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      }).toArray()
      return res.status(200).json({
        param: "Find All",
        result: result
      })
    } else if (!sumber && judul) {
      result = await Pengumuman.findOne({ judul: judul }, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      })
      if (!result) {
        return res.status(404).json({ message: `${judul} tidak ditemukan` })

      }
    } else if (!judul && sumber) {
      result = await Pengumuman.find({ sumber: sumber }, {
        projection: {
          createdAt: 0,
          lastModified: 0
        }
      }).toArray()
      if (!result) {
        return res.status(404).json({ message: `${sumber} tidak ditemukan` })

      }
    }
    return res.status(200).json({
      param: param,
      result: result
    })
  });

  app.get("/api/pengumuman/:kode", async (req, res) => {
    const { kode } = req.params
    const result = await Pengumuman.findOne({ kode: kode }, {
      projection: {
        createdAt: 0,
        lastModified: 0
      }
    })
    if (!result) {
      return res.status(404).json({ message: `${kode} tidak ditemukan` })
    }
    return res.status(200).json(result)

  })
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
