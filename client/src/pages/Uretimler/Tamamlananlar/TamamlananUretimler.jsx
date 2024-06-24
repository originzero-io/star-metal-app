import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse } from "antd";
import CountBadge from "components/shared/CountBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useState } from "react";
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
        console.log("tamamlananUretimData", tamamlananUretimData);

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
              <CountBadge count={tamamlananUretimler.normalUretimler?.length} offset={[20, 6]}>
                <div style={collapseStyle.parentCollapseHeader}>Star Metal Üretimleri</div>
              </CountBadge>
            ),
            children: <NormalUretimlerTablo musteriBazliKayitlar={musteriBazliNormalUretimler} />,
          },
          {
            key: "fason",
            style: collapseStyle.parentCollapseItem,
            label: (
              <CountBadge count={tamamlananUretimler.fasonUretimler?.length} offset={[20, 6]}>
                <div style={collapseStyle.parentCollapseHeader}>Fason Üretimler</div>
              </CountBadge>
            ),
            children: (
              <FasonUretimlerTablo fasonFirmasiBazliKayitlar={fasonFirmasiBazliFasonUretimler} />
            ),
          },
        ]}
      />
    </div>
  );
}

export default TamamlananUretimler;
