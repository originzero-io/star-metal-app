import { ContainerOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import SevkiyatKarti from "components/cards/SevkiyatKarti";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import MalzemeDuzenlemeForm from "components/forms/MalzemeDuzenlemeForm";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "./TableGod";
import UretimGirisi from "components/cards/UretimGirisi";

const data = [];
for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    referansNo: `${i}R1006197G`,
    siparisNo: "RC0236 BELKA",
    talepNo: `308-6${i}`,
    islemAciklama: "DIYAFRAM CINKO FOSFAT",
    irsaliyeNo: `34829${i}`,
    gelenTarih: "14.12.2023 08:47:32",
    gelenMiktar: 1696 + i,
    gidenMiktar: 1696 + i,
    kalanMiktar: 0,
    uretilenMiktar: 1697 + i,
    uretilmeyenMiktar: 0,
    yuzeyAlanHesap: i + Math.random() * 50,
    referansTipi: "Fosfat",
    malzemeTipi: "İade",
    kontrolEden: "Mustafa Akseki",
    gelenIrsaliyeNo: `${i}-12BRV4`,
    katSayi: 3,
    getirenSofor: "Necati Uysal",
    birinciAmbalaj: "MDDS",
    ikinciAmbalaj: "PTA",
    description: "Bu kayıtla ilgili not",
  });
}

const columns = [
  {
    title: "Referans",
    dataIndex: "referansNo",
    key: "referansNo",
    filters: createTableFilterFromData(data, "referansNo"),
    onFilter: (value, record) => record.referans.indexOf(value) === 0,
    filterSearch: true,
    render: (text) => (
      <Tag color="orange" style={{ width: "100px", textAlign: "center" }}>
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
    title: "Irsaliye No",
    dataIndex: "irsaliyeNo",
    key: "irsaliyeNo",
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
    title: "Referans Tipi",
    dataIndex: "referansTipi",
    key: "referansTipi",
    filters: createTableFilterFromData(data, "referansTipi"),
    onFilter: (value, record) => record.referansTipi.indexOf(value) === 0,
    filterSearch: true,
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function DevamEdenUretimTablo() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal } = useUIContext();

  const rowSelection = {
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      setSelectedRows(_selectedRows);
    },
  };
  const deleteRecordHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        console.log("Evet, eminim");
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };
  return (
    <TableGod
      dataSource={data}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      expandable
      contextMenu={{
        editForm: MalzemeDuzenlemeForm,
        extraItems: [
          {
            title: "Üretim İş Emri Kartı",
            action: (record) =>
              showModal({
                title: "Üretim İş Emri Kartı",
                content: <UretimIsEmriKarti record={record} />,
              }),
          },
          {
            title: "Sevkiyat Kartı",
            action: (record) =>
              showModal({ title: "Sevkiyat Kartı", content: <SevkiyatKarti record={record} /> }),
          },
        ],
      }}
      actionButtons={
        <>
          {selectedRows.length === 1 && (
            <Button
              style={{ marginRight: "4px" }}
              type="primary"
              icon={<ContainerOutlined />}
              onClick={() =>
                showModal({
                  title: "Üretim Girişi",
                  content: <UretimGirisi record={selectedRows[0]} />,
                })
              }
            >
              Üretim Girişi
            </Button>
          )}
          {selectedRows.length > 0 && (
            <>
              <Button
                style={{ marginRight: "4px" }}
                danger
                icon={<DeleteOutlined />}
                onClick={deleteRecordHandler}
              >
                Sil ({selectedRows.length})
              </Button>
            </>
          )}
        </>
      }
    />
  );
}

export default DevamEdenUretimTablo;
