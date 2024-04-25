import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { useUIContext } from "context/UIProvider";
import { useAuth } from "context/AuthProvider";

const ContextMenuWrapperStyled = styled.div`
  position: absolute;
  top: ${({ position }) => `${position.y}px`};
  left: ${({ position }) => `${position.x}px`};
  z-index: 1000;
`;

const MenuStyled = styled.div`
  background-color: white;
  box-shadow: -5px 14px 24px 0px rgba(0, 0, 0, 0.1);
  padding-top: 4px;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  border: 1px solid #d4d4d4;
`;
const MenuItemStyled = styled.div`
  color: #313131;
  padding: 8px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dbdbdb;
  &:hover {
    background-color: rgb(107, 67, 175);
    color: whitesmoke;
  }
`;

export default function RecordContextMenu({ position, record, contextMenu }) {
  const { user } = useAuth();

  const { showPanel } = useUIContext();

  const editRecordHandler = () => {
    showPanel({
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
        {contextMenu.extraItems?.map((item, i) => (
          <MenuItemStyled key={i} onClick={() => item.action(record)}>
            {item.title}
          </MenuItemStyled>
        ))}

        {contextMenu.editForm && (
          <MenuItemStyled onClick={editRecordHandler}>Düzenle</MenuItemStyled>
        )}

        {user.yetki === "admin" && contextMenu.deleteAction && (
          <MenuItemStyled onClick={() => contextMenu.deleteAction(record)} style={{ color: "red" }}>
            Sil
          </MenuItemStyled>
        )}
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
