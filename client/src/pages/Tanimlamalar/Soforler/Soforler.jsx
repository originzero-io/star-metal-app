import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo, useState } from "react";

import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import SoforForm from "pages/Tanimlamalar/Soforler/SoforForm";
import { GiSteeringWheel } from "react-icons/gi";
import logoGoApi from "services/logoGoApi";
import TableGod from "../../../components/shared/TableGod";

function Soforler() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const { soforler, setSoforler } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Logo Kodu",
        dataIndex: "logicalref",
        key: "logicalref",
        render: (text) => <IdBadge value={text} />,
        width: 150,
      },
      {
        title: "Adı",
        dataIndex: "adi",
        key: "adi",
      },
      {
        title: "Soyadı",
        dataIndex: "soyadi",
        key: "soyadi",
      },
      {
        title: "TC Kimlik No",
        dataIndex: "kimlikNo",
        key: "kimlikNo",
      },
    ],
    [soforler],
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
            selectedRows.map((row) => logoGoApi.deleteData("DeleteSofor", row.logicalref)),
          );

          setSoforler((prevSoforler) =>
            prevSoforler.filter(
              (sofor) => !selectedRows.map((row) => row.logicalref).includes(sofor.logicalref),
            ),
          );
          showNotification("success", "Seçili şoförler logodan silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${`${record.adi} ${record.soyadi}`} isimli şoförü üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          await logoGoApi.deleteData("DeleteSofor", record.logicalref);
          setSoforler((prevSoforler) =>
            prevSoforler.filter((sofor) => sofor.logicalref !== record.logicalref),
          );

          showNotification(
            "success",
            `${record.adi} ${record.soyadi} isimli şoför logodan silindi`,
          );
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  return (
    <div>
      <PageHeader label="Şoförler" icon={<GiSteeringWheel />} dataLength={soforler.length} />
      <TableGod
        dataSource={soforler}
        columns={columns}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={false}
        contextMenu={{
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
            <Button
              style={{ marginRight: "4px" }}
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showPanel({ title: "Şoför Ekle", content: <SoforForm /> })}
            >
              Şoför Ekle
            </Button>
          </>
        }
      />
    </div>
  );
}

export default Soforler;
