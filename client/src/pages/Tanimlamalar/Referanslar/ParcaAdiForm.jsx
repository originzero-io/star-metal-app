import { Button, Input } from "antd";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import logoGoApi from "services/logoGoApi";

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
      <Input defaultValue={parcaAdi.adi} onChange={(e) => setYeniParcaAdi(e.target.value)} />
      {yeniParcaAdi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            const data = { logicalref: parcaAdi.logicalref, adi: yeniParcaAdi };
            const response = await logoGoApi.putData("PutParcaAdi", data);

            if (response.statusCode === 200) {
              const parcaAdiList = await logoGoApi.getData("GetParcaAdiList");

              setReferansParcaAdlari(parcaAdiList);
              form.setFieldsValue({ parcaAdi: null });
              setSeciliParcaAdi(null);
              showModal(false);
              showNotification(
                "success",
                `${parcaAdi.adi} parçasının ismi ${yeniParcaAdi} olarak değiştirildi.`,
              );
            } else showNotification("error", response.message);
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
            const data = { adi: yeniParcaAdi };
            const response = await logoGoApi.postData("PostParcaAdi", data);

            if (response.statusCode === 200) {
              setReferansParcaAdlari((prevState) => [
                ...prevState,
                { logicalref: response.newId, ...data },
              ]);
              showModal(false);
              showNotification("success", `${yeniParcaAdi} parça adı olarak eklendi.`);
            } else {
              showNotification("error", response.message);
            }
          }}
        >
          Parçayı Ekle
        </Button>
      )}
    </div>
  );
}
