/* eslint-disable no-lonely-if */
import { Button, Form, InputNumber } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { devamEdenUretimHttp } from "services/uretimler.http";

export default function MalzemeDuzenlemeForm({ record }) {
  const { setDevamEdenUretimler } = useDBContext();
  const { showModal, showNotification, showAlert } = useUIContext();

  const adediDegistir = async (values) => {
    const updatedUretim = await devamEdenUretimHttp.updateData(record, values);

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
      `${record.referansNo} referans numaralı kaydın gelen malzeme miktarı ${values.gelenMiktar} olarak değiştirildi`,
    );
  };

  const onFinish = async (values) => {
    // console.log("Values:", values);
    try {
      if (record.Referanslar.fason) {
        if (values.gelenMiktar >= record.uretilenMiktar) {
          await adediDegistir(values);
        } else {
          showAlert(
            "warning",
            `Yeni gelen malzeme miktar değeri, üretilen miktardan az olamaz. Üretilen miktar: ${record.uretilenMiktar}`,
          );
        }
      } else if (!record.Referanslar.fason) {
        if (
          values.gelenMiktar >= record.uretilenMiktar &&
          values.gelenMiktar >= record.gidenMiktar
        ) {
          await adediDegistir(values);
        } else {
          showAlert(
            "warning",
            `Yeni gelen malzeme miktar değeri, üretilen miktardan ve giden miktardan az olamaz. Üretilen miktar: ${record.uretilenMiktar} Giden Miktar: ${record.gidenMiktar}`,
          );
        }
      }
    } catch (error) {
      console.log("error", error);
      showNotification("error", error.response.data.message);
    }
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
      initialValues={{ gelenMiktar: record.gelenMiktar }}
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
        name="gelenMiktar"
        ü
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <InputNumber placeholder="Gelen malzeme miktarı" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item style={{ marginTop: "20px" }}>
        <Button type="primary" htmlType="submit" block>
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
