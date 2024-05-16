import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class Personel extends CRUDServerHttp {
  constructor() {
    super("/personeller");
  }

  async login(user) {
    const rawData = await axios.post(`${this.path}/giris`, user);
    return rawData.data;
  }
}
const personelHttp = new Personel();

export default personelHttp;
