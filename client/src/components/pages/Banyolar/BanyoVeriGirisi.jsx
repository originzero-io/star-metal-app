import { Button, Col, Input, Row, Space, Tag } from "antd";
import { FcBullish, FcCustomerSupport, FcPlus, FcSurvey } from "react-icons/fc";
import styled from "styled-components";

const BanyoVeriGirisiContainerStyled = styled.div`
  width: 100%;
  height: 90vh;
  padding: 24px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6vmin;
  margin-top: 40px;
`;
const MiddleSection = styled.div`
  margin-top: 20px;
  font-size: 1.8vmin;
  display: flex;
  flex-direction: column;
`;
const ValuesItem = styled.div`
  margin: 8px;
  border-radius: 4px;
  // background: linear-gradient(90deg, #e9effd 0%, #e6f0fd);
  border: 1px solid rgb(184, 203, 245);
  color: #4c4c4c;
  box-shadow: 0 2px 4px 0 rgba(60, 60, 60, 0.3);
  box-shadow: 0 2px 4px 0 rgba(132, 132, 132, 0.3);
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  width: 100%;
  &:hover {
    border: 1px solid rgb(58, 105, 211);
  }
`;
const ValuesItemHeader = styled.div`
  font-weight: 600;
  padding-left: 14px;
  padding: 8px;
  font-size: 1.7vmin;
`;
const ValuesItemContent = styled.div`
  font-size: 2.5vmin;
  font-weight: 500;
  text-align: center;
`;

const MiddleSectionFieldWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const BottomSection = styled.div`
  margin-top: 30px;
  font-size: 1.7vmin;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 20px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const ButtonSection = styled.div`
  margin-top: 20px;
`;

export default function BanyoVeriGirisi({ content }) {
  return (
    <BanyoVeriGirisiContainerStyled>
      <Space
        direction="vertical"
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        <TopSection>
          <div>
            <span>Yetkili: </span>
            <Input style={{ marginLeft: "10px", width: "200px" }} />
          </div>
          <div>
            <span>Banyo Sıcaklığı: </span>
            <Tag
              color="red"
              style={{ padding: "7px", fontSize: "2vmin", fontWeight: "700", color: "red" }}
            >
              {content.banyoSicakligi}
            </Tag>
          </div>
        </TopSection>
        <MiddleSection>
          {content.parameters &&
            Object.entries(content.parameters).map((parameterEntry, i) => (
              <MiddleSectionFieldWrapper key={parameterEntry[1]}>
                <ValuesItem>
                  <ValuesItemHeader>{parameterEntry[0]}</ValuesItemHeader>
                  <ValuesItemContent>
                    <Input
                      placeholder={parameterEntry[1]}
                      type="number"
                      style={{
                        height: "5vh",
                        borderRadius: "0px",
                        textAlign: "center",
                        fontWeight: "500",
                        fontSize: "2.5vmin",
                        background: "transparent",
                        border: "none",
                        color: "darkblue",
                      }}
                    />
                  </ValuesItemContent>
                </ValuesItem>
                <ValuesItem>
                  <ValuesItemHeader>Açıklama</ValuesItemHeader>
                  <ValuesItemContent>
                    <div
                      style={{
                        fontSize: "2vmin",
                        background: "transparent",
                        height: "5vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      AÇIKLAMA BURAYA
                    </div>
                  </ValuesItemContent>
                </ValuesItem>
              </MiddleSectionFieldWrapper>
            ))}
        </MiddleSection>
        <BottomSection>
          <div>
            <span style={{ marginRight: "10px" }}>Yüzey Alanı: </span>
            <Tag
              style={{
                padding: "5px",
                width: "100px",
                textAlign: "center",
                fontSize: "1.7vmin",
              }}
              color="blue"
            >
              32.1
            </Tag>
          </div>
          <div>
            <span style={{ marginRight: "10px" }}>Banyo Ömrü: </span>
            <Tag
              style={{ padding: "5px", width: "100px", textAlign: "center", fontSize: "1.7vmin" }}
              color="blue"
            >
              1200
            </Tag>
          </div>
        </BottomSection>

        <ButtonSection>
          <Row gutter={4}>
            <Col span={6}>
              <CustomButton icon={<FcSurvey style={{ fontSize: "3vmin" }} />}>
                Ölçüm Değerlerini Kaydet
              </CustomButton>
            </Col>
            <Col span={6}>
              <CustomButton icon={<FcPlus style={{ fontSize: "3vmin" }} />}>
                Yeni Banyo
              </CustomButton>
            </Col>
            <Col span={6}>
              <CustomButton icon={<FcBullish style={{ fontSize: "3vmin" }} />}>
                En Son Ölçülen Değerler
              </CustomButton>
            </Col>
            <Col span={6}>
              <CustomButton icon={<FcCustomerSupport style={{ fontSize: "3vmin" }} />}>
                Yardım
              </CustomButton>
            </Col>
          </Row>
        </ButtonSection>
      </Space>
    </BanyoVeriGirisiContainerStyled>
  );
}

function CustomButton({ icon, children }) {
  return (
    <Button
      // type="primary"
      // danger
      type="dashed"
      shape="round"
      size="small"
      icon={icon}
      style={{
        width: "100%",
        height: "70px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {children}
    </Button>
  );
}
