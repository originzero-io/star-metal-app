import BaseHttp from "./base.http";

class LogoGoApi extends BaseHttp {
  constructor() {
    super();
    this.service = this.createService("Logo", "http://192.168.1.254:6311");
  }

  // path: string
  async getData(path) {
    const rawData = await this.service.get(`/${path}`);
    return rawData.data;
  }

  // path: string, data: object
  // return logoRef
  async postData(path, data) {
    // Yeni bir obje oluştur ve anahtarların ilk harfini büyük yap
    const capitalizedData = Object.keys(data).reduce((acc, key) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      acc[capitalizedKey] = data[key];
      return acc;
    }, {});

    const rawData = await this.service.post(`/${path}`, capitalizedData);
    return rawData.data;
  }

  async putData(path, data) {
    const rawData = await this.service.put(`/${path}`, data);
    return rawData.data;
  }

  async deleteData(path, logicalref) {
    const rawData = await this.service.delete(`/${path}/${logicalref}`);
    return rawData.data;
  }
}

export default new LogoGoApi();
