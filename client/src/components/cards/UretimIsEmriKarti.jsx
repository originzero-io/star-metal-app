import { Col, Row } from "antd";
import PrintButton from "components/shared/PrintButton";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";

const ContainerStyled = styled.div`
  margin-top: 8px;
  padding: 10px;
  height: 600px;
`;
const ColStyled = styled(Col)`
  border: 1px solid black;
  font-size: 24px;
  font-family: Arial, sans-serif;
  padding: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const BaslikStyled = styled.div`
  font-size: 24px;
  font-family: Arial, sans-serif;
  /* font-family: "Courier New", Courier, monospace; */
`;

const IcerikStyled = styled.div`
  font-weight: bold;
  font-size: 44px;
  font-family: Arial, sans-serif;
  /* font-family: "Courier New", Courier, monospace; */
`;

export default function UretimIsEmriKarti({ record, printTrigger, setPrintTrigger }) {
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
    <div style={{ height: "10%" }}>
      <PrintButton colorful handlePrintFunc={handlePrint} />
      <ContainerStyled ref={componentRef}>
        <Row>
          <ColStyled span={6}>
            <BaslikStyled style={{ fontWeight: "bold", fontSize: 22 }}>STAR METAL</BaslikStyled>
          </ColStyled>
          <ColStyled span={12}>
            <BaslikStyled style={{ fontWeight: "bold", fontSize: 22 }}>
              ÜRETİM İŞ EMRİ KARTI
            </BaslikStyled>
          </ColStyled>
          <ColStyled span={6}>
            <BaslikStyled style={{ fontWeight: "bold", fontSize: 22 }}>
              {getCurrentDateTime()}
            </BaslikStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>REFERANS NO</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.referansNo}</IcerikStyled>
          </ColStyled>
          <ColStyled span={6}>KODU</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.Referanslar?.kodu || record?.kodu}</IcerikStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>ADET</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.gelenMiktar}</IcerikStyled>
          </ColStyled>
          <ColStyled span={6}>KAYIT EDEN</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.personel}</IcerikStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>İRSALİYE NO</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.irsaliyeNo}</IcerikStyled>
          </ColStyled>
          <ColStyled span={6}>KAYIT NO</ColStyled>
          <ColStyled span={6}>
            <IcerikStyled>{record?.id}</IcerikStyled>
          </ColStyled>
        </Row>
        <Row style={{ height: "150px" }}>
          <ColStyled span={16}>
            <BaslikStyled>ÜRETİM NOTU</BaslikStyled>
            <IcerikStyled style={{ marginTop: 20 }}>
              {record?.Referanslar?.ReferansUretim.not}
            </IcerikStyled>
          </ColStyled>
          <ColStyled span={8}>
            <BaslikStyled>ÜRETİME VEREN</BaslikStyled>
            <IcerikStyled style={{ marginTop: 20 }}>{record?.personel}</IcerikStyled>
          </ColStyled>
        </Row>
      </ContainerStyled>
    </div>
  );
}
