import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo, useState } from "react";

import SoforForm from "pages/Tanimlamalar/Soforler/SoforForm";
import IdBadge from "components/shared/IdBadge";
import LogoSyncButton from "components/shared/LogoSyncButton";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { GiSteeringWheel } from "react-icons/gi";
import soforlerHttp from "services/soforler.http";
import TableGod from "../../../components/shared/TableGod";

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
      content: `${`${record.adi} ${record.soyadi}`} isimli şoförü üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
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

  const logoSync = async () => {
    const logoSoforler = await soforlerHttp.fetchLogoApi("GetSoforList");
    setSoforler(logoSoforler);
    console.log("logoSoforler: ", logoSoforler);
  };

  return (
    <div>
      <PageHeader label="Şoförler" icon={<GiSteeringWheel />} dataLength={soforler.length} />
      <TableGod
        dataSource={soforler}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={false}
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
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Şoför Ekle", content: <SoforForm /> })}
                >
                  Şoför Ekle
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

export default Soforler;
