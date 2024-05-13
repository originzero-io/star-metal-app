import { Badge, Collapse, Tag } from "antd";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { FcOk } from "react-icons/fc";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../../components/shared/TableGod";

const data = [];
for (let i = 0; i < 4; i++) {
  data.push({
    key: i,
    referans: `${i}R1006197G`,
    siparisNo: "RC0236 BELKA",
    talepNo: "IADE",
    islemAciklama: "DIYAFRAM CINKO FOSFAT",
    logoIrsaliyeNo: "348295",
    gelenTarih: "14.12.2023 08:47:32",
    gelenMiktar: 1696 + i,
    gidenMiktar: 1696 + i,
    kalanMiktar: 0,
    uretilenMiktar: 1697 + i,
    uretilmeyenMiktar: 0,
    yuzeyAlanHesap: i + Math.random() * 50,
    islemTipi: "Fosfat",
    description: "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  });
}

const columns = [
  {
    title: "Referans",
    dataIndex: "referans",
    key: "referans",
    filters: createTableFilterFromData(data, "referans"),
    onFilter: (value, record) => record.referans.indexOf(value) === 0,
    filterSearch: true,
    render: (text) => (
      <Tag color="green" style={{ width: "100px", textAlign: "center" }}>
        {text}
      </Tag>
    ),
    width: 120,
  },
  {
    title: "Sipariş No",
    dataIndex: "siparisNo",
    key: "siparisNo",
    filters: createTableFilterFromData(data, "siparisNo"),
    onFilter: (value, record) => record.siparisNo.indexOf(value) === 0,
    filterSearch: true,
  },
  {
    title: "Talep No",
    dataIndex: "talepNo",
    key: "talepNo",
  },
  {
    title: "İşlem Açıklaması",
    dataIndex: "islemAciklama",
    key: "islemAciklama",
  },
  {
    title: "Logo Irsaliye No",
    dataIndex: "logoIrsaliyeNo",
    key: "logoIrsaliyeNo",
  },
  {
    title: "Gelen Tarih",
    dataIndex: "gelenTarih",
    key: "gelenTarih",
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
  },
  {
    title: "Üretilmeyen",
    dataIndex: "uretilmeyenMiktar",
    key: "uretilmeyenMiktar",
    sorter: (a, b) => a.uretilmeyenMiktar - b.uretilmeyenMiktar,
  },
  {
    title: "Yüzey Alan Hesap",
    dataIndex: "yuzeyAlanHesap",
    key: "yuzeyAlanHesap",
  },
  {
    title: "İşlem Tipi",
    dataIndex: "islemTipi",
    key: "islemTipi",
    filters: createTableFilterFromData(data, "islemTipi"),
    onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
    filterSearch: true,
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function TamamlananUretimler() {
  // const [selectedRows, setSelectedRows] = useState([]);

  // const rowSelection = {
  //   onChange: (_selectedRowKeys, _selectedRows) => {
  //     console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
  //     setSelectedRows(_selectedRows);
  //   },
  // };
  return (
    <div>
      <PageHeader label="Tamamlanan Üretimler" icon={<FcOk />} />
      <Collapse
        // type="card"
        // size="large"
        bordered={false}
        defaultActiveKey="normal" // sağ tıklanarak gelinmişse otomatik olarak panel açık olsun
        items={[
          {
            key: "normal",
            // label: "Star Metal Üretimler",
            // key: index.toString(),
            label: (
              <Badge count={data.length} offset={[20, 6]}>
                <div
                  style={{
                    // fontSize: "16px",
                    fontWeight: "600",
                    color: "#474747",
                  }}
                >
                  Star Metal Üretimler
                </div>
              </Badge>
            ),
            children: <NormalUretimler />,
            style: collapseStyle.parentCollapseItem,
          },
          {
            key: "fason",
            label: "Fason Üretimler",
            children: <FasonUretimler />,
            style: collapseStyle.parentCollapseItem,
          },
        ]}
      />
    </div>
  );
}

TamamlananUretimler.propTypes = {};

export default TamamlananUretimler;

function FasonUretimler() {
  return (
    <TableGod
      wrapperStyle={{ padding: "0", width: "100%" }}
      dataSource={data}
      columns={columns}
      onChange={onChange}
      // expandable={{ key: ["Referanslar", "not"] }}
      // contextMenu={{
      //   editForm: MalzemeDuzenlemeForm,
      // }}
    />
  );
}

function NormalUretimler() {
  return (
    <TableGod
      wrapperStyle={{ padding: "0", width: "100%" }}
      dataSource={data}
      columns={columns}
      onChange={onChange}
      // expandable={{ key: ["Referanslar", "not"] }}
      // contextMenu={{
      //   editForm: MalzemeDuzenlemeForm,
      // }}
    />
  );
}
