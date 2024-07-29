import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Flex, Input } from "antd";
import CountBadge from "components/shared/CountBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useMemo, useState } from "react";
import { FcOk } from "react-icons/fc";
import { tamamlananUretimHttp } from "services/crud-server/uretimler.http";
import FasonUretimlerTablo from "./FasonUretimlerTablo";
import NormalUretimlerTablo from "./NormalUretimlerTablo";

function TamamlananUretimler() {
  const { tamamlananUretimler, setTamamlananUretimler, setLoading } = useDBContext();
  const { showNotification } = useUIContext();

  const [musteriBazliNormalUretimler, setMusteriBazliNormalUretimler] = useState({});
  const [fasonFirmasiBazliFasonUretimler, setFasonFirmasiBazliFasonUretimler] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const tamamlananUretimData = await tamamlananUretimHttp.getData();

        setTamamlananUretimler(tamamlananUretimData);
        setLoading(false);
      } catch (error) {
        showNotification("error", "Üretim verisi alınamadı", error.message);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const musteriBazliNormal = tamamlananUretimler.normalUretimler.reduce((acc, uretim) => {
      const { musteriAdi } = uretim;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır
    setMusteriBazliNormalUretimler(musteriBazliNormal);

    const fasonFirmasiBazliFason = tamamlananUretimler.fasonUretimler.reduce((acc, uretim) => {
      const { fasonFirmasi } = uretim;

      if (!acc[fasonFirmasi]) {
        acc[fasonFirmasi] = [];
      }
      acc[fasonFirmasi].push(uretim);

      return acc;
    }, {});
    setFasonFirmasiBazliFasonUretimler(fasonFirmasiBazliFason);
  }, [tamamlananUretimler]);

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
      <PageHeader label="Tamamlanan Üretimler" icon={<FcOk />} />
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
            children: <NormalUretimlerTablo musteriBazliKayitlar={normalUretimFilteredData} />,
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
            children: <FasonUretimlerTablo fasonFirmasiBazliKayitlar={fasonUretimFilteredData} />,
          },
        ]}
      />
    </div>
  );
}

export default TamamlananUretimler;
