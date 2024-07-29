import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class UretimGirisi extends CRUDServerHttp {
  constructor() {
    super("/uretim-girisleri");
  }

  async getDataByRecord(recordId, refNo) {
    const rawData = await axios.get(`${this.path}/${recordId}/${refNo}`);
    return rawData.data;
  }

  async aktiflikDegistir(istenenAktiflik, kayitlar = []) {
    const rawData = await axios.put(`${this.path}/aktiflik-degistir`, {
      kayitlar,
      istenenAktiflik,
    });
    return rawData.data;
  }

  async sevkiyatBilgileriniDoldur(kayitlar = [], logoIrsaliyeNo) {
    const rawData = await axios.put(`${this.path}/sevkiyat-bilgilerini-doldur`, {
      kayitlar,
      logoIrsaliyeNo,
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
