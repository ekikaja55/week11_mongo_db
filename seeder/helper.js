const {
  generateMhs,
  generateDosen,
  generateMatkul,
  generatePengumuman,
} = require("./generate_data");

const seeder = async (jumlah_data, db, param = "") => {
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
          data = generateMatkul();
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
      message: "berhasil insert data",
      data: dataList,
    };
  } catch (error) {
    console.log(error);

    return error.message;
  }
};

module.exports = seeder;
