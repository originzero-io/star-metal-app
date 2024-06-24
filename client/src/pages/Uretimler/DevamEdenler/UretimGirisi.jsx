import { CreditCardOutlined, FormOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Table, Tag } from "antd";
import IdBadge from "components/shared/IdBadge";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useState } from "react";
import uretimGirisleriHttp from "services/crud-server/uretim-girisleri.http";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";
import SevkiyatKarti from "../../../components/cards/SevkiyatKarti";

const SectionBase = styled.div`
  border: 1px solid #dcdcdc;
  padding: 10px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.4);
  box-shadow: 2px 3px 8px -8px rgba(0, 0, 0, 0.75);
`;
const Container = styled.div``;
const TeraziSection = styled(SectionBase)`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const TeraziItem = styled.div`
  border: 1px solid #c4c4c4;
  margin: 10px;
  width: 20%;
  border-radius: 6px;
`;
const TeraziItemHeader = styled.div`
  text-align: center;
  background-color: rgb(107, 67, 175);
  color: whitesmoke;
  padding: 2px;
  font-size: 16px;
`;
const TeraziItemContent = styled.div`
  font-size: 2.4vmin;
  font-weight: 700;
  text-align: center;
  padding: 10px;
`;

const FormSection = styled(SectionBase)`
  margin-top: 5px;
`;
const TabloSection = styled(SectionBase)`
  margin-top: 5px;
`;

export default function UretimGirisi({ record }) {
  const [localRecord, setLocalRecord] = useState(record);

  const { ambalajlar, referanslar, devamEdenUretimler, setDevamEdenUretimler, personeller } =
    useDBContext();
  const { showNotification, showPanel, showAlert } = useUIContext();
  const [form] = Form.useForm();

  const [miktarSapmasi, setMiktarSapmasi] = useState(
    referanslar.filter((referans) => referans.referansNo === localRecord.referansNo)[0]
      ?.miktarSapmasi,
  );

  // record değiştiğinde panelin içindeki verilerin de değişmesi için
  useEffect(() => {
    setLocalRecord(record);
  }, [record]);

  const [printTrigger, setPrintTrigger] = useState(false);
  const [sevkiyatKartiKayit, setSevkiyatKartiKayit] = useState(null);

  const [teraziOlcum, setTeraziOlcum] = useState({
    brut: 0,
    dara: 0,
    net: 0,
    adet: 0,
  });

  const fakeTeraziOlcumHandler = () => {
    const brut = Math.round((Math.random() * 100 + 1) * 10) / 10;
    const dara = Math.round((Math.random() * 100 + 1) * 10) / 10;
    const net = Math.round((Math.random() * 100 + 1) * 10) / 10;
    const adet = Math.floor(Math.random() * 50);
    setTeraziOlcum({
      ...teraziOlcum,
      brut,
      dara,
      net,
      adet,
    });
    form.setFieldsValue({ uretimAdedi: adet });
  };

  const onFinish = async (values) => {
    // console.log("localRecord: ", localRecord);
    // console.log("values: ", values);
    const data = {
      alici: localRecord.Referanslar.fason
        ? localRecord.Referanslar.fasonFirmasi
        : localRecord.Referanslar.musteriAdi,
      fason: localRecord.Referanslar.fason,
      referansNo: localRecord.referansNo,
      uretimSiraNo: localRecord.id,
      kodu: localRecord.Referanslar.kodu,
      iade: localRecord.iade,
      uretimTarihi: getCurrentDateTime(),
      uretimAdedi: values.uretimAdedi,
      personel: values.personel,
      islemAciklamasi: record.Referanslar.not,
      birinciAmbalaj: values.birinciAmbalaj,
      ikinciAmbalaj: values.ikinciAmbalaj,
      brut: teraziOlcum.brut,
      dara: teraziOlcum.dara,
      net: teraziOlcum.net,
    };

    if (data.uretimAdedi + localRecord.uretilenMiktar <= localRecord.gelenMiktar) {
      const updatedUretim = await uretimGirisleriHttp.addData(data);
      setLocalRecord(updatedUretim);
      let newDevamEdenUretimler = [];
      if (data.fason) {
        newDevamEdenUretimler = {
          ...devamEdenUretimler,
          fasonUretimler: devamEdenUretimler.fasonUretimler.map((uretim) => {
            if (uretim.id === updatedUretim.id) {
              return {
                ...updatedUretim,
              };
            }
            return uretim;
          }),
        };
      } else {
        newDevamEdenUretimler = {
          ...devamEdenUretimler,
          normalUretimler: devamEdenUretimler.normalUretimler.map((uretim) => {
            if (uretim.id === updatedUretim.id) {
              return {
                ...updatedUretim,
              };
            }
            return uretim;
          }),
        };
      }
      setDevamEdenUretimler(newDevamEdenUretimler);
      setSevkiyatKartiKayit(data);
      showNotification(
        "success",
        `${data.referansNo} referansına ${data.uretimAdedi} adet üretim girişi yapıldı`,
      );
    } else {
      showNotification(
        "error",
        `Üretilen miktar gelen miktardan fazla olamaz. Değerleri kontrol ediniz.`,
      );
    }
  };

  const uretimAdediMinInput = !localRecord.Referanslar.fason ? teraziOlcum.adet - miktarSapmasi : 0;
  const uretimAdediMaxInput = !localRecord.Referanslar.fason
    ? teraziOlcum.adet + miktarSapmasi
    : localRecord.gelenMiktar - localRecord.uretilenMiktar;

  return (
    <Container>
      {!localRecord.Referanslar.fason && (
        <div>
          <TeraziSection>
            <div>
              <Button type="primary" icon={<FormOutlined />} onClick={fakeTeraziOlcumHandler}>
                Teraziden Ölçüm Al
              </Button>
            </div>
            <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
              <TeraziItem>
                <TeraziItemHeader>Brüt</TeraziItemHeader>
                <TeraziItemContent>{teraziOlcum.brut}</TeraziItemContent>
              </TeraziItem>
              <TeraziItem>
                <TeraziItemHeader>Dara</TeraziItemHeader>
                <TeraziItemContent>{teraziOlcum.dara}</TeraziItemContent>
              </TeraziItem>
              <TeraziItem>
                <TeraziItemHeader>Net</TeraziItemHeader>
                <TeraziItemContent>{teraziOlcum.net}</TeraziItemContent>
              </TeraziItem>
              <TeraziItem>
                <TeraziItemHeader>Adet</TeraziItemHeader>
                <TeraziItemContent>{teraziOlcum.adet}</TeraziItemContent>
              </TeraziItem>
            </div>
          </TeraziSection>
        </div>
      )}
      <FormSection>
        <Form
          form={form}
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          initialValues={{ uretimAdedi: teraziOlcum.adet, uretimTarihi: getCurrentDateTime() }}
          onFinish={onFinish}
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item label="Üretim Sıra No">
                <IdBadge value={localRecord.id} />
              </Form.Item>
              <Form.Item label="Referans Sıra No">
                <IdBadge value={localRecord.Referanslar.id} />
              </Form.Item>
              <Form.Item label="Sipariş Tipi">
                {localRecord.Referanslar.siparisTipi === "Seri" ? (
                  <Tag color="volcano">{localRecord.Referanslar.siparisTipi}</Tag>
                ) : (
                  <Tag color="purple">{localRecord.Referanslar.siparisTipi}</Tag>
                )}
              </Form.Item>
              {localRecord.Referanslar.siparisTipi === "Seri" ? (
                <Form.Item label="Sipariş No">
                  <div>{localRecord.Referanslar.siparisNo}</div>
                </Form.Item>
              ) : (
                <Form.Item label="Talep No">
                  <div>{localRecord.talepNo}</div>
                </Form.Item>
              )}
              <Form.Item label="İrsaliye No">
                <div>{localRecord.irsaliyeNo}</div>
              </Form.Item>
              <Form.Item label="Referans No">
                <div>
                  <Tag color="orange">{localRecord.referansNo}</Tag>
                </div>
              </Form.Item>
              <Form.Item label="Fason">
                <div>
                  {localRecord.Referanslar.fason ? (
                    <Tag color="green">Evet</Tag>
                  ) : (
                    <Tag color="red">Hayır</Tag>
                  )}
                </div>
              </Form.Item>
              <Form.Item label="İade">
                <div>
                  {localRecord.iade === "Evet" ? (
                    <Tag color="green">{localRecord.iade}</Tag>
                  ) : (
                    <Tag color="red">{localRecord.iade}</Tag>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Üretim Tarih" name="uretimTarihi">
                <Input disabled />
              </Form.Item>
              {localRecord.Referanslar.fason === 1 && (
                <Form.Item
                  labelCol={{ span: 30 }}
                  label="Fasondan Gelen İrsaliye No"
                  name="fasondanGelenIrsaliyeNo"
                  rules={[
                    {
                      required: true,
                      message: "Bu alanı doldurun",
                    },
                  ]}
                >
                  <Input placeholder="İrsaliye no girin" style={{ width: "100%" }} />
                </Form.Item>
              )}
              <Form.Item
                label="Üretim Adedi"
                name="uretimAdedi"
                tooltip={`En fazla ${uretimAdediMaxInput} girebilirsiniz.`}
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={uretimAdediMinInput}
                  max={uretimAdediMaxInput}
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
                <Select placeholder="Personel giriniz">
                  {personeller.map((personel) => (
                    <Select.Option key={personel.id} value={personel.ad}>
                      {`${personel.ad} ${personel.soyad}`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Ambalaj Tanımı 1"
                name="birinciAmbalaj"
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <Select placeholder="Ambalaj giriniz">
                  {ambalajlar.map((ambalaj, i) => (
                    <Select.Option key={i} value={ambalaj.kasaAdi}>
                      {ambalaj.kasaAdi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Ambalaj Tanımı 2" name="ikinciAmbalaj">
                <Select placeholder="Ambalaj giriniz">
                  {ambalajlar.map((ambalaj, i) => (
                    <Select.Option key={i} value={ambalaj.kasaAdi}>
                      {ambalaj.kasaAdi}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Form.Item>
              <Button
                type="primary"
                style={{ marginRight: "4px" }}
                icon={<PrinterOutlined />}
                disabled={sevkiyatKartiKayit === null}
                onClick={() =>
                  showPanel({
                    title: "Sevkiyat Kartı",
                    content: <SevkiyatKarti record={sevkiyatKartiKayit} />,
                    width: 800,
                  })
                }
              >
                Sevkiyat Kartı Çıkart
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" icon={<CreditCardOutlined />} htmlType="submit">
                Üretim Girişi Yap
              </Button>
            </Form.Item>
          </div>
        </Form>
      </FormSection>

      <TabloSection>
        <Table
          dataSource={[
            {
              gelenMiktar: localRecord.gelenMiktar,
              gidenMiktar: localRecord.gidenMiktar,
              uretilenMiktar: localRecord.uretilenMiktar,
              [localRecord.Referanslar.fason ? "sevkEdilenMiktar" : "kalanMiktar"]: localRecord
                .Referanslar.fason
                ? localRecord.sevkEdilenMiktar
                : localRecord.kalanMiktar,
            },
          ]}
          columns={[
            {
              title: "Gelen Miktar",
              dataIndex: "gelenMiktar",
              key: "gelenMiktar",
              render: (value) => <div style={{ fontSize: "16px" }}>{value}</div>,
              align: "center",
            },
            {
              title: "Giden Miktar",
              dataIndex: "gidenMiktar",
              key: "gidenMiktar",
              render: (value) => <div style={{ fontSize: "16px" }}>{value}</div>,

              align: "center",
            },
            {
              title: "Üretilen Miktar",
              dataIndex: "uretilenMiktar",
              key: "uretilenMiktar",
              render: (value) => <div style={{ fontSize: "16px" }}>{value}</div>,
              align: "center",
            },
            {
              title: localRecord.Referanslar.fason ? "Sevk Edilen Miktar" : "Kalan Miktar",
              dataIndex: localRecord.Referanslar.fason ? "sevkEdilenMiktar" : "kalanMiktar",
              key: "kalan-sevk",
              render: (value) => <div style={{ fontSize: "16px" }}>{value}</div>,
              align: "center",
            },
          ]}
          pagination={false}
          bordered
        />
      </TabloSection>
      <div style={{ display: "none" }}>
        <SevkiyatKarti
          record={localRecord}
          printTrigger={printTrigger}
          setPrintTrigger={setPrintTrigger}
        />
      </div>
    </Container>
  );
}
