const { faker } = require("@faker-js/faker");
const { ObjectId } = require("mongodb");

const generateMhs = () => {
  const gender = faker.person.sex();
  const namaBaru = faker.person.fullName({ sex: gender });
  const namaDepan = namaBaru.split(" ")[1];
  const jurusan = ["S1 DKV", "S1 SIB", "S1 Infor", "D3 SI"];
  return {
    _id: new ObjectId(),
    nrp: Number(`225${faker.number.int(1000000)}`),
    nama: namaBaru,
    gender: gender,
    email: `${namaDepan.toLowerCase()}.a25@mhs.istts.ac.id`,
    no_hp: Number(`+${628}${faker.number.int({ min: 1, max: 9 })}${faker.number.int(
      999999999
    )}`),
    alamat: faker.location.streetAddress({ useFullAddress: true }),
    jurusan: jurusan[Math.floor(Math.random() * jurusan.length)],
    sks: faker.number.int({ min: 1, max: 24 }),
    createdAt: new Date(),
    lastModified: new Date(),
  };
};
const generatePengumuman = () => {
  const angka = faker.number.int({ min: 1, max: 9999 }).toString();
  const kode = `P${angka.padStart(4, "0000")}`;
  const sumber = ["Badan Administrasi Kemahasiswaan", "Badan Administrasi Umum", "Rektor"]
  return ({
    _id: new ObjectId(),
    kode: kode,
    sumber: sumber[Math.floor(Math.random() * sumber.length)],
    judul: faker.lorem.words(4),
    desc: faker.lorem.words({ min: 10, max: 50 }),
    createdAt: new Date(),
    lastModified: new Date(),
  })
};

const generateDosen = () => {
  const gender = faker.person.sex();
  const namaBaru = faker.person.fullName({ sex: gender });
  const namaDepan = namaBaru.split(" ")[1];
  return ({
    _id: new ObjectId(),
    nid: Number(`125${faker.number.int(1000000)}`),
    nama: namaBaru,
    gender: gender,
    email: `${namaDepan.toLowerCase()}.d25@istts.ac.id`,
    no_hp: Number(`+${628}${faker.number.int({ min: 1, max: 9 })}${faker.number.int(
      999999999
    )}`),
    alamat: faker.location.streetAddress({ useFullAddress: true }),
    createdAt: new Date(),
    lastModified: new Date(),
  })
};

const generateMatkul = (daftarNama) => {

  const angkaRandom = Math.floor(Math.random() * daftarNama.length)
  const angkaRandom2 = Math.floor(Math.random() * daftarNama.length)


  const dataPengajar = [
    {
      nid: daftarNama[angkaRandom].nid,
      nama: daftarNama[angkaRandom].nama
    },
    {
      nid: daftarNama[angkaRandom2].nid,
      nama: daftarNama[angkaRandom2].nama
    }
  ]


  const angka = faker.number.int({ min: 1, max: 9999 }).toString();
  const kode = `MK${angka.padStart(4, "0000")}`;
  return ({
    _id: new ObjectId(),
    kode: kode,
    nama: `${faker.lorem.slug(2)}`,
    data_pengajar: dataPengajar.map((item) => { return item }),
    sks: faker.number.int({ min: 1, max: 24 }),
    createdAt: new Date(),
    lastModified: new Date()
  })
};


module.exports = {
  generateMhs,
  generateDosen,
  generateMatkul,
  generatePengumuman,
};
