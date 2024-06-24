import axios from "axios";
import PropTypes from "prop-types";
import { createContext, useContext, useEffect, useState } from "react";
import logoGoApi from "services/logoGoApi";
import ambalajlarHttp from "services/crud-server/ambalajlar.http";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import personellerHttp from "services/crud-server/personeller.http";
import referanslarHttp from "services/crud-server/referanslar.http";
import { devamEdenUretimHttp, tamamlananUretimHttp } from "services/crud-server/uretimler.http";
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
  // ? uretimler denip {devamEdenler, tamamlananlar} şeklinde verilebilir
  const [personeller, setPersoneller] = useState([]);
  const [soforler, setSoforler] = useState([]);
  const [plakalar, setPlakalar] = useState([]);

  const [loading, setLoading] = useState(false);

  const { showNotification } = useUIContext();

  const fetchReferanslar = async () => {
    try {
      setLoading(true);
      const logoParcaAdlari = await logoGoApi.getData("GetParcaAdiList");
      setReferansParcaAdlari(logoParcaAdlari);
      showNotification("success", "Referans parça adları logo ile eşlendi.");

      const logoIslemTipleri = await logoGoApi.getData("GetIslemTipiList");
      setReferansIslemTipleri(logoIslemTipleri);
      showNotification("success", "Referans işlem tipleri logo ile eşlendi.");

      const logoAnaBirimler = await logoGoApi.getData("GetAnaBirimList");
      setReferansAnaBirimleri(logoAnaBirimler);
      showNotification("success", "Referans ana birimleri logo ile eşlendi.");

      // const logoReferanslar = await logoGoApi.getData("GetReferansList");
      // await referanslarHttp.logoIleEsle(logoReferanslar);
      const logoReferanslar = await referanslarHttp.getData();
      setReferanslar(logoReferanslar);
      showNotification("success", "Referanslar logo ile eşlendi.");
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
      const logoMusteriler = await logoGoApi.getData("GetCariList");
      setMusteriler(logoMusteriler);
      showNotification("success", "Müşteriler logo ile eşlendi.");

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
      console.log("devamEdenUretimData", devamEdenUretimData);

      setDevamEdenUretimler(devamEdenUretimData);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Üretim verisi alınamadı", error.message);
    }
  };

  const fetchTamamlananUretimler = async () => {
    try {
      setLoading(true);
      const tamamlananUretimData = await tamamlananUretimHttp.getData();
      console.log("tamamlananUretimData", tamamlananUretimData);

      setTamamlananUretimler(tamamlananUretimData);
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
      const logoSoforler = await logoGoApi.getData("GetSoforList");
      setSoforler(logoSoforler);
      showNotification("success", "Şoförler logo ile eşlendi.");

      setLoading(false);
    } catch (error) {
      showNotification("error", "Şoför verisi alınamadı", error.message);
    }
  };

  const fetchPlakalar = async () => {
    try {
      setLoading(true);
      const logoPlakalar = await logoGoApi.getData("GetAracList");
      setPlakalar(logoPlakalar);
      setLoading(false);
    } catch (error) {
      showNotification("error", "Plaka verisi alınamadı", error.message);
    }
  };

  useEffect(() => {
    // fetchDevamEdenUretimler();
    // fetchReferanslar();
    // fetchIrsaliyeler();
    // fetchMusteriler();
    // fetchAmbalajlar();
    // fetchPersoneller();
    // fetchSoforler();
    // fetchPlakalar();
    async function fetchAllState() {
      await Promise.all([
        fetchDevamEdenUretimler(),
        fetchTamamlananUretimler(),
        fetchReferanslar(),
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
