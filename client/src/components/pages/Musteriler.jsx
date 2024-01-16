import { Button, Modal } from "antd";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import YeniMusteriForm from "components/forms/YeniMusteriForm";
import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../shared/TableGod";

const data = [];
for (let i = 0; i < 4; i++) {
  data.push({
    key: i,
    musteriAdi1: "BELTAN VİBRAACOUSTİC A.Ş.",
    musteriAdi2: `270 71 0${i}`,
    adres1: "BTSO ORG. SAN. BÖLGESİ",
    adres2: "SARI CADDE NO:10",
    il: "BURSA",
    ilce: "OSMANGAZI",
    vergiDairesi: "E.GAZİ",
    vergiHesapNo: "1630026175",
  });
}

const columns = [
  {
    title: "Müşteri Adı - 1",
    dataIndex: "musteriAdi1",
    key: "musteriAdi1",
    filters: createTableFilterFromData(data, "musteriAdi1"),
    onFilter: (value, record) => record.musteriAdi1.indexOf(value) === 0,
    filterSearch: true,
    width: 200,
  },
  {
    title: "Müşteri Adı - 2",
    dataIndex: "musteriAdi2",
    key: "musteriAdi2",
    filters: createTableFilterFromData(data, "musteriAdi2"),
    onFilter: (value, record) => record.musteriAdi2.indexOf(value) === 0,
    filterSearch: true,
    width: 120,
  },
  {
    title: "Adres - 1",
    dataIndex: "adres1",
    key: "adres1",
    filters: createTableFilterFromData(data, "adres1"),
    onFilter: (value, record) => record.adres1.indexOf(value) === 0,
    filterSearch: true,
    width: 200,
  },
  {
    title: "Adres - 2",
    dataIndex: "adres2",
    key: "adres2",
    width: 200,
  },

  {
    title: "İl",
    dataIndex: "il",
    key: "il",
    filters: createTableFilterFromData(data, "il"),
    onFilter: (value, record) => record.il.indexOf(value) === 0,
    filterSearch: true,
    width: 80,
  },
  {
    title: "İlçe",
    dataIndex: "ilce",
    key: "ilce",
    width: 100,
  },
  {
    title: "Vergi Dairesi",
    dataIndex: "vergiDairesi",
    key: "vergiDairesi",
    width: 100,
  },
  {
    title: "Vergi Hesap No",
    dataIndex: "vergiHesapNo",
    key: "vergiHesapNo",
    width: 150,
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Musteriler() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal } = useUIContext();

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
      dataSource={data}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: YeniMusteriForm,
      }}
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
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<IoIosAddCircleOutline />}
            onClick={() => showModal({ title: "Yeni Müşteri", content: <YeniMusteriForm /> })}
          >
            Yeni Müşteri
          </Button>
        </>
      }
    />
  );
}

export default Musteriler;
