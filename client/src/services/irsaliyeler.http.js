import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

// export default new CRUDServerHttp("/irsaliyeler", "id");

class Irsaliye extends CRUDServerHttp {
  constructor() {
    super("/irsaliyeler", "id");
  }

  // devam eden üretimler üzerinden
  async fasonlaraIrsaliyeKes(irsaliyeKaydi = []) {
    const rawData = await axios.post(`${this.endPoint}/fasona`, irsaliyeKaydi);
    return rawData.data;
  }
}

const irsaliyeHttp = new Irsaliye();
export default irsaliyeHttp;
