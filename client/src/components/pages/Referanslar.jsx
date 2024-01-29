import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import ReferansForm from "components/forms/ReferansForm";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useMemo, useState } from "react";
import referanslarHttp from "services/referanslar.http";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../shared/TableGod";

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
        title: "Firma Adı",
        dataIndex: "firmaAdi01",
        key: "firmaAdi01",
        filters: createTableFilterFromData(referanslar, "firmaAdi01"),
        onFilter: (value, record) => record.firmaAdi01.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Lot Adedi",
        dataIndex: "lotAdedi",
        key: "lotAdedi",
        filters: createTableFilterFromData(referanslar, "lotAdedi"),
        onFilter: (value, record) => record.lotAdedi === value,
        filterSearch: true,
      },
      {
        title: "Miktar Sapması",
        dataIndex: "miktarSapmasi",
        key: "miktarSapmasi",
        filters: createTableFilterFromData(referanslar, "miktarSapmasi"),
        onFilter: (value, record) => record.miktarSapmasi === value,
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
        title: "Yüzey Alanı",
        dataIndex: "referansYuzeyAlani",
        key: "referansYuzeyAlani",
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
          const newReferanslar = await referanslarHttp.deleteData(referanslar, selectedRows);
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
          const newReferanslar = await referanslarHttp.deleteData(referanslar, [record]);
          setReferanslar(newReferanslar);
          showNotification("success", `${record.referansNo} referansı silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };
  return (
    <TableGod
      dataSource={referanslar}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: ReferansForm,
        deleteAction: deleteSingleRecordHandler,
      }}
      actionButtons={
        <>
          {selectedRows.length > 0 && (
            <Button
              style={{ marginRight: "4px" }}
              danger
              icon={<DeleteOutlined />}
              onClick={deleteSelectedRecordsHandler}
            >
              Sil ({selectedRows.length})
            </Button>
          )}
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal({ title: "Yeni Referans", content: <ReferansForm /> })}
          >
            Yeni Referans
          </Button>
        </>
      }
    />
  );
}

export default Referanslar;
