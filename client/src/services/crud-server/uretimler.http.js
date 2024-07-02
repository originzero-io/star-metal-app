/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

class DevamEdenUretim extends CRUDServerHttp {
  constructor() {
    super("/uretim/devam-eden");
  }

  async gelenMalzemeMiktariGuncelle(currentRecord, newData) {
    const { data } = await axios.put(`${this.path}/gelen-malzeme-miktari`, {
      currentRecord,
      newData,
    });
    return data;
  }

  async oncelikAyarla(currentRecord, newOncelikDurumu) {
    const { data } = await axios.put(`${this.path}/oncelik-ayarla`, {
      currentRecord,
      newOncelikDurumu,
    });
    return data;
  }

  async uretimiSil(kayit) {
    const { data } = await axios.delete(`${this.path}`, {
      data: { kayit },
    });
    return data;
  }
}
const devamEdenUretimHttp = new DevamEdenUretim();

const tamamlananUretimHttp = new CRUDServerHttp("/uretim/tamamlanan");

export { devamEdenUretimHttp, tamamlananUretimHttp };
