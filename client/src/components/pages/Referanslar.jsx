import { Button, Modal } from "antd";
import { useMemo, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import YeniReferansForm from "components/forms/YeniReferansForm";
import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../shared/TableGod";
import { useDBContext } from "context/DBProvider";
import referanslarHttp from "services/referanslar.http";

// const referansData = [];

// for (let i = 0; i < 4; i++) {
//   referansData.push({
//     key: i,
//     referansNo: `${i}1000256K`,
//     siparisNo: `270 71 0${i}`,
//     islemAciklama: "Çinko Fosfat",
//     irsaliyeAciklama: "006.0226 çinko fosfat",
//     hesaplama: "0.0002",
//     partiAdedi: 5,
//     referansYuzeyAlani: 10.9,
//     firmaAdi01: "Valeo",
//     birim: "kg",
//     firmaAdi02: "270 00 02",
//     islemTipi: "Fosfat",
//     uretimAdediDegistirme: "Hayır",
//   });
// }

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal, showNotification } = useUIContext();
  const { referanslar, setReferanslar } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(referanslar, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        filters: createTableFilterFromData(referanslar, "siparisNo"),
        onFilter: (value, record) => record.siparisNo.indexOf(value) === 0,
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
        dataIndex: "irsaliyeAciklama",
        key: "irsaliyeAciklama",
        // width: 300,
      },

      {
        title: "Hesaplama",
        dataIndex: "hesaplama",
        key: "hesaplama",
      },
    ],
    [referanslar],
  );

  const rowSelection = {
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      setSelectedRows(_selectedRows);
    },
  };
  const deleteSelectedRecordsHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili referansları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newReferanslar = await referanslarHttp.deleteReferans(referanslar, selectedRows);
          setReferanslar(newReferanslar);
          showNotification("success", "Seçili referanslar silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.referansNo} referansını silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newReferanslar = await referanslarHttp.deleteReferans(referanslar, [record]);
          setReferanslar(newReferanslar);
          showNotification("success", `${record.referansNo} referansı silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
      // onCancel() {
      //   console.log("Hayır, vazgeçtim");
      // },
    });
  };
  return (
    <TableGod
      dataSource={referanslar}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: YeniReferansForm,
        deleteAction: deleteSingleRecordHandler,
      }}
      actionButtons={
        <>
          {selectedRows.length > 0 && (
            <Button
              style={{ marginRight: "4px" }}
              danger
              icon={<MdOutlineDelete />}
              onClick={deleteSelectedRecordsHandler}
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
