import { Button, Input } from "antd";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import { referansParcaAdlariHttp } from "services/crud-server/referanslar.http";

export function ParcaAdiDuzenlemeForm({
  parcaAdi,
  setSeciliParcaAdi,
  setReferansParcaAdlari,
  form,
}) {
  const { showModal, showNotification } = useUIContext();
  const [yeniParcaAdi, setYeniParcaAdi] = useState("");

  return (
    <div>
      <Input placeholder={parcaAdi} onChange={(e) => setYeniParcaAdi(e.target.value)} />
      {yeniParcaAdi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            await referansParcaAdlariHttp.updateData(parcaAdi, yeniParcaAdi);
            const parcaAdlari = await referansParcaAdlariHttp.getData();
            setReferansParcaAdlari(parcaAdlari);
            form.setFieldsValue({ parcaAdi: null });
            setSeciliParcaAdi(null);
            showModal(false);
            showNotification(
              "success",
              `${parcaAdi} parçasının ismi ${yeniParcaAdi} olarak değiştirildi.`,
            );
          }}
        >
          {yeniParcaAdi} olarak değiştir
        </Button>
      )}
    </div>
  );
}

export function ParcaAdiEklemeForm({ setReferansParcaAdlari }) {
  const { showModal, showNotification } = useUIContext();
  const [yeniParcaAdi, setYeniParcaAdi] = useState("");

  return (
    <div>
      <Input placeholder="Parça adı giriniz" onChange={(e) => setYeniParcaAdi(e.target.value)} />
      {yeniParcaAdi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            const data = await referansParcaAdlariHttp.addData({ parcaAdi: yeniParcaAdi });
            setReferansParcaAdlari((prevState) => [...prevState, { ...data }]);
            showModal(false);
            showNotification("success", `${yeniParcaAdi} parça adı olarak eklendi.`);
          }}
        >
          Parçayı Ekle
        </Button>
      )}
    </div>
  );
}
