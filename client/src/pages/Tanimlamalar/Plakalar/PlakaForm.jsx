import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import plakalarHttp from "services/crud-server/plakalar.http";

export default function PlakaForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { plakalar, setPlakalar } = useDBContext();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedPlaka = await plakalarHttp.updateData(record.id, values);
      const updatedPlakaArray = plakalar.map((plaka) => {
        if (plaka.id === updatedPlaka.id) {
          return { ...updatedPlaka };
        }
        return plaka;
      });
      setPlakalar(updatedPlakaArray);
      // showPanel(false);
      showNotification("success", "Plaka güncellendi");
    } else {
      const newPlaka = await plakalarHttp.addData(values);
      setPlakalar([...plakalar, { ...newPlaka }]);
      showNotification("success", "Plaka eklendi");
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
