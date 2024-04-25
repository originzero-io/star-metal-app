import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Select, Tag } from "antd";
import CompanyLogo from "components/shared/CompanyLogo";
import styled from "styled-components";
import { useAuth } from "context/AuthProvider";
import { useDBContext } from "context/DBProvider";

const LoginContainer = styled.div`
  height: 100vh;
  // width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: -10%;
`;

const LoginCard = styled(Card)`
  width: 35%;
  // height: 35%;
  background: rgba(255, 255, 255, 0.4);
  padding: 30px;
`;

function Login() {
  const { login } = useAuth();
  const { personeller } = useDBContext();
  const onFinish = (values) => {
    login(values);
    console.log("Received values of form: ", values);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <CompanyLogo imgStyle={{ maxWidth: "15vw" }} />
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item name="ad" rules={[{ required: true, message: "Bu alan boş olamaz!" }]}>
            {/* <Input prefix={<UserOutlined />} placeholder="Personel Adı" /> */}
            <Select placeholder="Personel giriniz">
              {personeller.map((personel) => (
                <Select.Option key={personel.id} value={personel.ad}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {personel.ad}{" "}
                    <Tag color={personel.yetki === "admin" ? "volcano" : "blue"}>
                      {personel.yetki}
                    </Tag>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="parola" rules={[{ required: true, message: "Bu alan boş olamaz!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Parola" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Giriş
            </Button>
          </Form.Item>
        </Form>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
