import NavigationMenu from "components/NavigationMenu/NavigationMenu";
// import "./App.css";
import styled from "styled-components";
import FormModal from "components/shared/FormModal";
import { UIProvider } from "context/UIProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TamamlananUretimTablo from "components/tables/TamamlananUretimTablo";
import DevamEdenUretimTablo from "components/tables/DevamEdenUretimTablo";
import MusteriTablo from "components/tables/MusteriTablo";
import ReferansTablo from "components/tables/ReferansTablo";
import AmbalajTablo from "components/tables/AmbalajTablo";
import SicaklikTablo from "components/tables/SicaklikTablo";
import GelenMalzemeKayitForm from "components/forms/GelenMalzemeKayitForm";

const AppWrapperStyled = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f1f1f9;
  // background: #e0eafc;
  /* background: #e0eafc;
  background: -webkit-linear-gradient(to bottom, #cfdef3, #e0eafc); /* Chrome 10-25, Safari 5.1-6 */
  //background: linear-gradient(to bottom, #f7f9fa, #e0eafc); */
  // background: #c3cbdc;
  // background: #c4cfe8;
  background: rgb(196, 207, 232);
  // background: linear-gradient(180deg, #d4e0fa 52%, #fed4d2 100%);
  background: linear-gradient(180deg, #d4e0fa 52%, #fce6e5 100%);
`;

function App() {
  return (
    <AppWrapperStyled>
      <UIProvider>
        <Router>
          <NavigationMenu />
          <Routes>
            <Route path="/uretim/devam-eden" element={<DevamEdenUretimTablo />} />
            <Route path="/uretim/tamamlanan" element={<TamamlananUretimTablo />} />
            <Route path="/gelen-malzeme-kayit" element={<GelenMalzemeKayitForm />} />
            <Route path="/musteriler" element={<MusteriTablo />} />
            <Route path="/referanslar" element={<ReferansTablo />} />
            <Route path="/ambalajlar" element={<AmbalajTablo />} />
            <Route path="/sicakliklar" element={<SicaklikTablo />} />
          </Routes>
          <FormModal />
        </Router>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
