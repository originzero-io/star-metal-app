import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Tag, Tooltip } from "antd";
import ColumnBadge from "components/shared/ColumnBadge";
import CountBadge from "components/shared/CountBadge";
import IdBadge from "components/shared/IdBadge";
import collapseStyle from "components/shared/StyledCollapse";
import TableGod from "components/shared/TableGod";
import { createTableFilterFromData } from "utils/table.helper";

export default function FasonUretimlerTablo({ fasonFirmasiBazliKayitlar, uretimiSilFunc }) {
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
      // dataIndex: "musteriAdi",
      key: "fasonFirmasi",
      render: (text, record) => (
        <Tooltip title={record.musteriAdi}>
          <Tag
            color="blue"
            style={{
              width: "120px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {record.musteriAdi}
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
          color={record.siparisTipi === "SERİ" ? "volcano" : "purple"}
          value={record.siparisTipi}
        />
      ),
      filters: [
        ...new Set(fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.siparisTipi)),
      ].map((siparisTipi) => ({
        text: siparisTipi,
        value: siparisTipi,
      })),
      onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
      filterSearch: true,
      width: 100,
    },
    {
      title: "Kodu",
      dataIndex: "kodu",
      key: "kodu",
      render: (text, record) => <ColumnBadge color="green" value={record.kodu} />,
      width: 170,
    },
    {
      title: "Referans",
      dataIndex: "referansNo",
      key: "referansNo",
      filters: createTableFilterFromData(fasonFirmasiBazliKayitlar[fasonFirmasi], "referansNo"),
      onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
      filterSearch: true,
      render: (text) => <ColumnBadge color="green" value={text} />,
      width: 120,
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
      render: (text) => <Tag color={text > 0 ? "blue" : ""}>{text}</Tag>,
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
      key: "referansYuzeyAlanı",
      render: (text, record) => record.referansYuzeyAlani,
    },
    {
      title: "İşlem Tipi",
      render: (text, record) => <Tag color="blue">{record.islemTipi}</Tag>,
      key: "islemTipi",
      filters: [
        ...new Set(fasonFirmasiBazliKayitlar[fasonFirmasi]?.map((item) => item.islemTipi)),
      ].map((islemTipi) => ({
        text: islemTipi,
        value: islemTipi,
      })),
      onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
      filterSearch: true,
    },
  ];

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
            hideDefaultTitleButtons
            rowStyle={(row) => ({
              background: "#f5faf0",
            })}
            scroll={{ x: 1800 }}
          />
        ),
        style: collapseStyle.subCollapseItem,
      }))}
    />
  );
}
