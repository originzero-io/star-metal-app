import {
  CarOutlined,
  CaretRightOutlined,
  ContainerOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Collapse, Modal, Tag, Tooltip } from "antd";
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
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import { fasonaIrsaliyeKaydiOlustur } from "utils/irsaliye.helper";
import { createTableFilterFromData } from "utils/table.helper";
import ReferansResmi from "./ReferansResmi";

export default function FasonUretimlerTablo({ fasonFirmasiBazliKayitlar, uretimiSilFunc }) {
  const { user } = useAuth();

  const { irsaliyeler, setIrsaliyeler, setDevamEdenUretimler } = useDBContext();
  const { showPanel, showNotification, showAlert, showModal } = useUIContext();

  const [miktarToplam, setMiktarToplam] = useState({});

  const handleTableChange = (pagination, filters, sorter, extra, index) => {
    const data = extra.currentDataSource.reduce(
      (acc, item) => {
        acc.gelenMiktarToplam += item.gelenMiktar || 0;
        acc.fasonaGonderilenToplam += item.gidenMiktar || 0;
        acc.uretilenMiktarToplam += item.uretilenMiktar || 0;
        acc.sevkEdilenMiktarToplam += item.sevkEdilenMiktar || 0;
        return acc;
      },
      {
        gelenMiktarToplam: 0,
        fasonaGonderilenToplam: 0,
        uretilenMiktarToplam: 0,
        sevkEdilenMiktarToplam: 0,
      },
    );

    setMiktarToplam((prevState) => ({
      ...prevState,
      [index]: {
        state: true,
        gelenMiktarToplam: data.gelenMiktarToplam,
        fasonaGonderilenToplam: data.fasonaGonderilenToplam,
        uretilenMiktarToplam: data.uretilenMiktarToplam,
        sevkEdilenMiktarToplam: data.sevkEdilenMiktarToplam,
      },
    }));
  };

  const createColumnsForCustomer = (fasonFirmasi) => [
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      render: (text) => <IdBadge value={text} />,
      width: 70,
    },
    {
      title: "Müşteri",
      dataIndex: "Referanslar.musteriAdi",
      key: "fasonFirmasi",
      render: (text, record) => (
        <Tooltip title={record.Referanslar?.musteriAdi}>
          <Tag
            color="blue"
            style={{
              width: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {record.Referanslar?.musteriAdi}
          </Tag>
        </Tooltip>
      ),
      width: 120,
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
        ...new Set(
          fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.Referanslar?.siparisTipi),
        ),
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
        ...new Set(fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.Referanslar?.kodu)),
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
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => <ColumnBadge color="orange" value={text} />,
      width: 150,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "iade"),
      onFilter: (value, record) => record.iade.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "İrsaliye No",
      dataIndex: "irsaliyeNo",
      key: "irsaliyeNo",
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
      render: (text, record) =>
        record.gelenMiktar === record.gidenMiktar ? (
          <Tag color="green">{text}</Tag>
        ) : (
          <Tag>{text}</Tag>
        ),
    },
    {
      title: "Fasona Gönderilen",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text, record) =>
        record.gelenMiktar === record.gidenMiktar ? (
          <Tag color="green">{text}</Tag>
        ) : (
          <Tag>{text}</Tag>
        ),
    },
    {
      title: "Fasonda Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <Tag color={text > 0 ? "purple" : ""}>{text}</Tag>,
    },
    {
      title: "Sevk Edilen",
      dataIndex: "sevkEdilenMiktar",
      key: "sevkEdilenMiktar",
      render: (text) => <Tag color={text > 0 && "cyan"}>{text}</Tag>,
      sorter: (a, b) => a.sevkEdilenMiktar - b.sevkEdilenMiktar,
    },
    {
      title: "Yüzey Alanı",
      // dataIndex: ["Referanslar", "referansYuzeyAlani"],
      key: "referansYuzeyAlanı",
      render: (text, record) => record.Referanslar.ReferansUretim?.referansYuzeyAlani,
    },
    {
      title: "İşlem Tipi",
      // dataIndex: "referansTipi",
      render: (text, record) => <Tag color="blue">{record.Referanslar?.islemTipi}</Tag>,
      key: "islemTipi",
      filters: [
        ...new Set(
          fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.Referanslar?.islemTipi),
        ),
      ].map((islemTipi) => ({
        text: islemTipi,
        value: islemTipi,
      })),
      onFilter: (value, record) => record.Referanslar?.islemTipi.indexOf(value) === 0,
      filterSearch: true,
    },
  ];

  const fasonaIrsaliyeKes = async (record) => {
    const { fasonFirmasi: seciliFasonFirmasi } = record.Referanslar;
    Modal.confirm({
      title: "Emin misiniz?",
      content: `Seçtiğiniz ${record.referansNo} referans numaralı kayıt ${seciliFasonFirmasi} firmasına taşıma irsaliyesi kesmek için kaydedilecek. Onaylıyor musunuz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const limit = 10;

          const irsaliyeKaydi = fasonaIrsaliyeKaydiOlustur(record);

          console.log("irsaliye kaydı: ", irsaliyeKaydi);

          const { fasonFirmasi } = irsaliyeKaydi.Referanslar;

          const fasonFirmasindakiMevcutIrsaliyeler = irsaliyeler.filter(
            (irsaliye) => irsaliye.Referanslar.fasonFirmasi === fasonFirmasi,
          );

          const firmadaOlacakToplamIrsaliyeler = [
            ...fasonFirmasindakiMevcutIrsaliyeler,
            irsaliyeKaydi,
          ];

          const refBazliFirmaToplamIrsaliyeSayisi = new Set(
            firmadaOlacakToplamIrsaliyeler.map((item) => item.referansNo),
          ).size;

          if (refBazliFirmaToplamIrsaliyeSayisi <= limit) {
            await irsaliyeHttp.fasonaIrsaliyeKes(irsaliyeKaydi);
            const butunIrsaliyeler = await irsaliyeHttp.getData();
            const devamEdenUretimler = await devamEdenUretimHttp.getData();
            showNotification(
              "success",
              `Seçtiğiniz kayıtlar fason firmasına taşıma irsaliyesi kesmek için kaydedildi.`,
            );
            setDevamEdenUretimler(devamEdenUretimler);
            setIrsaliyeler(butunIrsaliyeler);
          } else {
            showAlert(
              "error",
              `İrsaliye kesilemedi. Bu referansları da eklediğinizde, ${fasonFirmasi} firmasına irsaliye kesilecek toplam referans sayısı ${refBazliFirmaToplamIrsaliyeSayisi} olacak. Bir firmaya en fazla ${limit} adet farklı referans gönderilebilir. Önce firmaya mevcut irsaliyeyi kesin ve sonra tekrar deneyin.`,
            );
          }
        } catch (error) {
          showNotification("error", error.message);
        }
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  return (
    <Collapse
      bordered={false}
      size="small"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(fasonFirmasiBazliKayitlar).map(([fasonFirmasi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <CountBadge count={kayitlar.length} offset={[20, 6]}>
            <div style={collapseStyle.subCollapseHeader}>{fasonFirmasi}</div>
          </CountBadge>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(fasonFirmasi)}
            onChange={(...args) => handleTableChange(...args, index)}
            hideDefaultTitleButtons
            footer={
              miktarToplam[index]?.state && (
                <div style={{ fontSize: "13px" }}>
                  <span>
                    Gelen Miktar Toplam:{" "}
                    <Tag color="orange">{miktarToplam[index].gelenMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Fasona Gönderilen Toplam:{" "}
                    <Tag color="cyan">{miktarToplam[index].fasonaGonderilenToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Fasonda Üretilen Toplam:{" "}
                    <Tag color="purple">{miktarToplam[index].uretilenMiktarToplam}</Tag>
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    Sevk Edilen Miktar Toplam:{" "}
                    <Tag color="purple">{miktarToplam[index].sevkEdilenMiktarToplam}</Tag>
                  </span>
                </div>
              )
            }
            scroll={{ x: 1800 }}
            rowStyle={(row) => ({
              background: "#fcf8f0",
            })}
            contextMenu={{
              deleteAction: uretimiSilFunc,
              extraItems: (record) => [
                record.gelenMiktar !== record.gidenMiktar && {
                  icon: <SnippetsOutlined />,
                  title: (
                    <div>
                      Fasona İrsaliye Kes
                      <Tag color="blue" style={{ marginLeft: "12px" }}>
                        {record.Referanslar.fasonFirmasi}
                      </Tag>
                    </div>
                  ),
                  action: () => fasonaIrsaliyeKes(record),
                },
                record.gelenMiktar === record.gidenMiktar && {
                  icon: <ContainerOutlined />,
                  title: "Fason Üretim Girişi Yap",
                  action: () =>
                    showPanel({
                      title: "Fason Üretim Girişi",
                      content: <UretimGirisi record={record} />,
                      width: 800,
                    }),
                },
                {
                  icon: <CarOutlined />,
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
