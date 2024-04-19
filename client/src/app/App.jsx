import NavigationMenu from "components/NavigationMenu/NavigationMenu";
import styled from "styled-components";
import FormModal from "components/shared/FormModal";
import FormPanel from "components/shared/FormPanel";
import { UIProvider } from "context/UIProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TamamlananUretimler from "components/pages/TamamlananUretimler";
import DevamEdenUretimler from "components/pages/DevamEdenUretimler";
import Musteriler from "components/pages/Musteriler";
import Referanslar from "components/pages/Referanslar";
import Ambalajlar from "components/pages/Ambalajlar";
import Sicakliklar from "components/pages/Sicakliklar";
import GelenMalzemeKayit from "components/pages/GelenMalzemeKayit";
import Banyolar from "components/pages/Banyolar/Banyolar";
import { DBProvider } from "context/DBProvider";
import UretimSevkiyatHareketleri from "components/pages/UretimSevkiyatHareketleri";
import Personeller from "components/pages/Personeller";
import IrsaliyeSayfasi from "components/pages/IrsaliyeSayfasi";

const AppWrapperStyled = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f1f1f9;
  background: rgb(196, 207, 232);
  background: linear-gradient(180deg, #d4e0fa 52%, #e8e2f7 100%);
  // background: linear-gradient(180deg, #d4e0fa 52%, #dad0f3 100%);
`;

const PageWrapperStyled = styled.div`
  width: 87%;
  // padding: 0px;
  padding: 10px;
  overflow: auto;
`;

function App() {
  return (
    <AppWrapperStyled>
      <UIProvider>
        <DBProvider>
          <Router>
            <NavigationMenu />
            <PageWrapperStyled>
              <Routes>
                <Route path="/" element={<Navigate replace to="/uretim/devam-eden" />} />
                <Route path="/uretim/devam-eden" element={<DevamEdenUretimler />} />
                <Route path="/uretim/sevk-edilecekler" element={<UretimSevkiyatHareketleri />} />
                <Route path="/uretim/irsaliye-sayfasi" element={<IrsaliyeSayfasi />} />
                <Route path="/uretim/tamamlanan" element={<TamamlananUretimler />} />
                <Route path="/gelen-malzeme-kayit" element={<GelenMalzemeKayit />} />
                <Route path="/musteriler" element={<Musteriler />} />
                <Route path="/referanslar" element={<Referanslar />} />
                <Route path="/ambalajlar" element={<Ambalajlar />} />
                <Route path="/personeller" element={<Personeller />} />
                <Route path="/sicakliklar" element={<Sicakliklar />} />
                <Route path="/banyo-degerleri" element={<Banyolar />} />
              </Routes>
            </PageWrapperStyled>
            <FormModal />
            <FormPanel />
          </Router>
        </DBProvider>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
