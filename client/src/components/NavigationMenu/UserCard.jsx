import styled from "styled-components";
import { Button, Tooltip, Modal } from "antd";
import { LogoutOutlined, PoweroffOutlined } from "@ant-design/icons";
import { useUIContext } from "context/UIProvider";
import { useAuth } from "context/AuthProvider";

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ContainerStyled = styled.div`
  // height: 7%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  margin-bottom: 16px;
  width: 80%;

  cursor: pointer;
`;
const UserNameStyled = styled.div`
  font-weight: 700;
  font-size: 1.8vmin;
  color: black;
`;
const UserRoleStyled = styled.div`
  font-size: 1.1vmin;
  color: #909090;
`;

export default function UserCard() {
  const { showNotification } = useUIContext();
  const { logout, user } = useAuth();
  const logoutUser = () => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: "Çıkış yapmak istediğinizden emin misiniz ? ",
      okText: "Eminim",
      cancelText: "İptal",
      async onOk() {
        logout();
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };
  return (
    <WrapperStyled>
      {user && (
        <ContainerStyled>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UserNameStyled>{user.ad}</UserNameStyled>
            <UserRoleStyled>{user.yetki}</UserRoleStyled>
          </div>
          <Tooltip title="Çıkış yap">
            <Button
              shape="circle"
              style={{ marginBottom: "6px" }}
              type="primary"
              danger
              onClick={logoutUser}
            >
              <PoweroffOutlined style={{ fontSize: "22px", marginBottom: "6px" }} />
            </Button>
          </Tooltip>
        </ContainerStyled>
      )}
    </WrapperStyled>
  );
}
