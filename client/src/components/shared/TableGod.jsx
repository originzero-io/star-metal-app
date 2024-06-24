/* eslint-disable indent */
import { Button, Divider, Modal, Table, Tag } from "antd";
import RecordContextMenu from "components/shared/RecordContextMenu";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";

import { useDBContext } from "context/DBProvider";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import ExcelIcon from "../../../public/excel.png";
import PrintButton from "./PrintButton";

const TableTitleWrapperStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px;
`;
export default function TableGod({
  dataSource,
  columns,
  onChange,
  rowSelection,
  scroll,
  expandable,
  pagination,
  hideDefaultTitleButtons,
  actionButtons,
  // contextMenu = { editForm: null, extraItems: [] },
  contextMenu,
  wrapperStyle,
  rowStyle,
  rowKey,
}) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const { loading } = useDBContext();

  const contextMenuHandler = (record, event) => {
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    console.log("contextMenu record: ", record);
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
          fileName: "Tablo",
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

  const getObjectValueByKey = (obj, pathArr) => {
    return pathArr.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  };

  return (
    <div
      onClick={() => setSelectedRecord(null)}
      onContextMenu={(e) => e.preventDefault()}
      style={wrapperStyle}
    >
      {contextMenu && selectedRecord && (
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
          rowKey={
            rowKey ||
            ((record) => record.logicalref || record.logoRef || record.logoMalzemeRef || record.id)
          }
          size="small"
          onChange={onChange && onChange}
          // bordered
          pagination={
            pagination && {
              defaultPageSize: 20,
              showSizeChanger: true,
            }
          }
          rowSelection={
            rowSelection && {
              type: "checkbox",
              ...rowSelection,
            }
          }
          title={
            actionButtons || !hideDefaultTitleButtons
              ? () => (
                  <TableTitleWrapperStyled>
                    <div style={{ display: "flex" }}>
                      {actionButtons}
                      {!hideDefaultTitleButtons && (
                        <>
                          <Divider
                            style={{
                              height: "35px",
                              background: "#e7e5e5",
                            }}
                            type="vertical"
                          />

                          <PrintButton
                            style={{ marginRight: "4px" }}
                            handlePrintFunc={handlePrint}
                          />

                          <Button onClick={downloadExcelHandler}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <img src={ExcelIcon} width={20} />
                              <div style={{ marginLeft: "10px" }}>Excel</div>
                            </div>
                          </Button>
                        </>
                      )}
                    </div>
                  </TableTitleWrapperStyled>
                )
              : null
          }
          onRow={(record, rowIndex) => ({
            style: rowStyle && rowStyle(record),
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
                  <Tag color="magenta" style={{ fontWeight: "700" }}>
                    NOT:{" "}
                  </Tag>
                  <span>{getObjectValueByKey(record, expandable.key)}</span>
                </p>
              ),
              rowExpandable: (record) => expandable,
            }
          }
          loading={loading}
          // sticky={{
          //   offsetHeader: 64,
          // }}
          scroll={scroll}
        />
      </div>
    </div>
  );
}

TableGod.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  onChange: PropTypes.func,
  rowSelection: PropTypes.object,
  scroll: PropTypes.object,
  expandable: PropTypes.shape({
    key: PropTypes.array.isRequired,
  }),
  pagination: PropTypes.bool,
  hideDefaultTitleButtons: PropTypes.bool,
  hasContextMenu: PropTypes.bool,
  actionButtons: PropTypes.node,
  contextMenu: PropTypes.shape({
    editForm: PropTypes.elementType,
    deleteAction: PropTypes.func,
    extraItems: PropTypes.func,
  }),
  wrapperStyle: PropTypes.object,
  rowStyle: PropTypes.func,
  rowKey: PropTypes.number,
};
