import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { Modal, notification } from "antd";

const UIContext = createContext();

export const useUIContext = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [modal, setOpenModal] = useState({
    title: null, // form title
    content: null, // form component
  });

  const showModal = ({ title, content, width }) => {
    setOpenModal({ title, content, width });
  };

  const [panel, setOpenPanel] = useState({
    title: null, // form title
    content: null, // form component
    type: "add", // add or update
    width: 1000, // panel default width
  });

  const showPanel = ({ title, content, width }) => {
    setOpenPanel({ title, content, width });
  };

  const [api, notificationContextHolder] = notification.useNotification();
  const [alert, alertContextHolder] = Modal.useModal();

  const showNotification = (type, title, description) => {
    api[type]({
      message: title,
      description,
      placement: "topLeft",
    });
  };

  const showAlert = (type = "success", title, content) => {
    // type = confirm , warning, info, error
    alert[type]({
      title,
      content,
    });
  };

  const [selectedPage, setSelectedPage] = useState(null);

  const value = {
    modal,
    showModal,
    panel,
    showPanel,
    showNotification,
    showAlert,
    selectedPage,
    setSelectedPage,
  };
  return (
    <UIContext.Provider value={value}>
      {notificationContextHolder}
      {alertContextHolder}
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.element,
};
