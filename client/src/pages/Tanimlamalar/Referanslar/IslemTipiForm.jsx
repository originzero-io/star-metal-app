import { Button, Input } from "antd";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { referansIslemTipleriHttp } from "services/crud-server/referanslar.http";

export function IslemTipiDuzenlemeForm({
  islemTipi,
  setSeciliIslemTipi,
  setReferansIslemTipleri,
  form,
}) {
  const { showModal, showNotification } = useUIContext();
  const [yeniIslemTipi, setYeniIslemTipi] = useState("");

  return (
    <div>
      <Input placeholder={islemTipi} onChange={(e) => setYeniIslemTipi(e.target.value)} />
      {yeniIslemTipi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            await referansIslemTipleriHttp.updateData(islemTipi, yeniIslemTipi);
            const islemTipleri = await referansIslemTipleriHttp.getData();
            setReferansIslemTipleri(islemTipleri);
            form.setFieldsValue({ islemTipi: null });
            setSeciliIslemTipi(null);
            showModal(false);
            showNotification(
              "success",
              `${islemTipi} işlemi ${yeniIslemTipi} olarak değiştirildi.`,
            );
          }}
        >
          {yeniIslemTipi} olarak değiştir
        </Button>
      )}
    </div>
  );
}

export function IslemTipiEklemeForm({ setReferansIslemTipleri }) {
  const { showModal, showNotification } = useUIContext();
  const [yeniIslemTipi, setYeniIslemTipi] = useState("");

  return (
    <div>
      <Input placeholder="İşlem tipi giriniz" onChange={(e) => setYeniIslemTipi(e.target.value)} />
      {yeniIslemTipi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            const data = await referansIslemTipleriHttp.addData({ islemTipi: yeniIslemTipi });
            setReferansIslemTipleri((prevState) => [...prevState, { ...data }]);
            showModal(false);
            showNotification("success", `${yeniIslemTipi} işlem tipi olarak olarak eklendi.`);
          }}
        >
          İşlem Tipini Ekle
        </Button>
      )}
    </div>
  );
}
