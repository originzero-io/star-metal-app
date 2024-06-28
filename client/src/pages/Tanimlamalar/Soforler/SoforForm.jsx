import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import logoGoApi from "services/logoGoApi";

export default function SoforForm({ record }) {
  const { showPanel, showNotification } = useUIContext();
  const { soforler, setSoforler } = useDBContext();

  const onFinish = async (values) => {
    const logicalref = await logoGoApi.postData("PostSofor", values);
    setSoforler([...soforler, { logicalref, ...values }]);
    showNotification("success", `${values.adi} ${values.soyadi} şoförü eklendi`);
    showPanel(false);
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
        label="Adı"
        name="adi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Şoför adı girin" />
      </Form.Item>
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
        <Input placeholder="Şoför soyadı girin" />
      </Form.Item>
      <Form.Item
        label="TC"
        name="kimlikNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Şoför TC girin" maxLength={11} />
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
