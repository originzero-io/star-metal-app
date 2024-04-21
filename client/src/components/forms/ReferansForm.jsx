import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  InputNumber,
  Menu,
  Radio,
  Select,
  Space,
  Upload,
} from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useRef, useState } from "react";
import { IoPulseOutline } from "react-icons/io5";
import referanslarHttp, {
  referansIslemAdlariHttp,
  referansIslemTipleriHttp,
} from "services/referanslar.http";

export default function ReferansForm({ record, type }) {
  const {
    referanslar,
    setReferanslar,
    referansIslemTipleri,
    setReferansIslemTipleri,
    referansParcaAdlari,
    setReferansParcaAdlari,
    musteriler,
  } = useDBContext();
  const { showPanel, showNotification } = useUIContext();

  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  const [siparisTipi, setSiparisTipi] = useState(record?.siparisTipi);
  const [fason, setFason] = useState(record?.fason || false);

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    console.log("values:", values);
    if (type === "update") {
      const updatedReferans = await referanslarHttp.updateData(record.id, values);

      const updatedReferanslarArray = referanslar.map((referans) => {
        if (referans.id === updatedReferans.id) {
          return { ...updatedReferans };
        }
        return referans;
      });
      setReferanslar(updatedReferanslarArray);
      // showPanel(false)
      showNotification("success", "Referans güncellendi");
    } else {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (fileList.length > 0) {
        formData.append("photo", fileList[0].originFileObj);
      }
      const newReferans = await referanslarHttp.addData(formData);
      setReferanslar([...referanslar, { ...newReferans }]);
      showNotification("success", "Referans eklendi");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const referansTipiEkle = async () => {
    const newReference = prompt("Yeni tip girin: ");

    if (newReference.trim() === "") {
      showNotification("error", "Alan boş olamaz");
    } else if (newReference !== null) {
      const data = await referansIslemTipleriHttp.addData({ islemTipi: newReference });
      setReferansIslemTipleri([...referansIslemTipleri, { ...data }]);
      showNotification("success", `${newReference} işlem tipi olarak eklendi.`);
    }
  };
  const parcaAdiEkle = async () => {
    const newParcaAdi = prompt("Yeni parça adı girin: ");

    if (newParcaAdi.trim() === "") {
      showNotification("error", "Alan boş olamaz");
    } else if (newParcaAdi !== null) {
      const data = await referansIslemAdlariHttp.addData({ parcaAdi: newParcaAdi });
      // setReferansParcaAdlari([...referansParcaAdlari, { ...data }]);
      setReferansParcaAdlari((prevState) => [...prevState, { ...data }]);
      showNotification("success", `${newParcaAdi} parça adı olarak eklendi.`);
    }
  };

  const [selectedItems, setSelectedItems] = useState([]);

  const [name, setName] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSelectChange = (selected) => {
    setSelectedItems(selected);
  };

  return (
    <Form
      form={form}
      name="referans-form"
      labelCol={{ flex: "170px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={record || { miktarSapmasi: 0, fason: record?.fason || false }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Referans No"
        name="referansNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Referans No" />
      </Form.Item>

      <Form.Item
        label="Parça Adı"
        name="parcaAdi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Space.Compact block>
          <Form.Item name="parcaAdi" noStyle>
            <Select placeholder="Parça Adı Seçiniz" onChange={handleSelectChange}>
              {referansParcaAdlari.map((parcaAdi) => (
                <Select.Option key={parcaAdi.id} value={parcaAdi.parcaAdi}>
                  {parcaAdi.parcaAdi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" onClick={parcaAdiEkle} style={{ width: "100px" }}>
            Ekle
          </Button>
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
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Select placeholder="Müşteri Adı Seçiniz">
          {musteriler.map((musteri) => (
            <Select.Option key={musteri.id} value={musteri.musteriAdi}>
              {musteri.musteriAdi}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Çıkış Referans No"
        name="cikisReferansNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Çıkış Referans No" />
      </Form.Item>

      <Divider />

      <Form.Item
        name="siparisTipi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Radio.Group value={"Seri"} onChange={(e) => setSiparisTipi(e.target.value)}>
          <Space direction="vertical">
            <Radio value="Seri">
              <div
                style={{
                  width: "500px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>Seri</div>
                {siparisTipi === "Seri" && (
                  <Form.Item
                    name="siparisNo"
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
            <Radio value="Talepli">
              <div
                style={{
                  width: "500px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>Talepli</div>
                {siparisTipi === "Talepli" && (
                  <>
                    <Form.Item name="talepNo" style={{ width: 200, marginLeft: "3%" }}>
                      <Input title="Talep No" placeholder="Talep No Girin" />
                    </Form.Item>
                  </>
                )}
              </div>
            </Radio>
          </Space>
        </Radio.Group>
      </Form.Item>

      <Divider />

      <div style={{ display: "flex" }}>
        <Form.Item name="fason" valuePropName="checked">
          <Checkbox
            onChange={(e) => {
              setFason(e.target.checked);
              form.setFieldsValue({ fason: e.target.checked });
            }}
            checked={fason}
          >
            Fason
          </Checkbox>
        </Form.Item>

        {fason && (
          <Form.Item
            name="fasonFirmasi"
            rules={[{ required: fason, message: "Fason firması giriniz" }]}
            style={{ marginLeft: "2%", width: 200 }}
          >
            <Input title="Fason Firması" placeholder="Fason Firması" />
          </Form.Item>
        )}
      </div>

      <Divider />

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
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Yüzey alanı girin"
          addonAfter="dm2"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Divider />

      <Form.Item label="İşlem Tipi">
        <Space.Compact block>
          <Form.Item
            name="islemTipi"
            noStyle
            rules={[{ required: true, message: "Bu alanı doldurun" }]}
          >
            <Select placeholder="Tipi Seçin">
              {referansIslemTipleri.map((islemTipi) => (
                <Select.Option key={islemTipi.id} value={islemTipi.islemTipi}>
                  {islemTipi.islemTipi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" onClick={referansTipiEkle} style={{ width: "100px" }}>
            Ekle
          </Button>
        </Space.Compact>
      </Form.Item>

      <Form.Item
        label="Birim"
        name="birim"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Select placeholder="Birim seçin">
          <Select.Option value="kg">kg</Select.Option>
          <Select.Option value="lt">gram</Select.Option>
          <Select.Option value="adet">adet</Select.Option>
        </Select>
      </Form.Item>

      {type !== "update" && (
        <Form.Item label="Resim" name="resim">
          <Upload
            name="photo"
            listType="picture"
            accept="image/png, image/jpeg, image/jpg"
            fileList={fileList}
            onChange={onFileChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Resim seç</Button>
          </Upload>
        </Form.Item>
      )}

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
