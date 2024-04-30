import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import ReferansForm from "components/forms/ReferansForm";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import referanslarHttp from "services/referanslar.http";
import { createTableFilterFromData } from "utils/table.helper";
import PageHeader from "components/shared/PageHeader";
import { MdOutlineDocumentScanner } from "react-icons/md";
import TableGod from "../components/shared/TableGod";
import { useAuth } from "context/AuthProvider";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
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
        title: "Parça Adı",
        dataIndex: "parcaAdi",
        key: "parcaAdi",
        filters: createTableFilterFromData(referanslar, "parcaAdi"),
        onFilter: (value, record) => record.parcaAdi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Müşteri",
        dataIndex: "musteriAdi",
        key: "musteriAdi",
        filters: createTableFilterFromData(referanslar, "musteriAdi"),
        onFilter: (value, record) => record.musteriAdi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "İrsaliye Açıklaması",
        dataIndex: "irsaliyeAciklamasi",
        key: "irsaliyeAciklamasi",
      },
      {
        title: "Çıkış Referans No",
        dataIndex: "cikisReferansNo",
        key: "cikisReferansNo",
        filters: createTableFilterFromData(referanslar, "cikisReferansNo"),
        onFilter: (value, record) => record.cikisReferansNo.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        filters: createTableFilterFromData(referanslar, "siparisTipi"),
        render: (text, record) =>
          text === "Seri" ? <Tag color="volcano">{text}</Tag> : <Tag color="purple">{text}</Tag>,
        onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        filters: createTableFilterFromData(referanslar, "siparisNo"),
        onFilter: (value, record) => {
          const siparisNo = record.siparisNo ?? "Boş";
          return siparisNo.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Talep No",
        dataIndex: "talepNo",
        key: "talepNo",
        filters: createTableFilterFromData(referanslar, "talepNo"),
        onFilter: (value, record) => {
          const talepNo = record.talepNo ?? "Boş";
          return talepNo.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Fason",
        dataIndex: "fason",
        key: "fason",
        render: (text, record) =>
          record.fason ? <Tag color="green">Evet</Tag> : <Tag color="orange">Hayır</Tag>,
        filters: [
          { text: "Evet", value: "true" },
          { text: "Hayır", value: "false" },
        ],
        onFilter: (value, record) => {
          // value değeri string olarak geliyor, bu yüzden boolean'a çevirmemiz gerekiyor.
          const filterValue = value === "true";
          return record.fason === filterValue;
        },
        filterSearch: true,
      },
      {
        title: "Fason Firması",
        dataIndex: "fasonFirmasi",
        key: "fasonFirmasi",
        filters: createTableFilterFromData(referanslar, "fasonFirmasi"),
        onFilter: (value, record) => {
          const fasonFirmasi = record.fasonFirmasi ?? "Boş";
          return fasonFirmasi.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Miktar Sapması",
        dataIndex: "miktarSapmasi",
        key: "miktarSapmasi",
      },
      {
        title: "Lot Adedi",
        dataIndex: "lotAdedi",
        key: "lotAdedi",
      },
      {
        title: "Yüzey Alanı",
        dataIndex: "referansYuzeyAlani",
        key: "referansYuzeyAlani",
      },
      {
        title: "İşlem Tipi",
        dataIndex: "islemTipi",
        key: "islemTipi",
        filters: createTableFilterFromData(referanslar, "islemTipi"),
        onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Birim",
        dataIndex: "birim",
        key: "birim",
        filters: createTableFilterFromData(referanslar, "birim"),
        onFilter: (value, record) => record.birim.indexOf(value) === 0,
        filterSearch: true,
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
    <div>
      <PageHeader label="Referanslar" icon={<MdOutlineDocumentScanner />} />
      <TableGod
        dataSource={referanslar}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
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
            {user.yetki === "admin" && (
              <Button
                style={{ marginRight: "4px" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showPanel({ title: "Referans Ekle", content: <ReferansForm /> })}
              >
                Referans Ekle
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}

export default Referanslar;
