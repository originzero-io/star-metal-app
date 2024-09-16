import BaseHttp from "./base.http";

class KantarApi extends BaseHttp {
  constructor() {
    super();
    this.service = this.createService("Kantar", "http://192.168.1.2:3001");
  }

  async getData() {
    const rawData = await this.service.get(`/kantar-oku`);
    return rawData.data;
  }
}

export default new KantarApi();
