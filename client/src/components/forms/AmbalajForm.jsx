import { Button, Divider, Form, Input } from "antd";
import { useUIContext } from "context/UIProvider";

export default function AmbalajForm({ record }) {
  const { showModal } = useUIContext();
  console.log("yeni müşteri recordd: ", record);

  const onFinish = (values) => {
    console.log("Success:", values);
    showModal(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      // labelCol={{
      //   span: 6,
      // }}
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
