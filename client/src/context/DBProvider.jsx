import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import ambalajlarHttp from "services/crud-server/ambalajlar.http";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import personellerHttp from "services/crud-server/personeller.http";
import referanslarHttp from "services/crud-server/referanslar.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import logoGoApi from "services/logoGoApi";
import getUrlByEnvVariables from "utils/getServerUrl";
import { useUIContext } from "./UIProvider";

const DBContext = createContext();

axios.defaults.baseURL = getUrlByEnvVariables();

export const useDBContext = () => useContext(DBContext);

export const DBProvider = ({ children }) => {
  const [referanslar, setReferanslar] = useState([]);
  const [referansIslemTipleri, setReferansIslemTipleri] = useState([]);
  const [referansParcaAdlari, setReferansParcaAdlari] = useState([]);
  const [referansAnaBirimleri, setReferansAnaBirimleri] = useState([]);

  const [irsaliyeler, setIrsaliyeler] = useState([]);
  const [musteriler, setMusteriler] = useState([]);
  const [ambalajlar, setAmbalajlar] = useState([]);
  const [devamEdenUretimler, setDevamEdenUretimler] = useState({
    normalUretimler: [],
    fasonUretimler: [],
  });
  const [tamamlananUretimler, setTamamlananUretimler] = useState({
    normalUretimler: [],
    fasonUretimler: [],
  });
  const [personeller, setPersoneller] = useState([]);
  const [soforler, setSoforler] = useState([]);
  const [plakalar, setPlakalar] = useState([]);

  const [loading, setLoading] = useState(false);

  const { showNotification } = useUIContext();

  const fetchReferanslar = async () => {
    try {
      setLoading(true);

      const dbReferanslar = await referanslarHttp.getData();

      // const combinedReferanslar = await referanslarHttp.logoIleEsle(dbReferanslar);

      setReferanslar(dbReferanslar);
      showNotification("success", "Referanslar veri tabanından alındı.");

      const logoParcaAdlari = await logoGoApi.getData("GetParcaAdiList");
      setReferansParcaAdlari(logoParcaAdlari);
      const logoIslemTipleri = await logoGoApi.getData("GetIslemTipiList");
      setReferansIslemTipleri(logoIslemTipleri);
      const logoAnaBirimler = await logoGoApi.getData("GetAnaBirimList");
      setReferansAnaBirimleri(logoAnaBirimler);

      showNotification("success", "Referans alt bilgileri logodan alındı.");

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
      showNotification("error", "İrsaliye verisi veritabanından alınamadı", error.message);
    }
  };
  const fetchMusteriler = async () => {
    try {
      setLoading(true);
      const logoMusteriler = await logoGoApi.getData("GetCariList");
      setMusteriler(logoMusteriler);
      showNotification("success", "Müşteriler logodan alındı.");

      setLoading(false);
    } catch (error) {
      showNotification("error", "Müşteri verisi logodan alınamadı", error.message);
    }
  };

  const fetchAmbalajlar = async () => {
    try {
      setLoading(true);
      const ambalajData = await ambalajlarHttp.getData();
      setAmbalajlar(ambalajData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Ambalaj verisi veritabanından alınamadı", error.message);
    }
  };
  const fetchDevamEdenUretimler = async () => {
    try {
      setLoading(true);
      const devamEdenUretimData = await devamEdenUretimHttp.getData();
      setDevamEdenUretimler(devamEdenUretimData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Üretim verisi veritabanından alınamadı", error.message);
    }
  };

  const fetchPersoneller = async () => {
    try {
      setLoading(true);
      const personelData = await personellerHttp.getData();
      setPersoneller(personelData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Personel verisi veritabanından alınamadı", error.message);
    }
  };

  const fetchSoforler = async () => {
    try {
      setLoading(true);
      const logoSoforler = await logoGoApi.getData("GetSoforList");
      setSoforler(logoSoforler);
      showNotification("success", "Şoförler logodan alındı.");

      setLoading(false);
    } catch (error) {
      showNotification("error", "Şoför verisi logodan alınamadı", error.message);
    }
  };

  const fetchPlakalar = async () => {
    try {
      setLoading(true);
      const logoPlakalar = await logoGoApi.getData("GetAracList");
      setPlakalar(logoPlakalar);
      showNotification("success", "Plakalar logodan alındı.");

      setLoading(false);
    } catch (error) {
      showNotification("error", "Plaka verisi logodan alınamadı", error.message);
    }
  };

  useEffect(() => {
    async function fetchAllState() {
      await fetchReferanslar();
      await fetchDevamEdenUretimler();
      await Promise.all([
        fetchIrsaliyeler(),
        fetchMusteriler(),
        fetchAmbalajlar(),
        fetchPersoneller(),
        fetchSoforler(),
        fetchPlakalar(),
      ]);
    }
    fetchAllState();
  }, []);

  const value = {
    referanslar,
    setReferanslar,
    referansIslemTipleri,
    setReferansIslemTipleri,
    referansParcaAdlari,
    setReferansParcaAdlari,
    referansAnaBirimleri,
    setReferansAnaBirimleri,
    irsaliyeler,
    setIrsaliyeler,
    musteriler,
    setMusteriler,
    ambalajlar,
    setAmbalajlar,
    devamEdenUretimler,
    setDevamEdenUretimler,
    tamamlananUretimler,
    setTamamlananUretimler,
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
