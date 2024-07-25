import { CaretRightOutlined } from "@ant-design/icons";
import { Collapse, Flex, Modal } from "antd";
import CountBadge from "components/shared/CountBadge";
import PageHeader from "components/shared/PageHeader";
import collapseStyle from "components/shared/StyledCollapse";
import { useDBContext } from "context/DBProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect, useState } from "react";
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
              <Flex>
                <div style={collapseStyle.parentCollapseHeader}>Star Metal Üretimleri</div>
                <CountBadge>{devamEdenUretimler.normalUretimler?.length}</CountBadge>
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
              <Flex>
                <div style={collapseStyle.parentCollapseHeader}>Fason Üretimler</div>
                <CountBadge>{devamEdenUretimler.fasonUretimler?.length}</CountBadge>
              </Flex>
            ),
            children: (
              <FasonUretimlerTablo
                fasonFirmasiBazliKayitlar={fasonFirmasiBazliFasonUretimler}
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
