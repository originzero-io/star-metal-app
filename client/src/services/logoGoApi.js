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

  async postData(path, data) {
    // Yeni bir obje oluştur ve anahtarların ilk harfini büyük yap
    const capitalizedData = Object.keys(data).reduce((acc, key) => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      acc[capitalizedKey] = data[key];
      return acc;
    }, {});

    // Query parametrelerini oluştur
    const queryParams = new URLSearchParams(capitalizedData).toString();
    const url = `/${path}?${queryParams}`;

    const rawData = await this.service.post(url);
    return rawData.data;
    // eklenen kayıdın logicalref değeri dönüyor
  }
}

export default new LogoGoApi();
