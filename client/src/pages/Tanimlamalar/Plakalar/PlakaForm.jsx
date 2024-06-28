import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import logoGoApi from "services/logoGoApi";

export default function PlakaForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { plakalar, setPlakalar } = useDBContext();

  const onFinish = async (values) => {
    const logicalref = await logoGoApi.postData("PostArac", values);
    setPlakalar([...plakalar, { logicalref, ...values }]);
    showNotification("success", `${values.plaka} plakası eklendi`);
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
        label="Plaka"
        name="plaka"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Plaka girin" />
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
