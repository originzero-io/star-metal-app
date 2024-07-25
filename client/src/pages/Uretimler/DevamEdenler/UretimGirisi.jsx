import { CreditCardOutlined, FileDoneOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row, Select, Table, Tag } from "antd";
import IdBadge from "components/shared/IdBadge";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useState } from "react";
import uretimGirisleriHttp from "services/crud-server/uretim-girisleri.http";
import kantarApi from "services/kantarApi";
import styled from "styled-components";
import { getCurrentDateTime } from "utils/time.helper";
import SevkiyatKarti from "../../../components/cards/SevkiyatKarti";
import ColumnBadge from "components/shared/ColumnBadge";

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
  const { showNotification, showPanel, showAlert, showModal } = useUIContext();
  const [form] = Form.useForm();

  const [miktarSapmasi, setMiktarSapmasi] = useState(
    referanslar.filter((referans) => referans.referansNo === localRecord.referansNo)[0]
      ?.miktarSapmasi || 5,
  );

  // record değiştiğinde panelin içindeki verilerin de değişmesi için
  useEffect(() => {
    setLocalRecord(record);
  }, [record]);

  const [printTrigger, setPrintTrigger] = useState(false);
  const [sevkiyatKartiKayit, setSevkiyatKartiKayit] = useState(null);

  const [teraziLoading, setTeraziLoading] = useState(false);
  const [terazidenOlcumAlindi, setTerazidenOlcumAlindi] = useState(false);
  const [uretimAdedi, setUretimAdedi] = useState(0);

  const [teraziOlcum, setTeraziOlcum] = useState({
    brut: 0,
    dara: 0,
    net: 0,
    adet: 0,
  });

  const fakeTeraziOlcumHandler = () => {
    setTeraziLoading(true);
    setTerazidenOlcumAlindi(false);
    setTimeout(() => {
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
      setUretimAdedi(adet);
      setTeraziLoading(false);
      setTerazidenOlcumAlindi(true);
    }, 1000);
  };

  function roundUp(num, decimals = 1) {
    return parseFloat(num.toFixed(decimals));
  }

  const terazidenOlcumAl = async () => {
    setTeraziLoading(true);
    setTerazidenOlcumAlindi(false);
    const data = await kantarApi.getData();

    setTeraziOlcum({
      ...teraziOlcum,
      brut: roundUp(data.Net + data.Dara),
      dara: data.Dara,
      net: data.Net,
      adet: data.Adet,
    });
    setTeraziLoading(false);
    form.setFieldsValue({ uretimAdedi: data.Adet });
    setUretimAdedi(data.adet);
    setTerazidenOlcumAlindi(true);
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
      uretimId: localRecord.id,
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
      Referanslar: { ...record.Referanslar }, // sevkiyat kartı için
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

  useEffect(() => {
    if (sevkiyatKartiKayit !== null) {
      showModal({
        title: "Sevkiyat Kartı",
        content: <SevkiyatKarti record={sevkiyatKartiKayit} />,
        width: 800,
      });
      showPanel(false);
    }
  }, [sevkiyatKartiKayit]);

  const uretimAdediMinInput = !localRecord.Referanslar?.fason
    ? teraziOlcum.adet - miktarSapmasi
    : 0;
  const uretimAdediMaxInput = !localRecord.Referanslar?.fason
    ? teraziOlcum.adet + miktarSapmasi
    : localRecord.gelenMiktar - localRecord.uretilenMiktar;

  return (
    <Container>
      {!localRecord.Referanslar.fason && (
        <div>
          <TeraziSection>
            <div>
              <Button
                type="primary"
                icon={<FormOutlined />}
                onClick={terazidenOlcumAl}
                loading={teraziLoading}
              >
                {teraziLoading ? "Ölçüm Alınıyor..." : "Teraziden Ölçüm Al"}
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
                opacity: teraziLoading ? 0.4 : 1,
              }}
            >
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
          initialValues={{ uretimAdedi: teraziOlcum.adet || 0, uretimTarihi: getCurrentDateTime() }}
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
                <ColumnBadge value={localRecord.Referanslar.siparisTipi} width="60%" />
              </Form.Item>
              <Form.Item label="Kodu">
                <ColumnBadge color="#ffecdc" value={localRecord.Referanslar.kodu} width="60%" />
              </Form.Item>
              <Form.Item label="İrsaliye No">
                <ColumnBadge color="#ffecdc" value={localRecord.irsaliyeNo} width="60%" />
              </Form.Item>
              <Form.Item label="Referans No">
                <ColumnBadge color="#ffecdc" value={localRecord.referansNo} width="60%" />
              </Form.Item>
              <Form.Item label="Fason">
                <div>
                  {localRecord.Referanslar.fason ? (
                    <ColumnBadge color="#e2f9e9" value="FASON" width="60%" />
                  ) : (
                    <ColumnBadge color="#f3f3f3" value="DEĞİL" width="60%" />
                  )}
                </div>
              </Form.Item>
              <Form.Item label="İade">
                <div>
                  {localRecord.iade === "Evet" ? (
                    <ColumnBadge value={localRecord.iade} width="60%" />
                  ) : (
                    <ColumnBadge value={localRecord.iade} width="60%" />
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
                tooltip={`${uretimAdediMinInput}-${uretimAdediMaxInput} arası girebilirsiniz`}
                rules={[
                  {
                    required: true,
                    message: "Bu alanı doldurun",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={uretimAdediMinInput > 0 ? uretimAdediMinInput : 0}
                  max={uretimAdediMaxInput}
                  disabled={!localRecord.Referanslar.fason && !terazidenOlcumAlindi}
                  onChange={(value) => setUretimAdedi(value)}
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
              <Form.Item label="Ambalaj Tanımı 1" name="birinciAmbalaj">
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
                icon={<CreditCardOutlined />}
                htmlType="submit"
                disabled={uretimAdedi === 0}
              >
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
