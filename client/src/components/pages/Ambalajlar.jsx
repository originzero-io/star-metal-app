import { Button, Modal } from "antd";
import { useMemo, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";

import AmbalajForm from "components/forms/AmbalajForm";
import { useDBContext } from "context/DBProvider";
import TableGod from "../shared/TableGod";
import ambalajlarHttp from "services/ambalajlar.http";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Ambalajlar() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal, showNotification } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Kasa Adı",
        dataIndex: "kasaAdi",
        key: "kasaAdi",
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

  const deleteSelectedRowsHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newAmbalajlar = await ambalajlarHttp.deleteData(ambalajlar, selectedRows);
          setAmbalajlar(newAmbalajlar);
          showNotification("success", "Seçili ambalajlar silindi");
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };

  const deleteSingleRecordHandler = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.kasaAdi} isimli müşteriyi üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newMusteriler = await ambalajlarHttp.deleteData(ambalajlar, [record]);
          setAmbalajlar(newMusteriler);
          showNotification("success", `${record.kasaAdi} ambalajı silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };
  return (
    <TableGod
      dataSource={ambalajlar}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: AmbalajForm,
        deleteAction: deleteSingleRecordHandler,
      }}
      actionButtons={
        <>
          {selectedRows.length > 0 && (
            <Button
              style={{ marginRight: "4px" }}
              danger
              icon={<MdOutlineDelete />}
              onClick={deleteSelectedRowsHandler}
            >
              Sil ({selectedRows.length})
            </Button>
          )}
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<IoIosAddCircleOutline />}
            onClick={() => showModal({ title: "Yeni Ambalaj", content: <AmbalajForm /> })}
          >
            Yeni Ambalaj
          </Button>
        </>
      }
    />
  );
}

export default Ambalajlar;
