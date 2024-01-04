import { Button, Col, Form, Input, Radio, Row, Select } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { FormOutlined } from "@ant-design/icons";
import { getCurrentDateTime } from "utils/time.helper";
import { ambalajData } from "components/tables/AmbalajTablo";

const Container = styled.div``;
const TopSection = styled.div``;
const MeasureSection = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  border: 1px solid black;
  padding: 10px;
`;
const MeasureItem = styled.div`
  border: 1px solid black;
  margin: 10px;
  width: 20%;
  height: 80px;
`;
const MeasureItemHeader = styled.div`
  text-align: center;
  background-color: gray;
`;
const MeasureItemContent = styled.div`
  font-size: 3vmin;
  font-weight: 700;
  text-align: center;
`;

const MiddleSection = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  padding: 10px;
`;
const FormSection = styled.div`
  margin-top: 5px;
  border: 1px solid black;
  padding: 10px;
`;
const BottomSection = styled.div`
  margin-top: 5px;
  border: 1px solid black;
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;
const BottomItem = styled.div`
  margin-top: 5px;
  border: 1px solid black;
  padding: 10px;
  display: flex;
`;

export default function UretimGirisi({ record }) {
  console.log(record);
  const [malzemeTipi, setMalzemeTipi] = useState("Talep No'lu");
  const malzemeTipiHandler = (e) => {
    console.log("radio checked", e.target.value);
    setMalzemeTipi(e.target.value);
  };
  const partiAdediHandler = (value) => {
    console.log("changed", value);
  };
  return (
    <Container>
      <TopSection>
        <Button type="primary" icon={<FormOutlined />}>
          Teraziden Ölçüm Al
        </Button>
      </TopSection>
      <MeasureSection>
        <MeasureItem>
          <MeasureItemHeader>Toplam</MeasureItemHeader>
          <MeasureItemContent>0</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Dara</MeasureItemHeader>
          <MeasureItemContent>0</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Net</MeasureItemHeader>
          <MeasureItemContent>0</MeasureItemContent>
        </MeasureItem>
        <MeasureItem>
          <MeasureItemHeader>Adet</MeasureItemHeader>
          <MeasureItemContent>0</MeasureItemContent>
        </MeasureItem>
      </MeasureSection>
      <MiddleSection>
        <Radio.Group onChange={malzemeTipiHandler} value={malzemeTipi}>
          <Radio value="Sipariş No'lu">Sipariş No'lu</Radio>
          <Radio value="Talep No'lu">Talep No'lu</Radio>
        </Radio.Group>
        <div style={{ width: "20%" }}>
          <span style={{ marginRight: "10px" }}>Parti Adedi: </span>
          <Input
            style={{ width: "50%" }}
            min={0}
            type="number"
            placeholder="Adet"
            onChange={partiAdediHandler}
          />
        </div>
      </MiddleSection>
      <FormSection>
        <Form
          name="basic"
          // labelCol={{
          //   span: 6,
          // }}
          layout="horizontal"
          labelCol={{ flex: "130px" }}
          labelAlign="left"
          // key={record ? record.key : "form"}
          initialValues={record || {}}
          //   onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item label="Üretim Sıra No">
                <div>1</div>
              </Form.Item>
              <Form.Item label="Referans Sıra No">
                <div>1</div>
              </Form.Item>
              <Form.Item label="Sipariş No">
                <div>{record.siparisNo}</div>
              </Form.Item>
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
                <Input type="number" min={0} />
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
                  {ambalajData.map((ambalaj, i) => (
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
                  {ambalajData.map((ambalaj, i) => (
                    <Select.Option key={i} value={ambalaj.kasaAdi}>
                      {ambalaj.kasaAdi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </FormSection>
      <BottomSection>
        <div>
          <div>Referans Miktarı</div>
          <div>636</div>
        </div>
        <div>
          <div>Toplam Üretim Miktarı</div>
          <div>636</div>
        </div>
        <div>
          <div>Kalan Üretim Miktarı</div>
          <div>636</div>
        </div>
        <div>
          <div>Toplam Sevkiyat Miktarı</div>
          <div>0</div>
        </div>
        <div>
          <div>Kalan Sevkiyat Miktarı</div>
          <div>636</div>
        </div>
      </BottomSection>
    </Container>
  );
}
