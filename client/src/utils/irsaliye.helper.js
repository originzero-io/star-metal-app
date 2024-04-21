import { getCurrentDateTime } from "./time.helper";

/* eslint-disable import/prefer-default-export */
export const fasonaIrsaliyeKaydiOlustur = (kayitlar = []) => {
  const irsaliyeKaydi = kayitlar.map((kayit) => ({
    ...kayit,
    tip: "tasima",
    siparisNo: kayit.Referanslar.siparisNo,
    talepNo: kayit.Referanslar.talepNo,
    uretimTarihi: getCurrentDateTime(),
    uretimAdedi: kayit.gelenMiktar,
    uretimGirisiIdleri: kayit.id,
    fasona: true,
  }));
  return irsaliyeKaydi;
};

export const fasonFirmasiKontrol = (kayitlar = []) => {
  // farklı fason firmalarına ait kayıtlar var mı?
  const firstFasonFirmasi = kayitlar[0]?.Referanslar?.fasonFirmasi;

  // Tüm kayıtların fasonFirmasi değerlerini karşılaştırıyoruz.
  return kayitlar.every((kayit) => kayit.Referanslar?.fasonFirmasi === firstFasonFirmasi);
};
