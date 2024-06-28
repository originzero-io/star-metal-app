import { Button, Divider, Form, Input, Upload } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ambalajlarHttp from "services/crud-server/ambalajlar.http";
import { UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import getUrlByEnvVariables from "utils/getServerUrl";

export default function AmbalajForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState([]);

  // Düzenleme ekranında mevcut resim gözüksün diye gerekli ayarlamalar
  useEffect(() => {
    if (type === "update") {
      const initialFileList = [
        {
          uid: "-1",
          name: record.resimUrl,
          status: "done",
          url: `${getUrlByEnvVariables()}/uploads/ambalajlar/${record.resimUrl}`,
        },
      ];
      setFileList(initialFileList);

      form.setFieldsValue({
        kasaAdi: record.kasaAdi,
        kasaTanimi: record.kasaTanimi,
        kasaOlcusu: record.kasaOlcusu,
        photo: initialFileList,
      });
    }
  }, [form, type, record]);

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("kasaAdi", values.kasaAdi);
    formData.append("kasaTanimi", values.kasaTanimi);
    formData.append("kasaOlcusu", values.kasaOlcusu);
    formData.append("photo", fileList[0].originFileObj);

    if (type === "update") {
      formData.append("id", record.id);

      const updatedAmbalaj = await ambalajlarHttp.updateWithPhoto(formData);

      const updatedAmbalajlarArray = ambalajlar.map((ambalaj) => {
        if (ambalaj.id === updatedAmbalaj.id) {
          // resmin otomatik render edilmesi için urlin sonuna query ekledik
          return {
            ...updatedAmbalaj,
            resimUrl: `${updatedAmbalaj.resimUrl}?t=${new Date().getTime()}`,
          };
        }
        return ambalaj;
      });

      setAmbalajlar(updatedAmbalajlarArray);
      showNotification("success", "Ambalaj güncellendi");
      showPanel(false);
    } else {
      const newAmbalaj = await ambalajlarHttp.addData(formData);
      setAmbalajlar([...ambalajlar, { ...newAmbalaj }]);
      showNotification("success", "Ambalaj eklendi");
      showPanel(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      form={form}
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
        label="Kasa Adı"
        name="kasaAdi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Kasa adı girin" />
      </Form.Item>
      <Form.Item
        label="Kasa Tanımı"
        name="kasaTanimi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Kasa tanımı girin" />
      </Form.Item>
      <Form.Item
        label="Kasa Ölçüsü"
        name="kasaOlcusu"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Kasa ölçüsü girin" />
      </Form.Item>
      <Form.Item
        label={type === "update" ? "Resim Değiştir" : "Resim Ekle"}
        name="photo"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Upload
          name="photo"
          listType="picture"
          accept="image/png, image/jpeg, image/jpg, image/bmp"
          fileList={fileList}
          onChange={onFileChange}
          beforeUpload={() => false}
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Resim seç</Button>
        </Upload>
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
