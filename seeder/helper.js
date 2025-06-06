const {
  generateMhs,
  generateDosen,
  generateMatkul,
  generatePengumuman,
} = require("./generate_data");

const seeder = async (jumlah_data, db, param = "", daftarNama = []) => {
  
  try {
    const dataList = [];
    for (let i = 0; i < jumlah_data; i++) {
      let data;
      switch (param) {
        case "mhs":
          data = generateMhs();
          break;
        case "dosen":
          data = generateDosen();
          break;
        case "matkul":
          data = generateMatkul(daftarNama);
          break;
        case "pengumuman":
          data = generatePengumuman();
          break;
        default:
          return;
      }
      dataList.push(data);
    }
    await db.deleteMany({});
    await db.insertMany(dataList);
    return {
      message: `berhasil seed data ${param}`,
      data: dataList,
    };
  } catch (error) {
    console.log(error);

    return error.message;
  }
};

module.exports = seeder;
