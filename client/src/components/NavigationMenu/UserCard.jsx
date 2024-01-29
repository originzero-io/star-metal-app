import styled from "styled-components";

const ContainerStyled = styled.div`
  height: 7%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;

  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
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
const AvatarStyled = styled.div`
  background-color: tomato;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: 600;
  margin-right: 10px;
`;
export default function UserCard() {
  return (
    <ContainerStyled>
      <AvatarStyled>A</AvatarStyled>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <UserNameStyled>Akın Şibay</UserNameStyled>
        <UserRoleStyled>Administrator</UserRoleStyled>
      </div>
    </ContainerStyled>
  );
}
