import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class Personel extends CRUDServerHttp {
  constructor() {
    super("/personeller", "id");
  }

  async login(user) {
    const rawData = await axios.post(`${this.endPoint}/giris`, user);
    return rawData.data;
  }
}
const personelHttp = new Personel();

export default personelHttp;
