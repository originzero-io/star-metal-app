import { FolderAddTwoTone, PlusCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import UretimIsEmriKarti from "components/cards/UretimIsEmriKarti";
import PageHeader from "components/shared/PageHeader";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { FaMinusCircle } from "react-icons/fa";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 14px;
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
  // justify-content: flex-start;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 6px;
  overflow-y: auto;
  // align-items: center;
  &:hover {
    border: 1px solid rgb(131, 92, 197);
  }
`;

const rules = [
  {
    required: true,
    message: "Bu alan zorunlu",
  },
];

export default function GelenMalzemeKayit() {
  const {
    devamEdenUretimler,
    setDevamEdenUretimler,
    musteriler,
    ambalajlar,
    referanslar,
    personeller,
    soforler,
  } = useDBContext();
  const { showNotification, showAlert } = useUIContext();

  const [form] = Form.useForm();

  const [seciliReferansFasonluk, setSeciliReferansFasonluk] = useState({});
  const [seciliReferansSiparisTipi, setSeciliReferansSiparisTipi] = useState({});

  const [printRecord, setPrintRecord] = useState({});
  const [printTrigger, setPrintTrigger] = useState(false);

  const [musteriReferanslari, setMusteriReferanslari] = useState([]);

  const [kayitDurumu, setKayitDurumu] = useState(false);

  const isEmriYazdir = async (name) => {
    try {
      const data = form.getFieldsValue();

      const referans = referanslar.filter(
        (referans) => referans.referansNo === data.malzemeler[name].referansNo,
      )[0];

      const uretim = referans.fason
        ? devamEdenUretimler.fasonUretimler.find(
            (f) =>
              f.irsaliyeNo === data.irsaliyeNo &&
              f.referansNo === referans.referansNo &&
              f.gelenMiktar === data.malzemeler[name].gelenMiktar,
          )
        : devamEdenUretimler.normalUretimler.find(
            (f) =>
              f.irsaliyeNo === data.irsaliyeNo &&
              f.referansNo === referans.referansNo &&
              f.gelenMiktar === data.malzemeler[name].gelenMiktar,
          );

      const cardRecord = {
        key: name,
        id: uretim.id,
        irsaliyeNo: data.irsaliyeNo,
        personel: data.personel,
        kodu: referans.kodu,
        Referanslar: { ...referans }, // üretim iş emri kartı için
        ...data.malzemeler[name],
      };

      console.log(">>> Print Card Record: ", cardRecord);
      setPrintRecord(cardRecord);
      setPrintTrigger(true);
    } catch (errorInfo) {
      console.log("Validation failed:", errorInfo);
    }
  };

  const referansSecimiYap = (value, name) => {
    const selectedReference = referanslar.filter((referans) => referans.referansNo === value)[0];

    // bu referans no'lu kayıdın fasonluk bilgisini tut (true/false)
    setSeciliReferansFasonluk({
      ...seciliReferansFasonluk,
      [name]: selectedReference.fason === 1 ? true : false,
    });

    // bu referans no'lu kayıdın sipariş tipi bilgisini tut (SERİ/TALEPLİ)
    setSeciliReferansSiparisTipi({
      ...seciliReferansSiparisTipi,
      [name]: selectedReference.siparisTipi,
    });

    form.setFieldsValue({
      malzemeler: {
        ...form.getFieldValue("malzemeler"),
        [name]: {
          ...form.getFieldValue(["malzemeler", name]),
          islemTipi: selectedReference.islemTipi,
          fason: selectedReference.fason ? "Fason" : "Fason Değil",
          fasonFirmasi: selectedReference.fasonFirmasi,
          resimUrl: selectedReference.resimUrl,
        },
      },
    });
  };

  const musteriSecimiYap = (value) => {
    const musteriRef = referanslar.filter((referans) => referans.musteriRef === value);
    setMusteriReferanslari(musteriRef);
    form.setFieldsValue({ malzemeler: null }); // müşteri seçimi değiştirildiğinde tüm satırlar temizlensin
    setKayitDurumu(false);
  };

  const satirEkle = (addRowFunc) => {
    if (form.getFieldValue("musteriAdi")) {
      addRowFunc();
    } else {
      showAlert("warning", "Satır eklemeden önce müşteri seçimi yapın.");
    }
  };

  const satiriSil = (name, removeRowFunc) => {
    removeRowFunc(name);
    setSeciliReferansFasonluk((prevState) => {
      const newState = { ...prevState };
      delete newState[name];
      return newState;
    });
  };

  const onFinish = async (values) => {
    console.log("Success:", values);

    const { irsaliyeNo, getirenSofor, personel, malzemeler } = values;

    const yeniMalzemeler = malzemeler.map((malzeme) => ({
      gelenTarih: getCurrentDateTime(),
      irsaliyeNo,
      getirenSofor,
      personel,
      referansNo: malzeme.referansNo,
      iade: malzeme.iade, // ? bu true false da yapılabilir
      birinciAmbalaj: malzeme.birinciAmbalaj,
      ikinciAmbalaj: malzeme.ikinciAmbalaj,
      fason: malzeme.fason === "Fason", // true or false
      fasonFirmasi: malzeme.fasonFirmasi,
      gelenMiktar: malzeme.gelenMiktar,
      gidenMiktar: 0,
      kalanMiktar: malzeme.gelenMiktar,
      uretilenMiktar: 0,
      uretilmeyenMiktar: malzeme.gelenMiktar,
    }));

    console.log("Gelen Malzeme Kayıtları: ", yeniMalzemeler);

    setKayitDurumu(true);

    const { normalUretimler, fasonUretimler } = await devamEdenUretimHttp.addData(yeniMalzemeler);

    setDevamEdenUretimler((prevState) => ({
      normalUretimler: [...prevState.normalUretimler, ...normalUretimler],
      fasonUretimler: [...prevState.fasonUretimler, ...fasonUretimler],
    }));
    showNotification("success", `Malzemeler üretime eklendi.`);
  };

  return (
    <Container>
      <PageHeader label="Gelen Malzeme Kaydı" icon={<FolderAddTwoTone twoToneColor="#5c0099" />} />
      <FormStyled layout="vertical" onFinish={onFinish} form={form}>
        <Row
          gutter={4}
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: 6,
            padding: "12px",
            background: "rgba(255,255,255, 0.7)",
          }}
        >
          <Col span={6}>
            <Form.Item label="Müşteri" name="musteriAdi" rules={rules}>
              <Select
                placeholder="Müşteri Seçin"
                onChange={musteriSecimiYap}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {musteriler.map((musteri) => (
                  <Select.Option key={musteri.id} value={musteri.logoRef}>
                    {musteri.unvani}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="İrsaliye No" name="irsaliyeNo" rules={rules}>
              <Input placeholder="İrsaliye No" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Şoför" name="getirenSofor" rules={rules}>
              <Select
                placeholder="Şoför seçiniz"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {[...soforler]
                  .sort((a, b) => a.adi.localeCompare(b.adi))
                  .map((sofor) => (
                    <Select.Option key={sofor.logicalref} value={`${sofor.adi} ${sofor.soyadi}`}>
                      {`${sofor.adi} ${sofor.soyadi}`}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Personel" name="personel" rules={rules}>
              <Select placeholder="Personel">
                {personeller.map((personel) => (
                  <Select.Option key={personel.id} value={personel.ad}>
                    {`${personel.ad} ${personel.soyad}`}
                  </Select.Option>
                ))}
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
                <SpaceStyled key={key} align="start">
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <Tag color="purple">{i}</Tag>
                    <Form.Item
                      {...restField}
                      name={[name, "referansNo"]}
                      rules={rules}
                      style={{ width: "160px" }}
                    >
                      <Select
                        showSearch
                        placeholder="Referans No"
                        name={name}
                        onChange={(value) => referansSecimiYap(value, name)}
                        filterOption={(input, option) =>
                          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        {musteriReferanslari.map((referans) => (
                          <Select.Option key={referans.logoMalzemeRef} value={referans.referansNo}>
                            {referans.referansNo}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "iade"]}
                      rules={rules}
                      style={{ width: "120px" }}
                      initialValue="Hayır"
                    >
                      <Select placeholder="İade mi?" name={name}>
                        <Select.Option value="Evet">İade</Select.Option>
                        <Select.Option value="Hayır">İade Değil</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item {...restField} name={[name, "gelenMiktar"]} rules={rules}>
                      <InputNumber placeholder="Gelen Miktar" min={0} style={{ width: "140px" }} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "birinciAmbalaj"]}
                      // rules={rules}
                      style={{ width: "130px" }}
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
                      style={{ width: "130px" }}
                    >
                      <Select placeholder="2. Ambalaj">
                        {ambalajlar.map((ambalaj) => (
                          <Select.Option key={ambalaj.id} value={ambalaj.kasaAdi}>
                            {ambalaj.kasaAdi}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Divider type="vertical" style={{ background: "#cfcfcf", height: "35px" }} />

                    <Form.Item {...restField} name={[name, "islemTipi"]}>
                      <Input disabled placeholder="İşlem Tipi" style={{ width: "140px" }} />
                    </Form.Item>

                    {seciliReferansFasonluk[name] && (
                      <Form.Item {...restField} name={[name, "fasonFirmasi"]}>
                        <Input
                          disabled
                          placeholder="Fason Firması Yok"
                          style={{
                            width: "170px",
                            background: seciliReferansFasonluk[name] ? "#fce2d8" : "",
                            color: seciliReferansFasonluk[name] ? "black" : "",
                          }}
                        />
                      </Form.Item>
                    )}
                  </div>
                  <Space>
                    <Tooltip title={!kayitDurumu ? "Önce kaydetmelisiniz" : ""}>
                      {!seciliReferansFasonluk[name] && (
                        <Form.Item {...restField}>
                          <Button
                            type="primary"
                            disabled={!kayitDurumu}
                            onClick={() => isEmriYazdir(name)}
                          >
                            İş Emri Yazdır
                          </Button>
                        </Form.Item>
                      )}
                    </Tooltip>
                    <FaMinusCircle onClick={() => satiriSil(name, remove)} />
                  </Space>
                </SpaceStyled>
              ))}
              <Form.Item style={{ marginBottom: "20px" }}>
                <Button
                  type="dashed"
                  onClick={() => satirEkle(add)}
                  block
                  disabled={kayitDurumu}
                  icon={<PlusCircleFilled style={{ fontSize: "15px" }} />}
                  style={{
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Satır Ekle
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>
        <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            htmlType="reset"
            style={{ marginRight: "10px" }}
            onClick={() => {
              setKayitDurumu(false);
              setYeniEklenenNormal([]);
              setYeniEklenenFason([]);
            }}
          >
            Sıfırla
          </Button>
          <Button type="primary" htmlType="submit" disabled={kayitDurumu}>
            Malzemeleri Kaydet
          </Button>
        </Form.Item>
        <div style={{ display: "none" }}>
          <UretimIsEmriKarti
            record={printRecord}
            printTrigger={printTrigger}
            setPrintTrigger={setPrintTrigger}
          />
        </div>
      </FormStyled>
    </Container>
  );
}
