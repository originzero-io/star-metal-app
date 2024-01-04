import NewGelen from "components/forms/GelenMalzemeKayitForm";
import { useUIContext } from "context/UIProvider";
import { FaTemperatureLow, FaWpforms } from "react-icons/fa";
import { FaDropbox } from "react-icons/fa6";
import { FcAddDatabase, FcOk, FcSynchronize } from "react-icons/fc";
import { GoDatabase } from "react-icons/go";
import { GrHostMaintenance } from "react-icons/gr";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { RiCustomerServiceLine } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";
import { Link } from "react-router-dom";
import styled from "styled-components";
import CompanyLogo from "../shared/CompanyLogo";
import UserCard from "./UserCard";
import { useState } from "react";

const ContainerStyled = styled.div`
  height: 100%;
  width: 13%;
  display: flex;
  flex-direction: column;
  background: rgb(35, 34, 50);
  background: linear-gradient(191deg, rgba(35, 34, 50, 1) 50%, #660400 100%);
  border-top-right-radius: 28px;
  border-right: 1px solid red;
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
  color: white;
  font-size: 1.6vmin;
  font-weight: 700;
  padding-left: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  background-color: #2e2d4b;
  padding: 6px;
  border-radius: 6px;
`;
const MenuListGroupItemStyled = styled.div`
  cursor: pointer;
  padding: 8px;
  padding-left: 10px;
  font-weight: 400;

  display: flex;
  align-items: center;
  color: white;
  border-radius: 8px;
  background-color: ${(props) => (props.selected ? "#56334d" : "")};
  &:hover {
    background-color: #3e3d65;
    background-color: #2a2945;
    border-radius: 8px;
  }
`;
const MenuListGroupItemTitle = styled.div`
  margin-left: 6px;
  font-size: 1.6vmin;
  color: #d8d6d6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const MenuListGroupTitleStyled = styled.div`
  margin-left: 10px;
`;
const MenuListGroupIcon = styled.div`
  font-size: 22px;
  display: flex;
  color: #d8d6d6;
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
  ],
  tanimlamalar: [
    {
      title: "Gelen Malzeme Kaydı",
      icon: <FcAddDatabase />,
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
  const { showModal, setPageHeader } = useUIContext();
  const [selectedPage, setSelectedPage] = useState(null);

  return (
    <ContainerStyled>
      <div>
        <CompanyLogo />
        <MenuListStyled>
          {pages.categories.map((category, i) => (
            <MenuListGroupStyled key={i}>
              <MenuListGroupHeaderStyled>
                <div>{category.icon}</div>
                <MenuListGroupTitleStyled>{category.title}</MenuListGroupTitleStyled>
              </MenuListGroupHeaderStyled>
              <MenuListGroupContentStyled>
                {pages[category.key].map((content, i) => (
                  <LinkStyled
                    key={i}
                    // to={content.title !== "Gelen Malzeme Kaydı" ? content.link : null}
                    to={content.link}
                    onClick={() => setSelectedPage(content)}
                  >
                    <MenuListGroupItemStyled
                      selected={selectedPage === content}
                      onClick={() =>
                        setPageHeader({
                          title: content.title,
                          icon: content.icon,
                        })
                      }
                      // onClick={
                      //   content.title === "Gelen Malzeme Kaydı"
                      //     ? () =>
                      //         showModal({
                      //           title: "Gelen Malzeme Kaydı",
                      //           content: <NewGelen />,
                      //           width: 1200,
                      //         })
                      //     : () =>
                      //         setPageHeader({
                      //           title: content.title,
                      //           icon: content.icon,
                      //         })
                      // }
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
    // <MenuListGroupItemStyled
    //             onClick={() =>
    //               showModal({ title: "Gelen Malzeme Kaydı", content: <NewGelen />, width: 1200 })
    //             }
    //           >
  );
}

export default NavigationMenu;
