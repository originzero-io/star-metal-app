import { notification } from "antd";
import axios from "axios";
import BaseHttp from "../base.http";

// axios.defaults.baseURL = "http://localhost:6333";

class CRUDServerHttp extends BaseHttp {
  constructor(path) {
    super();
    this.path = path;
    this.service = this.createService("http://localhost:6333");
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
// class CRUDServerHttp extends BaseHttp {
//   constructor(path, rowKey) {
//     this.path = path;
//     this.rowKey = rowKey;
//   }

//   async getData() {
//     const rawData = await axiosInstance.get(this.path);
//     // console.log("fetched data from server(raw) --> : ", rawData);
//     return rawData.data;
//   }

//   async addData(newData) {
//     try {
//       const { data } = await axiosInstance.post(this.path, newData);
//       return data;
//     } catch (error) {
//       const message = error.response.data;
//       notification.error({
//         message: "Kayıtta hata oluştu",
//         description: `${message.name} - ${Object.values(message.fields)}`,
//         duration: 5,
//       });
//       return null;
//     }
//   }

//   async updateData(entityId, newData) {
//     try {
//       const { data } = await axiosInstance.put(this.path, { id: entityId, ...newData });
//       return data;
//     } catch (error) {
//       const message = error.response.data;
//       notification.error({
//         message: "Güncellemede hata oluştu",
//         description: `${message.name} - ${Object.values(message.fields)}`,
//         duration: 5,
//       });
//       return null;
//     }
//   }

//   async deleteData(dataArray, selectedRows) {
//     await axiosInstance.delete(this.path, {
//       data: { selectedRows },
//     });

//     const newDataArray = dataArray.filter(
//       (data) => !selectedRows.some((selectedRow) => selectedRow.id === data.id),
//     );

//     return newDataArray;
//   }

//   async logoIleEsle(dataArray) {
//     try {
//       const { data } = await axiosInstance.post(`${this.path}/logo-ile-esle`, dataArray);
//       return data;
//     } catch (error) {
//       const message = error.response.data;
//       notification.error({
//         message: "Kayıtta hata oluştu",
//         description: `${message.name} - ${Object.values(message.fields)}`,
//         duration: 5,
//       });
//       return null;
//     }
//   }
// }

// export default CRUDServerHttp;
