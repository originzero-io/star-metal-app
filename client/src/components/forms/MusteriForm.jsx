import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import musterilerHttp from "services/musteriler.http";

export default function MusteriForm({ record, type }) {
  const { showModal, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

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
      showModal(false);
      showNotification("success", "Kayıt güncellendi");
    } else {
      const newMusteri = await musterilerHttp.addData(values);
      setMusteriler([...musteriler, { ...newMusteri }]);
      showNotification("success", "Kayıt eklendi");
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
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Müşteri Adı - 1"
        name="musteriAdi1"
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
        label="Müşteri Adı - 2"
        name="musteriAdi2"
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
        label="Adres - 1"
        name="adres1"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Adres - 2" name="adres2">
        <Input />
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
        <Input />
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
        <Input />
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
        <Input />
      </Form.Item>
      <Form.Item
        label="Vergi Hesap No"
        name="vergiHesapNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
