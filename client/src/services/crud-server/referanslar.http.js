/* eslint-disable max-classes-per-file */
import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar");

class ReferansUretimHttp extends CRUDServerHttp {
  constructor() {
    super("/referanslar/uretim-verileri");
  }
}

const referansUretimHttp = new ReferansUretimHttp();
export { referansUretimHttp };
