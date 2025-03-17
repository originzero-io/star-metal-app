import { Col, Row } from "antd";
import PrintButton from "components/shared/PrintButton";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";

const ContainerStyled = styled.div`
  margin-top: 8px;
  padding: 10px;
  height: 40;
`;
const ColStyled = styled(Col)`
  border: 1px solid black;
  text-align: center;
  font-size: 2.3vmin;
  padding: 6px;
  flex-direction: column;
`;
const BaslikStyled = styled.div`
  font-size: 18px;
  font-family: Arial, sans-serif;
  /* font-family: "Courier New", Courier, monospace; */
`;

const IcerikStyled = styled.div`
  font-weight: bold;
  font-size: 30px;
  font-family: Arial, sans-serif;
  /* font-family: "Courier New", Courier, monospace; */
`;

const OKDaireStyled = styled.div`
  background-color: black;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  margin-top: 10px;
  margin-left: 40%;
  font-weight: bold;
  color: white;
`;

export default function SevkiyatKarti({ record, printTrigger, setPrintTrigger }) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (printTrigger && record) {
      handlePrint();
      setPrintTrigger(false);
    }
  }, [handlePrint, record]);

  return (
    <div>
      <PrintButton colorful handlePrintFunc={handlePrint} />
      <ContainerStyled ref={componentRef}>
        <Row>
          <ColStyled span={8}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>ALICI</BaslikStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "1.2vmin", marginRight: "40px" }}>
              <IcerikStyled style={{ fontSize: "20px" }}>
                {record.Referanslar.musteriAdi}
              </IcerikStyled>
            </div>
          </ColStyled>
          <ColStyled span={8} style={{ display: "flex", justifyContent: "center" }}>
            <BaslikStyled style={{ fontWeight: "bold", fontSize: 25 }}>
              SEVKİYAT TANITIM KARTI
            </BaslikStyled>
          </ColStyled>
          <ColStyled span={8} style={{ display: "flex", justifyContent: "center" }}>
            <BaslikStyled style={{ fontWeight: "bold", fontSize: 25 }}>STAR METAL</BaslikStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={24}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>REFERANS NO</BaslikStyled>
            </div>
            <div style={{ textAlign: "end", marginRight: "40px" }}>
              <IcerikStyled style={{ fontSize: "54px" }}>
                {record.Referanslar?.irsaliyeAciklamasi}
              </IcerikStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={24}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>KODU</BaslikStyled>
            </div>
            <div style={{ textAlign: "end", marginRight: "40px" }}>
              <IcerikStyled>{record.Referanslar.kodu}</IcerikStyled>
            </div>
          </ColStyled>
        </Row>

        <Row>
          <ColStyled span={12}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>ADET</BaslikStyled>
              <div style={{ textAlign: "center" }}>
                <IcerikStyled style={{ fontSize: "54px" }}>{record.uretimAdedi}</IcerikStyled>
              </div>
            </div>
          </ColStyled>
          <ColStyled span={12}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>GELİŞ REFERANSI</BaslikStyled>
            </div>
            <div style={{ textAlign: "start" }}>
              <IcerikStyled>{record.referansNo}</IcerikStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={12}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>AÇIKLAMA</BaslikStyled>
            </div>
            <div style={{ textAlign: "center" }}>
              <IcerikStyled style={{ fontSize: "48px" }}>
                {record.Referanslar.irsaliyeAciklamasi}
              </IcerikStyled>
            </div>
          </ColStyled>
          <ColStyled span={6}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>TARİH / SAAT</BaslikStyled>
            </div>
            <div style={{ textAlign: "center" }}>
              <IcerikStyled>{record.uretimTarihi}</IcerikStyled>
            </div>
          </ColStyled>
          <ColStyled span={3}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>BRÜT</BaslikStyled>
            </div>
            <div style={{ textAlign: "center" }}>
              <IcerikStyled>{record.brut}</IcerikStyled>
            </div>
          </ColStyled>
          <ColStyled span={3}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>DARA</BaslikStyled>
            </div>
            <div style={{ textAlign: "center" }}>
              <IcerikStyled>{record.dara}</IcerikStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={18}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>İŞLEM AÇIKLAMASI</BaslikStyled>
            </div>
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <IcerikStyled style={{ fontSize: "42px" }}>
                {record.Referanslar.ReferansUretim.not}
              </IcerikStyled>
            </div>
          </ColStyled>
          <ColStyled span={6}>
            <div style={{ textAlign: "start" }}>
              <BaslikStyled>KONTROL EDEN</BaslikStyled>
            </div>
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <IcerikStyled>{record.personel}</IcerikStyled>
            </div>
          </ColStyled>
        </Row>
        <OKDaireStyled>OK</OKDaireStyled>
      </ContainerStyled>
    </div>
  );
}
