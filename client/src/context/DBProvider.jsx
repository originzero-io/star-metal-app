import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import ambalajlarHttp from "services/crud-server/ambalajlar.http";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import musterilerHttp from "services/crud-server/musteriler.http";
import personellerHttp from "services/crud-server/personeller.http";
import plakalarHttp from "services/crud-server/plakalar.http";
import referanslarHttp, {
  referansIslemTipleriHttp,
  referansParcaAdlariHttp,
} from "services/crud-server/referanslar.http";
import soforlerHttp from "services/crud-server/soforler.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import getUrlByEnvVariables from "utils/getServerUrl";
import { useUIContext } from "./UIProvider";

const DBContext = createContext();

axios.defaults.baseURL = getUrlByEnvVariables();

export const useDBContext = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [referansIslemTipleri, setReferansIslemTipleri] = useState([]);
  const [referansParcaAdlari, setReferansParcaAdlari] = useState([]);
  const [irsaliyeler, setIrsaliyeler] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [ambalajlar, setAmbalajlar] = useState([]);
  const [devamEdenUretimler, setDevamEdenUretimler] = useState({
    normalUretimler: [],
    fasonUretimler: [],
  });
  // ? uretimler denip {devamEdenler, tamamlananlar} şeklinde verilebilir
  const [personeller, setPersoneller] = useState([]);
  const [soforler, setSoforler] = useState([]);
  const [plakalar, setPlakalar] = useState([]);

  const [loading, setLoading] = useState(false);

  const { showNotification } = useUIContext();

  const fetchReferanslar = async () => {
    try {
      setLoading(true);
      const referansData = await referanslarHttp.getData();
      setReferanslar(referansData);
      const referansIslemTipiData = await referansIslemTipleriHttp.getData();
      setReferansIslemTipleri(referansIslemTipiData);
      const referansParcaAdiData = await referansParcaAdlariHttp.getData();
      setReferansParcaAdlari(referansParcaAdiData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Referans verisi alınamadı", error.message);
    }
  };

  const fetchIrsaliyeler = async () => {
    try {
      setLoading(true);
      const irsaliyeData = await irsaliyeHttp.getData();
      setIrsaliyeler(irsaliyeData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "İrsaliye verisi alınamadı", error.message);
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

  const fetchPersoneller = async () => {
    try {
      setLoading(true);
      const personelData = await personellerHttp.getData();
      setPersoneller(personelData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Personel verisi alınamadı", error.message);
    }
  };

  const fetchSoforler = async () => {
    try {
      setLoading(true);
      const soforData = await soforlerHttp.getData();
      setSoforler(soforData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Şoför verisi alınamadı", error.message);
    }
  };

  const fetchPlakalar = async () => {
    try {
      setLoading(true);
      const plakaData = await plakalarHttp.getData();
      setPlakalar(plakaData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Plaka verisi alınamadı", error.message);
    }
  };

  useEffect(() => {
    fetchDevamEdenUretimler();
    fetchReferanslar();
    fetchIrsaliyeler();
    fetchMusteriler();
    fetchAmbalajlar();
    fetchPersoneller();
    fetchSoforler();
    fetchPlakalar();
  }, []);

  const value = {
    referanslar,
    setReferanslar,
    referansIslemTipleri,
    setReferansIslemTipleri,
    referansParcaAdlari,
    setReferansParcaAdlari,
    irsaliyeler,
    setIrsaliyeler,
    musteriler,
    setMusteriler,
    ambalajlar,
    setAmbalajlar,
    devamEdenUretimler,
    setDevamEdenUretimler,
    personeller,
    setPersoneller,
    soforler,
    setSoforler,
    plakalar,
    setPlakalar,
    loading,
    setLoading,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
};

DBProvider.propTypes = {
  children: PropTypes.element,
};
