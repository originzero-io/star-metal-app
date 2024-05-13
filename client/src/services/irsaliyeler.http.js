import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

// export default new CRUDServerHttp("/irsaliyeler", "id");

class Irsaliye extends CRUDServerHttp {
  constructor() {
    super("/irsaliyeler", "id");
  }

  // devam eden üretimler üzerinden
  async fasonlaraIrsaliyeKes(irsaliyeKaydi = []) {
    const rawData = await axios.post(`${this.endPoint}/fasona`, irsaliyeKaydi);
    return rawData.data;
  }

  async eIrsaliyeKes(dataArray, selectedRows) {
    await axios.post(`${this.endPoint}/e-irsaliye-kes`, selectedRows);

    const newDataArray = dataArray.filter(
      (data) => !selectedRows.some((selectedRow) => selectedRow.id === data.id),
    );

    return newDataArray;
  }
}

const irsaliyeHttp = new Irsaliye();
export default irsaliyeHttp;
