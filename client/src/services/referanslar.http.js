import CRUDServerHttp from "./crud-server.http";

export default new CRUDServerHttp("/referanslar", "referansNo");

class ReferansIslemTipi extends CRUDServerHttp {
  constructor() {
    super("/referanslar/islem-tipi", "id");
  }
}
const referansIslemTipleriHttp = new ReferansIslemTipi();

export { referansIslemTipleriHttp };
