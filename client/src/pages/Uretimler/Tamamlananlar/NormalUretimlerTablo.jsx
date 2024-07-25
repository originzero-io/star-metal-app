import { CaretRightOutlined, TruckOutlined } from "@ant-design/icons";

import { Collapse, Flex } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import IdBadge from "components/shared/IdBadge";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { useAuth } from "context/AuthProvider";
import { useUIContext } from "context/UIProvider";
import { createTableFilterFromData } from "utils/table.helper";
import UretimSevkiyatHareketleri from "../DevamEdenler/UretimSevkiyatHareketleri";

export default function NormalUretimlerTablo({ musteriBazliKayitlar, uretimiSilFunc }) {
  const { user } = useAuth();
  const { showPanel } = useUIContext();

  const createColumnsForCustomer = (musteriAdi) => [
    {
      title: "Sıra No",
      dataIndex: "id",
      key: "id",
      render: (text) => <IdBadge value={text} />,
      sorter: (a, b) => a.id - b.id,
      width: 72,
    },
    {
      title: "Sipariş Tipi",
      dataIndex: "siparisTipi",
      key: "siparisTipi",
      render: (text, record) => <ColumnBadge value={record.siparisTipi} />,
      filters: [...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.siparisTipi))].map(
        (siparisTipi) => ({
          text: siparisTipi,
          value: siparisTipi,
        }),
      ),
      onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 100,
    },
    {
      title: "Kodu",
      dataIndex: "kodu",
      key: "kodu",
      render: (text, record) => <ColumnBadge value={record.kodu} />,
      filters: createTableFilterFromData(musteriBazliKayitlar[musteriAdi], "kodu"),
      onFilter: (value, record) => record.kodu.indexOf(value) === 0,
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
      render: (text) => <ColumnBadge value={text} />,
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
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Giden",
      dataIndex: "gidenMiktar",
      key: "gidenMiktar",
      sorter: (a, b) => a.gidenMiktar - b.gidenMiktar,
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Kalan",
      dataIndex: "kalanMiktar",
      key: "kalanMiktar",
      sorter: (a, b) => a.kalanMiktar - b.kalanMiktar,
      render: (text) => <ColumnBadge value={text} />,
    },
    {
      title: "Üretilen",
      dataIndex: "uretilenMiktar",
      key: "uretilenMiktar",
      sorter: (a, b) => a.uretilenMiktar - b.uretilenMiktar,
      render: (text) => <ColumnBadge value={text} />,
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
      dataIndex: "referansYuzeyAlani",
      key: "referansYuzeyAlani",
      width: 110,
    },
    {
      title: "İşlem Tipi",
      // dataIndex: "referansTipi",
      key: "islemTipi",
      render: (text, record) => <ColumnBadge value={record.islemTipi} />,
      filters: [...new Set(musteriBazliKayitlar[musteriAdi]?.map((item) => item.islemTipi))].map(
        (islemTipi) => ({
          text: islemTipi,
          value: islemTipi,
        }),
      ),
      onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 90,
    },
  ];

  return (
    <Collapse
      bordered={false}
      size="small"
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
      items={Object.entries(musteriBazliKayitlar).map(([musteriAdi, kayitlar], index) => ({
        key: index.toString(),
        label: (
          <Flex>
            <div style={collapseStyle.subCollapseHeader}>{musteriAdi}</div>
            <CountBadge>{kayitlar.length}</CountBadge>
          </Flex>
        ),
        children: (
          <TableGod
            dataSource={kayitlar}
            columns={createColumnsForCustomer(musteriAdi)}
            hideDefaultTitleButtons
            scroll={{ x: 1700 }}
            contextMenu={{
              extraItems: (record) => [
                user.yetki !== "operator" && {
                  icon: <TruckOutlined />,
                  title: "Üretim / Sevkiyat Hareketleri",
                  action: () =>
                    showPanel({
                      title: "Üretim / Sevkiyat Hareketleri",
                      content: <UretimSevkiyatHareketleri record={record} />,
                      width: 1400,
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
