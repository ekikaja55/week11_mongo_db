const { faker } = require("@faker-js/faker");
const { ObjectId } = require("mongodb");

const generateMhs = () => {
  const gender = faker.person.sex();
  const namaBaru = faker.person.fullName({ sex: gender });
  const namaDepan = namaBaru.split(" ")[1];
  const jurusan = ["S1 DKV", "S1 SIB", "S1 Infor", "D3 SI"];
  return {
    _id: new ObjectId(),
    nrp: `225${faker.number.int(1000000)}`,
    nama: namaBaru,
    gender: gender,
    //628 9 637181522
    email: `${namaDepan.toLowerCase()}.a25@mhs.istts.ac.id`,
    no_hp: `+${628}${faker.number.int({ min: 1, max: 9 })}${faker.number.int(
      999999999
    )}`,
    jurusan: jurusan[Math.floor(Math.random() * jurusan.length)],
    sks: faker.number.int({ min: 1, max: 24 }),
    createdAt: new Date(),
    lastModified: new Date(),
  };
};
const generatePengumuman = () => {};
const generateDosen = () => {};
const generateMatkul = () => {};


module.exports = {
  generateMhs,
  generateDosen,
  generateMatkul,
  generatePengumuman,
};
