import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { useUIContext } from "context/UIProvider";
import { Modal } from "antd";

const ContextMenuWrapperStyled = styled.div`
  position: absolute;
  top: ${({ position }) => `${position.y}px`};
  left: ${({ position }) => `${position.x}px`};
  z-index: 1000;
  // border: 1px solid #c8c8c8;
  box-shadow: -5px 8px 15px 0px rgba(0, 0, 0, 0.1);
`;

const MenuStyled = styled.div`
  background-color: #232232;
  padding: 8px;
  font-size: 15px;
  cursor: pointer;
  border-radius: 6px;
`;
const MenuItemStyled = styled.div`
  color: whitesmoke;
  padding: 4px;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #515067;
    border-radius: 6px;
  }
`;

export default function RecordContextMenu({ position, record, contextMenu }) {
  const { showModal } = useUIContext();

  const editRecordHandler = () => {
    showModal({
      title: "Düzenle",
      content: React.createElement(contextMenu.editForm, {
        record,
      }),
    });
  };

  const deleteRecordHandler = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: "Bu kaydı silmek üzeresiniz. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?",
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
    <ContextMenuWrapperStyled position={position}>
      <MenuStyled>
        {contextMenu.extraItems?.map((item, i) => (
          <MenuItemStyled key={i} onClick={() => item.action(record)}>
            {item.title}
          </MenuItemStyled>
        ))}
        <MenuItemStyled onClick={editRecordHandler}>Düzenle</MenuItemStyled>
        <MenuItemStyled onClick={deleteRecordHandler}>Sil</MenuItemStyled>
      </MenuStyled>
    </ContextMenuWrapperStyled>
  );
}

RecordContextMenu.propTypes = {
  position: PropTypes.object.isRequired,
  record: PropTypes.object.isRequired,
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
