import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ambalajlarHttp from "services/ambalajlar.http";

export default function AmbalajForm({ record, type }) {
  const { showModal, showNotification } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedMusteri = await ambalajlarHttp.updateData(ambalajlar, {
        id: record.id,
        ...values,
      });
      setAmbalajlar(updatedMusteri);
      showModal(false);
      showNotification("success", "Kayıt güncellendi");
    } else {
      await ambalajlarHttp.addData(values);
      setAmbalajlar([...ambalajlar, { key: values.kasaAdi, ...values }]);
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
      key={record ? record.key : "form"}
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Kasa Adı"
        name="kasaAdi"
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
