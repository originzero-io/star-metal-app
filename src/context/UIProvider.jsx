import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UIContext = createContext();

export const useUIContext = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  const [modal, setOpenModal] = useState({
    title: null,
    content: null,
    width: 1000,
  });

  const showModal = ({ title, content, width }) => {
    setOpenModal({ title, content, width });
  };

  const [pageHeader, setPageHeader] = useState({
    title: "",
    icon: "",
  });
  const value = {
    modal,
    showModal,
    pageHeader,
    setPageHeader,
  };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

UIProvider.propTypes = {
  children: PropTypes.element,
};
