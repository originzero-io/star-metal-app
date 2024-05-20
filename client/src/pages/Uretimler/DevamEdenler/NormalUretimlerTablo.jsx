import {
  CaretRightOutlined,
  ContainerOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PrinterOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { Badge, Collapse, Tag } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
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
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
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
        <Tag color={text && "red-inverse"} style={{ width: "80px", textAlign: "center" }}>
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
      title: "Referans",
      dataIndex: "referansNo",
      key: "referansNo",
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => (
        <Tag color="orange" style={{ fontSize: "14px" }}>
          {text}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Çıkış Referansı",
      dataIndex: "cikisReferansNo",
      key: "cikisReferansNo",
      filters: [
        ...new Set(
          musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.cikisReferansNo),
        ),
      ].map((cikisReferansNo) => ({
        text: cikisReferansNo,
        value: cikisReferansNo,
      })),
      onFilter: (value, record) => record.Referanslar?.cikisReferansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text, record) => record.Referanslar.cikisReferansNo,

      width: 120,
    },
    {
      title: "İade",
      dataIndex: "iade",
      key: "iade",
      render: (text) =>
        text === "Evet" ? <Tag color="green">{text}</Tag> : <Tag color="red">{text}</Tag>,
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "iade"),
      onFilter: (value, record) => record.iade.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) =>
        record.Referanslar.siparisTipi === "Seri" ? (
          <Tag color="volcano">{record.Referanslar.siparisTipi}</Tag>
        ) : (
          <Tag color="purple">{record.Referanslar.siparisTipi}</Tag>
        ),
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.siparisTipi)),
      ].map((siparisTipi) => ({
        text: siparisTipi,
        value: siparisTipi,
      })),
      onFilter: (value, record) => record.Referanslar?.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
    },
    {
      title: "Sipariş No",
      dataIndex: "siparisNo",
      key: "siparisNo",
      render: (text, record) => record?.Referanslar?.siparisNo,
      filters: [
        ...new Set(
          musteriBazliKayitlar[musteriAdi]?.map((item) => item.Referanslar?.siparisNo || "Boş"),
        ),
      ].map((siparisNo) => ({
        text: siparisNo,
        value: siparisNo,
      })),
      onFilter: (value, record) => {
        const siparisNo = record.Referanslar?.siparisNo || "Boş";
        return siparisNo.indexOf(value) === 0;
      },
      filterSearch: true,
    },
    {
      title: "Talep No",
      dataIndex: "talepNo",
      key: "talepNo",
      filters: [
        ...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.talepNo || "Boş")),
      ].map((talepNo) => ({
        text: talepNo,
        value: talepNo,
      })),
      onFilter: (value, record) => {
        const talepNo = record.talepNo || "Boş";
        return talepNo.indexOf(value) === 0;
      },
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
    },
    {
      title: "Yüzey Alanı",
      // dataIndex: ["Referanslar", "referansYuzeyAlani"],
      key: "referansYuzeyAlanı",
      render: (text, record) => record.Referanslar?.referansYuzeyAlani,
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
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <Badge count={kayitlar.length} offset={[20, 6]}>
            <div
              style={{
                fontWeight: "600",
                color: "#474747",
              }}
            >
              {musteriAdi}
            </div>
          </Badge>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(musteriAdi)}
            hideDefaultTitleButtons
            scroll={{ x: 1500 }}
            contextMenu={{
              deleteAction: uretimiSilFunc,
              extraItems: (record) => [
                user.yetki === "admin" && {
                  icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
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
                  record.Referanslar.siparisTipi === "Talepli" && {
                    icon: <EditOutlined />,
                    title: record.talepNo ? "Talep No Değiştir" : "Talep No Gir",
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
              ],
            }}
          />
        ),
        style: collapseStyle.subCollapseItem,
      }))}
    />
  );
}
