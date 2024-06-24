import {
  CaretRightOutlined,
  CheckCircleOutlined,
  ContainerOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
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
import TalepNoGiris from "pages/Uretimler/DevamEdenler/TalepNoGiris";
import UretimGirisi from "pages/Uretimler/DevamEdenler/UretimGirisi";
import UretimSevkiyatHareketleri from "pages/Uretimler/DevamEdenler/UretimSevkiyatHareketleri";
import { devamEdenUretimHttp, tamamlananUretimHttp } from "services/crud-server/uretimler.http";
import { createTableFilterFromData } from "utils/table.helper";

export default function NormalUretimlerTablo({ musteriBazliKayitlar, uretimiSilFunc }) {
  const { user } = useAuth();

  const { showPanel, showModal } = useUIContext();
  const { setDevamEdenUretimler } = useDBContext();

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
      width: 120,
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
    },
    {
      title: "Giden",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text) => <Tag color={text > 0 ? "cyan" : ""}>{text}</Tag>,
    },
    {
      title: "Kalan",
      dataIndex: "kalanMiktar",
      key: "kalanMiktar",
      sorter: (a, b) => a.kalanMiktar - b.kalanMiktar,
    },
    {
      title: "Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <Tag color={text > 0 ? "blue" : ""}>{text}</Tag>,
    },
    {
      title: "Üretilmeyen",
      dataIndex: "uretilmeyenMiktar",
      key: "uretilmeyenMiktar",
      sorter: (a, b) => a.uretilmeyenMiktar - b.uretilmeyenMiktar,
      width: 120,
    },
    {
      title: "Yüzey Alanı",
      // dataIndex: ["Referanslar", "referansYuzeyAlani"],
      key: "referansYuzeyAlanı",
      render: (text, record) => record.Referanslar?.referansYuzeyAlani,
      width: 110,
    },
    {
      title: "İşlem Tipi",
      // dataIndex: "referansTipi",
      render: (text, record) => <Tag color="blue">{record.Referanslar?.islemTipi}</Tag>,
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
            hideDefaultTitleButtons
            scroll={{ x: 1700 }}
            contextMenu={{
              deleteAction: uretimiSilFunc,
              extraItems: (record) => [
                user.yetki === "admin" && {
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
                      width: 1100,
                    }),
                },
                {
                  icon: <PrinterOutlined />,
                  title: "Üretim İş Emri Kartı Çıkart",
                  action: () =>
                    showPanel({
                      title: "Üretim İş Emri Kartı",
                      content: <UretimIsEmriKarti record={record} />,
                      width: 800,
                    }),
                },
                user.yetki === "admin" &&
                  record.Referanslar.siparisTipi === "SERİ" && {
                    icon: <EditOutlined />,
                    title: "Talep No Gir",
                    action: () => {
                      showModal({
                        title: "Talep No Girişi",
                        content: <TalepNoGiris record={record} />,
                        width: 400,
                      });
                    },
                  },
                user.yetki === "admin" && {
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
                  icon: <EditOutlined />,
                  title: "Tamamlananlara Gönder",
                  action: async () => await tamamlananUretimHttp.addData(record),
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
