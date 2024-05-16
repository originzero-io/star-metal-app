import { Button, Divider, Form, Input } from "antd";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import musterilerHttp from "services/crud-server/musteriler.http";

export default function MusteriForm({ record, type }) {
  const { showPanel, showNotification } = useUIContext();
  const { musteriler, setMusteriler } = useDBContext();

  const onFinish = async (values) => {
    if (type === "update") {
      const updatedMusteri = await musterilerHttp.updateData(record.id, values);
      const updatedMusterilerArray = musteriler.map((musteri) => {
        if (musteri.id === updatedMusteri.id) {
          return { ...updatedMusteri };
        }
        return musteri;
      });
      setMusteriler(updatedMusterilerArray);
      // showPanel(false);
      showNotification("success", "Müşteri güncellendi");
    } else {
      const newMusteri = await musterilerHttp.addData(values);
      setMusteriler([...musteriler, { ...newMusteri }]);
      showNotification("success", "Müşteri eklendi");
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
        label="Logo Kodu"
        name="logicalref"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input value={record.logicalref} disabled />
      </Form.Item>
      <Form.Item
        label="Kodu"
        name="kodu"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input value={record.kodu} disabled />
      </Form.Item>
      <Form.Item
        label="Müşteri Adı"
        name="unvani"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Müşteri adı girin" />
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
        <Input.TextArea placeholder="Adresi girin" />
      </Form.Item>
      <Form.Item
        label="Vergi Dairesi"
        name="vergiDairesi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Vergi dairesi girin" />
      </Form.Item>
      <Form.Item
        label="Vergi No"
        name="vergiNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input placeholder="Vergi no girin" />
      </Form.Item>
      <Form.Item label="Telefon" name="telefon">
        <Input placeholder="Telefon girin" />
      </Form.Item>
      <Form.Item label="E-Mail" name="mail">
        <Input placeholder="E-mail girin" />
      </Form.Item>
      <Form.Item label="Yetkili Kişi" name="yetkili">
        <Input placeholder="Yetkili girin" />
      </Form.Item>
      <Form.Item label="Kep Adresi" name="kepAdresi">
        <Input placeholder="Kep adresi girin" />
      </Form.Item>

      <Divider />

      <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
        Kaydet
      </Button>
    </Form>
  );
}
// import { Button, Divider, Form, Input } from "antd";
// import { useDBContext } from "context/DBProvider";
// import { useUIContext } from "context/UIProvider";
// import musterilerHttp from "services/musteriler.http";

// export default function MusteriForm({ record, type }) {
//   const { showPanel, showNotification } = useUIContext();
//   const { musteriler, setMusteriler } = useDBContext();

//   const onFinish = async (values) => {
//     if (type === "update") {
//       const updatedMusteri = await musterilerHttp.updateData(record.id, values);
//       const updatedMusterilerArray = musteriler.map((musteri) => {
//         if (musteri.id === updatedMusteri.id) {
//           return { ...updatedMusteri };
//         }
//         return musteri;
//       });
//       setMusteriler(updatedMusterilerArray);
//       // showPanel(false);
//       showNotification("success", "Müşteri güncellendi");
//     } else {
//       const newMusteri = await musterilerHttp.addData(values);
//       setMusteriler([...musteriler, { ...newMusteri }]);
//       showNotification("success", "Müşteri eklendi");
//     }
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };
//   return (
//     <Form
//       name="basic"
//       labelCol={{ flex: "130px" }}
//       labelAlign="left"
//       key={record ? record.id : "form"}
//       initialValues={record || {}}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//     >
//       <Form.Item
//         label="Müşteri Logo Kodu"
//         name="musteriLogoKodu"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input placeholder="Müşteri logo kodu girin" />
//       </Form.Item>
//       <Form.Item
//         label="Müşteri Adı"
//         name="musteriAdi"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input placeholder="Müşteri adı girin" />
//       </Form.Item>
//       <Form.Item
//         label="Adres"
//         name="adres"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input.TextArea placeholder="Adresi girin" />
//       </Form.Item>
//       <Form.Item
//         label="Vergi Dairesi"
//         name="vergiDairesi"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input placeholder="Vergi dairesi girin" />
//       </Form.Item>
//       <Form.Item
//         label="Vergi No"
//         name="vergiNo"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input placeholder="Vergi no girin" />
//       </Form.Item>
//       <Form.Item label="Telefon" name="telefon">
//         <Input placeholder="Telefon girin" />
//       </Form.Item>
//       <Form.Item label="E-Mail" name="mail">
//         <Input placeholder="E-mail girin" />
//       </Form.Item>
//       <Form.Item label="Yetkili Kişi" name="yetkili">
//         <Input placeholder="Yetkili girin" />
//       </Form.Item>
//       <Form.Item label="Kep Adresi" name="kepAdresi">
//         <Input placeholder="Kep adresi girin" />
//       </Form.Item>

//       <Divider />

//       <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
//         Kaydet
//       </Button>
//     </Form>
//   );
// }
