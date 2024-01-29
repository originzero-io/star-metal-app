import { PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Space, Tag } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import PageHeader from "components/shared/PageHeader";
import { useDBContext } from "context/DBProvider";
import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // align-items: center;
  padding: 14px;
  max-width: 87%;
  width: 90%;
  overflow: auto;
`;

const FormStyled = styled(Form)`
  margin-top: 10px;
  width: 100%;
  padding: 30px;
  /* From https://css.glass */
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const SpaceStyled = styled(Space)`
  display: flex;
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  &:hover {
    border: 1px solid #b0ddfe;
    background-color: #e5f3fd;
  }
`;
export default function GelenMalzemeKayit() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const rules = [
    {
      required: true,
      message: "Bu alan zorunlu",
    },
  ];

  const [form] = Form.useForm();

  const [record, setRecord] = useState(null);
  const [printTrigger, setPrintTrigger] = useState(false);
  const { ambalajlar, referanslar } = useDBContext();

  const printRowData = async (name) => {
    try {
      const data = await form.validateFields([
        ["irsaliyeNo"],
        ["kontrolEden"],
        ["malzemeler", name, "referansNo"],
        ["malzemeler", name, "islemAciklama"],
        ["malzemeler", name, "siparisNo"],
        ["malzemeler", name, "adet"],
      ]);

      console.log("DATA: ", data);
      const cardRecord = {
        key: name,
        irsaliyeNo: data.irsaliyeNo,
        kontrolEden: data.kontrolEden,
        ...data.malzemeler[name],
      };

      console.log("cardRecord: ", cardRecord);
      setRecord(cardRecord);
      setPrintTrigger(true);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const selectReferenceHandle = (value, name) => {
    const selectedReference = referanslar.filter((referans) => referans.referansNo === value)[0];

    form.setFieldsValue({
      malzemeler: {
        ...form.getFieldValue("malzemeler"),
        [name]: {
          ...form.getFieldValue(["malzemeler", name]),
          islemAciklama: selectedReference.islemAciklama,
          siparisNo: selectedReference.siparisNo,
        },
      },
    });
  };

  const [selectedIrsaliyeTipi, setSelectedIrsaliyeTipi] = useState({});

  const selectedIrsaliyeTipiHandler = (value, name) => {
    if (value === "İade") {
      // sonradan İade olarak seçilirse mevcut değerler boşaltılsın diye
      form.setFieldsValue({
        malzemeler: {
          ...form.getFieldValue("malzemeler"),
          [name]: {
            ...form.getFieldValue(["malzemeler", name]),
            islemAciklama: "",
            siparisNo: "",
          },
        },
      });
    } else if (value === "Talep No'lu") {
      // sonradan Talep No'lu olarak seçilirse mevcut değerler boşaltılsın diye
      form.setFieldsValue({
        malzemeler: {
          ...form.getFieldValue("malzemeler"),
          [name]: {
            ...form.getFieldValue(["malzemeler", name]),
            siparisNo: "",
          },
        },
      });
    } else if (value === "Sipariş No'lu") {
      // sonradan Sipariş No'lu olarak seçilirse mevcut değerler boşaltılsın diye
      form.setFieldsValue({
        malzemeler: {
          ...form.getFieldValue("malzemeler"),
          [name]: {
            ...form.getFieldValue(["malzemeler", name]),
            talepNo: "",
          },
        },
      });
    }
    setSelectedIrsaliyeTipi({ ...selectedIrsaliyeTipi, [name]: value });
  };

  return (
    <Container>
      <FormStyled layout="vertical" onFinish={onFinish} form={form}>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PageHeader />
        </div>
        <Row
          gutter={4}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 6,
            padding: "12px",
            background: "rgba(255,255,255, 0.7)",
          }}
        >
          <Col span={8}>
            <Form.Item label="İrsaliye No" name="irsaliyeNo" rules={rules}>
              <Input placeholder="İrsaliye No" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Şoför" name="sofor" rules={rules}>
              <Input placeholder="Şoför" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Kontrol Eden" name="kontrolEden" rules={rules}>
              <Select placeholder="Kontrol Eden">
                <Select.Option value="Anıl Akseki">Anıl Akseki</Select.Option>
                <Select.Option value="Mustafa Akseki">Mustafa Akseki</Select.Option>
                <Select.Option value="Özlem Alanç">Özlem Alanç</Select.Option>
                <Select.Option value="Türkan Kader">Türkan Kader</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.List name="malzemeler">
          {(fields, { add, remove }) => (
            <div
              style={{
                marginTop: "20px",
              }}
            >
              {fields.map(({ key, name, ...restField }, i) => (
                <SpaceStyled key={key} align="baseline">
                  <Tag color="blue">{i}</Tag>

                  <Form.Item
                    {...restField}
                    name={[name, "malzemeTipi"]}
                    rules={rules}
                    style={{ width: "120px" }}
                  >
                    <Select
                      placeholder="İrsaliye Tipi"
                      style={{ width: "120px" }}
                      onChange={(value) => selectedIrsaliyeTipiHandler(value, name)}
                    >
                      <Select.Option value="Sipariş No'lu">Sipariş No'lu</Select.Option>
                      <Select.Option value="Talep No'lu">Talep No'lu</Select.Option>
                      <Select.Option value="İade">İade</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "referansNo"]}
                    rules={rules}
                    style={{ width: "140px" }}
                  >
                    {selectedIrsaliyeTipi[name] !== "Sipariş No'lu" ? (
                      <Input placeholder="Referans No" />
                    ) : (
                      <Select
                        showSearch
                        placeholder="Referans No"
                        name={name}
                        onChange={(value) => selectReferenceHandle(value, name)}
                      >
                        {referanslar.map((referans) => (
                          <Select.Option key={referans.referansNo} value={referans.referansNo}>
                            {referans.referansNo}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "islemAciklama"]}
                    rules={selectedIrsaliyeTipi[name] === "İade" ? rules : null}
                  >
                    <Input
                      disabled={selectedIrsaliyeTipi[name] === "Sipariş No'lu"}
                      placeholder="Açıklama"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "siparisNo"]}
                    rules={[
                      {
                        required: selectedIrsaliyeTipi[name] === "Sipariş No'lu",
                        message: "Bu alan zorunlu",
                      },
                    ]}
                  >
                    <Input
                      disabled={selectedIrsaliyeTipi[name] !== "İade"}
                      placeholder="Sipariş No"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "talepNo"]}
                    rules={selectedIrsaliyeTipi[name] === "Talep No'lu" ? rules : null}
                  >
                    <Input
                      disabled={selectedIrsaliyeTipi[name] !== "Talep No'lu"}
                      placeholder="Talep No"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "adet"]}
                    rules={rules}
                    style={{ width: "100px" }}
                  >
                    <Input placeholder="Adet" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "birinciAmbalaj"]}
                    rules={rules}
                    style={{ width: "120px" }}
                  >
                    <Select placeholder="1. Ambalaj">
                      {ambalajlar.map((ambalaj, i) => (
                        <Select.Option key={i} value={ambalaj.kasaAdi}>
                          {ambalaj.kasaAdi}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "ikinciAmbalaj"]}
                    style={{ width: "120px" }}
                  >
                    <Select placeholder="2. Ambalaj">
                      {ambalajlar.map((ambalaj, i) => (
                        <Select.Option key={i} value={ambalaj.kasaAdi}>
                          {ambalaj.kasaAdi}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item {...restField}>
                    <Button type="primary" onClick={() => printRowData(name)}>
                      İş Emri Yazdır
                    </Button>
                  </Form.Item>

                  <FaMinusCircle onClick={() => remove(name)} />
                </SpaceStyled>
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
                  Malzeme Ekle
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
        <div style={{ display: "none" }}>
          <UretimIsEmriKarti
            record={record}
            printTrigger={printTrigger}
            setPrintTrigger={setPrintTrigger}
          />
        </div>
      </FormStyled>
    </Container>
  );
}
