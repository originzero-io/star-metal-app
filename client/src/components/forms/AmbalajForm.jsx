import { Button, Divider, Form, Input, Upload } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ambalajlarHttp from "services/ambalajlar.http";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function AmbalajForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const [fileList, setFileList] = useState([]);

  const onFileChange = ({ fileList: newFileList }) => {
    console.log("fileList: ", newFileList);
    setFileList(newFileList);
  };
  const onFinish = async (values) => {
    if (type === "update") {
      const updatedAmbalaj = await ambalajlarHttp.updateData(record.id, values);

      const updatedAmbalajlarArray = ambalajlar.map((ambalaj) => {
        if (ambalaj.id === updatedAmbalaj.id) {
          return { ...updatedAmbalaj };
        }
        return ambalaj;
      });
      setAmbalajlar(updatedAmbalajlarArray);
      // showPanel(false);
      showNotification("success", "Ambalaj güncellendi");
    } else {
      const formData = new FormData();
      formData.append("kasaAdi", values.kasaAdi);

      if (fileList.length > 0) {
        formData.append("photo", fileList[0].originFileObj);
      }

      const newAmbalaj = await ambalajlarHttp.addData(formData);
      setAmbalajlar([...ambalajlar, { ...newAmbalaj }]);
      showNotification("success", "Ambalaj eklendi");
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
      {type !== "update" && (
        <Form.Item
          label="Resim Ekle"
          name="photo"
          rules={[
            {
              required: true,
              message: "Bu ürüne ait bir resim seçin",
            },
          ]}
        >
          <Upload
            name="photo"
            listType="picture"
            accept="image/png, image/jpeg, image/jpg"
            fileList={fileList}
            onChange={onFileChange}
            beforeUpload={() => false}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Resim seç</Button>
          </Upload>
        </Form.Item>
      )}
      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
