/* eslint-disable indent */
import { Table, Tag } from "antd";
import RecordContextMenu from "components/shared/RecordContextMenu";
import PropTypes from "prop-types";
import { useRef, useState } from "react";

import { useDBContext } from "context/DBProvider";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

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
  actionButtons,
  // contextMenu = { editForm: null, extraItems: [] },
  contextMenu,
  wrapperStyle,
  rowStyle,
  rowKey,
  footer,
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
          footer={() => footer || null}
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
              defaultPageSize: 50,
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
            actionButtons
              ? () => (
                  <TableTitleWrapperStyled>
                    <div style={{ display: "flex" }}>{actionButtons}</div>
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
          sticky={{
            offsetHeader: 28,
          }}
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
  footer: PropTypes.oneOfType([PropTypes.node, PropTypes.oneOf([null])]),
};
