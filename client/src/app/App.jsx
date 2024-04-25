import NavigationMenu from "components/NavigationMenu/NavigationMenu";
import styled from "styled-components";
import FormModal from "components/shared/FormModal";
import FormPanel from "components/shared/FormPanel";
import { UIProvider } from "context/UIProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TamamlananUretimler from "pages/TamamlananUretimler";
import DevamEdenUretimler from "pages/DevamEdenUretimler";
import Musteriler from "pages/Musteriler";
import Referanslar from "pages/Referanslar";
import Ambalajlar from "pages/Ambalajlar";
import Sicakliklar from "pages/Sicakliklar";
import GelenMalzemeKayit from "pages/GelenMalzemeKayit";
import Banyolar from "pages/Banyolar/Banyolar";
import { DBProvider } from "context/DBProvider";
import SevkEdilecekler from "pages/SevkEdilecekler";
import Personeller from "pages/Personeller";
import Irsaliyeler from "pages/Irsaliyeler";
import Login from "pages/Login";
import { useState } from "react";
// import useAuth from "utils/useAuth";
import ProtectedRoute from "pages/ProtectedRoute";
import { AuthProvider, useAuth } from "context/AuthProvider";

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
        <Router>
          <AuthProvider>
            <DBProvider>
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
            </DBProvider>
          </AuthProvider>

          <FormModal />
          <FormPanel />
        </Router>
      </UIProvider>
    </AppWrapperStyled>
  );
}

export default App;
