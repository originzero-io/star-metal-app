import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class UretimGirisi extends CRUDServerHttp {
  constructor() {
    super("/uretim-girisleri", "id");
  }

  async getDataByReferans(recordReferansNo) {
    const rawData = await axios.get(`${this.endPoint}/${recordReferansNo}`);
    return rawData.data;
  }

  async aktiflikDegistir(istenenAktiflik, kayitlar = []) {
    const rawData = await axios.post(`${this.endPoint}/aktiflik-degistir`, {
      kayitlar,
      istenenAktiflik,
    });
    return rawData.data;
  }

  async deleteData(selectedRows) {
    await axios.delete(this.endPoint, {
      data: { selectedRows },
    });
  }
}
export default new UretimGirisi();
