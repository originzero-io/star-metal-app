import { FolderAddTwoTone } from "@ant-design/icons";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { FaTemperatureLow, FaWpforms } from "react-icons/fa";
import { FaDropbox } from "react-icons/fa6";
import { FcOk, FcPieChart, FcSynchronize } from "react-icons/fc";
import { GoDatabase } from "react-icons/go";
import { GrHostMaintenance } from "react-icons/gr";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CompanyLogo from "../shared/CompanyLogo";
import UserCard from "./UserCard";

const ContainerStyled = styled.div`
  height: 100%;
  width: 13%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-top-right-radius: 20px;
  padding-top: 10px;
  justify-content: space-between;
`;
const MenuListStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4px;
  margin-top: 20px;
`;
const MenuListGroupStyled = styled.div`
  margin-bottom: 10px;
`;
const MenuListGroupContentStyled = styled.div``;
const MenuListGroupHeaderStyled = styled.div`
  color: #2f2f2f;
  font-size: 1.5vmin;
  font-weight: 700;
  padding-left: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;

  box-shadow: 0 2px 4px 0 rgba(106, 113, 210, 0.3);
  backdrop-filter: blur(2.5px);
  -webkit-backdrop-filter: blur(2.5px);
  padding: 6px;
  border-radius: 6px;
`;
const MenuListGroupItemStyled = styled.div`
  cursor: pointer;
  padding: 8px;
  padding-left: 10px;
  font-weight: 600;

  display: flex;
  align-items: center;
  color: #5a5a5a;
  border-radius: 6px;
  background-color: ${(props) => (props.selected ? "rgba(114, 151, 235, 0.3)" : "")};
  color: ${(props) => (props.selected ? "#4b00ff" : "")};

  &:hover {
    background: rgb(206, 215, 237);
    border-radius: 6px;
    color: #4b00ff;
  }
`;
const MenuListGroupItemTitle = styled.div`
  margin-left: 6px;
  font-size: 1.4vmin;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MenuListGroupTitleStyled = styled.div`
  margin-left: 10px;
`;
const MenuListGroupIcon = styled.div`
  font-size: 20px;
  display: flex;
`;

const LinkStyled = styled(Link)`
  text-decoration: none;
`;

const pages = {
  categories: [
    {
      title: "Üretim",
      key: "uretim",
      icon: <GrHostMaintenance />,
    },
    {
      title: "Tanımlamalar",
      key: "tanimlamalar",
      icon: <FaWpforms />,
    },
    {
      title: "Veriler",
      key: "veriler",
      icon: <GoDatabase />,
    },
  ],
  uretim: [
    {
      title: "Devam Eden Üretimler",
      icon: <FcSynchronize />,
      link: "/uretim/devam-eden",
    },
    {
      title: "Tamamlanan Üretimler",
      icon: <FcOk />,
      link: "/uretim/tamamlanan",
    },
    {
      title: "Üretim Raporu",
      icon: <FcPieChart />,
      link: "/uretim/rapor",
    },
  ],
  tanimlamalar: [
    {
      title: "Gelen Malzeme Kaydı",
      icon: <FolderAddTwoTone twoToneColor="#5c0099" />,
      link: "/gelen-malzeme-kayit",
    },
    {
      title: "Müşteriler",
      icon: <RiCustomerServiceLine />,
      link: "/musteriler",
    },
    {
      title: "Referanslar",
      icon: <MdOutlineDocumentScanner />,
      link: "/referanslar",
    },
    {
      title: "Ambalajlar",
      icon: <FaDropbox />,
      link: "/ambalajlar",
    },
  ],
  veriler: [
    {
      title: "Sıcaklık",
      icon: <FaTemperatureLow />,
      link: "/sicakliklar",
    },
    {
      title: "Banyo Değerleri",
      icon: <TbRulerMeasure />,
      link: "/banyo-degerleri",
    },
    {
      title: "Butonlar",
      icon: <TbRulerMeasure />,
      link: "/butonlar",
    },
  ],
};

function NavigationMenu() {
  const { setPageHeader } = useUIContext();
  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <ContainerStyled>
      <div>
        <CompanyLogo />
        <MenuListStyled>
          {pages.categories.map((category, i) => (
            <MenuListGroupStyled key={i}>
              <MenuListGroupHeaderStyled>
                <div style={{ display: "flex", alignItems: "center", fontSize: "1.7vmin" }}>
                  {category.icon}
                </div>
                <MenuListGroupTitleStyled>{category.title}</MenuListGroupTitleStyled>
              </MenuListGroupHeaderStyled>
              <MenuListGroupContentStyled>
                {pages[category.key].map((content, i) => (
                  <LinkStyled key={i} to={content.link} onClick={() => setSelectedPage(content)}>
                    <MenuListGroupItemStyled
                      selected={selectedPage === content}
                      onClick={() =>
                        setPageHeader({
                          title: content.title,
                          icon: content.icon,
                        })
                      }
                    >
                      <MenuListGroupIcon>{content.icon}</MenuListGroupIcon>
                      <MenuListGroupItemTitle>{content.title}</MenuListGroupItemTitle>
                    </MenuListGroupItemStyled>
                  </LinkStyled>
                ))}
              </MenuListGroupContentStyled>
            </MenuListGroupStyled>
          ))}
        </MenuListStyled>
      </div>
      <UserCard />
    </ContainerStyled>
  );
}

export default NavigationMenu;
