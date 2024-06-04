const irsaliye = {
  irsaliyeMaster: {
    Logicaref: 0,
    Turu: 2,
    Tarih: new Date().toISOString(), // ISO formatında tarih
    IrsaliyeNo: "IR123456",
    CariRef: 123,
    CariHesapKoduUnvani: "XYZ Şirketi",
    Plaka: "34ABC34",
    SoforAdi: "Ahmet",
    SoforSoyadi: "Yılmaz",
    SoforKimlikNo: "12345678901",
  },
  IrsaliyeDetails: [
    {
      Logicalref: 0,
      IrsaliyeRef: 0,
      SatirNo: 1,
      MalzemeRef: 101,
      Miktar: 5.0,
      BirimRef: 1,
      SatirAciklamasi: "Açıklama 1",
    },
    {
      Logicalref: 0,
      IrsaliyeRef: 0,
      SatirNo: 2,
      MalzemeRef: 102,
      Miktar: 10.0,
      BirimRef: 1,
      SatirAciklamasi: "Açıklama 2",
    },
  ],
};

export default irsaliye;

const gonderilenKayitlar = {
  id: 1071,
  uretimGirisiIdleri: "54",
  uretimSiraNo: "1003",
  tip: "sevk",
  fasona: null,
  referansNo: "STR-19-ABC",
  siparisNo: "S-ABC21",
  talepNo: null,
  iade: "Hayır",
  uretimTarihi: "21.05.2024 16:53:19",
  uretimAdedi: 7,
  birinciAmbalaj: "Kutu 01",
  ikinciAmbalaj: null,
  Referanslar: {
    irsaliyeAciklamasi: "DIYAFRAM",
    musteriAdi: "SMG OTOMOTİV LTD. ŞTİ.",
    fasonFirmasi: null,
  },
  sofor: {
    id: 11,
    logicalref: "11",
    adi: "TAHSİN ",
    soyadi: "MUTLU",
    kimlikNo: "11111122222",
  },
  plaka: "16AEB52",
  irsaliyeNo: "14-ABCDE",
  sevkTarihi: "30.05.2024 12:01:46",
};
