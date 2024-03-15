import { UploadOutlined } from "@ant-design/icons";
import { Button, Divider, Form, Input, InputNumber, Select, Upload } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import referanslarHttp, { referansIslemTipleriHttp } from "services/referanslar.http";

export default function ReferansForm({ record, type }) {
  const { referanslar, setReferanslar, referansIslemTipleri, setReferansIslemTipleri } =
    useDBContext();
  const { showModal, showNotification } = useUIContext();

  const [fileList, setFileList] = useState([]);

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedReferans = await referanslarHttp.updateData(record.id, values);

      const updatedReferanslarArray = referanslar.map((referans) => {
        if (referans.id === updatedReferans.id) {
          return { ...updatedReferans };
        }
        return referans;
      });
      setReferanslar(updatedReferanslarArray);
      showModal(false);
      showNotification("success", "Referans güncellendi");
    } else {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (fileList.length > 0) {
        formData.append("photo", fileList[0].originFileObj);
      }
      const newReferans = await referanslarHttp.addData(formData);
      setReferanslar([...referanslar, { ...newReferans }]);
      showNotification("success", "Referans eklendi");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const addReferansTypeHandler = async () => {
    const newReference = prompt("Yeni tip girin: ");

    if (newReference.trim() === "") {
      showNotification("error", "Alan boş olamaz");
    } else if (newReference !== null) {
      const data = await referansIslemTipleriHttp.addData({ islemTipi: newReference });
      setReferansIslemTipleri([...referansIslemTipleri, { ...data }]);
      showNotification("success", `${newReference} işlem tipi olarak eklendi.`);
    }
  };

  return (
    <Form
      name="basic"
      labelCol={{ flex: "170px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Çıkış Referans No"
        name="referansNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="İrsaliye Açıklama" name="irsaliyeAciklama">
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label="Lot Adedi"
        name="lotAdedi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label="Miktar Sapması"
        name="miktarSapmasi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item label="Referans Yüzey Alanı" name="referansYuzeyAlani">
        <InputNumber min={0} />
      </Form.Item>

      <Divider />
      <Form.Item
        label="Referans No"
        name="referansNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Sipariş No"
        name="siparisNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="İşlem Açıklaması"
        name="islemAciklama"
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
          label="Resim"
          name="resim"
          rules={[
            {
              required: true,
              message: "Bu alanı doldurun",
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

      <Form.Item label="Firma Adı.01" name="firmaAdi01">
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="firmaAdi01"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Birim" name="birim">
            <Select placeholder="Birim seçin">
              <Select.Option value="kg">kg</Select.Option>
              <Select.Option value="lt">lt</Select.Option>
            </Select>
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item label="Firma Adı.02" name="firmaAdi02">
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="firmaAdi02"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="İşlem Tipi" name="islemTipi">
            <Select placeholder="Tipi Seçin">
              {referansIslemTipleri.map((islemTipi) => (
                <Select.Option key={islemTipi.id} value={islemTipi.islemTipi}>
                  {islemTipi.islemTipi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button shape="circle" type="primary" onClick={addReferansTypeHandler}>
            +
          </Button>
        </div>
      </Form.Item>

      <Form.Item label="Üretim Adedi Değiştirme" name="uretimAdediDegistirme">
        <Select style={{ width: "50%" }}>
          <Select.Option value="Hayır">Hayır</Select.Option>
          <Select.Option value="Evet">Evet</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
