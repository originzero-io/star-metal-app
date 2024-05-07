import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { useMemo, useState } from "react";

import MusteriForm from "components/forms/MusteriForm";
import IdBadge from "components/shared/IdBadge";
import PageHeader from "components/shared/PageHeader";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { RiCustomerServiceLine } from "react-icons/ri";
import musterilerHttp from "services/musteriler.http";
import { createTableFilterFromData } from "utils/table.helper";
import LogoSyncButton from "components/shared/LogoSyncButton";
import TableGod from "../components/shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
function Musteriler() {
  const { user } = useAuth();

  const [selectedRows, setSelectedRows] = useState([]);
  const { showPanel, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Müşteri Logo Kodu",
        dataIndex: "musteriLogoKodu",
        key: "musteriLogoKodu",
        render: (text) => <IdBadge value={text} />,
        filters: createTableFilterFromData(musteriler, "musteriLogoKodu"),
        onFilter: (value, record) => record.musteriLogoKodu.indexOf(value) === 0,
        filterSearch: true,
        width: 150,
      },
      {
        title: "Müşteri Adı",
        dataIndex: "musteriAdi",
        key: "musteriAdi",
        filters: createTableFilterFromData(musteriler, "musteriAdi"),
        onFilter: (value, record) => record.musteriAdi.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "Adres",
        dataIndex: "adres",
        key: "adres1",
        filters: createTableFilterFromData(musteriler, "adres"),
        onFilter: (value, record) => record.adres.indexOf(value) === 0,
        filterSearch: true,
        // width: 200,
      },
      {
        title: "Vergi Dairesi",
        dataIndex: "vergiDairesi",
        key: "vergiDairesi",
        width: 100,
      },
      {
        title: "Vergi No",
        dataIndex: "vergiNo",
        key: "vergiNo",
        // width: 150,
      },
      {
        title: "Telefon",
        dataIndex: "telefon",
        key: "telefon",
        width: 120,
      },
      {
        title: "E-Mail",
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
      {
        title: "Kep Adresi",
        dataIndex: "kepAdresi",
        key: "kepAdresi",
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
          const newMusteriler = await musterilerHttp.deleteData(musteriler, selectedRows);
          setMusteriler(newMusteriler);
          showNotification("success", "Seçili müşteriler silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.musteriAdi} isimli müşteriyi üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newMusteriler = await musterilerHttp.deleteData(musteriler, [record]);
          setMusteriler(newMusteriler);
          showNotification("success", `${record.musteriAdi} müşterisi silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };

  const logoSync = () => {
    console.log("müşteriler: ", musteriler);
  };

  return (
    <div>
      <PageHeader label="Müşteriler" icon={<RiCustomerServiceLine />} />
      <TableGod
        dataSource={musteriler}
        columns={columns}
        onChange={onChange}
        rowSelection={user.yetki === "admin" && rowSelection}
        pagination={false}
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
                Sil ({selectedRows.length})
              </Button>
            )}
            {user.yetki === "admin" && (
              <>
                <Button
                  style={{ marginRight: "4px" }}
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => showPanel({ title: "Müşteri Ekle", content: <MusteriForm /> })}
                >
                  Müşteri Ekle
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

export default Musteriler;
