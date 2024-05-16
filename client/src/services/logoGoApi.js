import axios from "axios";

class LogoGoApi {
  logoApiUrl = "http://192.168.1.254:6311";

  async getData(path) {
    const rawData = await axios.get(`${this.logoApiUrl}/${path}`);
    return rawData.data;
  }
}

export default new LogoGoApi();
