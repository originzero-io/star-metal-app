/* eslint-disable max-classes-per-file */
import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar", "referansNo");

class ReferansIslemTipi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/islem-tipi");
  }
}
const referansIslemTipleriHttp = new ReferansIslemTipi();

class ReferansParcaAdi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/parca-adi");
  }
}
const referansIslemAdlariHttp = new ReferansParcaAdi();

export { referansIslemTipleriHttp, referansIslemAdlariHttp };
