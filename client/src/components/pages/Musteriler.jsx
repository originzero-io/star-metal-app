import { Button, Modal } from "antd";
import { useMemo, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import MusteriForm from "components/forms/MusteriForm";
import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";
import { createTableFilterFromData } from "utils/table.helper";
import { useDBContext } from "context/DBProvider";
import musterilerHttp from "services/musteriler.http";
import TableGod from "../shared/TableGod";

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};
function Musteriler() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

  const columns = useMemo(
    () => [
      {
        title: "Müşteri Adı - 1",
        dataIndex: "musteriAdi1",
        key: "musteriAdi1",
        filters: createTableFilterFromData(musteriler, "musteriAdi1"),
        onFilter: (value, record) => record.musteriAdi1.indexOf(value) === 0,
        filterSearch: true,
        width: 200,
      },
      {
        title: "Müşteri Adı - 2",
        dataIndex: "musteriAdi2",
        key: "musteriAdi2",
        filters: createTableFilterFromData(musteriler, "musteriAdi2"),
        onFilter: (value, record) => record.musteriAdi2.indexOf(value) === 0,
        filterSearch: true,
        width: 120,
      },
      {
        title: "Adres - 1",
        dataIndex: "adres1",
        key: "adres1",
        filters: createTableFilterFromData(musteriler, "adres1"),
        onFilter: (value, record) => record.adres1.indexOf(value) === 0,
        filterSearch: true,
        width: 200,
      },
      {
        title: "Adres - 2",
        dataIndex: "adres2",
        key: "adres2",
        width: 200,
      },

      {
        title: "İl",
        dataIndex: "il",
        key: "il",
        filters: createTableFilterFromData(musteriler, "il"),
        onFilter: (value, record) => record.il.indexOf(value) === 0,
        filterSearch: true,
        width: 80,
      },
      {
        title: "İlçe",
        dataIndex: "ilce",
        key: "ilce",
        width: 100,
      },
      {
        title: "Vergi Dairesi",
        dataIndex: "vergiDairesi",
        key: "vergiDairesi",
        width: 100,
      },
      {
        title: "Vergi Hesap No",
        dataIndex: "vergiHesapNo",
        key: "vergiHesapNo",
        width: 150,
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
      content: `${record.musteriAdi1} isimli müşteriyi üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        try {
          const newMusteriler = await musterilerHttp.deleteData(musteriler, [record]);
          setMusteriler(newMusteriler);
          showNotification("success", `${record.musteriAdi1} müşterisi silindi`);
        } catch (error) {
          showNotification("error", "Hata oluştu", error.message);
        }
      },
    });
  };
  return (
    <TableGod
      dataSource={musteriler}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
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
              icon={<MdOutlineDelete />}
              onClick={deleteSelectedRecordsHandler}
            >
              Sil ({selectedRows.length})
            </Button>
          )}
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<IoIosAddCircleOutline />}
            onClick={() => showModal({ title: "Yeni Müşteri", content: <MusteriForm /> })}
          >
            Yeni Müşteri
          </Button>
        </>
      }
    />
  );
}

export default Musteriler;
