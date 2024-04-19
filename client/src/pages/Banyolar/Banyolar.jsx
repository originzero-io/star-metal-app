import { Tabs } from "antd";
import styled from "styled-components";
import { FcComboChart } from "react-icons/fc";
import BanyoItem from "./BanyoItem";

const tabItems = [
  {
    label: <div style={{ fontWeight: "800", color: "red", fontSize: "1.6vmin" }}>KA Hattı</div>,
    key: "KA-HEADER",
    disabled: true,
  },
  {
    label: <TabLabel>KA01 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KA01",
    children: <BanyoItem name="KA01" />,
  },
  {
    label: <TabLabel>KA03 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KA03",
    children: <BanyoItem name="KA03" />,
  },
  {
    label: <TabLabel>KA06 - Asit Banyosu</TabLabel>,
    key: "KA06",
    children: <BanyoItem name="KA06" />,
  },
  {
    label: <TabLabel>KA09 - Aktivasyon Banyosu</TabLabel>,
    key: "KA09",
    children: <BanyoItem name="KA09" />,
  },
  {
    label: <TabLabel>KA10 - Fosfat Banyosu</TabLabel>,
    key: "KA10",
    children: <BanyoItem name="KA10" />,
  },
  {
    label: <TabLabel>KA11 - Fosfat Banyosu</TabLabel>,
    key: "KA11",
    children: <BanyoItem name="KA11" />,
  },
  {
    label: <TabLabel>KA14 - Yağlama Banyosu</TabLabel>,
    key: "KA14",
    children: <BanyoItem name="KA14" />,
  },
  {
    label: <div style={{ fontWeight: "800", color: "red", fontSize: "1.6vmin" }}>KB Hattı</div>,
    key: "KB-HEADER",
    disabled: true,
  },
  {
    label: <TabLabel>KB01 - Sıcak Yağ Alma Banyosu</TabLabel>,
    key: "KB01",
    children: <BanyoItem name="KB01" />,
  },
  {
    label: <TabLabel>KB03 - Elek. Yağ Alma Banyosu</TabLabel>,
    key: "KB03",
    children: <BanyoItem name="KB03" />,
  },
  {
    label: <TabLabel>KB06 - Asit Banyosu</TabLabel>,
    key: "KB06",
    children: <BanyoItem name="KB06" />,
  },
  {
    label: <TabLabel>KB09 - Nikel Banyosu</TabLabel>,
    key: "KB09",
    children: <BanyoItem name="KB09" />,
  },
  {
    label: <TabLabel>KB10 - Nikel Banyosu Banyosu</TabLabel>,
    key: "KB10",
    children: <BanyoItem name="KB10" />,
  },
  {
    label: <TabLabel>KB12 - Fosfat Banyosu</TabLabel>,
    key: "KB12",
    children: <BanyoItem name="KB12" />,
  },
  {
    label: <TabLabel>KB14 - Yağlama Banyosu</TabLabel>,
    key: "KB14",
    children: <BanyoItem name="KB14" />,
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // padding: 4px;
  // max-width: 87%;
  // width: 90%;
  overflow: auto;
`;

const ContentStyled = styled.div`
  width: 100%;
  padding: 18px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export default function Banyolar() {
  return (
    <Container>
      <ContentStyled>
        <Tabs defaultActiveKey="KA01" tabPosition="left" size="middle" items={tabItems} />
      </ContentStyled>
    </Container>
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
