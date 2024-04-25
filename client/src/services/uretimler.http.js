/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

// export const devamEdenUretimHttp = new CRUDServerHttp("/uretim/devam-eden", "id");

class DevamEdenUretim extends CRUDServerHttp {
  constructor() {
    super("/uretim/devam-eden", "id");
  }

  async updateData(currentRecord, newData) {
    const { data } = await axios.put(this.endPoint, { currentRecord, newData });
    return data;
  }
}
const devamEdenUretimHttp = new DevamEdenUretim();

export { devamEdenUretimHttp };
