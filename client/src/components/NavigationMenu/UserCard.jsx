import { PoweroffOutlined } from "@ant-design/icons";
import { Modal, Tooltip } from "antd";
import { useAuth } from "context/AuthProvider";
import { useUIContext } from "context/UIProvider";
import styled from "styled-components";

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
  font-weight: 500;
  font-size: 1.6vmin;
  color: #1f1f1f;
`;
const UserRoleStyled = styled.div`
  font-size: 1.1vmin;
  color: #585858;
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
            <UserNameStyled>
              {user.ad} {user.soyad}
            </UserNameStyled>
            <UserRoleStyled>{user.yetki}</UserRoleStyled>
          </div>
          <Tooltip title="Çıkış yap">
            <PoweroffOutlined
              style={{ fontSize: "18px", marginBottom: "6px", color: "red" }}
              onClick={logoutUser}
            />
          </Tooltip>
        </ContainerStyled>
      )}
    </WrapperStyled>
  );
}
