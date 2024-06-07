import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import LogoSyncButton from "components/shared/LogoSyncButton";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ReferansForm from "pages/Tanimlamalar/Referanslar/ReferansForm";
import { useMemo, useState } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import referanslarHttp, {
  referansIslemTipleriHttp,
  referansParcaAdlariHttp,
} from "services/crud-server/referanslar.http";
import logoGoApi from "services/logoGoApi";
import { createTableFilterFromData } from "utils/table.helper";
import IdBadge from "components/shared/IdBadge";
import ColumnBadge from "components/shared/ColumnBadge";
import TableGod from "../../../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const {
    referanslar,
    setReferanslar,
    setReferansIslemTipleri,
    setReferansParcaAdlari,
    setReferansAnaBirimleri,
  } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Logo Ana Birim Ref",
        dataIndex: "logoAnaBirimRef",
        key: "logoAnaBirimRef",
        render: (text) => <IdBadge value={text} />,
      },
      {
        title: "Logo Malzeme Ref",
        dataIndex: "logoMalzemeRef",
        key: "logoMalzemeRef",
        render: (text) => <IdBadge value={text} />,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(referanslar, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag color="orange" style={{ width: "100%", fontSize: "12px" }}>
            {text}
          </Tag>
        ),
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
        filters: createTableFilterFromData(referanslar, "irsaliyeAciklamasi"),
        onFilter: (value, record) => record.irsaliyeAciklamasi.indexOf(value) === 0,
        filterSearch: true,
        width: 300,
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
        title: "Fason",
        dataIndex: "fason",
        key: "fason",
        render: (text, record) =>
          record.fason ? <Tag color="green">Evet</Tag> : <Tag color="red">Hayır</Tag>,
        filters: [
          { text: "Evet", value: 1 },
          { text: "Hayır", value: 0 },
        ],
        onFilter: (value, record) => {
          // value değeri string olarak geliyor, bu yüzden boolean'a çevirmemiz gerekiyor.
          const filterValue = value;
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
        render: (text, record) => <Tag color="blue">{record.islemTipi}</Tag>,
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

  const logoSync = async () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Referanslar, Referans Parça İsimleri ve Kaplama Cinsi ve Ana Birim bilgileri logo programından çekilip bu programa aktarılacak. Onaylıyor musunuz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        //! buralar logodan 500 dönüyor
        // const logoParcaAdlari = await logoGoApi.getData("GetParcaAdiList");
        // const newParcaAdlari = await referansParcaAdlariHttp.logoIleEsle(logoParcaAdlari);
        // setReferansParcaAdlari(newParcaAdlari);
        // showNotification("success", "Referans parça adları logo ile eşlendi.");

        // const logoIslemTipleri = await logoGoApi.getData("GetIslemTipiList");
        // const newIslemTipleri = await referansIslemTipleriHttp.logoIleEsle(logoIslemTipleri);
        // setReferansIslemTipleri(newIslemTipleri);
        // showNotification("success", "Referans işlem tipleri logo ile eşlendi.");

        const logoAnaBirimler = await logoGoApi.getData("GetAnaBirimList");
        console.log("logoAnaBirimler", logoAnaBirimler);
        setReferansAnaBirimleri(logoAnaBirimler);
        showNotification("success", "Referans ana birimleri logo ile eşlendi.");

        const logoReferanslar = await logoGoApi.getData("GetReferansList");
        console.log("logoReferanslar", logoReferanslar);
        setReferanslar(logoReferanslar);
        showNotification("success", "Referanslar logo ile eşlendi.");
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  return (
    <div>
      <PageHeader
        label="Referanslar"
        icon={<MdOutlineDocumentScanner />}
        dataLength={referanslar.length}
      />
      <TableGod
        dataSource={referanslar}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={true}
        scroll={{ x: 1800 }}
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
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Referans Ekle", content: <ReferansForm /> })}
                >
                  Referans Ekle
                </Button>
                <LogoSyncButton onClick={logoSync} />
              </>
            )}
          </>
        }
      />
    </div>
  );
}

export default Referanslar;
