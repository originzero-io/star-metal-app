import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo, useState } from "react";

import SoforForm from "components/forms/SoforForm";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { GiSteeringWheel } from "react-icons/gi";
import soforlerHttp from "services/soforler.http";
import TableGod from "../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
function Soforler() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const { soforler, setSoforler } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Şoför Logo Kodu",
        dataIndex: "soforLogoKodu",
        key: "soforLogoKodu",
        render: (text) => <IdBadge value={text} />,
        width: 150,
      },
      {
        title: "Adı",
        dataIndex: "ad",
        key: "adi",
      },
      {
        title: "Soyadı",
        dataIndex: "soyad",
        key: "soyad",
      },
      {
        title: "Kimlik No",
        dataIndex: "tc",
        key: "tc",
      },
    ],
    [],
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
          const newSoforler = await soforlerHttp.deleteData(soforler, selectedRows);
          setSoforler(newSoforler);
          showNotification("success", "Seçili şoförler silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.ad} isimli şoförü üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newSoforler = await soforlerHttp.deleteData(soforler, [record]);
          setSoforler(newSoforler);
          showNotification("success", `${record.ad} isimli şoför silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };
  return (
    <div>
      <PageHeader label="Şoförler" icon={<GiSteeringWheel />} />
      <TableGod
        dataSource={soforler}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        contextMenu={{
          editForm: SoforForm,
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
                Sil ({selectedRows.length})
              </Button>
            )}
            {user.yetki === "admin" && (
              <Button
                style={{ marginRight: "4px" }}
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => showPanel({ title: "Yeni Şoför", content: <SoforForm /> })}
              >
                Yeni Şoför
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}

export default Soforler;
