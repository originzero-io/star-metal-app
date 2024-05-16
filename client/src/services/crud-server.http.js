import { notification } from "antd";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:6333";

class CRUDServerHttp {
  constructor(endPoint, rowKey) {
    this.endPoint = endPoint;
    this.rowKey = rowKey;
  }

  async getData() {
    const rawData = await axios.get(this.endPoint);
    // console.log("fetched data from server(raw) --> : ", rawData);
    return rawData.data;
  }

  async addData(newData) {
    try {
      const { data } = await axios.post(this.endPoint, newData);
      return data;
    } catch (error) {
      const message = error.response.data;
      notification.error({
        message: "Kayıtta hata oluştu",
        description: `${message.name} - ${Object.values(message.fields)}`,
        duration: 5,
      });
      return null;
    }
  }

  async updateData(entityId, newData) {
    try {
      const { data } = await axios.put(this.endPoint, { id: entityId, ...newData });
      return data;
    } catch (error) {
      const message = error.response.data;
      notification.error({
        message: "Güncellemede hata oluştu",
        description: `${message.name} - ${Object.values(message.fields)}`,
        duration: 5,
      });
      return null;
    }
  }

  async deleteData(dataArray, selectedRows) {
    await axios.delete(this.endPoint, {
      data: { selectedRows },
    });

    const newDataArray = dataArray.filter(
      (data) => !selectedRows.some((selectedRow) => selectedRow.id === data.id),
    );

    return newDataArray;
  }

  async logoIleEsle(dataArray) {
    try {
      const { data } = await axios.post(`${this.endPoint}/logo-ile-esle`, dataArray);
      return data;
    } catch (error) {
      const message = error.response.data;
      notification.error({
        message: "Kayıtta hata oluştu",
        description: `${message.name} - ${Object.values(message.fields)}`,
        duration: 5,
      });
      return null;
    }
  }
}

export default CRUDServerHttp;
