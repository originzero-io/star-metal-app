import { PlusCircleFilled } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Space, Tag } from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import PageHeader from "components/shared/PageHeader";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { devamEdenUretimHttp } from "services/uretim.http";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";

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
  const { devamEdenUretimler, setDevamEdenUretimler } = useDBContext();
  const { showNotification } = useUIContext();

  const onFinish = async (values) => {
    console.log("Success:", values);

    const { irsaliyeNo, getirenSofor, kontrolEden, malzemeler } = values;

    const records = malzemeler.map((malzeme) => ({
      irsaliyeNo,
      getirenSofor,
      kontrolEden,
      ...malzeme,
      gelenTarih: getCurrentDateTime(),
      gidenMiktar: 0,
      kalanMiktar: malzeme.adet,
      uretilenMiktar: 0,
      uretilmeyenMiktar: malzeme.adet,
    }));

    const newMalzemeler = await devamEdenUretimHttp.addData(records);

    setDevamEdenUretimler([...devamEdenUretimler, ...newMalzemeler]);
    showNotification("success", `${newMalzemeler.length} adet malzeme üretime eklendi.`);
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
        ["malzemeler", name, "resimUrl"],
      ]);

      const cardRecord = {
        key: name,
        irsaliyeNo: data.irsaliyeNo,
        kontrolEden: data.kontrolEden,
        ...data.malzemeler[name],
      };

      console.log(">>> Print Card Record: ", cardRecord);
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
          resimUrl: selectedReference.resimUrl,
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
    } else if (value === "Talep Nolu") {
      // sonradan Talep Nolu olarak seçilirse mevcut değerler boşaltılsın diye
      form.setFieldsValue({
        malzemeler: {
          ...form.getFieldValue("malzemeler"),
          [name]: {
            ...form.getFieldValue(["malzemeler", name]),
            siparisNo: "",
          },
        },
      });
    } else if (value === "Sipariş Nolu") {
      // sonradan Sipariş Nolu olarak seçilirse mevcut değerler boşaltılsın diye
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
            <Form.Item label="Şoför" name="getirenSofor" rules={rules}>
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
                      <Select.Option value="Sipariş Nolu">Sipariş Nolu</Select.Option>
                      <Select.Option value="Talep Nolu">Talep Nolu</Select.Option>
                      <Select.Option value="İade">İade</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "referansNo"]}
                    rules={rules}
                    style={{ width: "140px" }}
                  >
                    {selectedIrsaliyeTipi[name] !== "Sipariş Nolu" ? (
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
                      disabled={selectedIrsaliyeTipi[name] === "Sipariş Nolu"}
                      placeholder="Açıklama"
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "siparisNo"]}
                    rules={[
                      {
                        required: selectedIrsaliyeTipi[name] === "Sipariş Nolu",
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
                    rules={selectedIrsaliyeTipi[name] === "Talep Nolu" ? rules : null}
                  >
                    <Input
                      disabled={selectedIrsaliyeTipi[name] !== "Talep Nolu"}
                      placeholder="Talep No"
                    />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "adet"]} rules={rules}>
                    <InputNumber placeholder="Adet" min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "birinciAmbalaj"]}
                    rules={rules}
                    style={{ width: "120px" }}
                  >
                    <Select placeholder="1. Ambalaj">
                      {ambalajlar.map((ambalaj) => (
                        <Select.Option key={ambalaj.id} value={ambalaj.kasaAdi}>
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
                      {ambalajlar.map((ambalaj) => (
                        <Select.Option key={ambalaj.id} value={ambalaj.kasaAdi}>
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
