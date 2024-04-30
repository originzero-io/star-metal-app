import NavigationMenu from "components/NavigationMenu/NavigationMenu";
import FormModal from "components/shared/FormModal";
import FormPanel from "components/shared/FormPanel";
import { DBProvider } from "context/DBProvider";
import { UIProvider } from "context/UIProvider";
import Ambalajlar from "pages/Ambalajlar";
import Banyolar from "pages/Banyolar/Banyolar";
import DevamEdenUretimler from "pages/DevamEdenUretimler";
import GelenMalzemeKayit from "pages/GelenMalzemeKayit";
import Irsaliyeler from "pages/Irsaliyeler";
import Login from "pages/Login";
import Musteriler from "pages/Musteriler";
import Personeller from "pages/Personeller";
import Soforler from "pages/Soforler";
import Plakalar from "pages/Plakalar";
import Referanslar from "pages/Referanslar";
import SevkEdilecekler from "pages/SevkEdilecekler";
import Sicakliklar from "pages/Sicakliklar";
import TamamlananUretimler from "pages/TamamlananUretimler";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import { AuthProvider } from "context/AuthProvider";
import ProtectedRoute from "pages/ProtectedRoute";

const AppWrapperStyled = styled.div`
  height: 100vh;
  display: flex;
  background-color: #f1f1f9;
  background: rgb(196, 207, 232);
  // background: linear-gradient(180deg, #d4e0fa 52%, #e8e2f7 100%);
  background: linear-gradient(180deg, #d4e0fa 52%, #dad0f3 100%);
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
            <AuthProvider>
              <NavigationMenu />
              <PageWrapperStyled>
                <Routes>
                  <Route path="/giris" element={<Login />} />
                  <Route
                    path="/uretim/devam-eden"
                    element={
                      <ProtectedRoute>
                        <DevamEdenUretimler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/uretim/sevk-edilecekler"
                    element={
                      <ProtectedRoute>
                        <SevkEdilecekler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/uretim/irsaliye-sayfasi"
                    element={
                      <ProtectedRoute>
                        <Irsaliyeler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/uretim/tamamlanan"
                    element={
                      <ProtectedRoute>
                        <TamamlananUretimler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/gelen-malzeme-kayit"
                    element={
                      <ProtectedRoute>
                        <GelenMalzemeKayit />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/musteriler"
                    element={
                      <ProtectedRoute>
                        <Musteriler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/referanslar"
                    element={
                      <ProtectedRoute>
                        <Referanslar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ambalajlar"
                    element={
                      <ProtectedRoute>
                        <Ambalajlar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/personeller"
                    element={
                      <ProtectedRoute>
                        <Personeller />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/soforler"
                    element={
                      <ProtectedRoute>
                        <Soforler />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/plakalar"
                    element={
                      <ProtectedRoute>
                        <Plakalar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/sicakliklar"
                    element={
                      <ProtectedRoute>
                        <Sicakliklar />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/banyo-degerleri"
                    element={
                      <ProtectedRoute>
                        <Banyolar />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </PageWrapperStyled>
            </AuthProvider>

            <FormModal />
            <FormPanel />
          </Router>
        </DBProvider>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
