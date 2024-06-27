import {
  BankOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileDoneOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Flex, Modal, Tag } from "antd";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ReferansForm from "pages/Tanimlamalar/Referanslar/ReferansForm";
import { useMemo, useState } from "react";
import { MdOutlineDocumentScanner } from "react-icons/md";
import referanslarHttp from "services/crud-server/referanslar.http";
import logoGoApi from "services/logoGoApi";
import getUrlByEnvVariables from "utils/getServerUrl";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../../../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Referanslar() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification, showModal } = useUIContext();
  const { referanslar, setReferanslar } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Logo Ana Birim Ref",
        dataIndex: "logoAnaBirimRef",
        key: "logoAnaBirimRef",
        render: (text) => <IdBadge value={text} />,
      },
      {
        title: "Logo Malzeme Ref",
        dataIndex: "logoMalzemeRef",
        key: "logoMalzemeRef",
        render: (text) => <IdBadge value={text} />,
      },
      {
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        render: (text, record) => (
          <Tag
            color={record.siparisTipi === "SERİ" ? "volcano" : "purple"}
            icon={<FileDoneOutlined />}
            style={{ width: "100%", fontSize: "12px" }}
          >
            {text}
          </Tag>
        ),
        filters: createTableFilterFromData(referanslar, "kodu"),
        onFilter: (value, record) => {
          const kodu = record.kodu ?? "Boş";
          return kodu.indexOf(value) === 0;
        },
        filterSearch: true,
      },
      {
        title: "Sipariş Tipi",
        dataIndex: "siparisTipi",
        key: "siparisTipi",
        filters: createTableFilterFromData(referanslar, "siparisTipi"),
        render: (text) =>
          text === "SERİ" ? <Tag color="volcano">{text}</Tag> : <Tag color="purple">{text}</Tag>,
        onFilter: (value, record) => record.siparisTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Referans No",
        dataIndex: "referansNo",
        key: "referansNo",
        filters: createTableFilterFromData(referanslar, "referansNo"),
        onFilter: (value, record) => record.referansNo.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag
            color="orange"
            icon={<FileDoneOutlined />}
            style={{ width: "100%", fontSize: "12px" }}
          >
            {text}
          </Tag>
        ),
      },
      {
        title: "Müşteri",
        dataIndex: "musteriAdi",
        key: "musteriAdi",
        filters: createTableFilterFromData(referanslar, "musteriAdi"),
        onFilter: (value, record) => record.musteriAdi.indexOf(value) === 0,
        filterSearch: true,
        render: (text) => (
          <Tag icon={<BankOutlined />} color="geekblue" style={{ width: "100%", fontSize: "12px" }}>
            {text}
          </Tag>
        ),
        width: 170,
      },
      {
        title: "Parça Adı",
        dataIndex: "parcaAdi",
        key: "parcaAdi",
        filters: createTableFilterFromData(referanslar, "parcaAdi"),
        onFilter: (value, record) => record.parcaAdi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "İrsaliye Açıklaması",
        dataIndex: "irsaliyeAciklamasi",
        key: "irsaliyeAciklamasi",
        filters: createTableFilterFromData(referanslar, "irsaliyeAciklamasi"),
        onFilter: (value, record) => record.irsaliyeAciklamasi.indexOf(value) === 0,
        filterSearch: true,
        width: 300,
      },
      {
        title: "Fason",
        dataIndex: "fason",
        key: "fason",
        render: (text, record) =>
          record.fason ? <Tag color="green">Evet</Tag> : <Tag color="red">Hayır</Tag>,
        filters: [
          { text: "Evet", value: 1 },
          { text: "Hayır", value: 0 },
        ],
        onFilter: (value, record) => {
          // value değeri string olarak geliyor, bu yüzden boolean'a çevirmemiz gerekiyor.
          const filterValue = value;
          return record.fason === filterValue;
        },
        filterSearch: true,
      },
      {
        title: "Fason Firması",
        dataIndex: "fasonFirmasi",
        key: "fasonFirmasi",
        filters: createTableFilterFromData(referanslar, "fasonFirmasi"),
        onFilter: (value, record) => {
          const fasonFirmasi = record.fasonFirmasi ?? "Boş";
          return fasonFirmasi.indexOf(value) === 0;
        },
        render: (value) =>
          value && (
            <Tag
              icon={<BankOutlined />}
              color="volcano"
              style={{ width: "100%", fontSize: "12px" }}
            >
              {value}
            </Tag>
          ),
        filterSearch: true,
      },
      {
        title: "Miktar Sapması",
        dataIndex: "miktarSapmasi",
        key: "miktarSapmasi",
        render: (value, record) => record.ReferansUretim?.miktarSapmasi,
      },
      {
        title: "Lot Adedi",
        dataIndex: "lotAdedi",
        key: "lotAdedi",
        render: (value, record) => record.ReferansUretim?.lotAdedi,
      },
      {
        title: "Yüzey Alanı",
        dataIndex: "referansYuzeyAlani",
        key: "referansYuzeyAlani",
        render: (value, record) => record.ReferansUretim?.referansYuzeyAlani,
      },
      {
        title: "İşlem Tipi",
        dataIndex: "islemTipi",
        key: "islemTipi",
        render: (text, record) => <Tag color="blue">{record.islemTipi}</Tag>,
        filters: createTableFilterFromData(referanslar, "islemTipi"),
        onFilter: (value, record) => record.islemTipi.indexOf(value) === 0,
        filterSearch: true,
      },
      {
        title: "Birim",
        dataIndex: "birim",
        key: "birim",
        filters: createTableFilterFromData(referanslar, "birim"),
        onFilter: (value, record) => record.birim.indexOf(value) === 0,
        filterSearch: true,
      },
    ],
    [referanslar],
  );

  const rowSelection = {
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      setSelectedRows(_selectedRows);
    },
  };
  const deleteSelectedRecordsHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili referansları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await Promise.all(
            selectedRows.map((row) => {
              logoGoApi.deleteData("DeleteReferans", row.logoMalzemeRef);
              referanslarHttp.deleteData(referanslar, [row]);
            }),
          );
          setReferanslar((prevReferanslar) =>
            prevReferanslar.filter(
              (referans) =>
                !selectedRows.map((row) => row.logoMalzemeRef).includes(referans.logoMalzemeRef),
            ),
          );

          showNotification("success", "Seçili referanslar silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.referansNo} referansını silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await logoGoApi.deleteData("DeleteReferans", record.logoMalzemeRef);
          await referanslarHttp.deleteData(referanslar, [record]);

          setReferanslar((prevReferanslar) =>
            prevReferanslar.filter((referans) => referans.logoMalzemeRef !== record.logoMalzemeRef),
          );
          showNotification("success", `${record.referansNo} referansı silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader
        label="Referanslar"
        icon={<MdOutlineDocumentScanner />}
        dataLength={referanslar.length}
      />
      <TableGod
        dataSource={referanslar}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={true}
        scroll={{ x: 1800 }}
        contextMenu={{
          editForm: ReferansForm,
          deleteAction: deleteSingleRecordHandler,
          extraItems: (record) => [
            {
              icon: <EyeOutlined />,
              title: "Resmi Göster",
              action: () =>
                showModal({
                  title: `Referans No: ${record.referansNo} `,
                  content: (
                    <Flex justify="center">
                      <img
                        alt="Resim bulunamadı"
                        src={`${getUrlByEnvVariables()}/uploads/referanslar/${
                          record.ReferansUretim.resimUrl
                        }?t=${new Date().getTime()}`}
                        style={{ maxHeight: "90vh", maxWidth: "100%" }}
                      />
                    </Flex>
                  ),
                  width: 2000,
                }),
            },
          ],
        }}
        actionButtons={
          <>
            {selectedRows.length > 0 && (
              <Button
                style={{ marginRight: "4px" }}
                danger
                icon={<DeleteOutlined />}
                onClick={deleteSelectedRecordsHandler}
              >
                Toplu Sil ({selectedRows.length})
              </Button>
            )}
            {user.yetki === "admin" && (
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Referans Ekle", content: <ReferansForm /> })}
                >
                  Referans Ekle
                </Button>
              </>
            )}
          </>
        }
      />
    </div>
  );
}

export default Referanslar;
