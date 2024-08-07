import {
  BellFilled,
  CaretRightOutlined,
  CheckCircleFilled,
  ContainerOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PrinterOutlined,
  StarFilled,
  StarOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Collapse, Flex, Modal, Tag, Tooltip } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import ExcelButton from "components/shared/ExcelButton";
import IdBadge from "components/shared/IdBadge";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import MiktarDuzenlemeForm from "pages/Uretimler/DevamEdenler/MiktarDuzenlemeForm";
import UretimGirisi from "pages/Uretimler/DevamEdenler/UretimGirisi";
import UretimSevkiyatHareketleri from "pages/Uretimler/DevamEdenler/UretimSevkiyatHareketleri";
import { useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import { createTableFilterFromData } from "utils/table.helper";
import ReferansResmi from "./ReferansResmi";

export default function NormalUretimlerTablo({
  musteriBazliKayitlar,
  uretimiSilFunc,
  tamamlananlaraGonderFunc,
}) {
  const { user } = useAuth();

  const { showPanel, showModal, showNotification } = useUIContext();
  const { setDevamEdenUretimler } = useDBContext();

  const [miktarToplam, setMiktarToplam] = useState({});

  const handleTableChange = (pagination, filters, sorter, extra, index) => {
    const data = extra.currentDataSource.reduce(
      (acc, item) => {
        acc.gelenMiktarToplam += item.gelenMiktar || 0;
        acc.gidenMiktarToplam += item.gidenMiktar || 0;
        acc.kalanMiktarToplam += item.kalanMiktar || 0;
        acc.uretilenMiktarToplam += item.uretilenMiktar || 0;
        acc.uretilmeyenMiktarToplam += item.uretilmeyenMiktar || 0;
        return acc;
      },
      {
        gelenMiktarToplam: 0,
        gidenMiktarToplam: 0,
        kalanMiktarToplam: 0,
        uretilenMiktarToplam: 0,
        uretilmeyenMiktarToplam: 0,
      },
    );

    setMiktarToplam((prevState) => ({
      ...prevState,
      [index]: {
        state: true,
        gelenMiktarToplam: data.gelenMiktarToplam,
        gidenMiktarToplam: data.gidenMiktarToplam,
        kalanMiktarToplam: data.kalanMiktarToplam,
        uretilenMiktarToplam: data.uretilenMiktarToplam,
        uretilmeyenMiktarToplam: data.uretilmeyenMiktarToplam,
      },
    }));
  };

  const createColumnsForCustomer = (musteriAdi) => [
    {
      title: "Öncelik",
      dataIndex: "acil",
      key: "acil",
      render: (text) => (
        <Tooltip title={text ? "ACİL" : "NORMAL"}>
          <Tag
            style={{
              width: "70%",
              textAlign: "center",
              fontSize: 16,
              color: text ? "#f94242" : "#2bc03f",
              fontWeight: "bold",
              border: "none",
            }}
            icon={
              text ? (
                <BellFilled style={{ fontSize: 20 }} />
              ) : (
                <CheckCircleFilled style={{ fontSize: 20 }} />
              )
            }
          />
        </Tooltip>
      ),
      filters: [
        { text: "ACİL", value: true },
        { text: "NORMAL", value: false },
      ],
      onFilter: (value, record) => record.acil === value,
      width: 70,
      fixed: "left",
    },
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      render: (text) => <IdBadge value={text} />,
      sorter: (a, b) => a.id - b.id,
      width: 67,
    },
    {
      title: "Referans",
      dataIndex: "referansNo",
      key: "referansNo",
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => <ColumnBadge value={text} />,
      width: 120,
    },
    {
      title: "Kodu",
      dataIndex: "kodu",
      key: "kodu",
      render: (text, record) => <ColumnBadge value={record.Referanslar.kodu} />,
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.kodu)),
      ].map((kod) => ({
        text: kod,
        value: kod,
      })),
      onFilter: (value, record) => record.Referanslar?.kodu.indexOf(value) === 0,
      filterSearch: true,
      width: 135,
    },
    {
      title: "İşlem Tipi",
      // dataIndex: "referansTipi",
      render: (text, record) => record.Referanslar?.islemTipi,
      key: "islemTipi",
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.islemTipi)),
      ].map((islemTipi) => ({
        text: islemTipi,
        value: islemTipi,
      })),
      onFilter: (value, record) => record.Referanslar?.islemTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 90,
    },
    {
      title: "İrsaliye No",
      dataIndex: "irsaliyeNo",
      key: "irsaliyeNo",
      width: 100,
      filters: [...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.irsaliyeNo))]
        .sort((a, b) => a.localeCompare(b)) // Küçükten büyüğe sıralama
        .map((a) => ({
          text: a,
          value: a,
        })),
      onFilter: (value, record) => record.irsaliyeNo.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Gelen Tarih",
      dataIndex: "gelenTarih",
      key: "gelenTarih",
      width: 135,
    },
    {
      title: "Gelen",
      dataIndex: "gelenMiktar",
      key: "gelenMiktar",
      sorter: (a, b) => a.gelenMiktar - b.gelenMiktar,
      render: (text) => <ColumnBadge value={text} />,
      width: 90,
    },
    {
      title: "Giden",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text) => <ColumnBadge value={text} color="#ebf6e5" />,
      width: 90,
    },
    {
      title: "Kalan",
      dataIndex: "kalanMiktar",
      key: "kalanMiktar",
      sorter: (a, b) => a.kalanMiktar - b.kalanMiktar,
      render: (text) => <ColumnBadge value={text} color="#f8e9fa" />,
      width: 90,
    },
    {
      title: "Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <ColumnBadge value={text} />,
      width: 90,
    },
    {
      title: "Üretilmeyen",
      dataIndex: "uretilmeyenMiktar",
      key: "uretilmeyenMiktar",
      sorter: (a, b) => a.uretilmeyenMiktar - b.uretilmeyenMiktar,
      render: (text) => <ColumnBadge value={text} color="#f8e9fa" />,
      width: 90,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) => <ColumnBadge value={record.Referanslar.siparisTipi} />,
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.siparisTipi)),
      ].map((siparisTipi) => ({
        text: siparisTipi,
        value: siparisTipi,
      })),
      onFilter: (value, record) => record.Referanslar?.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 90,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "iade"),
      onFilter: (value, record) => record.iade.indexOf(value) === 0,
      filterSearch: true,
      width: 60,
    },
    {
      title: "Y.Alanı",
      // dataIndex: ["Referanslar", "referansYuzeyAlani"],
      key: "referansYuzeyAlanı",
      render: (text, record) => record.Referanslar.ReferansUretim.referansYuzeyAlani,
      width: 80,
    },
  ];

  const oncelikDurumunuDegistir = async (record) => {
    const yeniOncelikDurumu = record.acil ? 0 : 1;
    const updatedUretim = await devamEdenUretimHttp.oncelikAyarla(record, yeniOncelikDurumu);
    setDevamEdenUretimler((prevState) => ({
      ...prevState,
      normalUretimler: prevState.normalUretimler.map((normal) => {
        if (normal.id === updatedUretim.id) {
          return { ...updatedUretim };
        }
        return normal;
      }),
    }));
  };

  const downloadExcelHandler = (musteriAdi, dataSource) => {
    const columns = createColumnsForCustomer(musteriAdi);

    Modal.confirm({
      title: "Emin misiniz?",
      content: "Bu tablo excel formatında indirilecek.",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        try {
          const header = columns.map((column) => column.title);

          const body = dataSource.map((data) => ({
            acil: data.acil ? "ACİL" : "NORMAL",
            id: data.id,
            referansNo: data.referansNo,
            kodu: data.Referanslar.kodu,
            islemTipi: data.Referanslar.islemTipi,
            irsaliyeNo: data.irsaliyeNo,
            gelenTarih: data.gelenTarih,
            gelenMiktar: data.gelenMiktar,
            gidenMiktar: data.gidenMiktar,
            kalanMiktar: data.kalanMiktar,
            uretilenMiktar: data.uretilenMiktar,
            uretilmeyenMiktar: data.uretilmeyenMiktar,
            siparisTipi: data.Referanslar.siparisTipi,
            iade: data.iade,
            referansYuzeyAlani: data.Referanslar.ReferansUretim.referansYuzeyAlani,
          }));

          downloadExcel({
            fileName: `DEVAM EDENLER-${musteriAdi}.xls`,
            tablePayload: {
              header,
              body,
            },
          });
          showNotification("success", "Excel başarıyla indirildi");
        } catch (error) {
          showNotification("error", `Dosya indirilirken hata: ${error.message}`);
        }
      },
    });
  };

  return (
    <Collapse
      bordered={false}
      size="small"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Flex align="center">
              <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
              <CountBadge>{kayitlar.length}</CountBadge>
            </Flex>
            {user.yetki !== "operator" && (
              <ExcelButton
                onClick={(e) => {
                  e.stopPropagation();
                  downloadExcelHandler(musteriAdi, kayitlar);
                }}
              />
            )}
          </div>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(musteriAdi)}
            onChange={(...args) => handleTableChange(...args, index)}
            rowStyle={(row) =>
              row.acil && {
                background: "#fadddd",
              }
            }
            footer={
              miktarToplam[index]?.state && (
                <div
                  style={{
                    fontSize: "13px",
                    marginTop: 14,
                  }}
                >
                  <span>
                    Gelen Miktar Toplam:{" "}
                    <ColumnBadge
                      value={miktarToplam[index].gelenMiktarToplam}
                      width="70px"
                      textAlign="center"
                    />
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Giden Miktar Toplam:{" "}
                    <ColumnBadge
                      color="#ebf6e5"
                      value={miktarToplam[index].gidenMiktarToplam}
                      width="70px"
                      textAlign="center"
                    />
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Kalan Miktar Toplam:
                    <ColumnBadge
                      color="#f8e9fa"
                      value={miktarToplam[index].kalanMiktarToplam}
                      width="70px"
                      textAlign="center"
                    />
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Üretilen Miktar Toplam:{" "}
                    <ColumnBadge
                      value={miktarToplam[index].uretilenMiktarToplam}
                      width="70px"
                      textAlign="center"
                    />
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Üretilmeyen Miktar Toplam:{" "}
                    <ColumnBadge
                      color="#f8e9fa"
                      value={miktarToplam[index].uretilmeyenMiktarToplam}
                      width="70px"
                      textAlign="center"
                    />
                  </span>
                </div>
              )
            }
            scroll={{ x: 1500 }}
            pagination={false}
            contextMenu={{
              deleteAction: uretimiSilFunc,
              extraItems: (record) => [
                user.yetki !== "operator" && {
                  icon: <ExclamationCircleOutlined />,
                  title: record.acil ? "Acilliği Kaldır" : "Acil Olarak İşaretle",
                  action: () => oncelikDurumunuDegistir(record),
                },
                {
                  icon: <ContainerOutlined />,
                  title: "Üretim Girişi Yap",
                  action: () =>
                    showPanel({
                      title: "Üretim Girişi",
                      content: <UretimGirisi record={record} />,
                      width: 800,
                    }),
                },
                {
                  icon: <TruckOutlined />,
                  title: "Üretim / Sevkiyat Hareketleri",
                  action: () =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <UretimSevkiyatHareketleri record={record} />,
                      width: 1500,
                    }),
                },
                {
                  icon: <PrinterOutlined />,
                  title: "Üretim İş Emri Kartı Çıkart",
                  action: () =>
                    showModal({
                      title: "Üretim İş Emri Kartı",
                      content: <UretimIsEmriKarti record={record} />,
                      width: 1400,
                    }),
                },
                user.yetki !== "operator" && {
                  icon: <EditOutlined />,
                  title: "Gelen Malzeme Miktarını Değiştir",
                  action: () =>
                    showModal({
                      title: "Gelen Malzeme Miktarını Düzenle",
                      content: <MiktarDuzenlemeForm record={record} />,
                      width: 400,
                    }),
                },
                {
                  icon: <EyeOutlined />,
                  title: "Referans Resmini Göster",
                  action: () =>
                    showModal({
                      title: `Referans No: ${record.referansNo} `,
                      content: <ReferansResmi record={record} />,
                      width: 2000,
                    }),
                },
                user.yetki === "admin" &&
                  record.gelenMiktar === record.gidenMiktar && {
                    icon: <CaretRightOutlined style={{ color: "purple" }} />,
                    title: (
                      <div style={{ color: "purple", fontWeight: "bold" }}>
                        Tamamlananlara Gönder
                      </div>
                    ),
                    action: () => tamamlananlaraGonderFunc(record),
                  },
              ],
            }}
          />
        ),
        style: collapseStyle.subCollapseItem,
      }))}
    />
  );
}
