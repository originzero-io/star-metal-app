import NavigationMenu from "components/NavigationMenu/NavigationMenu";
import FormModal from "components/shared/FormModal";
import FormPanel from "components/shared/FormPanel";
import { DBProvider } from "context/DBProvider";
import { UIProvider } from "context/UIProvider";
import Ambalajlar from "pages/Tanimlamalar/Ambalajlar/Ambalajlar";
import Banyolar from "pages/Banyolar/Banyolar";
import DevamEdenUretimler from "pages/Uretimler/DevamEdenler/DevamEdenUretimler";
import GelenMalzemeKayit from "pages/GelenMalzemeKayit";
import Irsaliyeler from "pages/Uretimler/Irsaliyeler";
import Login from "pages/Login";
import Musteriler from "pages/Tanimlamalar/Musteriler/Musteriler";
import Personeller from "pages/Tanimlamalar/Personeller/Personeller";
import Soforler from "pages/Tanimlamalar/Soforler/Soforler";
import Plakalar from "pages/Tanimlamalar/Plakalar/Plakalar";
import Referanslar from "pages/Tanimlamalar/Referanslar/Referanslar";
import SevkEdilecekler from "pages/Uretimler/SevkEdilecekler";
import Sicakliklar from "pages/Sicakliklar";
import TamamlananUretimler from "pages/Uretimler/Tamamlananlar/TamamlananUretimler";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import styled from "styled-components";
import { AuthProvider } from "context/AuthProvider";
import ProtectedRoute from "pages/ProtectedRoute";

const AppWrapperStyled = styled.div`
  height: 100vh;
  display: flex;
  background: linear-gradient(180deg, #d4e0fa 52%, #bacdf7 100%);
  overflow: hidden;

  border-top: 4px solid;
  border-bottom: 4px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(90deg, #f06595, #845ec2, #3b82f6);
`;

const PageWrapperStyled = styled.div`
  width: 87%;
  padding: 10px;
  padding-left: 14px;
  overflow: auto;
  background-color: rgba(255, 255, 255, 0.2);
  margin-top: 7px;
  margin-left: 7px;
  border-top-left-radius: 8px;
  border: 1px solid #c3d1f2;
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
              <FormModal />
              <FormPanel />
            </AuthProvider>
          </Router>
        </DBProvider>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
