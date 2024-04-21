import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class UretimGirisi extends CRUDServerHttp {
  constructor() {
    super("/uretim-girisleri", "id");
  }

  async getDataById(recordId) {
    const rawData = await axios.get(`${this.endPoint}/${recordId}`);
    return rawData.data;
  }

  async aktiflikDegistir(istenenAktiflik, kayitlar = []) {
    const rawData = await axios.put(`${this.endPoint}/aktiflik-degistir`, {
      kayitlar,
      istenenAktiflik,
    });
    return rawData.data;
  }

  async sevkEt(kayitlar = []) {
    const rawData = await axios.put(`${this.endPoint}/sevk-et`, {
      kayitlar,
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
