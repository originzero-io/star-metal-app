import NavigationMenu from "components/NavigationMenu/NavigationMenu";
// import "./App.css";
import styled from "styled-components";
import FormModal from "components/shared/FormModal";
import { UIProvider } from "context/UIProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TamamlananUretimler from "components/pages/TamamlananUretimler";
import DevamEdenUretimler from "components/pages/DevamEdenUretimler";
import Musteriler from "components/pages/Musteriler";
import Referanslar from "components/pages/Referanslar";
import Ambalajlar from "components/pages/Ambalajlar";
import Sicakliklar from "components/pages/Sicakliklar";
import GelenMalzemeKayit from "components/pages/GelenMalzemeKayit";
import BanyoDegerleri from "components/pages/BanyoDegerleri";
import { DBProvider } from "context/DBProvider";

const AppWrapperStyled = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f1f1f9;
  background: rgb(196, 207, 232);
  background: linear-gradient(180deg, #d4e0fa 52%, #dad0f3 100%);
  // background: linear-gradient(180deg, #d4e0fa 52%, #fce6e5 100%);
`;

function App() {
  return (
    <AppWrapperStyled>
      <UIProvider>
        <DBProvider>
          <Router>
            <NavigationMenu />
            <Routes>
              <Route path="/uretim/devam-eden" element={<DevamEdenUretimler />} />
              <Route path="/uretim/tamamlanan" element={<TamamlananUretimler />} />
              <Route path="/gelen-malzeme-kayit" element={<GelenMalzemeKayit />} />
              <Route path="/musteriler" element={<Musteriler />} />
              <Route path="/referanslar" element={<Referanslar />} />
              <Route path="/ambalajlar" element={<Ambalajlar />} />
              <Route path="/sicakliklar" element={<Sicakliklar />} />
              <Route path="/banyo-degerleri" element={<BanyoDegerleri />} />
            </Routes>
            <FormModal />
          </Router>
        </DBProvider>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
