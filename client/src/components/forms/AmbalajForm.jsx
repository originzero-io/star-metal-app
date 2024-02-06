import { Button, Divider, Form, Input, Upload } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import ambalajlarHttp from "services/ambalajlar.http";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function AmbalajForm({ record, type }) {
  const { showModal, showNotification } = useUIContext();
  const { ambalajlar, setAmbalajlar } = useDBContext();

  const [fileList, setFileList] = useState([]);

  const onFileChange = ({ fileList: newFileList }) => {
    console.log("fileList: ", newFileList);
    setFileList(newFileList);
  };
  const onFinish = async (values) => {
    if (type === "update") {
      const updatedMusteri = await ambalajlarHttp.updateData(ambalajlar, {
        id: record.id,
        kasaAdi: values.kasaAdi,
        resimUrl: record.resimUrl,
      });
      setAmbalajlar(updatedMusteri);
      showModal(false);
      showNotification("success", "Ambalaj güncellendi");
    } else {
      const formData = new FormData();
      formData.append("kasaAdi", values.kasaAdi);

      if (fileList.length > 0) {
        formData.append("photo", fileList[0].originFileObj);
      }

      await ambalajlarHttp.addData(formData);
      const resimUrl = `${values.kasaAdi}.${values.photo.file.type.split("/")[1]}`;
      setAmbalajlar([...ambalajlar, { key: values.kasaAdi, kasaAdi: values.kasaAdi, resimUrl }]);
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
