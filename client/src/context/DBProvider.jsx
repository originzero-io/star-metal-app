import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import referanslarHttp, { referansIslemTipleriHttp } from "services/referanslar.http";
import musterilerHttp from "services/musteriler.http";
import ambalajlarHttp from "services/ambalajlar.http";
import { devamEdenUretimHttp } from "services/uretim.http";
import { useUIContext } from "./UIProvider";

const DBContext = createContext();

axios.defaults.baseURL = "http://localhost:6333";

export const useDBContext = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [referansIslemTipleri, setReferansIslemTipleri] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [ambalajlar, setAmbalajlar] = useState([]);
  const [devamEdenUretimler, setDevamEdenUretimler] = useState([]);
  // ? uretimler denip {devamEdenler, tamamlananlar} şeklinde verilebilir

  const [loading, setLoading] = useState(false);

  const { showNotification } = useUIContext();

  const fetchReferanslar = async () => {
    try {
      setLoading(true);
      const referansData = await referanslarHttp.getData();
      setReferanslar(referansData);
      const referansIslemTipiData = await referansIslemTipleriHttp.getData();
      setReferansIslemTipleri(referansIslemTipiData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Referans verisi alınamadı", error.message);
    }
  };

  const fetchMusteriler = async () => {
    try {
      setLoading(true);
      const musteriData = await musterilerHttp.getData();
      setMusteriler(musteriData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Müşteri verisi alınamadı", error.message);
    }
  };

  const fetchAmbalajlar = async () => {
    try {
      setLoading(true);
      const ambalajData = await ambalajlarHttp.getData();
      setAmbalajlar(ambalajData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Ambalaj verisi alınamadı", error.message);
    }
  };
  const fetchDevamEdenUretimler = async () => {
    try {
      setLoading(true);
      const devamEdenUretimData = await devamEdenUretimHttp.getData();
      setDevamEdenUretimler(devamEdenUretimData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Üretim verisi alınamadı", error.message);
    }
  };

  useEffect(() => {
    fetchReferanslar();
    fetchMusteriler();
    fetchAmbalajlar();
    fetchDevamEdenUretimler();
  }, []);

  const value = {
    referanslar,
    setReferanslar,
    referansIslemTipleri,
    setReferansIslemTipleri,
    musteriler,
    setMusteriler,
    ambalajlar,
    setAmbalajlar,
    devamEdenUretimler,
    setDevamEdenUretimler,
    loading,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

DBProvider.propTypes = {
  children: PropTypes.element,
};
