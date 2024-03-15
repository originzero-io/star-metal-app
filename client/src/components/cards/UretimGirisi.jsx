import { Button, Col, Form, Radio, Row, Select, InputNumber } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { FormOutlined, CreditCardOutlined } from "@ant-design/icons";
import { getCurrentDateTime } from "utils/time.helper";
import SevkiyatKarti from "./SevkiyatKarti";
import { useDBContext } from "context/DBProvider";

const SectionBase = styled.div`
  border: 1px solid #d0d0d0;
  padding: 10px;
  border-radius: 6px;
`;
const Container = styled.div``;
const TopSection = styled.div`
  display: flex;
  justify-content: center;
`;
const MeasureSection = styled(SectionBase)`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;
const MeasureItem = styled.div`
  border: 1px solid #c4c4c4;
  margin: 10px;
  width: 20%;
  height: 85px;
  border-radius: 6px;
`;
const MeasureItemHeader = styled.div`
  text-align: center;
  background-color: rgb(107, 67, 175);
  color: whitesmoke;
  padding: 2px;
  font-size: 16px;
`;
const MeasureItemContent = styled.div`
  font-size: 3vmin;
  font-weight: 700;
  text-align: center;
`;

const MiddleSection = styled(SectionBase)`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FormSection = styled(SectionBase)`
  margin-top: 5px;
`;
const BottomSection = styled(SectionBase)`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  background-color: #c3c3c3;
  // background-image: linear-gradient(135deg, #c3c3c3 10%, #eeeeee 100%);
`;
const BottomItem = styled.div``;
const BottomHeader = styled.div``;
const BottomContent = styled.div`
  text-align: center;
  font-weight: 700;
  font-size: 2.3vmin;
`;

export default function UretimGirisi({ record }) {
  const { ambalajlar, referanslar } = useDBContext();

  const [malzemeTipi, setMalzemeTipi] = useState(record.malzemeTipi);
  const [miktarSapmasi, setMiktarSapmasi] = useState(
    referanslar.filter((referans) => referans.referansNo === record.referansNo)[0]?.miktarSapmasi,
  );

  const [printTrigger, setPrintTrigger] = useState(false);

  const onFinish = (values) => {
    console.log("Success:", values);
    setPrintTrigger(true);
  };
  const malzemeTipiHandler = (e) => {
    console.log("radio checked", e.target.value);
    setMalzemeTipi(e.target.value);
  };

  const [teraziOlcum, setTeraziOlcum] = useState({
    brut: 0,
    dara: 0,
    net: 0,
  });

  const fakeTeraziOlcumHandler = () => {
    const brut = Math.round((Math.random() * 100 + 1) * 10) / 10;
    const dara = Math.round((Math.random() * 100 + 1) * 10) / 10;
    const net = Math.round((Math.random() * 100 + 1) * 10) / 10;
    setTeraziOlcum({
      ...teraziOlcum,
      brut,
      dara,
      net,
    });
  };
  return (
    <Container>
      <TopSection>
        <Button type="primary" icon={<FormOutlined />} onClick={fakeTeraziOlcumHandler}>
          Teraziden Ölçüm Al
        </Button>
      </TopSection>
      <MeasureSection>
        <MeasureItem>
          <MeasureItemHeader>Brüt</MeasureItemHeader>
          <MeasureItemContent>{teraziOlcum.brut}</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Dara</MeasureItemHeader>
          <MeasureItemContent>{teraziOlcum.dara}</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Net</MeasureItemHeader>
          <MeasureItemContent>{teraziOlcum.net}</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Adet</MeasureItemHeader>
          <MeasureItemContent>{record.adet}</MeasureItemContent>
        </MeasureItem>
      </MeasureSection>
      <MiddleSection>
        <Radio.Group onChange={malzemeTipiHandler} value={malzemeTipi} disabled>
          <Radio value="Sipariş Nolu">Sipariş Nolu</Radio>
          <Radio value="Talep Nolu">Talep Nolu</Radio>
        </Radio.Group>
      </MiddleSection>
      <FormSection>
        <Form
          name="basic"
          layout="horizontal"
          labelCol={{ flex: "130px" }}
          labelAlign="left"
          // key={record ? record.id : "form"}
          initialValues={{ uretimAdedi: record.adet }}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item label="Üretim Sıra No">
                <div>{record.id}</div>
              </Form.Item>
              <Form.Item label="Referans Sıra No">
                <div>{record.id}</div>
              </Form.Item>
              {record.malzemeTipi === "Sipariş Nolu" ? (
                <Form.Item label="Sipariş No">
                  <div>{record.siparisNo}</div>
                </Form.Item>
              ) : (
                <Form.Item label="Talep No">
                  <div>{record.talepNo}</div>
                </Form.Item>
              )}
              <Form.Item label="İrsaliye No">
                <div>{record.irsaliyeNo}</div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Üretim Tarih">{getCurrentDateTime()}</Form.Item>
              <Form.Item
                label="Üretim Adedi"
                name="uretimAdedi"
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={record.adet - miktarSapmasi}
                  max={record.adet + miktarSapmasi}
                />
              </Form.Item>
              <Form.Item
                label="Personel"
                name="personel"
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <Select>
                  <Select.Option value="Anıl Akseki">Anıl Akseki</Select.Option>
                  <Select.Option value="Mustafa Akseki">Mustafa Akseki</Select.Option>
                  <Select.Option value="Özlem Alanç">Özlem Alanç</Select.Option>
                  <Select.Option value="Türkan Kader">Türkan Kader</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Kasa Tanımı 1"
                name="kasaTanimi1"
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <Select>
                  {ambalajlar.map((ambalaj, i) => (
                    <Select.Option key={i} value={ambalaj.kasaAdi}>
                      {ambalaj.kasaAdi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Kasa Tanımı 2"
                name="kasaTanimi2"
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <Select>
                  {ambalajlar.map((ambalaj, i) => (
                    <Select.Option key={i} value={ambalaj.kasaAdi}>
                      {ambalaj.kasaAdi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="primary" icon={<CreditCardOutlined />} htmlType="submit">
              Üretim Kartı Çıkart
            </Button>
          </Form.Item>
        </Form>
      </FormSection>
      <BottomSection>
        <BottomItem>
          <BottomHeader>Referans Miktarı</BottomHeader>
          <BottomContent>636</BottomContent>
        </BottomItem>
        <BottomItem>
          <BottomHeader>Toplam Üretim Miktarı</BottomHeader>
          <BottomContent>636</BottomContent>
        </BottomItem>
        <BottomItem>
          <BottomHeader>Kalan Üretim Miktarı</BottomHeader>
          <BottomContent>636</BottomContent>
        </BottomItem>
        <BottomItem>
          <BottomHeader>Toplam Sevkiyat Miktarı</BottomHeader>
          <BottomContent>0</BottomContent>
        </BottomItem>
        <BottomItem>
          <BottomHeader>Kalan Sevkiyat Miktarı</BottomHeader>
          <BottomContent>636</BottomContent>
        </BottomItem>
      </BottomSection>
      <div style={{ display: "none" }}>
        <SevkiyatKarti
          record={record}
          printTrigger={printTrigger}
          setPrintTrigger={setPrintTrigger}
        />
      </div>
    </Container>
  );
}
