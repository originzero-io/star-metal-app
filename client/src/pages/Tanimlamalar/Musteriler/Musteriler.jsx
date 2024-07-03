import { BankOutlined, DeleteOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Modal, Tag } from "antd";
import { useMemo, useState } from "react";

import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import MusteriForm from "pages/Tanimlamalar/Musteriler/MusteriForm";
import { RiCustomerServiceLine } from "react-icons/ri";
import logoGoApi from "services/logoGoApi";
import { createTableFilterFromData } from "utils/table.helper";
import TableGod from "../../../components/shared/TableGod";

function Musteriler() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Logo Kodu",
        dataIndex: "logoRef",
        key: "logoRef",
        render: (text) => <IdBadge value={text} />,
        width: 100,
      },
      {
        title: "Kodu",
        dataIndex: "kodu",
        key: "kodu",
        filters: createTableFilterFromData(musteriler, "kodu"),
        onFilter: (value, record) => record.kodu.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "Firma Tipi",
        dataIndex: "sahisFirmasi",
        key: "sahisFirmasi",
        render: (value) => (
          <Tag
            color={value ? "volcano" : "geekblue"}
            icon={value ? <UserOutlined /> : <BankOutlined />}
          >
            {value ? "Şahıs" : "Tüzel"}
          </Tag>
        ),
        filters: [
          { text: "Şahıs", value: 1 },
          { text: "Tüzel", value: 0 },
        ],
        onFilter: (value, record) => record.sahisFirmasi === value,
        width: 100,
      },
      {
        title: "Unvan",
        dataIndex: "unvani",
        key: "unvani",
        filters: createTableFilterFromData(musteriler, "unvani"),
        onFilter: (value, record) => record.unvani.indexOf(value) === 0,
        filterSearch: true,
        render: (text, record) => (
          <Tag
            color={record.sahisFirmasi ? "volcano" : "geekblue"}
            icon={record.sahisFirmasi ? <UserOutlined /> : <BankOutlined />}
            style={{ width: "100%" }}
          >
            {text}
          </Tag>
        ),
        width: 350,
      },
      {
        title: "Adı",
        dataIndex: "adi",
        key: "adi",
        filters: createTableFilterFromData(musteriler, "adi"),
        onFilter: (value, record) => record.adi.indexOf(value) === 0,
        filterSearch: true,
        render: (text, record) =>
          record.sahisFirmasi ? (
            <Tag
              color={record.sahisFirmasi ? "volcano" : "geekblue"}
              icon={record.sahisFirmasi ? <UserOutlined /> : <BankOutlined />}
              style={{ width: "100%" }}
            >
              {text}
            </Tag>
          ) : (
            ""
          ),
        width: 100,
      },
      {
        title: "Soyadı",
        dataIndex: "soyadi",
        key: "soyadi",
        render: (text, record) =>
          record.sahisFirmasi ? (
            <Tag
              color={record.sahisFirmasi ? "volcano" : "geekblue"}
              icon={record.sahisFirmasi ? <UserOutlined /> : <BankOutlined />}
              style={{ width: "100%" }}
            >
              {text}
            </Tag>
          ) : (
            ""
          ),
        width: 100,
      },
      {
        title: "Adres",
        dataIndex: "adres",
        key: "adres",
        // width: 200,
      },
      {
        title: "İl",
        dataIndex: "il",
        key: "il",
        filters: createTableFilterFromData(musteriler, "il"),
        onFilter: (value, record) => record.il.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "İlçe",
        dataIndex: "ilce",
        key: "ilce",
        filters: createTableFilterFromData(musteriler, "ilce"),
        onFilter: (value, record) => record.ilce.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "Ülke",
        dataIndex: "ulke",
        key: "ulke",
        filters: createTableFilterFromData(musteriler, "ulke"),
        onFilter: (value, record) => record.ulke.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "Posta Kodu",
        dataIndex: "postaKodu",
        key: "postaKodu",
        // width: 200,
      },
      {
        title: "Vergi Dairesi",
        dataIndex: "vergiDairesi",
        key: "vergiDairesi",
        filters: createTableFilterFromData(musteriler, "vergiDairesi"),
        onFilter: (value, record) => record.vergiDairesi.indexOf(value) === 0,
        filterSearch: true,
        width: 100,
      },
      {
        title: "Vergi No",
        dataIndex: "vergiNo",
        key: "vergiNo",
        filters: createTableFilterFromData(musteriler, "vergiNo"),
        onFilter: (value, record) => record.vergiNo.indexOf(value) === 0,
        filterSearch: true,
        // width: 150,
      },
      {
        title: "Kimlik No",
        dataIndex: "kimlikNo",
        key: "kimlikNo",
        filters: createTableFilterFromData(musteriler, "kimlikNo"),
        onFilter: (value, record) => record.kimlikNo.indexOf(value) === 0,
        filterSearch: true,
        // width: 150,
      },
      {
        title: "Telefon",
        dataIndex: "telefon",
        key: "telefon",
        width: 120,
      },
      {
        title: "Mail",
        dataIndex: "mail",
        key: "mail",
        // width: 160,
      },
      {
        title: "Yetkili Kişi",
        dataIndex: "yetkili",
        key: "yetkili",
        // width: 150,
      },
    ],
    [musteriler],
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
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await Promise.all(
            selectedRows.map((row) => logoGoApi.deleteData("DeleteCari", row.logoRef)),
          );

          setMusteriler((prevMusteriler) =>
            prevMusteriler.filter(
              (musteri) => !selectedRows.map((row) => row.logoRef).includes(musteri.logoRef),
            ),
          );

          showNotification("success", `${selectedRows.length} adet müşteri logodan silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.unvani} müşterisini üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await logoGoApi.deleteData("DeleteCari", record.logoRef);
          setMusteriler((prevMusteriler) =>
            prevMusteriler.filter((musteriler) => musteriler.logoRef !== record.logoRef),
          );
          showNotification("success", `${record.unvani} müşterisi silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader
        label="Müşteriler"
        icon={<RiCustomerServiceLine />}
        dataLength={musteriler.length}
      >
        <Badge count={musteriler.length} overflowCount={9999999} offset={[50, 0]}></Badge>
      </PageHeader>

      <TableGod
        dataSource={musteriler}
        columns={columns}
        rowSelection={user.yetki !== "operator" && rowSelection}
        pagination={true}
        scroll={{ x: 2200 }}
        contextMenu={{
          editForm: MusteriForm,
          deleteAction: deleteSingleRecordHandler,
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
            {user.yetki !== "operator" && (
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Müşteri Ekle", content: <MusteriForm /> })}
                >
                  Müşteri Ekle
                </Button>
              </>
            )}
          </>
        }
      />
    </div>
  );
}

export default Musteriler;
