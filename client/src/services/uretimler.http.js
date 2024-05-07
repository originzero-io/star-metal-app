/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

// export const devamEdenUretimHttp = new CRUDServerHttp("/uretim/devam-eden", "id");

class DevamEdenUretim extends CRUDServerHttp {
  constructor() {
    super("/uretim/devam-eden", "id");
  }

  async gelenMalzemeMiktariGuncelle(currentRecord, newData) {
    const { data } = await axios.put(`${this.endPoint}/gelen-malzeme-miktari`, {
      currentRecord,
      newData,
    });
    return data;
  }

  async talepNoGir(currentRecord, newData) {
    const { data } = await axios.put(`${this.endPoint}/talepNo`, {
      currentRecord,
      newData,
    });
    return data;
  }
}
const devamEdenUretimHttp = new DevamEdenUretim();

export { devamEdenUretimHttp };
