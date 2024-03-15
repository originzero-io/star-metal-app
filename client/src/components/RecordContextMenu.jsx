import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { useUIContext } from "context/UIProvider";

const ContextMenuWrapperStyled = styled.div`
  position: absolute;
  top: ${({ position }) => `${position.y}px`};
  left: ${({ position }) => `${position.x}px`};
  z-index: 1000;
  border: 1px solid #d4d4d4;
  box-shadow: -5px 14px 24px 0px rgba(0, 0, 0, 0.1);
`;

const MenuStyled = styled.div`
  background-color: white;
  padding: 6px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 6px;
`;
const MenuItemStyled = styled.div`
  color: #313131;
  padding: 4px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #ebedf3;
    color: #4b00ff;
  }
`;

export default function RecordContextMenu({ position, record, contextMenu }) {
  const { showModal } = useUIContext();

  const editRecordHandler = () => {
    showModal({
      title: "Düzenle",
      content: React.createElement(contextMenu.editForm, {
        record,
        type: "update",
      }),
    });
  };

  return (
    <ContextMenuWrapperStyled position={position}>
      <MenuStyled>
        <MenuItemStyled
          style={{
            background: "#842c72",
            color: "whitesmoke",
            borderRadius: "6px",
            marginBottom: "8px",
            display: "flex",
            justifyContent: "center",
            fontSize: "14px",
          }}
        >
          {record.referansNo}
        </MenuItemStyled>
        {contextMenu.extraItems?.map((item, i) => (
          <MenuItemStyled key={i} onClick={() => item.action(record)}>
            {item.title}
          </MenuItemStyled>
        ))}
        <MenuItemStyled onClick={editRecordHandler}>Düzenle</MenuItemStyled>
        <MenuItemStyled onClick={() => contextMenu.deleteAction(record)} style={{ color: "red" }}>
          Sil
        </MenuItemStyled>
      </MenuStyled>
    </ContextMenuWrapperStyled>
  );
}

RecordContextMenu.propTypes = {
  position: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
  contextMenu: PropTypes.shape({
    editForm: PropTypes.elementType,
    deleteAction: PropTypes.func,
    extraItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        action: PropTypes.func.isRequired,
      }),
    ), // extraItems, belirli bir şekle sahip nesnelerin bir dizisi
  }),
};
