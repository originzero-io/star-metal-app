import { Button, Divider, Form, Input, Select, Switch } from "antd";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import personelHttp from "services/crud-server/personeller.http";

export default function PersonelForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { personeller, setPersoneller } = useDBContext();
  const { user } = useAuth();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedPersonel = await personelHttp.updateData(record.id, values);
      const updatedPersonellerArray = personeller.map((musteri) => {
        if (musteri.id === updatedPersonel.id) {
          return { ...updatedPersonel };
        }
        return musteri;
      });
      setPersoneller(updatedPersonellerArray);
      showPanel(false);
      showNotification("success", "Personel güncellendi");
    } else {
      const newPersonel = await personelHttp.addData(values);
      setPersoneller([...personeller, { ...newPersonel }]);
      showNotification("success", "Personel eklendi");
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
      disabled={user.yetki !== "admin" && user.ad !== record.ad}
    >
      <Form.Item
        label="Ad"
        name="ad"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Ad girin" />
      </Form.Item>
      <Form.Item
        label="Soyad"
        name="soyad"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Soyad girin" />
      </Form.Item>
      <Form.Item
        label="Telefon"
        name="telefon"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Telefon girin" maxLength={13} />
      </Form.Item>
      <Form.Item
        label="TC"
        name="tc"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="TC kimlik no girin" maxLength={11} />
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
        <Input.TextArea placeholder="Adres girin" />
      </Form.Item>

      <Form.Item
        label="Yetki"
        name="yetki"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Select
          placeholder="Yetki düzeyi seçin"
          options={[
            { value: "admin", label: "Admin" },
            { value: "yonetici", label: "Yönetici" },
            { value: "operator", label: "Operatör" },
          ]}
        />
      </Form.Item>

      {(user.yetki === "admin" || (user.yetki === "yonetici" && user.ad === record.ad)) && (
        <Form.Item
          label="Parola"
          name="parola"
          rules={[
            {
              required: true,
              message: "Bu alanı doldurun",
            },
          ]}
        >
          <Input.Password placeholder="Giriş için kullanılacak parola girin" />
        </Form.Item>
      )}

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
