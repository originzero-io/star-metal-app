import React, { useEffect } from "react";
import styled from "styled-components";
import { PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Space, Tag } from "antd";
import { FaMinusCircle } from "react-icons/fa";

const BanyoTanimlamaContainerStyled = styled.div`
  width: 100%;
  height: 90vh;
  padding: 24px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export default function BanyoTanimlama({ content }) {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  useEffect(() => {
    // Başlangıçta 5 boş satır ekle
    const initialRows = Array.from({ length: 5 }, (_, i) => ({
      hucre: `Hücre ${i + 1}`,
      birinciDeger: i + 1,
      ikinciDeger: i + 5,
      aciklama: `Açıklama ${i + 1}`,
    }));

    form.setFieldsValue({ islemler: initialRows });
  }, [form]);

  const rules = [
    {
      required: true,
      message: "Bu alan zorunlu",
    },
  ];
  return (
    <BanyoTanimlamaContainerStyled>
      <div>
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Row
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: 6,
              padding: "12px",
              background: "rgba(255,255,255, 0.7)",
            }}
          >
            <Col span={12}>
              <Form.Item label="Banyo Ömrü" name="banyoOmru" rules={rules}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Malzeme Sayacı" name="malzemeSayaci" rules={rules}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.List name="islemler">
            {(fields, { add, remove }) => (
              <div
                style={{
                  marginTop: "20px",
                }}
              >
                {fields.map(({ key, name, ...restField }, i) => (
                  <Row
                    gutter={2}
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Col span={1}>
                      <Tag color="blue">{i}</Tag>
                    </Col>
                    <Col span={4}>
                      <Form.Item {...restField} name={[name, "hucre"]}>
                        <Select placeholder="Hücre">
                          {Object.keys(content.parameters).map((parameterKey) => (
                            <Select.Option key={parameterKey}>{parameterKey}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item {...restField} name={[name, "birinciDeger"]}>
                        <Input placeholder="İlk değer" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <div style={{ textAlign: "center" }}> {">= : <="}</div>
                    </Col>
                    <Col span={3}>
                      <Form.Item {...restField} name={[name, "ikinciDeger"]}>
                        <Input placeholder="İkinci Değer" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item {...restField} name={[name, "aciklama"]}>
                        <Input placeholder="Parametreye göre açıklama" />
                      </Form.Item>
                    </Col>
                    <Col span={1}>
                      <FaMinusCircle onClick={() => remove(name)} />
                    </Col>
                  </Row>
                ))}
                <Form.Item style={{ marginBottom: "20px" }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleFilled style={{ fontSize: "15px" }} />}
                    style={{
                      padding: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    İşlem Ekle
                  </Button>
                </Form.Item>
              </div>
            )}
          </Form.List>
          <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button htmlType="reset" style={{ marginRight: "10px" }}>
              Sıfırla
            </Button>
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Form.Item>
        </Form>{" "}
      </div>
    </BanyoTanimlamaContainerStyled>
  );
}
