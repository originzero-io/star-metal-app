import axios from "axios";

axios.defaults.baseURL = "http://localhost:6333";

class CRUDServerHttp {
  constructor(endPoint, rowKey) {
    this.endPoint = endPoint;
    this.rowKey = rowKey;
  }

  async getData() {
    const rawData = await axios.get(this.endPoint);
    const stateData = rawData.data[0].map((data) => ({
      key: data[this.rowKey],
      ...data,
    }));
    return stateData;
  }

  async addData(data) {
    await axios.post(this.endPoint, data);
  }

  async updateData(dataArray, newData) {
    await axios.put(this.endPoint, newData);

    const updatedData = dataArray.map((data) => {
      if (data.id === newData.id) {
        return { key: newData.id, ...newData };
      }
      return data;
    });
    return updatedData;
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
}

export default CRUDServerHttp;
