import { CaretRightOutlined } from "@ant-design/icons";
import { Badge, Collapse, Flex, Modal } from "antd";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { FcSynchronize } from "react-icons/fc";
import irsaliyeHttp from "services/irsaliyeler.http";
import { devamEdenUretimHttp } from "services/uretimler.http";
import { useEffect, useState } from "react";
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
  const [musteriBazliFasonUretimler, setMusteriBazliFasonUretimler] = useState({});

  useEffect(() => {
    const musteriBazliNormal = devamEdenUretimler.normalUretimler.reduce((acc, uretim) => {
      const { musteriAdi } = uretim.Referanslar;

      // Eğer bu müşteri adı ile bir grup zaten mevcut değilse, bu grup için boş bir dizi oluştur
      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc; // Akümülatörü (gruplama objesini) döndür
    }, {}); // İlk değer olarak boş bir obje kullanılır
    setMusteriBazliNormalUretimler(musteriBazliNormal);

    const musteriBazliFason = devamEdenUretimler.fasonUretimler.reduce((acc, uretim) => {
      const { musteriAdi } = uretim.Referanslar;

      if (!acc[musteriAdi]) {
        acc[musteriAdi] = [];
      }
      acc[musteriAdi].push(uretim);

      return acc;
    }, {});
    setMusteriBazliFasonUretimler(musteriBazliFason);
  }, [devamEdenUretimler]);

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
              <Flex justify="center">
                <Badge count={devamEdenUretimler.normalUretimler?.length} offset={[20, 9]}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Star Metal Üretimler
                  </div>
                </Badge>
              </Flex>
            ),
            children: (
              <NormalUretimlerTablo
                musteriBazliKayitlar={musteriBazliNormalUretimler}
                uretimiSilFunc={uretimiSil}
              />
            ),
          },
          {
            key: "fason",
            style: collapseStyle.parentCollapseItem,
            label: (
              <Flex justify="center">
                <Badge
                  count={devamEdenUretimler.fasonUretimler?.length}
                  offset={[20, 9]}
                  color="blue"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Fason Üretimler
                  </div>
                </Badge>
              </Flex>
            ),
            children: (
              <FasonUretimlerTablo
                musteriBazliKayitlar={musteriBazliFasonUretimler}
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
