import { CarOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo, useState } from "react";

import IdBadge from "components/shared/IdBadge";
import LogoSyncButton from "components/shared/LogoSyncButton";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import PlakaForm from "pages/Tanimlamalar/Plakalar/PlakaForm";
import plakalarHttp from "services/plakalar.http";
import TableGod from "../../../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
function Plakalar() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const { plakalar, setPlakalar } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Plaka Logo Kodu",
        dataIndex: "plakaLogoKodu",
        key: "plakaLogoKodu",
        render: (text) => <IdBadge value={text} />,
        width: 120,
      },
      {
        title: "Plaka",
        dataIndex: "plaka",
        key: "plaka",
        render: (text) => <div style={{ fontSize: "14px" }}>{text}</div>,
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
          const newPlakalar = await plakalarHttp.deleteData(plakalar, selectedRows);
          setPlakalar(newPlakalar);
          showNotification("success", "Seçili plakalar silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.plaka} plakasını silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newPlakalar = await plakalarHttp.deleteData(plakalar, [record]);
          setPlakalar(newPlakalar);
          showNotification("success", `${record.plaka} plakası silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const logoSync = () => {
    console.log("plakalar: ", plakalar);
  };

  return (
    <div>
      <PageHeader label="Plakalar" icon={<CarOutlined />} />
      <TableGod
        dataSource={plakalar}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={false}
        contextMenu={{
          editForm: PlakaForm,
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
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Plaka Ekle", content: <PlakaForm /> })}
                >
                  Plaka Ekle
                </Button>
                <LogoSyncButton onClick={logoSync} />
              </>
            )}
          </>
        }
      />
    </div>
  );
}

export default Plakalar;
