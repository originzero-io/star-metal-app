/* eslint-disable max-classes-per-file */
import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar", "referansNo");

class ReferansIslemTipi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/islem-tipi", "id");
  }
}
const referansIslemTipleriHttp = new ReferansIslemTipi();

class ReferansParcaAdi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/parca-adi", "id");
  }
}
const referansIslemAdlariHttp = new ReferansParcaAdi();

export { referansIslemTipleriHttp, referansIslemAdlariHttp };
