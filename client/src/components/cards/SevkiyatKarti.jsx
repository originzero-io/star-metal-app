import { Col, Row } from "antd";
import PrintButton from "components/shared/PrintButton";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";

const ContainerStyled = styled.div`
  margin-top: 8px;
  padding: 10px;
`;
const ColStyled = styled(Col)`
  border: 1px solid black;
  text-align: center;
  font-size: 3vmin;
  padding: 6px;
  flex-direction: column;
`;
const BoldTextStyled = styled.div`
  font-weight: 800;
  font-size: 3vmin;
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
          <ColStyled span={6}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>ALICI</BoldTextStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "1.5vmin", marginRight: "40px" }}>
              <BoldTextStyled>{record.alici}</BoldTextStyled>
            </div>
          </ColStyled>
          <ColStyled span={12} style={{ display: "flex", justifyContent: "center" }}>
            <BoldTextStyled>SEVKİYAT TANITIM KARTI</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6} style={{ display: "flex", justifyContent: "center" }}>
            <BoldTextStyled>STAR METAL</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={24}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>REFERANS NO</BoldTextStyled>
            </div>
            <div style={{ textAlign: "end", fontSize: "2.2vmin", marginRight: "40px" }}>
              <BoldTextStyled>{record.referansNo}</BoldTextStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={24}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>KODU</BoldTextStyled>
            </div>
            <div style={{ textAlign: "end", fontSize: "2.2vmin", marginRight: "40px" }}>
              <BoldTextStyled>{record.Referanslar.kodu}</BoldTextStyled>
            </div>
          </ColStyled>
        </Row>

        <Row>
          <ColStyled span={12}>
            <div style={{ textAlign: "start" }}>
              <BoldTextStyled>ADET</BoldTextStyled>
              <div style={{ textAlign: "start", fontSize: "2.2vmin" }}>
                <BoldTextStyled>{record.uretimAdedi}</BoldTextStyled>
              </div>
            </div>
          </ColStyled>
          <ColStyled span={12}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>GELİŞ REFERANSI</BoldTextStyled>
            </div>
            <div style={{ textAlign: "start", fontSize: "2.2vmin" }}>
              <BoldTextStyled>{record.referansNo}</BoldTextStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={12}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>AÇIKLAMA</BoldTextStyled>
            </div>
            <div style={{ textAlign: "start", fontSize: "2vmin" }}>
              <BoldTextStyled>{record.Referanslar.irsaliyeAciklamasi}</BoldTextStyled>
            </div>
          </ColStyled>
          <ColStyled span={6}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>TARİH / SAAT</BoldTextStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "2vmin" }}>
              <BoldTextStyled>{getCurrentDateTime()}</BoldTextStyled>
            </div>
          </ColStyled>
          <ColStyled span={3}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>BRÜT</BoldTextStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "2.2vmin" }}>
              <BoldTextStyled>{record.brut}</BoldTextStyled>
            </div>
          </ColStyled>
          <ColStyled span={3}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>DARA</BoldTextStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "2.2vmin" }}>
              <BoldTextStyled>{record.dara}</BoldTextStyled>
            </div>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={18}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>İŞLEM AÇIKLAMASI</BoldTextStyled>
            </div>
            <div style={{ textAlign: "start", fontSize: "2vmin", marginTop: "8px" }}>
              <BoldTextStyled>{record.Referanslar.ReferansUretim.not}</BoldTextStyled>
            </div>
          </ColStyled>
          <ColStyled span={6}>
            <div style={{ textAlign: "start", fontSize: "1.3vmin" }}>
              <BoldTextStyled>KONTROL EDEN</BoldTextStyled>
            </div>
            <div style={{ textAlign: "center", fontSize: "2.2vmin", marginTop: "8px" }}>
              <BoldTextStyled>{record.personel}</BoldTextStyled>
            </div>
          </ColStyled>
        </Row>
      </ContainerStyled>
    </div>
  );
}
