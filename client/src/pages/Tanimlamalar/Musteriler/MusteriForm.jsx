import { Button, Checkbox, Divider, Form, Input, Select } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import musterilerHttp from "services/crud-server/musteriler.http";
import iller from "utils/iller.json";

export default function MusteriForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

  const [form] = Form.useForm();

  const [sahisFirmasi, setSahisFirmasi] = useState(record?.sahisFirmasi);

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedMusteri = await musterilerHttp.updateData(record.id, values);
      const updatedMusterilerArray = musteriler.map((musteri) => {
        if (musteri.id === updatedMusteri.id) {
          return { ...updatedMusteri };
        }
        return musteri;
      });
      setMusteriler(updatedMusterilerArray);
      // showPanel(false);
      showNotification("success", "Müşteri güncellendi");
    } else {
      const newMusteri = await musterilerHttp.addData(values);
      setMusteriler([...musteriler, { ...newMusteri }]);
      showNotification("success", "Müşteri eklendi");
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ flex: "130px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={record || { ulke: "Türkiye" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      {type === "update" && (
        <>
          <Form.Item
            label="Logo Kodu"
            name="logoRef"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input value={record.logoRef} disabled />
          </Form.Item>
          <Form.Item
            label="Kodu"
            name="kodu"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input value={record.kodu} disabled />
          </Form.Item>
        </>
      )}

      {type === "update" && <Divider />}

      <Form.Item name="sahisFirmasi" valuePropName="checked">
        <Checkbox
          onChange={(e) => {
            setSahisFirmasi(e.target.checked);
            form.setFieldsValue({ sahisFirmasi: e.target.checked });
          }}
          checked={sahisFirmasi}
        >
          Şahıs Firması
        </Checkbox>
      </Form.Item>

      <Form.Item
        label="Adı"
        name="adi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Adı girin" />
      </Form.Item>

      {sahisFirmasi ? (
        <>
          <Form.Item
            label="Soyadı"
            name="soyadi"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input placeholder="Soyadı girin" />
          </Form.Item>

          <Form.Item
            label="Kimlik No"
            name="kimlikNo"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input placeholder="Kimlik no girin" maxLength={11} />
          </Form.Item>
        </>
      ) : (
        <Form.Item
          label="Vergi No"
          name="vergiNo"
          rules={[
            {
              required: true,
              message: "Bu alanı doldurun",
            },
          ]}
        >
          <Input placeholder="Vergi no girin" />
        </Form.Item>
      )}

      <Divider />

      <Form.Item label="Ünvanı" name="unvani">
        <Input placeholder="Ünvan girin" />
      </Form.Item>

      <Form.Item
        label="Adres"
        name="adres"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input.TextArea placeholder="Adresi girin" />
      </Form.Item>
      <Form.Item
        label="İl"
        name="il"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Select placeholder="İl seçin" showSearch>
          {iller.map((il) => (
            <Select.Option key={il.id} value={il.name}>
              {il.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="İlçe"
        name="ilce"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="İlçe girin" />
      </Form.Item>
      <Form.Item
        label="Ülke"
        name="ulke"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Ülke girin" />
      </Form.Item>

      <Form.Item
        label="Vergi Dairesi"
        name="vergiDairesi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Vergi dairesi girin" />
      </Form.Item>

      <Form.Item label="Posta Kodu" name="postaKodu">
        <Input placeholder="Posta kodu girin" maxLength={5} />
      </Form.Item>

      <Form.Item label="Telefon" name="telefon">
        <Input placeholder="Telefon girin" maxLength={25} />
      </Form.Item>
      <Form.Item label="E-Mail" name="mail">
        <Input placeholder="E-mail girin" />
      </Form.Item>
      <Form.Item label="Yetkili Kişi" name="yetkili">
        <Input placeholder="Yetkili girin" />
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" block>
        Kaydet
      </Button>
    </Form>
  );
}
