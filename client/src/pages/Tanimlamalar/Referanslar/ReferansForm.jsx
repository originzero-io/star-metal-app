import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Space,
  Upload,
} from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useState } from "react";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import referanslarHttp, { referansUretimHttp } from "services/crud-server/referanslar.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import logoGoApi from "services/logoGoApi";
import getUrlByEnvVariables from "utils/getServerUrl";
import { IslemTipiDuzenlemeForm, IslemTipiEklemeForm } from "./IslemTipiForm";
import { ParcaAdiDuzenlemeForm, ParcaAdiEklemeForm } from "./ParcaAdiForm";

export default function ReferansForm({ record, type }) {
  const {
    referanslar,
    setReferanslar,
    referansIslemTipleri,
    setReferansIslemTipleri,
    referansParcaAdlari,
    setReferansParcaAdlari,
    referansAnaBirimleri,
    musteriler,
    setDevamEdenUretimler,
    setIrsaliyeler,
  } = useDBContext();
  const { showPanel, showModal, showNotification } = useUIContext();

  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const [siparisTipi, setSiparisTipi] = useState(record?.siparisTipi);
  const [fason, setFason] = useState(record?.fason || false);

  const [seciliParcaAdi, setSeciliParcaAdi] = useState(record?.parcaAdi);
  const [seciliIslemTipi, setSeciliIslemTipi] = useState(record?.islemTipi);

  useEffect(() => {
    if (type === "update") {
      const initialFileList = [];

      if (record.ReferansUretim?.resimUrl) {
        initialFileList.push({
          uid: "-1",
          name: record.ReferansUretim.resimUrl,
          status: "done",
          url: `${getUrlByEnvVariables()}/uploads/referanslar/${record.ReferansUretim.resimUrl}`,
        });
      }

      setFileList(initialFileList);

      form.setFieldsValue({
        ...record,
        miktarSapmasi: record?.ReferansUretim?.miktarSapmasi || 0,
        lotAdedi: record?.ReferansUretim?.lotAdedi || 0,
        referansYuzeyAlani: record?.ReferansUretim?.referansYuzeyAlani || 0,
        resimUrl: record?.ReferansUretim?.resimUrl || "",
        not: record?.ReferansUretim?.not || "",
        photo: initialFileList.length > 0 ? initialFileList : undefined,
      });
    }
  }, [form, type, record]);

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();

    if (type === "update") {
      const logoyaGonderilecekPut = {
        ...record,
        referansNo: values.referansNo,
        // kodu: record.kodu || values.kodu,
        kodu: values.kodu || record.kodu,
        irsaliyeAciklamasi: values.irsaliyeAciklamasi,
        musteriAdi: record.musteriAdi || values.musteriAdi,
        musteriRef:
          record.musteriRef === 0
            ? musteriler.find((m) => m.unvani === values.musteriAdi).logoRef
            : record.musteriRef,
        fasonFirmaRef: record.fason
          ? musteriler.find((m) => m.unvani === values.fasonFirmasi).logoRef
          : record.fasonFirmaRef,
        fasonFirmasi: record.fason ? values.fasonFirmasi : record.fasonFirmasi,
        ReferansUretim: {
          logoMalzemeRef: record.logoMalzemeRef,
          kodu: record.kodu,
          resimUrl: record.resimUrl,
          miktarSapmasi: values.miktarSapmasi,
          lotAdedi: values.lotAdedi,
          referansYuzeyAlani: values.referansYuzeyAlani,
          not: values.not,
        },
      };

      console.log("put-:", logoyaGonderilecekPut);

      const response = await logoGoApi.putData("PutReferans", logoyaGonderilecekPut);

      if (response.statusCode === 200) {
        showNotification("success", "Referans logoda güncellendi");

        Object.keys(logoyaGonderilecekPut).forEach((key) => {
          if (key === "ReferansUretim") {
            formData.append(key, JSON.stringify(logoyaGonderilecekPut[key]));
          } else {
            formData.append(key, logoyaGonderilecekPut[key]);
          }
        });

        if (fileList.length > 0) {
          formData.append("photo", fileList[0].originFileObj);
        }

        await referanslarHttp.updateData(record.id, logoyaGonderilecekPut);

        const updatedReferansUretim = await referansUretimHttp.updateWithPhoto(formData);

        const updatedReferanslar = referanslar.map((referans) => {
          if (referans.logoMalzemeRef === record.logoMalzemeRef) {
            return {
              ...logoyaGonderilecekPut,
              ReferansUretim: {
                ...referans.ReferansUretim,
                ...updatedReferansUretim,
                resimUrl: `${updatedReferansUretim.resimUrl}?t=${new Date().getTime()}`,
              },
            };
          }
          return referans;
        });

        setReferanslar(updatedReferanslar);

        showNotification("success", "Referans üretim verisi güncellendi");

        const devamEdenler = await devamEdenUretimHttp.getData();
        setDevamEdenUretimler(devamEdenler);

        const irsaliyeler = await irsaliyeHttp.getData();
        setIrsaliyeler(irsaliyeler);

        showPanel(false);
      } else showNotification("error", response.message);
    } else {
      const logoyaGonderilecekPost = {
        ...values,
        parcaAdi: seciliParcaAdi.adi,
        islemTipi: seciliIslemTipi.adi,
        fason: values.fason === true ? 1 : 0,
        fasonFirmasi: values.fason === true ? values.fasonFirmasi : "",
        logoMalzemeRef: 0,
        resimUrl: "",
        musteriRef: musteriler.find((musteri) => musteri.unvani === values.musteriAdi).logoRef,
        fasonFirmaRef:
          musteriler.find((musteri) => musteri.unvani === values.fasonFirmasi)?.logoRef ?? 0, // eğer kayıt fason değilse 0 olarak doldur
      };

      const response = await logoGoApi.postData("PostReferans", logoyaGonderilecekPost);

      if (response.statusCode === 200) {
        showNotification("success", `${values.referansNo} referansı logoya eklendi`);

        Object.keys(logoyaGonderilecekPost).forEach((key) => {
          formData.append(key, logoyaGonderilecekPost[key]);
        });

        if (fileList.length > 0) {
          formData.append("photo", fileList[0].originFileObj);
        }

        formData.delete("logoMalzemeRef");
        formData.append("logoMalzemeRef", response.newId);

        await referanslarHttp.addData({
          ...logoyaGonderilecekPost,
          logoMalzemeRef: response.newId,
        });
        const newReferansUretim = await referansUretimHttp.addData(formData);

        setReferanslar([
          ...referanslar,
          {
            ...logoyaGonderilecekPost,
            logoMalzemeRef: newReferansUretim.logoMalzemeRef,
            ReferansUretim: { ...newReferansUretim },
          },
        ]);

        showNotification("success", `${values.referansNo} referansı için üretim verileri eklendi`);
        showPanel(false);
      } else {
        const duplicateError = response.message.includes("duplicate");
        showNotification(
          "error",
          duplicateError
            ? "Bu sipariş veya talep numarası daha önce girilmiş. Başka bir numara girip yeniden deneyin."
            : response.message,
        );
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const parcaAdiSec = (selected) => {
    const parcaAdi = referansParcaAdlari.find((pa) => pa.logicalref === selected);
    setSeciliParcaAdi(parcaAdi);
  };

  const parcaAdiEkle = async () => {
    showModal({
      title: "Parça ekle",
      content: <ParcaAdiEklemeForm setReferansParcaAdlari={setReferansParcaAdlari} />,
      width: 400,
    });
  };

  const parcaAdiDuzenle = () => {
    showModal({
      title: "Parça Adını Düzenle",
      content: (
        <ParcaAdiDuzenlemeForm
          parcaAdi={seciliParcaAdi}
          setSeciliParcaAdi={setSeciliParcaAdi}
          setReferansParcaAdlari={setReferansParcaAdlari}
          form={form}
        />
      ),
      width: 400,
    });
  };

  const parcaAdiSil = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${seciliParcaAdi.adi} isimli parça silinecek. Emin misiniz?`,
      okText: "Eminim",
      cancelText: "İptal",
      async onOk() {
        await logoGoApi.deleteData("DeleteParcaAdi", seciliParcaAdi.logicalref);

        const newParcaAdlari = referansParcaAdlari.filter(
          (pa) => pa.logicalref !== seciliParcaAdi.logicalref,
        );
        setReferansParcaAdlari(newParcaAdlari);
        form.setFieldsValue({ parcaAdi: null });
        setSeciliParcaAdi(null);
        showNotification("success", `${seciliParcaAdi.adi} parçası silindi`);
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  const islemTipiSec = (selected) => {
    const islemTipi = referansIslemTipleri.find((it) => it.logicalref === selected);

    setSeciliIslemTipi(islemTipi);
  };
  const islemTipiEkle = async () => {
    showModal({
      title: "İşlem Tipi Ekle",
      content: <IslemTipiEklemeForm setReferansIslemTipleri={setReferansIslemTipleri} />,
      width: 400,
    });
  };

  const islemTipiDuzenle = () => {
    showModal({
      title: "İşlem Tipini Düzenle",
      content: (
        <IslemTipiDuzenlemeForm
          islemTipi={seciliIslemTipi}
          setSeciliIslemTipi={setSeciliIslemTipi}
          setReferansIslemTipleri={setReferansIslemTipleri}
          form={form}
        />
      ),
      width: 400,
    });
  };

  const islemTipiSil = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${seciliIslemTipi.adi} isimli işlem tipi silinecek. Emin misiniz?`,
      okText: "Eminim",
      cancelText: "İptal",
      async onOk() {
        await logoGoApi.deleteData("DeleteIslemTipi", seciliIslemTipi.logicalref);

        const newIslemTipleri = referansIslemTipleri.filter(
          (it) => it.logicalref !== seciliIslemTipi.logicalref,
        );
        setReferansIslemTipleri(newIslemTipleri);
        form.setFieldsValue({ islemTipi: null });
        setSeciliIslemTipi(null);
        showNotification("success", `${seciliIslemTipi.adi} işlem tipi silindi`);
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  return (
    <Form
      form={form}
      name="referans-form"
      labelCol={{ flex: "170px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={
        record || {
          fason: record?.fason || false,
          miktarSapmasi: 5,
          lotAdedi: 150,
          referansYuzeyAlani: 1.5,
          not: "",
        }
      }
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Divider style={{ color: "#4535aa", marginTop: 0 }} orientation="left">
        Logo Verileri
      </Divider>
      {type === "update" && (
        <Form.Item
          label="Kodu"
          name="kodu"
          rules={[{ required: true, message: "Bu alanı doldurun" }]}
        >
          <Input placeholder="Kodu" />
        </Form.Item>
      )}
      <Form.Item
        label="Referans No"
        name="referansNo"
        rules={[{ required: true, message: "Bu alanı doldurun" }]}
      >
        <Input placeholder="Referans No" />
      </Form.Item>

      <Form.Item
        label="Parça Adı"
        name="parcaAdi"
        rules={[{ required: type !== "update", message: "Bu alanı doldurun" }]}
        style={type === "update" ? { display: "none" } : null}
      >
        <Space.Compact block>
          <Form.Item name="parcaAdi" noStyle>
            <Select
              placeholder="Parça Adı Seçiniz"
              onChange={parcaAdiSec}
              value={seciliParcaAdi}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {referansParcaAdlari.map((parca) => (
                <Select.Option key={parca.logicalref} value={parca.logicalref}>
                  {parca.adi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" onClick={parcaAdiEkle} icon={<PlusOutlined />} title="Ekle" />
          {seciliParcaAdi && (
            <>
              <Button
                type="primary"
                onClick={parcaAdiDuzenle}
                icon={<EditOutlined />}
                title="Düzenle"
              />
              <Button type="primary" onClick={parcaAdiSil} icon={<DeleteOutlined />} title="Sil" />
            </>
          )}
        </Space.Compact>
      </Form.Item>
      <Form.Item
        label="İşlem Tipi"
        name="islemTipi"
        rules={[{ required: type !== "update", message: "Bu alanı doldurun" }]}
        style={type === "update" ? { display: "none" } : null}
      >
        <Space.Compact block>
          <Form.Item name="islemTipi" noStyle>
            <Select
              placeholder="Tipi Seçin"
              onChange={islemTipiSec}
              value={seciliIslemTipi}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {referansIslemTipleri.map((islemTipi) => (
                <Select.Option key={islemTipi.logicalref} value={islemTipi.logicalref}>
                  {islemTipi.adi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Button type="primary" onClick={islemTipiEkle} icon={<PlusOutlined />} title="Ekle" />
          {seciliIslemTipi && (
            <>
              <Button
                type="primary"
                onClick={islemTipiDuzenle}
                icon={<EditOutlined />}
                title="Düzenle"
              />
              <Button type="primary" onClick={islemTipiSil} icon={<DeleteOutlined />} title="Sil" />
            </>
          )}
        </Space.Compact>
      </Form.Item>

      <Form.Item
        label="İrsaliye Açıklaması"
        name="irsaliyeAciklamasi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="İrsaliye için açıklama girin" />
      </Form.Item>

      <Form.Item
        label="Müşteri"
        name="musteriAdi"
        rules={[{ required: true, message: "Bu alanı doldurun" }]}
        style={type === "update" && record.musteriAdi !== "" ? { display: "none" } : null}
      >
        <Select placeholder="Müşteri Adı Seçiniz" showSearch>
          {musteriler.map((musteri) => (
            <Select.Option key={musteri.logoRef} value={musteri.unvani}>
              {musteri.unvani}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Birim"
        name="logoAnaBirimRef"
        rules={[{ required: type !== "update", message: "Bu alanı doldurun" }]}
        style={type === "update" ? { display: "none" } : null}
      >
        <Select placeholder="Birim seçin">
          {referansAnaBirimleri.map((birim) => (
            <Select.Option key={birim.logicalref} value={birim.logicalref}>
              {birim.adi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {type !== "update" && <Divider />}

      <Form.Item
        name="siparisTipi"
        rules={[{ required: type !== "update", message: "Bu alanı doldurun" }]}
        style={type === "update" ? { display: "none" } : null}
      >
        <Radio.Group value={"SERİ"} onChange={(e) => setSiparisTipi(e.target.value)}>
          <Space direction="vertical">
            <Radio value="SERİ">
              <div
                style={{
                  width: "500px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                }}
              >
                <div>Seri</div>
                {siparisTipi === "SERİ" && (
                  <Form.Item
                    name="kodu"
                    style={{ width: 200, marginLeft: "7%" }}
                    rules={[
                      {
                        required: true,
                        message: "Bu alanı doldurun",
                      },
                    ]}
                  >
                    <Input title="Sipariş No" placeholder="Sipariş No Girin" />
                  </Form.Item>
                )}
              </div>
            </Radio>
            <Space direction="vertical">
              <Radio value="TALEPLİ">
                <div
                  style={{
                    width: "500px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "15px",
                  }}
                >
                  <div>Talepli</div>
                  {siparisTipi === "TALEPLİ" && (
                    <Form.Item
                      name="kodu"
                      style={{ width: 200, marginLeft: "7%" }}
                      rules={[
                        {
                          required: true,
                          message: "Bu alanı doldurun",
                        },
                      ]}
                    >
                      <Input title="Talep No" placeholder="Talep No Girin" />
                    </Form.Item>
                  )}
                </div>
              </Radio>
            </Space>
          </Space>
        </Radio.Group>
      </Form.Item>

      {type !== "update" && <Divider />}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Form.Item name="fason" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              setFason(e.target.checked);
              form.setFieldsValue({ fason: e.target.checked });
            }}
            checked={fason}
            disabled={type === "update"}
          >
            Fason
          </Checkbox>
        </Form.Item>

        {fason && (
          <Form.Item
            name="fasonFirmasi"
            rules={[{ required: fason, message: "Fason firması giriniz" }]}
            style={{ width: "61%" }}
          >
            <Select placeholder="Fason Firması Seçiniz" showSearch>
              {musteriler.map((musteri) => (
                <Select.Option key={musteri.logoRef} value={musteri.unvani}>
                  {musteri.unvani}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </div>

      <Divider style={{ color: "#4535aa", marginTop: 8 }} orientation="left">
        Üretim Takip Verileri
      </Divider>
      <Form.Item
        label="Miktar Sapması"
        name="miktarSapmasi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <InputNumber min={0} placeholder="Miktar sapması girin" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Lot Adedi"
        name="lotAdedi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Lot adedi girin"
          addonAfter="adet"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Referans Yüzey Alanı"
        name="referansYuzeyAlani"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
          {
            validator: (_, value) => {
              if (!value || /^-?\d{1}(\.\d{1,4})?$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error(
                  "Lütfen geçerli bir sayı girin. Ondalıktan önce 1 basamak ondalıktan sonra en fazla 4 basamak girilebilir.",
                ),
              );
            },
          },
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Yüzey alanı girin"
          addonAfter="dm2"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label={type === "update" ? "Resim Değiştir" : "Resim Ekle"} name="resimUrl">
        <Upload
          name="photo"
          listType="picture"
          accept="image/png, image/jpeg, image/jpg, image/tiff"
          fileList={fileList}
          onChange={onFileChange}
          beforeUpload={() => false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Resim seç</Button>
        </Upload>
      </Form.Item>

      <Form.Item label="Üretim Notu" name="not">
        <Input.TextArea />
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
