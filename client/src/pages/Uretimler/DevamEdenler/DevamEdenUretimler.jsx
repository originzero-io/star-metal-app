/* eslint-disable no-restricted-syntax */
import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Flex, Input, Modal } from "antd";
import CountBadge from "components/shared/CountBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { FcSynchronize } from "react-icons/fc";
import irsaliyeHttp from "services/crud-server/irsaliyeler.http";
import { devamEdenUretimHttp } from "services/crud-server/uretimler.http";
import FasonUretimlerTablo from "./FasonUretimlerTablo";
import NormalUretimlerTablo from "./NormalUretimlerTablo";

function DevamEdenUretimler() {
  const { devamEdenUretimler, setDevamEdenUretimler, setIrsaliyeler } = useDBContext();
  const { showNotification } = useUIContext();

  const uretimiSil = (record) => {
    Modal.confirm({
      title: "Emin misiniz?",
      content: `${record.id} numaralı üretim kaydını silmek üzeresiniz. Bu kaydı sildiğinizde üretime ait veriler Sevk Edilecekler ve İrsaliye Sayfasından da silinecek. Bu işlemi gerçekleştirmek istediğinizden emin misiniz?`,
      okText: "Tamam",
      cancelText: "İptal",
      async onOk() {
        await devamEdenUretimHttp.uretimiSil(record);
        const newDevamEdenUretimler = await devamEdenUretimHttp.getData();
        const newIrsaliyeler = await irsaliyeHttp.getData();
        setDevamEdenUretimler(newDevamEdenUretimler);
        setIrsaliyeler(newIrsaliyeler);
        showNotification(
          "success",
          `${record.id} numaralı üretim kaydı silindi. Bu üretime bağlı üretim girişi ve irsaliye kayıtları da silindi.`,
        );
      },
      onCancel() {
        showNotification("warning", "İşlem iptal edildi");
      },
    });
  };

  const [musteriBazliNormalUretimler, setMusteriBazliNormalUretimler] = useState({});
  const [fasonFirmasiBazliFasonUretimler, setFasonFirmasiBazliFasonUretimler] = useState({});

  // ? normal ve fason bazlı kategorize etme
  useEffect(() => {
    const musteriBazliNormal = devamEdenUretimler.normalUretimler.reduce((acc, uretim) => {
      const musteriAdi = uretim?.Referanslar?.musteriAdi;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır
    setMusteriBazliNormalUretimler(musteriBazliNormal);

    const fasonFirmasiBazliFason = devamEdenUretimler.fasonUretimler.reduce((acc, uretim) => {
      const { fasonFirmasi } = uretim.Referanslar;

      if (!acc[fasonFirmasi]) {
        acc[fasonFirmasi] = [];
      }
      acc[fasonFirmasi].push(uretim);

      return acc;
    }, {});
    setFasonFirmasiBazliFasonUretimler(fasonFirmasiBazliFason);
  }, [devamEdenUretimler]);

  // ? referans no bazlı filtreleme

  const [normalUretimAramaMetni, setNormalUretimAramaMetni] = useState("");
  const [fasonUretimAramaMetni, setFasonUretimAramaMetni] = useState("");

  const normalUretimFilteredData = useMemo(
    () =>
      Object.entries(musteriBazliNormalUretimler).reduce((acc, [company, items]) => {
        const filteredItems = items.filter((item) =>
          item.referansNo.toLowerCase().includes(normalUretimAramaMetni.toLowerCase()),
        );
        if (filteredItems.length > 0) {
          acc[company] = filteredItems;
        }
        return acc;
      }, {}),
    [musteriBazliNormalUretimler, normalUretimAramaMetni],
  );

  const fasonUretimFilteredData = useMemo(
    () =>
      Object.entries(fasonFirmasiBazliFasonUretimler).reduce((acc, [company, items]) => {
        const filteredItems = items.filter((item) =>
          item.referansNo.toLowerCase().includes(fasonUretimAramaMetni.toLowerCase()),
        );
        if (filteredItems.length > 0) {
          acc[company] = filteredItems;
        }
        return acc;
      }, {}),
    [fasonFirmasiBazliFasonUretimler, fasonUretimAramaMetni],
  );

  return (
    <div>
      <PageHeader label="Devam Eden Üretimler" icon={<FcSynchronize />} />

      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        bordered={false}
        defaultActiveKey={["normal", "fason"]}
        items={[
          {
            key: "normal",
            style: collapseStyle.parentCollapseItem,
            label: (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Flex>
                  <div style={collapseStyle.parentCollapseHeader}>Star Metal Üretimleri</div>
                  <CountBadge>
                    {Object.values(normalUretimFilteredData).reduce(
                      (total, company) => total + company.length,
                      0,
                    )}
                  </CountBadge>
                </Flex>
                <Input.Search
                  enterButton
                  placeholder="Referans Girin"
                  onChange={(e) => setNormalUretimAramaMetni(e.target.value)}
                  value={normalUretimAramaMetni}
                  style={{ width: "240px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </div>
            ),
            children: (
              <NormalUretimlerTablo
                musteriBazliKayitlar={normalUretimFilteredData}
                uretimiSilFunc={uretimiSil}
              />
            ),
          },
          {
            key: "fason",
            style: collapseStyle.parentCollapseItem,
            label: (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Flex>
                  <div style={collapseStyle.parentCollapseHeader}>Fason Üretimler</div>
                  <CountBadge>
                    {Object.values(fasonUretimFilteredData).reduce(
                      (total, company) => total + company.length,
                      0,
                    )}
                  </CountBadge>
                </Flex>
                <Input.Search
                  enterButton
                  placeholder="Referans Girin"
                  onChange={(e) => setFasonUretimAramaMetni(e.target.value)}
                  value={fasonUretimAramaMetni}
                  style={{ width: "240px" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                />
              </div>
            ),
            children: (
              <FasonUretimlerTablo
                fasonFirmasiBazliKayitlar={fasonUretimFilteredData}
                uretimiSilFunc={uretimiSil}
              />
            ),
          },
        ]}
      />
    </div>
  );
}

export default DevamEdenUretimler;
