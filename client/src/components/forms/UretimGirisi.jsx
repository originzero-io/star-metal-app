import { Button, Col, Form, Radio, Row, Select, InputNumber, Input, Tag } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { FormOutlined, CreditCardOutlined, PrinterOutlined } from "@ant-design/icons";
import { getCurrentDateTime } from "utils/time.helper";
import SevkiyatKarti from "../cards/SevkiyatKarti";
import { useDBContext } from "context/DBProvider";
import uretimGirisiHttp from "services/uretim-girisleri.http";
import { useUIContext } from "context/UIProvider";
import sevkiyatHareketleriHttp from "services/sevkiyat-hareketleri.http";

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
  const { ambalajlar, referanslar, devamEdenUretimler, setDevamEdenUretimler, personeller } =
    useDBContext();
  const { showNotification, showPanel, showAlert } = useUIContext();
  const [form] = Form.useForm();

  const [miktarSapmasi, setMiktarSapmasi] = useState(
    referanslar.filter((referans) => referans.referansNo === record.referansNo)[0]?.miktarSapmasi,
  );

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
    // console.log("record: ", record);
    // console.log("values: ", values);
    const data = {
      fason: record.Referanslar.fason,
      referansNo: record.referansNo,
      uretimSiraNo: record.id,
      siparisNo: record.Referanslar.siparisNo,
      talepNo: record.Referanslar.talepNo,
      // irsaliyeNo: record.irsaliyeNo,
      iade: record.iade,
      uretimTarihi: getCurrentDateTime(),
      uretimAdedi: values.uretimAdedi,
      // personel: values.personel,
      birinciAmbalaj: values.birinciAmbalaj,
      ikinciAmbalaj: values.ikinciAmbalaj,
      brut: teraziOlcum.brut,
      dara: teraziOlcum.dara,
      net: teraziOlcum.net,
    };

    if (data.uretimAdedi + record.uretilenMiktar <= record.gelenMiktar) {
      const updatedUretim = await uretimGirisiHttp.addData(data);
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
      console.log("amannnn");
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

  const uretimAdediMinInput = !record.Referanslar.fason ? teraziOlcum.adet - miktarSapmasi : 0;
  const uretimAdediMaxInput = !record.Referanslar.fason
    ? teraziOlcum.adet + miktarSapmasi
    : record.gelenMiktar - record.uretilenMiktar;

  return (
    <Container>
      {!record.Referanslar.fason && (
        <div>
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
              <MeasureItemContent>{teraziOlcum.adet}</MeasureItemContent>
            </MeasureItem>
          </MeasureSection>
        </div>
      )}
      <MiddleSection>
        <Radio.Group value={record.Referanslar.siparisTipi} disabled>
          <Radio value="Seri">Seri</Radio>
          <Radio value="Talepli">Talepli</Radio>
        </Radio.Group>
      </MiddleSection>
      <FormSection>
        <Form
          form={form}
          name="basic"
          layout="horizontal"
          labelCol={{ flex: "150px" }}
          labelAlign="left"
          // key={record ? record.id : "form"}
          initialValues={{ uretimAdedi: teraziOlcum.adet, uretimTarihi: getCurrentDateTime() }}
          onFinish={onFinish}
          //   onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelWrap
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item label="Üretim Sıra No">
                <div>{record.id}</div>
              </Form.Item>
              <Form.Item label="Referans Sıra No">
                <div>{record.Referanslar.id}</div>
              </Form.Item>
              {record.Referanslar.siparisTipi === "Seri" ? (
                <Form.Item label="Sipariş No">
                  <div>{record.Referanslar.siparisNo}</div>
                </Form.Item>
              ) : (
                <Form.Item label="Talep No">
                  <div>{record.Referanslar.talepNo}</div>
                </Form.Item>
              )}
              <Form.Item label="İrsaliye No">
                <div>{record.irsaliyeNo}</div>
              </Form.Item>
              <Form.Item label="Referans No">
                <div>
                  <Tag color="blue">{record.referansNo}</Tag>
                </div>
              </Form.Item>
              <Form.Item label="Fason">
                <div>
                  {record.Referanslar.fason ? (
                    <Tag color="green">Evet</Tag>
                  ) : (
                    <Tag color="orange">Hayır</Tag>
                  )}
                </div>
              </Form.Item>
              <Form.Item label="İade">
                <div>
                  {record.iade === "Evet" ? (
                    <Tag color="orange">{record.iade}</Tag>
                  ) : (
                    <Tag color="purple">{record.iade}</Tag>
                  )}
                </div>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Üretim Tarih" name="uretimTarihi">
                <Input disabled />
              </Form.Item>
              {record.Referanslar.fason && (
                <Form.Item
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
                  // min={!record.Referanslar.fason && teraziOlcum.adet - miktarSapmasi}
                  // max={!record.Referanslar.fason && teraziOlcum.adet + miktarSapmasi}
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
                    content: React.createElement(SevkiyatKarti, {
                      record: sevkiyatKartiKayit,
                    }),
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
