import { DeleteOutlined, EyeOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Tag, Tooltip } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ReferansForm from "pages/Tanimlamalar/Referanslar/ReferansForm";
import { useMemo, useState } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import referanslarHttp, { referansUretimHttp } from "services/crud-server/referanslar.http";
import logoGoApi from "services/logoGoApi";
import styled from "styled-components";
import getUrlByEnvVariables from "utils/getServerUrl";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../../../components/shared/TableGod";

const LogoSyncButton = styled(Button)`
  background: linear-gradient(135deg, #b1e6bc 58%, #a4e5b1 100%);

  color: #090909;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 1.4vmin;
  margin-bottom: 6px;
  padding: 2px 15px;
  border: 1px solid rgb(73, 171, 66);
  position: absolute;
  left: 4px;

  &:hover {
    background: linear-gradient(135deg, #ceecd4 58%, #b6e9c1 100%);
    color: black !important;
    border: 1px solid rgb(73, 171, 66) !important;
  }
`;

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
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        render: (text) => <ColumnBadge value={text} />,
        filters: createTableFilterFromData(referanslar, "kodu"),
        onFilter: (value, record) => {
          const kodu = record.kodu ?? "Boş";
          return kodu.indexOf(value) === 0;
        },
        filterSearch: true,
        width: 150,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        filters: createTableFilterFromData(referanslar, "siparisTipi"),
        render: (text) => <ColumnBadge value={text} />,
        onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
        width: 100,
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
        render: (text) => <ColumnBadge value={text || "Boş"} />,
        width: 120,
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
          <Tooltip title={text}>
            <Tag
              style={{
                width: "120px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                background: "#d8f4fc",
                fontWeight: "600",
              }}
            >
              {text}
            </Tag>
          </Tooltip>
        ),
        width: 120,
      },
      {
        title: "Parça Adı",
        dataIndex: "parcaAdi",
        key: "parcaAdi",
        filters: createTableFilterFromData(referanslar, "parcaAdi"),
        onFilter: (value, record) => record.parcaAdi.indexOf(value) === 0,
        filterSearch: true,
        width: 100,
      },
      {
        title: "İrsaliye Açıklaması",
        dataIndex: "irsaliyeAciklamasi",
        key: "irsaliyeAciklamasi",
        filters: createTableFilterFromData(referanslar, "irsaliyeAciklamasi"),
        onFilter: (value, record) => record.irsaliyeAciklamasi.indexOf(value) === 0,
        filterSearch: true,
        width: 200,
      },
      {
        title: "Fason",
        dataIndex: "fason",
        key: "fason",
        render: (text, record) =>
          record.fason ? (
            <ColumnBadge color="#e2f9e9" value="FASON" />
          ) : (
            <ColumnBadge color="#f3f3f3" value="DEĞİL" />
          ),
        filters: [
          { text: "FASON", value: 1 },
          { text: "FASON DEĞİL", value: 0 },
        ],
        onFilter: (value, record) => {
          // value değeri string olarak geliyor, bu yüzden boolean'a çevirmemiz gerekiyor.
          const filterValue = value;
          return record.fason === filterValue;
        },
        filterSearch: true,
        width: 80,
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
        render: (text) =>
          text && (
            <Tooltip title={text}>
              <Tag
                style={{
                  width: "120px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  background: "#fce2d8",
                  fontWeight: "bold",
                }}
              >
                {text}
              </Tag>
            </Tooltip>
          ),
        filterSearch: true,
        width: 120,
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
        width: 130,
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
        width: 120,
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
        width: 110,
      },
      {
        title: "İşlem Tipi",
        dataIndex: "islemTipi",
        key: "islemTipi",
        render: (text) => <ColumnBadge value={text} />,
        filters: createTableFilterFromData(referanslar, "islemTipi"),
        onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
        filterSearch: true,
        width: 110,
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
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Bunu yaptığınızda logodan tüm referans kayıtları alınıp bu programa aktarılacak. Bunu logo programından bir referans değiştirdiğinizde yapın. ",
      okText: "Eminim",
      cancelText: "İptal",
      async onOk() {
        try {
          showNotification("info", "Referanslar ve alt bilgiler logo ile eşitleniyor...");

          const logoReferanslar = await logoGoApi.getData("GetReferansList");
          const combinedReferanslar = await referanslarHttp.logoIleEsle(logoReferanslar);

          // logodan girilmiş verilere ait referans üretim bilgilerinin doldurulması
          await referansUretimHttp.logoIleEsle(logoReferanslar);

          setReferanslar(combinedReferanslar);
          showNotification(
            "success",
            `${logoReferanslar.length} adet referans logo ile eşitlendi.`,
          );

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
            <LogoSyncButton onClick={logoIleEsle} icon={<SyncOutlined />}>
              Logo ile Eşitle
            </LogoSyncButton>
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
