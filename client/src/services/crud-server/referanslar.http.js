/* eslint-disable max-classes-per-file */
import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar");

class ReferansUretimHttp extends CRUDServerHttp {
  constructor() {
    super("/referanslar/uretim-verileri");
  }

  async getOneData(referans) {
    const rawData = await this.service.get(`${this.path}/${referans.logoMalzemeRef}`);
    // console.log("fetched data from server(raw) --> : ", rawData);
    return rawData.data;
  }
}

const referansUretimHttp = new ReferansUretimHttp();
export { referansUretimHttp };
