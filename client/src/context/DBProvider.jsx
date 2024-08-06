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
      const dbReferanslar = await referanslarHttp.getData();

      // const combinedReferanslar = await referanslarHttp.logoIleEsle(dbReferanslar);

      setReferanslar(dbReferanslar);

      const logoParcaAdlari = await logoGoApi.getData("GetParcaAdiList");
      setReferansParcaAdlari(logoParcaAdlari);
      const logoIslemTipleri = await logoGoApi.getData("GetIslemTipiList");
      setReferansIslemTipleri(logoIslemTipleri);
      const logoAnaBirimler = await logoGoApi.getData("GetAnaBirimList");
      setReferansAnaBirimleri(logoAnaBirimler);
    } catch (error) {
      console.log("Referanslar çekilirken hata oluştu", error);
    }
  };

  const fetchIrsaliyeler = async () => {
    const irsaliyeData = await irsaliyeHttp.getData();
    setIrsaliyeler(irsaliyeData);
  };

  const fetchMusteriler = async () => {
    const logoMusteriler = await logoGoApi.getData("GetCariList");
    setMusteriler(logoMusteriler);
  };

  const fetchAmbalajlar = async () => {
    const ambalajData = await ambalajlarHttp.getData();
    setAmbalajlar(ambalajData);
  };

  const fetchDevamEdenUretimler = async () => {
    const devamEdenUretimData = await devamEdenUretimHttp.getData();
    setDevamEdenUretimler(devamEdenUretimData);
  };

  const fetchPersoneller = async () => {
    const personelData = await personellerHttp.getData();
    setPersoneller(personelData);
  };

  const fetchSoforler = async () => {
    const logoSoforler = await logoGoApi.getData("GetSoforList");
    setSoforler(logoSoforler);
  };

  const fetchPlakalar = async () => {
    const logoPlakalar = await logoGoApi.getData("GetAracList");
    setPlakalar(logoPlakalar);
  };

  useEffect(() => {
    async function fetchAllState() {
      setLoading(true);

      await fetchReferanslar();
      await fetchDevamEdenUretimler();
      await Promise.all([
        fetchMusteriler(),
        fetchIrsaliyeler(),
        fetchAmbalajlar(),
        fetchPersoneller(),
        fetchSoforler(),
        fetchPlakalar(),
      ]);
      setLoading(false);
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
