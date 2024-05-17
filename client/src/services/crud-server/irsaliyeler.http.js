import axios from "axios";
import CRUDServerHttp from "./crud-server.http";

// export default new CRUDServerHttp("/irsaliyeler", "id");

class Irsaliye extends CRUDServerHttp {
  constructor() {
    super("/irsaliyeler");
  }

  async fasonaIrsaliyeKes(irsaliyeKaydi = []) {
    const rawData = await axios.post(`${this.path}/fasona`, irsaliyeKaydi);
    return rawData.data;
  }

  async eIrsaliyeKes(dataArray, selectedRows) {
    await axios.post(`${this.path}/e-irsaliye-kes`, selectedRows);

    const newDataArray = dataArray.filter(
      (data) => !selectedRows.some((selectedRow) => selectedRow.id === data.id),
    );

    return newDataArray;
  }
}

const irsaliyeHttp = new Irsaliye();
export default irsaliyeHttp;
