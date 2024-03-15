import { Button, Divider, Form, Input, Radio, Select } from "antd";
import { useDBContext } from "context/DBProvider";
import { getCurrentDateTime } from "utils/time.helper";

export default function MalzemeDuzenlemeForm({ record }) {
  const { referanslar, ambalajlar } = useDBContext();

  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const options = [
    { label: "Sipariş Nolu", value: "Sipariş Nolu" },
    { label: "Talep Nolu", value: "Talep Nolu" },
    { label: "İade", value: "İade" },
  ];

  const onRadioButtonChange = ({ target: { value } }) => {
    console.log("radio3 checked", value);
  };
  return (
    <Form
      name="basic"
      labelCol={{ flex: "150px" }}
      labelAlign="left"
      key={record ? record.id : "form"}
      initialValues={record || {}}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label="Referans Sıra No" name="siraNo">
        <Input disabled placeholder={record.id} />
      </Form.Item>
      <Form.Item label="Tarih" name="tarih">
        <div>{getCurrentDateTime()}</div>
      </Form.Item>

      <Divider />

      <Form.Item
        label="Gelen Malzeme Tipi"
        name="malzemeTipi"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Radio.Group
          options={options}
          onChange={onRadioButtonChange}
          // value={options[0].value}
          optionType="button"
          buttonStyle="solid"
        />
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
        <Select>
          {referanslar.map((referans) => (
            <Select.Option key={referans.id} value={referans.referansNo}>
              {referans.referansNo}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Kontrol Eden"
        name="kontrolEden"
        rules={[
          {
            required: true,
            message: "Bu alanı doldurun",
          },
        ]}
      >
        <Select>
          <Select.Option value="Anıl Akseki">Anıl Akseki</Select.Option>
          <Select.Option value="Mustafa Akseki">Mustafa Akseki</Select.Option>
          <Select.Option value="Özlem Alanç">Özlem Alanç</Select.Option>
          <Select.Option value="Türkan Kader">Türkan Kader</Select.Option>
        </Select>
      </Form.Item>

      <Divider />

      <Form.Item label="Gelen İrsaliye No" name="gelenIrsaliyeNo">
        <div style={{ display: "flex", gap: "16px" }}>
          <Form.Item
            name="irsaliyeNo"
            rules={[
              {
                required: true,
                message: "Bu alanı doldurun",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Kat Sayı" name="katSayi">
            <Input />
          </Form.Item>
          <Button>Kaydet</Button>
        </div>
      </Form.Item>

      <Form.Item
        label="Getiren Şoför"
        name="getirenSofor"
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
        <Input.TextArea />
      </Form.Item>

      <Divider />

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
        label="Talep No"
        name="talepNo"
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

      <div style={{ display: "flex", gap: "10px" }}>
        <Form.Item
          label="1. Ambalaj"
          name="birinciAmbalaj"
          rules={[{ required: true, message: "Ambalaj seçimi zorunludur" }]}
          style={{ flex: 1 }} // margin: 0 ile iç içe Form.Item'larda boşluk sorununu düzeltir
        >
          <Select>
            {ambalajlar.map((ambalaj, i) => (
              <Select.Option key={i} value={ambalaj.kasaAdi}>
                {ambalaj.kasaAdi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="birinciAmbalajInput"
          rules={[{ required: true, message: "Bu alanı doldurun" }]}
          style={{ width: "10%", margin: 0 }}
        >
          <Input type="number" placeholder="0" />
        </Form.Item>
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <Form.Item
          label="2. Ambalaj"
          name="ikinciAmbalaj"
          rules={[{ required: true, message: "Ambalaj seçimi zorunludur" }]}
          style={{ flex: 1 }}
        >
          <Select>
            {ambalajlar.map((ambalaj, i) => (
              <Select.Option key={i} value={ambalaj.kasaAdi}>
                {ambalaj.kasaAdi}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="ikinciAmbalajInput"
          rules={[{ required: true, message: "Bu alanı doldurun" }]}
          style={{ width: "10%", margin: 0 }}
        >
          <Input type="number" placeholder="0" />
        </Form.Item>
      </div>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kaydet
        </Button>
      </Form.Item>
    </Form>
  );
}
