import { Button, Modal } from "antd";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import YeniReferansForm from "components/forms/YeniReferansForm";
import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../shared/TableGod";

export const referansData = [];

for (let i = 0; i < 4; i++) {
  referansData.push({
    key: i,
    referansNo: `${i}1000256K`,
    siparisNo: `270 71 0${i}`,
    islemAciklama: "Çinko Fosfat",
    aciklama: "006.0226 çinko fosfat",
    hesaplama: "0.0002",
    partiAdedi: 5,
    referansYuzeyAlani: 10.9,
    firmaAdi01: "Valeo",
    birim: "kg",
    firmaAdi02: "270 00 02",
    islemTipi: "Fosfat",
    uretimAdediDegistirme: "Hayır",
  });
}

const columns = [
  {
    title: "Referans No",
    dataIndex: "referansNo",
    key: "referansNo",
    filters: createTableFilterFromData(referansData, "referansNo"),
    onFilter: (value, record) => record.musteriAdi1.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "Sipariş No",
    dataIndex: "siparisNo",
    key: "siparisNo",
    filters: createTableFilterFromData(referansData, "siparisNo"),
    onFilter: (value, record) => record.musteriAdi2.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "İşlem Açıklaması",
    dataIndex: "islemAciklama",
    key: "adres1",
    // width: 250,
  },
  {
    title: "İrsaliye için Açıklama",
    dataIndex: "aciklama",
    key: "aciklama",
    // width: 300,
  },

  {
    title: "Hesaplama",
    dataIndex: "hesaplama",
    key: "hesaplama",
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
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
      dataSource={referansData}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: YeniReferansForm,
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
            onClick={() => showModal({ title: "Yeni Referans", content: <YeniReferansForm /> })}
          >
            Yeni Referans
          </Button>
        </>
      }
    />
  );
}

export default Referanslar;
