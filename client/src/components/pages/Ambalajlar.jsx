import { Button, Modal } from "antd";
import { useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

import { useUIContext } from "context/UIProvider";
import { MdOutlineDelete } from "react-icons/md";

import YeniAmbalajForm from "components/forms/YeniAmbalajForm";
import TableGod from "../shared/TableGod";

export const ambalajData = [
  {
    key: 1,
    kasaAdi: "DÇTA",
  },
  {
    key: 2,
    kasaAdi: "Kasa 01",
  },
  {
    key: 3,
    kasaAdi: "Kasa 02",
  },
  {
    key: 4,
    kasaAdi: "KS",
  },
  {
    key: 5,
    kasaAdi: "Kutu 01",
  },
  {
    key: 6,
    kasaAdi: "Kutu 02",
  },
  {
    key: 7,
    kasaAdi: "Kutu 03",
  },
  {
    key: 8,
    kasaAdi: "MDDS",
  },
  {
    key: 9,
    kasaAdi: "MDTA",
  },
  {
    key: 10,
    kasaAdi: "PS",
  },
  {
    key: 11,
    kasaAdi: "PTA",
  },
  {
    key: 12,
    kasaAdi: "TA",
  },
];

const columns = [
  {
    title: "Kasa Adı",
    dataIndex: "kasaAdi",
    key: "kasaAdi",
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

function Ambalajlar() {
  const [selectedRows, setSelectedRows] = useState([]);
  const { showModal } = useUIContext();

  const rowSelection = {
    onChange: (_selectedRowKeys, _selectedRows) => {
      console.log(`selectedRowKeys: ${_selectedRowKeys}`, "selectedRows: ", _selectedRows);
      setSelectedRows(_selectedRows);
    },
  };

  const deleteRecordHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content:
        "Seçili kayıtları silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        console.log("Evet, eminim");
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };
  return (
    <TableGod
      dataSource={ambalajData}
      columns={columns}
      onChange={onChange}
      rowSelection={rowSelection}
      contextMenu={{
        editForm: YeniAmbalajForm,
      }}
      actionButtons={
        <>
          {selectedRows.length > 0 && (
            <Button
              style={{ marginRight: "4px" }}
              danger
              icon={<MdOutlineDelete />}
              onClick={deleteRecordHandler}
            >
              Sil ({selectedRows.length})
            </Button>
          )}
          <Button
            style={{ marginRight: "4px" }}
            type="primary"
            icon={<IoIosAddCircleOutline />}
            onClick={() => showModal({ title: "Yeni Ambalaj", content: <YeniAmbalajForm /> })}
          >
            Yeni Ambalaj
          </Button>
        </>
      }
    />
  );
}

export default Ambalajlar;
