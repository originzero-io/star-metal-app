/* eslint-disable max-classes-per-file */
import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar", "referansNo");

class ReferansIslemTipi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/islem-tipi");
  }

  async updateData(mevcutIslemTipi, yeniIslemTipi) {
    const { data } = await this.service.put(this.path, { mevcutIslemTipi, yeniIslemTipi });
    return data;
  }
}
const referansIslemTipleriHttp = new ReferansIslemTipi();

class ReferansParcaAdi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/parca-adi");
  }

  async updateData(mevcutParcaAdi, yeniParcaAdi) {
    const { data } = await this.service.put(this.path, { mevcutParcaAdi, yeniParcaAdi });
    return data;
  }
}
const referansParcaAdlariHttp = new ReferansParcaAdi();

export { referansIslemTipleriHttp, referansParcaAdlariHttp };
