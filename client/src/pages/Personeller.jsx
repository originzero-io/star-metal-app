import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import { useMemo, useState } from "react";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import personellerHttp from "services/personeller.http";
import PersonelForm from "components/forms/PersonelForm";
import PageHeader from "components/shared/PageHeader";
import { PiUsersThreeBold } from "react-icons/pi";
import { createTableFilterFromData } from "utils/table.helper";
import { useAuth } from "context/AuthProvider";
import TableGod from "../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
function Personeller() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification, showAlert } = useUIContext();
  const { personeller, setPersoneller } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Yetki",
        dataIndex: "yetki",
        key: "yetki",
        render: (text, record) =>
          text === "admin" ? <Tag color="volcano">Admin</Tag> : <Tag color="blue">Operatör</Tag>,
        filters: createTableFilterFromData(personeller, "yetki"),

        onFilter: (value, record) => record.yetki.indexOf(value) === 0,
        filterSearch: true,
        width: 70,
      },
      {
        title: "Ad",
        dataIndex: "ad",
        key: "ad",
      },
      {
        title: "Soyad",
        dataIndex: "soyad",
        key: "soyad",
      },
      {
        title: "Telefon",
        dataIndex: "telefon",
        key: "telefon",
      },
      {
        title: "TC Kimlik No",
        dataIndex: "tc",
        key: "tc",
      },

      {
        title: "Adres",
        dataIndex: "adres",
        key: "adres",
        width: 600,
      },
    ],
    [personeller],
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
          const newPersoneller = await personellerHttp.deleteData(personeller, selectedRows);
          setPersoneller(newPersoneller);
          showNotification("success", "Seçili personeller silindi");
        } catch (error) {
          showAlert("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.ad} isimli personeli üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newPersoneller = await personellerHttp.deleteData(personeller, [record]);
          setPersoneller(newPersoneller);
          showNotification("success", `${record.ad} personeli silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader label="Personeller" icon={<PiUsersThreeBold />} />
      <TableGod
        dataSource={personeller}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        contextMenu={
          user.yetki === "admin" && {
            editForm: PersonelForm,
            deleteAction: deleteSingleRecordHandler,
          }
        }
        actionButtons={
          <>
            {selectedRows.length > 0 && (
              <Button
                style={{ marginRight: "4px" }}
                danger
                icon={<DeleteOutlined />}
                onClick={deleteSelectedRecordsHandler}
              >
                Sil ({selectedRows.length})
              </Button>
            )}
            {user.yetki === "admin" && (
              <Button
                style={{ marginRight: "4px" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showPanel({ title: "Personel Ekle", content: <PersonelForm /> })}
              >
                Personel Ekle
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}

export default Personeller;
