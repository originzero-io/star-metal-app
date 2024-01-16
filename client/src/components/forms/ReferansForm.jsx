import { UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, Select, Upload } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import referanslarHttp from "services/referanslar.http";

export default function ReferansForm({ record, type }) {
  const [referenceTypes, setReferenceTypes] = useState([
    "Fosfat",
    "Nikel",
    "Isıl İşlem",
    "Kumlama",
    "Anchor",
  ]);

  const { referanslar, setReferanslar } = useDBContext();
  const { showModal, showNotification } = useUIContext();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedReferanslar = await referanslarHttp.updateData(referanslar, {
        id: record.id,
        ...values,
      });
      setReferanslar(updatedReferanslar);
      showModal(false);
      showNotification("success", "Kayıt güncellendi");
    } else {
      await referanslarHttp.addData(values);
      setReferanslar([...referanslar, { key: values.referansNo, ...values }]);
      showNotification("success", "Kayıt eklendi");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const addReferansTypeHandler = () => {
    const newReference = prompt("Yeni tip girin: ");
    if (newReference !== null) {
      setReferenceTypes([...referenceTypes, newReference]);
    }
  };
  return (
    <Form
      name="basic"
      labelCol={{ flex: "170px" }}
      labelAlign="left"
      key={record ? record.key : "form"}
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Çıkış Referans No"
        name="referansNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="İrsaliye Açıklama" name="irsaliyeAciklama">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label="Parti Adedi"
        name="partiAdedi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Referans Yüzey Alanı" name="referansYuzeyAlani">
        <Input type="number" />
      </Form.Item>

      <Divider />
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
        <Input />
      </Form.Item>
      <Form.Item
        label="Sipariş No"
        name="siparisNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="İşlem Açıklaması"
        name="islemAciklama"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Resim Ekle" name="resim">
        <Upload
          name="logo"
          action="/upload.do"
          listType="picture"
          accept="image/png, image/jpeg, image/jpg"
        >
          <Button icon={<UploadOutlined />}>Resim seç</Button>
        </Upload>
      </Form.Item>

      <Divider />

      <Form.Item label="Firma Adı.01" name="firmaAdi01">
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="firmaAdi01"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Birim" name="birim">
            <Select placeholder="Birim seçin">
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="lt">lt</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item label="Firma Adı.02" name="firmaAdi02">
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="firmaAdi02"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="İşlem Tipi" name="islemTipi">
            <Select placeholder="Tipi Seçin">
              {referenceTypes.map((referenceType, i) => (
                <Select.Option key={i} value={referenceType}>
                  {referenceType}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button shape="circle" type="primary" onClick={addReferansTypeHandler}>
            +
          </Button>
        </div>
      </Form.Item>

      <Form.Item label="Üretim Adedi Değiştirme" name="uretimAdediDegistirme">
        <Select style={{ width: "50%" }}>
          <Select.Option value="Hayır">Hayır</Select.Option>
          <Select.Option value="Evet">Evet</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
