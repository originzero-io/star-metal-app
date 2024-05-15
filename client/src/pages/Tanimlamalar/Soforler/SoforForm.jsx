import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import soforlerHttp from "services/soforler.http";

export default function SoforForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { soforler, setSoforler } = useDBContext();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedSofor = await soforlerHttp.updateData(record.id, values);
      const updatedSoforArray = soforler.map((sofor) => {
        if (sofor.id === updatedSofor.id) {
          return { ...updatedSofor };
        }
        return sofor;
      });
      setSoforler(updatedSoforArray);
      // showPanel(false);
      showNotification("success", "Şoför güncellendi");
    } else {
      const newSofor = await soforlerHttp.addData(values);
      setSoforler([...soforler, { ...newSofor }]);
      showNotification("success", "Şoför eklendi");
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
      <Form.Item label="Logo Kodu" name="logicalref">
        <Input placeholder="Şoför logo kodu girin" value={record.logicalref} disabled />
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
