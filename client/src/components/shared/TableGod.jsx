/* eslint-disable indent */
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Divider, Modal, Table } from "antd";
import RecordContextMenu from "components/RecordContextMenu";
import { useUIContext } from "context/UIProvider";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";

import PageHeader from "components/shared/PageHeader";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import ExcelIcon from "../../../public/excel.png";
import { useDBContext } from "context/DBProvider";

const TableWrapperStyled = styled.div`
  height: 100vh;
  width: 87%;
  padding: 14px;
  overflow: auto;
`;
const TableTitleWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px;
`;
export default function TableGod({
  dataSource,
  columns,
  onChange,
  rowSelection,
  expandable,
  actionButtons,
  // contextMenu = { editForm: null, extraItems: [] },
  contextMenu,
}) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { pageHeader } = useUIContext();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const { loading } = useDBContext();

  const contextMenuHandler = (record, event) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    console.log(record);
    setSelectedRecord(record);
  };

  const downloadExcelHandler = () => {
    // const header = ["Firstname", "Lastname", "Age"];
    // const body = [["Edison", "Padilla", 14]];

    Modal.confirm({
      title: "Emin misiniz?",
      content: "Bu tablo excel formatında indirilecek.",
      okText: "Tamam",
      cancelText: "İptal",
      onOk() {
        const header = columns.map((column) => column.title);
        const body = dataSource.map(({ key, ...rest }) => Object.values(rest));

        downloadExcel({
          fileName: pageHeader.title,
          // sheet: "react-export-table-to-excel",
          tablePayload: {
            header,
            body,
          },
        });
      },
      onCancel() {
        console.log("Hayır, vazgeçtim");
      },
    });
  };
  return (
    <TableWrapperStyled
      onClick={() => setSelectedRecord(null)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {contextMenu?.editForm && selectedRecord && (
        <RecordContextMenu
          position={contextMenuPosition}
          record={selectedRecord}
          contextMenu={contextMenu}
        />
      )}
      <div ref={componentRef}>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          onChange={onChange && onChange}
          // bordered
          pagination={{
            defaultPageSize: 20,
            showSizeChanger: true,
          }}
          rowSelection={
            rowSelection && {
              type: "checkbox",
              ...rowSelection,
            }
          }
          title={() => (
            <TableTitleWrapperStyled>
              <PageHeader />
              <div style={{ display: "flex" }}>
                {actionButtons}
                <Divider
                  style={{
                    height: "35px",
                    background: "#e7e5e5",
                  }}
                  type="vertical"
                />
                <Button
                  style={{ marginRight: "4px" }}
                  icon={<PrinterOutlined />}
                  onClick={handlePrint}
                >
                  Yazdır
                </Button>
                <Button onClick={downloadExcelHandler}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <img src={ExcelIcon} width={20} />
                    <div style={{ marginLeft: "10px" }}>Excel</div>
                  </div>
                </Button>
              </div>
            </TableTitleWrapperStyled>
          )}
          onRow={(record, rowIndex) => ({
            onClick: (event) => {},
            onDoubleClick: (event) => {},
            onContextMenu: (event) => contextMenuHandler(record, event),
            onMouseEnter: (event) => {},
            onMouseLeave: (event) => {},
          })}
          expandable={
            expandable && {
              expandedRowRender: (record) => (
                <p
                  style={{
                    margin: 0,
                    fontSize: "1.4vmin",
                  }}
                >
                  {record.description}
                </p>
              ),
            }
          }
          loading={loading}
          // sticky={{
          //   offsetHeader: 64,
          // }}
          // scroll={{ y: 660 }}
        />
      </div>
    </TableWrapperStyled>
  );
}

TableGod.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  rowSelection: PropTypes.object,
  expandable: PropTypes.bool,
  hasContextMenu: PropTypes.bool,
  actionButtons: PropTypes.node,
  contextMenu: PropTypes.shape({
    editForm: PropTypes.elementType,
    extraItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        action: PropTypes.func.isRequired,
      }),
    ), // extraItems, belirli bir şekle sahip nesnelerin bir dizisi
  }),
};
