import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import referanslarHttp from "services/referanslar.http";
import musterilerHttp from "services/musteriler.http";
import ambalajlarHttp from "services/ambalajlar.http";

const DBContext = createContext();

axios.defaults.baseURL = "http://localhost:6333";

export const useDBContext = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [ambalajlar, setAmbalajlar] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchReferanslar = async () => {
    setLoading(true);
    try {
      const referansData = await referanslarHttp.getData();
      setReferanslar(referansData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchMusteriler = async () => {
    setLoading(true);
    try {
      const musteriData = await musterilerHttp.getData();
      setMusteriler(musteriData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const fetchAmbalajlar = async () => {
    setLoading(true);
    try {
      const ambalajData = await ambalajlarHttp.getData();
      setAmbalajlar(ambalajData);
      setLoading(false);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    fetchReferanslar();
    fetchMusteriler();
    fetchAmbalajlar();
  }, []);

  const value = {
    referanslar,
    setReferanslar,
    musteriler,
    setMusteriler,
    ambalajlar,
    setAmbalajlar,
    loading,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

DBProvider.propTypes = {
  children: PropTypes.element,
};
