import { ContainerOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import SevkiyatKarti from "components/cards/SevkiyatKarti";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import MalzemeDuzenlemeForm from "components/forms/MalzemeDuzenlemeForm";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { createTableFilterFromData } from "utils/table.helper";
import UretimGirisi from "components/cards/UretimGirisi";
import { useDBContext } from "context/DBProvider";
import TableGod from "../shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function DevamEdenUretimler() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal } = useUIContext();
  const { devamEdenUretimler } = useDBContext();

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

  const columns = useMemo(
    () => [
      {
        title: "Referans",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(devamEdenUretimler, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag color="orange" style={{ width: "100px", textAlign: "center" }}>
            {text}
          </Tag>
        ),
        width: 120,
      },
      {
        title: "Malzeme Tipi",
        dataIndex: "malzemeTipi",
        key: "malzemeTipi",
        filters: createTableFilterFromData(devamEdenUretimler, "malzemeTipi"),
        onFilter: (value, record) => record.malzemeTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Sipariş No",
        dataIndex: "siparisNo",
        key: "siparisNo",
        filters: createTableFilterFromData(devamEdenUretimler, "siparisNo"),
        onFilter: (value, record) => record.siparisNo.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Talep No",
        dataIndex: "talepNo",
        key: "talepNo",
      },
      // {
      //   title: "İşlem Açıklaması",
      //   dataIndex: "islemAciklama",
      //   key: "islemAciklama",
      // },
      {
        title: "İrsaliye No",
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
        dataIndex: "adet",
        key: "adet",
        sorter: (a, b) => a.adet - b.adet,
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
        title: "Referans Yüzey Alanı",
        // dataIndex: ["Referanslar", "referansYuzeyAlani"],
        key: "referansYuzeyAlanı",
        render: (text, record) => record.Referanslar?.referansYuzeyAlani,
      },
      {
        title: "İşlem Tipi",
        // dataIndex: "referansTipi",
        render: (text, record) => record.Referanslar?.islemTipi,
        key: "islemTipi",
        filters: [...new Set(devamEdenUretimler.map((item) => item.Referanslar?.islemTipi))].map(
          (islemTipi) => ({
            text: islemTipi,
            value: islemTipi,
          }),
        ),
        onFilter: (value, record) => record.Referanslar?.islemTipi.indexOf(value) === 0,
        filterSearch: true,
      },
    ],
    [devamEdenUretimler],
  );

  return (
    <TableGod
      dataSource={devamEdenUretimler}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      expandable
      contextMenu={{
        editForm: MalzemeDuzenlemeForm,
        extraItems: [
          {
            title: "Üretim / Sevkiyat Hareketleri",
            //title: <div style={{ fontWeight: "700" }}>Üretim / Sevkiyat Hareketleri</div>,
            action: (record) =>
              showModal({
                title: "Üretim / Sevkiyat Hareketleri",
                content: <SevkiyatKarti record={record} />,
              }),
          },
          {
            title: "Üretim İş Emri Kartı Çıkart",
            action: (record) =>
              showModal({
                title: "Üretim İş Emri Kartı",
                content: <UretimIsEmriKarti record={record} />,
              }),
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

export default DevamEdenUretimler;
