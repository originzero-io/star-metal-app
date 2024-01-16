/* eslint-disable class-methods-use-this */
import axios from "axios";

axios.defaults.baseURL = "http://localhost:6333";

class ReferansService {
  async getReferanslar() {
    const rawReferanslar = await axios.get("/referanslar");
    const referansData = rawReferanslar.data[0].map((referans) => ({
      key: referans.referansNo,
      ...referans,
    }));
    return referansData;
  }

  async addReferans(referans) {
    await axios.post("/referanslar", referans);
  }

  async updateReferans(referanslar, yeniReferans) {
    await axios.put("/referanslar", yeniReferans);

    const updatedReferanslar = referanslar.map((referans) => {
      if (referans.id === yeniReferans.id) {
        return { key: yeniReferans.id, ...yeniReferans };
      }
      return referans;
    });
    return updatedReferanslar;
  }

  async deleteReferans(referanslar, selectedRows) {
    await axios.delete("/referanslar", {
      data: { selectedRows },
    });

    const newReferanslar = referanslar.filter(
      (referans) => !selectedRows.some((selectedRow) => selectedRow.id === referans.id),
    );
    return newReferanslar;
  }
}

export default new ReferansService();
