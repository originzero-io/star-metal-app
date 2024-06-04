import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class UretimGirisi extends CRUDServerHttp {
  constructor() {
    super("/uretim-girisleri");
  }

  async getDataById(recordId) {
    const rawData = await axios.get(`${this.path}/${recordId}`);
    return rawData.data;
  }

  async aktiflikDegistir(istenenAktiflik, kayitlar = []) {
    const rawData = await axios.put(`${this.path}/aktiflik-degistir`, {
      kayitlar,
      istenenAktiflik,
    });
    return rawData.data;
  }

  async sevkiyatBilgileriniDoldur(kayitlar = []) {
    const rawData = await axios.put(`${this.path}/sevkiyat-bilgilerini-doldur`, {
      kayitlar,
    });
    return rawData.data;
  }

  async deleteData(selectedRows) {
    await axios.delete(this.path, {
      data: { selectedRows },
    });
  }
}
export default new UretimGirisi();
