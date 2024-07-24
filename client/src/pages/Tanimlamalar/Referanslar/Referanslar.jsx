import {
  BankOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileDoneOutlined,
  PlusOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal, Tag } from "antd";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ReferansForm from "pages/Tanimlamalar/Referanslar/ReferansForm";
import { useMemo, useState } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import referanslarHttp, { referansUretimHttp } from "services/crud-server/referanslar.http";
import logoGoApi from "services/logoGoApi";
import styled, { keyframes } from "styled-components";
import getUrlByEnvVariables from "utils/getServerUrl";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../../../components/shared/TableGod";
import LogoIcon from "../../../../public/logo.png";

// Butonun parlamasını sağlayan bir animasyon
const glow = keyframes`
  0% {
    box-shadow: 0 0 15px #24cd24;
    box-shadow: 0 0 15px rgba(34, 139, 34, 0.3);
  }
  50% {
    box-shadow: 0 0 15px #24cd24;
  }
  100% {
    box-shadow: 0 0 15px #27b127;
    box-shadow: 0 0 15px rgba(34, 139, 34, 0.3);

  }
`;

// Hover ve tıklama animasyonlarını tanımlayan buton stili
const SpecialButton = styled(Button)`
  background-color: #3fad3f; /* Orta koyulukta yeşil */

  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  animation: ${glow} 1s infinite;

  // margin-right: 10px;
  position: absolute;
  left: 15px;
  &:hover {
    background: #50c350;
    color: white !important;
  }

  &:active {
    background: linear-gradient(45deg, #1a6e1a, #269926, #77dd77); /* Daha da koyu gradient */
    transform: scale(0.95);
  }
`;

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification, showModal } = useUIContext();
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
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        render: (text, record) => (
          <Tag
            color={record.siparisTipi === "SERİ" ? "volcano" : "purple"}
            icon={<FileDoneOutlined />}
            style={{ width: "100%", fontSize: "12px" }}
          >
            {text}
          </Tag>
        ),
        filters: createTableFilterFromData(referanslar, "kodu"),
        onFilter: (value, record) => {
          const kodu = record.kodu ?? "Boş";
          return kodu.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        filters: createTableFilterFromData(referanslar, "siparisTipi"),
        render: (text) =>
          text === "SERİ" ? <Tag color="volcano">{text}</Tag> : <Tag color="purple">{text}</Tag>,
        onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: [
          ...createTableFilterFromData(referanslar, "referansNo"),
          { text: "Boş", value: "Boş" },
        ],
        onFilter: (value, record) => {
          if (value === "Boş") {
            return !record.referansNo;
          }
          return record.referansNo.indexOf(value) === 0;
        },
        filterSearch: true,
        render: (text) => (
          <Tag
            color="orange"
            icon={<FileDoneOutlined />}
            style={{ width: "100%", fontSize: "12px" }}
          >
            {text || "Boş"}
          </Tag>
        ),
      },

      {
        title: "Müşteri",
        dataIndex: "musteriAdi",
        key: "musteriAdi",
        filters: [
          ...createTableFilterFromData(referanslar, "musteriAdi"),
          { text: "Boş", value: "Boş" },
        ],
        onFilter: (value, record) => {
          if (value === "Boş") {
            return !record.musteriAdi;
          }
          return record.musteriAdi.indexOf(value) === 0;
        },
        filterSearch: true,
        render: (text) => (
          <Tag icon={<BankOutlined />} color="geekblue" style={{ width: "100%", fontSize: "12px" }}>
            {text || "Boş"}
          </Tag>
        ),
        width: 170,
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
        title: "İrsaliye Açıklaması",
        dataIndex: "irsaliyeAciklamasi",
        key: "irsaliyeAciklamasi",
        filters: createTableFilterFromData(referanslar, "irsaliyeAciklamasi"),
        onFilter: (value, record) => record.irsaliyeAciklamasi.indexOf(value) === 0,
        filterSearch: true,
        width: 300,
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
        render: (value) =>
          value && (
            <Tag
              icon={<BankOutlined />}
              color="volcano"
              style={{ width: "100%", fontSize: "12px" }}
            >
              {value}
            </Tag>
          ),
        filterSearch: true,
      },
      {
        title: "Miktar Sapması",
        dataIndex: "miktarSapmasi",
        key: "miktarSapmasi",
        render: (value, record) => record.ReferansUretim?.miktarSapmasi,
        filters: [...new Set(referanslar.map((item) => item.ReferansUretim?.miktarSapmasi))].map(
          (value) => ({ text: value, value }),
        ),
        onFilter: (value, record) => {
          const miktarSapmasi = record.ReferansUretim?.miktarSapmasi ?? "Boş";
          return miktarSapmasi === value;
        },
      },
      {
        title: "Lot Adedi",
        dataIndex: "lotAdedi",
        key: "lotAdedi",
        render: (value, record) => record.ReferansUretim?.lotAdedi,
        filters: [...new Set(referanslar.map((item) => item.ReferansUretim?.lotAdedi))].map(
          (value) => ({ text: value, value }),
        ),
        onFilter: (value, record) => {
          const lotAdedi = record.ReferansUretim?.lotAdedi ?? "Boş";
          return lotAdedi === value;
        },
      },
      {
        title: "Yüzey Alanı",
        dataIndex: "referansYuzeyAlani",
        key: "referansYuzeyAlani",
        render: (value, record) => record.ReferansUretim?.referansYuzeyAlani,
        filters: [
          ...new Set(referanslar.map((item) => item.ReferansUretim?.referansYuzeyAlani)),
        ].map((value) => ({ text: value, value })),
        onFilter: (value, record) => {
          const yuzeyAlani = record.ReferansUretim?.referansYuzeyAlani ?? "Boş";
          return yuzeyAlani === value;
        },
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
          await Promise.all(
            selectedRows.map((row) => {
              logoGoApi.deleteData("DeleteReferans", row.logoMalzemeRef);
              referanslarHttp.deleteData(referanslar, [row]);
            }),
          );
          setReferanslar((prevReferanslar) =>
            prevReferanslar.filter(
              (referans) =>
                !selectedRows.map((row) => row.logoMalzemeRef).includes(referans.logoMalzemeRef),
            ),
          );

          showNotification("success", "Seçili referanslar silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
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
          await logoGoApi.deleteData("DeleteReferans", record.logoMalzemeRef);
          await referanslarHttp.deleteData(referanslar, [record]);

          setReferanslar((prevReferanslar) =>
            prevReferanslar.filter((referans) => referans.logoMalzemeRef !== record.logoMalzemeRef),
          );
          showNotification("success", `${record.referansNo} referansı silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const logoIleEsle = async () => {
    try {
      showNotification("info", "Referanslar ve alt bilgiler logo ile eşitleniyor...");

      const logoReferanslar = await logoGoApi.getData("GetReferansList");
      const combinedReferanslar = await referanslarHttp.logoIleEsle(logoReferanslar);

      // logodan girilmiş verilere ait referans üretim bilgilerinin doldurulması
      await referansUretimHttp.logoIleEsle(logoReferanslar);

      setReferanslar(combinedReferanslar);
      showNotification("success", `${logoReferanslar.length} adet referans logo ile eşitlendi.`);

      const logoParcaAdlari = await logoGoApi.getData("GetParcaAdiList");
      setReferansParcaAdlari(logoParcaAdlari);
      const logoIslemTipleri = await logoGoApi.getData("GetIslemTipiList");
      setReferansIslemTipleri(logoIslemTipleri);
      const logoAnaBirimler = await logoGoApi.getData("GetAnaBirimList");
      setReferansAnaBirimleri(logoAnaBirimler);

      showNotification("success", "Referans alt bilgileri logo ile eşitlendi.");
    } catch (error) {
      showNotification("error", "Referans verisi alınamadı", error.message);
    }
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
        rowSelection={user.yetki !== "operator" && rowSelection}
        pagination={true}
        scroll={{ x: 1800 }}
        contextMenu={{
          editForm: ReferansForm,
          deleteAction: deleteSingleRecordHandler,
          extraItems: (record) => [
            {
              icon: <EyeOutlined />,
              title: "Resmi Göster",
              action: () =>
                showModal({
                  title: `Referans No: ${record.referansNo} `,
                  content: (
                    <Flex justify="center">
                      <img
                        alt="Resim bulunamadı"
                        src={`${getUrlByEnvVariables()}/uploads/referanslar/${
                          record.ReferansUretim.resimUrl
                        }?t=${new Date().getTime()}`}
                        style={{ maxHeight: "90vh", maxWidth: "100%" }}
                      />
                    </Flex>
                  ),
                  width: 2000,
                }),
            },
          ],
        }}
        actionButtons={
          <>
            <SpecialButton
              onClick={logoIleEsle}
              icon={<SyncOutlined />}
              // icon={<img src={LogoIcon} width={35} style={{ marginRight: 5 }} />}
            >
              Logo ile Eşle
            </SpecialButton>
            {/* <Button
              style={{
                position: "absolute",
                left: 10,
                justifyContent: "center",
                alignItems: "center",
                width: "8%",
                background: "#b7e4c7",
                fontWeight: 600,
                color: "#484646",
                border: "1px solid #77b64d",
              }}
              icon={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={LogoIcon} width={35} style={{ marginRight: 5 }} />
                  <span> ile Eşle</span>
                </div>
              }
              onClick={logoIleEsle}
            /> */}
            {selectedRows.length > 0 && (
              <Button
                style={{ marginRight: "4px" }}
                danger
                icon={<DeleteOutlined />}
                onClick={deleteSelectedRecordsHandler}
              >
                Toplu Sil ({selectedRows.length})
              </Button>
            )}
            {user.yetki !== "operator" && (
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Referans Ekle", content: <ReferansForm /> })}
                >
                  Referans Ekle
                </Button>
              </>
            )}
          </>
        }
      />
    </div>
  );
}

export default Referanslar;
