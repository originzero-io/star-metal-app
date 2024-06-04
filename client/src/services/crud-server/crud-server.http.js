import getUrlByEnvVariables from "utils/getServerUrl";
import BaseHttp from "../base.http";

class CRUDServerHttp extends BaseHttp {
  constructor(path) {
    super();
    this.path = path;
    this.service = this.createService(getUrlByEnvVariables());
  }

  async getData() {
    const rawData = await this.service.get(this.path);
    // console.log("fetched data from server(raw) --> : ", rawData);
    return rawData.data;
  }

  async addData(newData) {
    const { data } = await this.service.post(this.path, newData);
    return data;
  }

  async updateData(entityId, newData) {
    const { data } = await this.service.put(this.path, { id: entityId, ...newData });
    return data;
  }

  async deleteData(dataArray, selectedRows) {
    await this.service.delete(this.path, {
      data: { selectedRows },
    });

    const newDataArray = dataArray.filter(
      (data) => !selectedRows.some((selectedRow) => selectedRow.id === data.id),
    );

    return newDataArray;
  }

  async logoIleEsle(dataArray) {
    const { data } = await this.service.post(`${this.path}/logo-ile-esle`, dataArray);
    return data;
  }
}

export default CRUDServerHttp;
