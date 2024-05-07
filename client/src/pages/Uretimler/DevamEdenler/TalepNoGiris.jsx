/* eslint-disable no-lonely-if */
import { Button, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { devamEdenUretimHttp } from "services/uretimler.http";

export default function TalepNoGiris({ record }) {
  const { setDevamEdenUretimler } = useDBContext();
  const { showModal, showNotification, showAlert } = useUIContext();

  const onFinish = async (values) => {
    const updatedUretim = await devamEdenUretimHttp.talepNoGir(record, values);

    setDevamEdenUretimler((prevState) => {
      if (updatedUretim.Referanslar.fason) {
        return {
          ...prevState,
          fasonUretimler: prevState.fasonUretimler.map((fason) => {
            if (fason.id === updatedUretim.id) {
              return { ...updatedUretim };
            }
            return fason;
          }),
        };
      }
      return {
        ...prevState,
        normalUretimler: prevState.normalUretimler.map((normal) => {
          if (normal.id === updatedUretim.id) {
            return { ...updatedUretim };
          }
          return normal;
        }),
      };
    });

    showModal(false);
    showNotification(
      "success",
      `${record.id} numaralı üretimin talep numarası ${values.talepNo} olarak kaydedildi.`,
    );
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      // labelCol={{ flex: "150px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={{ talepNo: record.talepNo }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <div
        style={{
          marginBottom: "10px",
          fontWeight: "500",
          borderBottom: "1px solid #d1d1d1",
          padding: "4px",
          fontSize: "15px",
        }}
      >
        <div>Referans No: {record.referansNo}</div>
        <div>Müşteri: {record.Referanslar.musteriAdi}</div>
      </div>
      <Form.Item
        name="talepNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Talep no giriniz" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item style={{ marginTop: "20px" }}>
        <Button type="primary" htmlType="submit" block>
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
