import { Button, Modal, Tag } from "antd";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";

import { getCurrentDateTime } from "utils/time.helper";
import TableGod from "../shared/TableGod";
import { createTableFilterFromData } from "utils/table.helper";

export const sicaklikData = [];

for (let i = 0; i < 19; i++) {
  sicaklikData.push({
    key: i,
    banyoKodu: `B-${i}`,
    tarih: getCurrentDateTime(),
    saat: getCurrentDateTime(),
    sicaklik: Math.round((Math.random() * (50 - 25) + 25) * 10) / 10,
  });
}

const columns = [
  {
    title: "Banyo Kodu",
    dataIndex: "banyoKodu",
    key: "banyoKodu",
    filters: createTableFilterFromData(sicaklikData, "banyoKodu"),
    onFilter: (value, record) => record.banyoKodu.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "Tarih",
    dataIndex: "tarih",
    key: "tarih",
    filters: createTableFilterFromData(sicaklikData, "tarih"),
    onFilter: (value, record) => record.tarih.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "Saat",
    dataIndex: "saat",
    key: "saat",
    filters: createTableFilterFromData(sicaklikData, "saat"),
    onFilter: (value, record) => record.saat.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "Sıcaklık Değeri",
    dataIndex: "sicaklik",
    key: "sicaklik",
    render: (text) => (
      <Tag color="#f50" style={{ width: "40px", textAlign: "center" }}>
        {text}
      </Tag>
    ),
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Sicakliklar() {
  const [selectedRows, setSelectedRows] = useState([]);

  const rowSelection = {
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      setSelectedRows(_selectedRows);
    },
  };

  const deleteRecordHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        console.log("Evet, eminim");
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };
  return (
    <TableGod
      dataSource={sicaklikData}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      //   contextMenu={{
      //     editForm: YeniSicaklikForm,
      //   }}
      actionButtons={
        <>
          {selectedRows.length > 0 && (
            <Button
              style={{ marginRight: "4px" }}
              danger
              icon={<MdOutlineDelete />}
              onClick={deleteRecordHandler}
            >
              Sil ({selectedRows.length})
            </Button>
          )}
        </>
      }
    />
  );
}

export default Sicakliklar;
