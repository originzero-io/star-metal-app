import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import referanslarHttp from "services/referanslar.http";

const DBContext = createContext();

axios.defaults.baseURL = "http://localhost:6333";

export const useDBContext = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReferanslar = async () => {
    setLoading(true);
    try {
      const referansData = await referanslarHttp.getReferanslar();
      setReferanslar(referansData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    fetchReferanslar();
  }, []);

  const value = {
    referanslar,
    setReferanslar,
    loading,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

DBProvider.propTypes = {
  children: PropTypes.element,
};
