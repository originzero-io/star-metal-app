import { Button, Col, Row } from "antd";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useReactToPrint } from "react-to-print";
import { IoPrintOutline } from "react-icons/io5";
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
          <ColStyled span={6}>Sipariş No</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.siparisNo}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>Adet</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.lotAdedi}</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>Kayıt Eden</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.kontrolEden}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row>
          <ColStyled span={6}>İrsaliye No</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.irsaliyeNo}</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>Kayıt No</ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>{record?.key}</BoldTextStyled>
          </ColStyled>
        </Row>
        <Row style={{ height: "150px" }}>
          <ColStyled span={12}>
            <BoldTextStyled>İŞLEM AÇIKLAMASI</BoldTextStyled>
            <BoldTextStyled>{record?.islemAciklama}</BoldTextStyled>
          </ColStyled>
          <ColStyled span={6}>
            <img
              alt="referansResim"
              src={`http://localhost:6333/uploads/referanslar/${record?.resimUrl}`}
              style={{ maxWidth: "100%" }}
            />
          </ColStyled>
          <ColStyled span={6}>
            <BoldTextStyled>ÜRETİME VEREN</BoldTextStyled>
            <BoldTextStyled>{record?.kontrolEden}</BoldTextStyled>
          </ColStyled>
        </Row>
      </ContainerStyled>
    </div>
  );
}
