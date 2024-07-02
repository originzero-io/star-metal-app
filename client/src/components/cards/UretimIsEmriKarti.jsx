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
  text-align: center;
  font-size: 2vmin;
  padding: 14px;
`;
const BoldTextStyled = styled.div`
  font-weight: 800;
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
            <BoldTextStyled>STAR METAL</BoldTextStyled>
          </ColStyled>
          <ColStyled span={12}>
            <BoldTextStyled>ÜRETİM İŞ EMRİ KARTI</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{getCurrentDateTime()}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>Referans No</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.referansNo}</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>Kodu</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.Referanslar?.kodu || record?.kodu}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>Adet</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.gelenMiktar}</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>Kayıt Eden</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.personel}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>İrsaliye No</ColStyled>
          <ColStyled span={18}>
            <BoldTextStyled>{record?.irsaliyeNo}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row style={{ height: "150px" }}>
          <ColStyled span={18}>
            <BoldTextStyled>ÜRETİM NOTU</BoldTextStyled>
            <BoldTextStyled style={{ marginTop: 20 }}>
              {record.Referanslar?.ReferansUretim?.not}
            </BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>ÜRETİME VEREN</BoldTextStyled>
            <BoldTextStyled style={{ marginTop: 20 }}>{record?.personel}</BoldTextStyled>
          </ColStyled>
        </Row>
      </ContainerStyled>
    </div>
  );
}
