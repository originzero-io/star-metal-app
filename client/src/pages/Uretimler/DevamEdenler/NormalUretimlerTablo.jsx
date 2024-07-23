import {
  CaretRightOutlined,
  CheckCircleOutlined,
  ContainerOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PrinterOutlined,
  TruckOutlined,
} from "@ant-design/icons";

import { Collapse, Tag } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
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
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import { createTableFilterFromData } from "utils/table.helper";
import ReferansResmi from "./ReferansResmi";

export default function NormalUretimlerTablo({ musteriBazliKayitlar, uretimiSilFunc }) {
  const { user } = useAuth();

  const { showPanel, showModal } = useUIContext();
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
        <Tag
          color={text && "#c1121f"}
          icon={text ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
          style={{ width: "100%", textAlign: "center" }}
        >
          {text ? "ACİL" : "NORMAL"}
        </Tag>
      ),
      filters: [
        { text: "ACİL", value: true },
        { text: "NORMAL", value: false },
      ],
      onFilter: (value, record) => record.acil === value,
      width: 100,
      fixed: "left",
    },
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      render: (text) => <IdBadge value={text} />,
      width: 70,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) => (
        <ColumnBadge
          color={record.Referanslar.siparisTipi === "SERİ" ? "volcano" : "purple"}
          value={record.Referanslar.siparisTipi}
        />
      ),
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.siparisTipi)),
      ].map((siparisTipi) => ({
        text: siparisTipi,
        value: siparisTipi,
      })),
      onFilter: (value, record) => record.Referanslar?.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 100,
    },
    {
      title: "Kodu",
      dataIndex: "kodu",
      key: "kodu",
      render: (text, record) => (
        <ColumnBadge
          color={record.Referanslar.siparisTipi === "SERİ" ? "volcano" : "purple"}
          value={record.Referanslar.kodu}
        />
      ),
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.kodu)),
      ].map((kod) => ({
        text: kod,
        value: kod,
      })),
      onFilter: (value, record) => record.Referanslar?.kodu.indexOf(value) === 0,
      filterSearch: true,
      width: 170,
    },
    {
      title: "Referans",
      dataIndex: "referansNo",
      key: "referansNo",
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => <ColumnBadge color="orange" value={text} />,
      width: 150,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "iade"),
      onFilter: (value, record) => record.iade.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "İrsaliye No",
      dataIndex: "irsaliyeNo",
      key: "irsaliyeNo",
      width: 120,
    },
    {
      title: "Gelen Tarih",
      dataIndex: "gelenTarih",
      key: "gelenTarih",
      width: 160,
    },
    {
      title: "Gelen",
      dataIndex: "gelenMiktar",
      key: "gelenMiktar",
      sorter: (a, b) => a.gelenMiktar - b.gelenMiktar,
      render: (text) => <ColumnBadge color={text > 0 ? "orange" : ""} value={text} />,
    },
    {
      title: "Giden",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text) => <ColumnBadge color={text > 0 ? "cyan" : ""} value={text} />,
    },
    {
      title: "Kalan",
      dataIndex: "kalanMiktar",
      key: "kalanMiktar",
      sorter: (a, b) => a.kalanMiktar - b.kalanMiktar,
      render: (text) => <ColumnBadge color={text > 0 ? "magenta" : ""} value={text} />,
    },
    {
      title: "Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <ColumnBadge color={text > 0 ? "purple" : ""} value={text} />,
    },
    {
      title: "Üretilmeyen",
      dataIndex: "uretilmeyenMiktar",
      key: "uretilmeyenMiktar",
      sorter: (a, b) => a.uretilmeyenMiktar - b.uretilmeyenMiktar,
      render: (text) => <ColumnBadge color={text > 0 ? "purple" : ""} value={text} />,
      width: 120,
    },
    {
      title: "Yüzey Alanı",
      // dataIndex: ["Referanslar", "referansYuzeyAlani"],
      key: "referansYuzeyAlanı",
      render: (text, record) => record.Referanslar.ReferansUretim.referansYuzeyAlani,
      width: 110,
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

  return (
    <Collapse
      bordered={false}
      size="small"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <CountBadge count={kayitlar.length} offset={[20, 6]}>
            <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
          </CountBadge>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(musteriAdi)}
            onChange={(...args) => handleTableChange(...args, index)}
            hideDefaultTitleButtons
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
                    <Tag color="orange">{miktarToplam[index].gelenMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Giden Miktar Toplam:{" "}
                    <Tag color="cyan">{miktarToplam[index].gidenMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Kalan Miktar Toplam:{" "}
                    <Tag color="magenta">{miktarToplam[index].kalanMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Üretilen Miktar Toplam:{" "}
                    <Tag color="purple">{miktarToplam[index].uretilenMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Üretilmeyen Miktar Toplam:{" "}
                    <Tag color="purple">{miktarToplam[index].uretilmeyenMiktarToplam}</Tag>
                  </span>
                </div>
              )
            }
            scroll={{ x: 1700 }}
            pagination={true}
            rowStyle={(row) => ({
              background: "#fcf8f0",
            })}
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
                      width: 1400,
                    }),
                },
                {
                  icon: <PrinterOutlined />,
                  title: "Üretim İş Emri Kartı Çıkart",
                  action: () =>
                    showModal({
                      title: "Üretim İş Emri Kartı",
                      content: <UretimIsEmriKarti record={record} />,
                      width: 1200,
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
              ],
            }}
          />
        ),
        style: collapseStyle.subCollapseItem,
      }))}
    />
  );
}
