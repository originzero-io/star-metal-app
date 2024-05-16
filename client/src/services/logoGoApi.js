import BaseHttp from "./base.http";

class LogoGoApi extends BaseHttp {
  constructor() {
    super();
    this.service = this.createService("http://192.168.1.254:6311");
  }

  async getData(path) {
    const rawData = await this.service.get(`/${path}`);
    return rawData.data;
  }
}

export default new LogoGoApi();
