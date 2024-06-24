import { Button, Input } from "antd";
import { useUIContext } from "context/UIProvider";
import { useState } from "react";
import logoGoApi from "services/logoGoApi";

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
      <Input defaultValue={islemTipi.adi} onChange={(e) => setYeniIslemTipi(e.target.value)} />
      {yeniIslemTipi && (
        <Button
          type="primary"
          block
          style={{ marginTop: "10px" }}
          onClick={async () => {
            const data = { logicalref: islemTipi.logicalref, adi: yeniIslemTipi };
            const response = await logoGoApi.putData("PutIslemTipi", data);

            if (response.statusCode === 200) {
              const islemTipiList = await logoGoApi.getData("GetIslemTipiList");

              setReferansIslemTipleri(islemTipiList);
              form.setFieldsValue({ islemTipi: null });
              setSeciliIslemTipi(null);
              showModal(false);
              showNotification(
                "success",
                `${islemTipi.adi} işlemi ${yeniIslemTipi} olarak değiştirildi.`,
              );
            } else showNotification("error", response.message);
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
            const data = { adi: yeniIslemTipi };
            const response = await logoGoApi.postData("PostIslemTipi", data);

            if (response.statusCode === 200) {
              setReferansIslemTipleri((prevState) => [
                ...prevState,
                { logicalref: response.newId, ...data },
              ]);
              showModal(false);
              showNotification("success", `${yeniIslemTipi} işlem tipi olarak olarak eklendi.`);
            } else {
              showNotification("error", response.message);
            }
          }}
        >
          İşlem Tipini Ekle
        </Button>
      )}
    </div>
  );
}
