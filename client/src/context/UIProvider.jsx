import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import { notification } from "antd";

const UIContext = createContext();

export const useUIContext = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [modal, setOpenModal] = useState({
    title: null, // form title
    content: null, // form component
    type: "add", // add or update
    width: 1000, // modal width
  });

  const showModal = ({ title, content, width }) => {
    setOpenModal({ title, content, width });
  };

  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, title, description) => {
    api[type]({
      message: title,
      description,
      placement: "topRight",
    });
  };

  const [pageHeader, setPageHeader] = useState({
    title: "",
    icon: "",
  });
  const value = {
    modal,
    showModal,
    showNotification,
    pageHeader,
    setPageHeader,
  };
  return (
    <UIContext.Provider value={value}>
      {contextHolder}
      {children}
    </UIContext.Provider>
  );
};

UIProvider.propTypes = {
  children: PropTypes.element,
};
