import {
  FormOutlined,
  LineChartOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Button, Col, Input, Row, Space, Tabs, Tag } from "antd";
import {
  FcComboChart,
  FcCustomerSupport,
  FcBullish,
  FcAddDatabase,
  FcSurvey,
  FcPlus,
} from "react-icons/fc";
import styled from "styled-components";
import BanyoValues from "../../constants/BanyoDegerleri.json";
import { useEffect, useState } from "react";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px;
  max-width: 87%;
  width: 90%;

  overflow: auto;
`;

const ContentStyled = styled.div`
  width: 100%;
  padding: 30px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const tabItems = [
  {
    label: <div style={{ fontWeight: "800", color: "red", fontSize: "1.6vmin" }}>KA Hattı</div>,
    key: "KA-HEADER",
    disabled: true,
  },
  {
    label: <TabLabel>KA01 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KA01",
    children: <BanyoIcerik name="KA01" />,
  },
  {
    label: <TabLabel>KA03 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KA03",
    children: <BanyoIcerik name="KA03" />,
  },
  {
    label: <TabLabel>KA06 - Asit Banyosu</TabLabel>,
    key: "KA06",
    children: <BanyoIcerik name="KA06" />,
  },
  {
    label: <TabLabel>KA09 - Aktivasyon Banyosu</TabLabel>,
    key: "KA09",
    children: <BanyoIcerik name="KA09" />,
  },
  {
    label: <TabLabel>KA10 - Fosfat Banyosu</TabLabel>,
    key: "KA10",
    children: <BanyoIcerik name="KA10" />,
  },
  {
    label: <TabLabel>KA11 - Fosfat Banyosu</TabLabel>,
    key: "KA11",
    children: <BanyoIcerik name="KA11" />,
  },
  {
    label: <TabLabel>KA14 - Yağlama Banyosu</TabLabel>,
    key: "KA14",
    children: <BanyoIcerik name="KA14" />,
  },
  {
    label: <div style={{ fontWeight: "800", color: "red", fontSize: "1.6vmin" }}>KB Hattı</div>,
    key: "KB-HEADER",
    disabled: true,
  },
  {
    label: <TabLabel>KB01 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KB01",
    children: <BanyoIcerik name="KB01" />,
  },
  {
    label: <TabLabel>KB03 - Elek. Yağ Alma Banyosu</TabLabel>,
    key: "KB03",
    children: <BanyoIcerik name="KB03" />,
  },
  {
    label: <TabLabel>KB06 - Asit Banyosu</TabLabel>,
    key: "KB06",
    children: <BanyoIcerik name="KB06" />,
  },
  {
    label: <TabLabel>KB09 - Nikel Banyosu</TabLabel>,
    key: "KB09",
    children: <BanyoIcerik name="KB09" />,
  },
  {
    label: <TabLabel>KB10 - Nikel Banyosu Banyosu</TabLabel>,
    key: "KB10",
    children: <BanyoIcerik name="KB10" />,
  },
  {
    label: <TabLabel>KB12 - Fosfat Banyosu</TabLabel>,
    key: "KB12",
    children: <BanyoIcerik name="KB12" />,
  },
  {
    label: <TabLabel>KB14 - Yağlama Banyosu</TabLabel>,
    key: "KB14",
    children: <BanyoIcerik name="KB14" />,
  },
];

export default function BanyoDegerleri() {
  return (
    <Container>
      <ContentStyled>
        <Tabs defaultActiveKey="KA01" tabPosition="left" size="middle" items={tabItems} />
      </ContentStyled>
    </Container>
  );
}

const BanyoIcerikStyled = styled.div``;
const BanyoIcerikContentStyled = styled.div`
  width: 100%;
  height: 90vh;
  padding: 30px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const BanyoNameStyled = styled.div`
  text-align: center;
  font-size: 2vmin;
  font-weight: 700;
  display: flex;
  justify-content: center;
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
`;
const ValuesItem = styled.div`
  border: 1px solid #c4c4c4;
  margin: 5px;
  border-radius: 4px;
  width: 40%;
`;
const ValuesItemHeader = styled.div`
  text-align: center;
  background-color: #c3c3c3;
  background-color: #b62626;
  color: #eeeeee;
`;
const ValuesItemContent = styled.div`
  font-size: 3vmin;
  font-weight: 700;
  text-align: center;
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
function BanyoIcerik({ name }) {
  const [content, setContent] = useState({});

  useEffect(() => {
    const banyoContent = BanyoValues[name];
    setContent(banyoContent);
  }, [content]);

  return (
    <BanyoIcerikStyled>
      <BanyoIcerikContentStyled>
        <BanyoNameStyled>
          <FcComboChart style={{ fontSize: "3vmin", marginRight: "10px" }} />
          <div>{name} Banyosu</div>
        </BanyoNameStyled>
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
              Object.entries(content.parameters).map((parameterEntry) => (
                <ValuesItem>
                  <ValuesItemHeader>{parameterEntry[0]}</ValuesItemHeader>
                  <ValuesItemContent>{parameterEntry[1]}</ValuesItemContent>
                </ValuesItem>
              ))}
            {/* {values.parameters.map((parameter) => (
              <ValuesItem>
                <ValuesItemHeader>{Object.keys(parameter)}</ValuesItemHeader>
                <ValuesItemContent>{}</ValuesItemContent>
              </ValuesItem>
            ))} */}
            {/* <ValuesItem>
              <ValuesItemHeader>Temizleme Noktası</ValuesItemHeader>
              <ValuesItemContent>0</ValuesItemContent>
            </ValuesItem>
            <ValuesItem>
              <ValuesItemHeader>Serbest Asit</ValuesItemHeader>
              <ValuesItemContent>0</ValuesItemContent>
            </ValuesItem>
            <ValuesItem>
              <ValuesItemHeader>Demir Noktası</ValuesItemHeader>
              <ValuesItemContent>0</ValuesItemContent>
            </ValuesItem> */}
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
          {/* <ButtonSection>
            <Row gutter={4}>
              <Col span={6}>
                <CustomButton icon={<SaveOutlined style={{ fontSize: "2.5vmin" }} />}>
                  Ölçüm Değerlerini Kaydet
                </CustomButton>
              </Col>
              <Col span={6}>
                <CustomButton icon={<FormOutlined style={{ fontSize: "2.5vmin" }} />}>
                  Yeni Kuruluş
                </CustomButton>
              </Col>
              <Col span={6}>
                <CustomButton icon={<LineChartOutlined style={{ fontSize: "2.5vmin" }} />}>
                  En Son Ölçülen Değerler
                </CustomButton>
              </Col>
              <Col span={6}>
                <CustomButton icon={<QuestionCircleOutlined style={{ fontSize: "2.5vmin" }} />}>
                  Yardım
                </CustomButton>
              </Col>
            </Row>
          </ButtonSection> */}
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
      </BanyoIcerikContentStyled>
    </BanyoIcerikStyled>
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

function TabLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <FcComboChart style={{ fontSize: "2vmin", marginRight: "5px" }} />{" "}
      <div style={{ fontWeight: "600" }}>{children}</div>
    </div>
  );
}
