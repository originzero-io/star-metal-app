import { CarOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo } from "react";

import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import PlakaForm from "pages/Tanimlamalar/Plakalar/PlakaForm";
import logoGoApi from "services/logoGoApi";
import TableGod from "../../../components/shared/TableGod";

function Plakalar() {
  const { user } = useAuth();

  const { showPanel, showNotification } = useUIContext();
  const { plakalar, setPlakalar } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Logo Kodu",
        dataIndex: "logicalref",
        key: "logicalref",
        render: (text) => <IdBadge value={text} />,
        width: 100,
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

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.plaka} plakasını silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await logoGoApi.deleteData("DeleteArac", record.logicalref);
          setPlakalar((prevPlakalar) =>
            prevPlakalar.filter((plaka) => plaka.logicalref !== record.logicalref),
          );
          showNotification("success", `${record.plaka} plakası logodan silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader label="Plakalar" icon={<CarOutlined />} dataLength={plakalar.length} />
      <TableGod
        dataSource={plakalar}
        columns={columns}
        pagination={false}
        contextMenu={{
          deleteAction: deleteSingleRecordHandler,
        }}
        actionButtons={
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showPanel({ title: "Plaka Ekle", content: <PlakaForm /> })}
          >
            Plaka Ekle
          </Button>
        }
      />
    </div>
  );
}

export default Plakalar;
