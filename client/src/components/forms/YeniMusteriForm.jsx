import { Button, Divider, Form, Input } from "antd";
import { useUIContext } from "context/UIProvider";

export default function YeniMusteriForm({ record }) {
  const { showModal } = useUIContext();
  console.log("yeni müşteri recordd: ", record);

  const onFinish = (values) => {
    console.log("Success:", values);
    showModal(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Form
      name="basic"
      // labelCol={{
      //   span: 6,
      // }}
      labelCol={{ flex: "130px" }}
      labelAlign="left"
      key={record ? record.key : "form"}
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Müşteri Adı - 1"
        name="musteriAdi1"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
        // initialValue={record ? record.musteriAdi1 : null}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Müşteri Adı - 2"
        name="musteriAdi2"
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
        label="Adres - 1"
        name="adres1"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Adres - 2" name="adres2">
        <Input />
      </Form.Item>
      <Form.Item
        label="İl"
        name="il"
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
        label="İlçe"
        name="ilce"
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
        label="Vergi Dairesi"
        name="vergiDairesi"
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
        label="Vergi Hesap No"
        name="vergiHesapNo"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Divider />

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
// import { Button, Divider, Form, Input } from "antd";
// import { useUIContext } from "context/UIProvider";

// export default function YeniMusteriForm() {
//   const { showModal } = useUIContext();

//   const onFinish = (values) => {
//     console.log("Success:", values);
//     showModal(false);
//   };
//   const onFinishFailed = (errorInfo) => {
//     console.log("Failed:", errorInfo);
//   };
//   return (
//     <Form
//       name="basic"
//       // labelCol={{
//       //   span: 6,
//       // }}
//       labelCol={{ flex: "130px" }}
//       labelAlign="left"
//       initialValues={{
//         remember: true,
//       }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//       autoComplete="off"
//     >
//       <Form.Item
//         label="Müşteri Adı - 1"
//         name="musteriAdi1"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Müşteri Adı - 2"
//         name="musteriAdi2"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Adres - 1"
//         name="adres1"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item label="Adres - 2" name="adres2">
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="İl"
//         name="il"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="İlçe"
//         name="ilce"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
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
//         <Input />
//       </Form.Item>
//       <Form.Item
//         label="Vergi Hesap No"
//         name="vergiHesapNo"
//         rules={[
//           {
//             required: true,
//             message: "Bu alanı doldurun",
//           },
//         ]}
//       >
//         <Input />
//       </Form.Item>

//       <Divider />

//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Kaydet
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }
