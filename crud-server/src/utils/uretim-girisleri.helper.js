import UretimGirisi from "../api/models/uretim-girisi.model.js";
import { DFasonUretim, DNormalUretim } from "../api/models/uretim.model.js";

export default class UretimGirisiHelper {
  static async uretimMiktarlariniGuncelle(uretimGirisiKaydi) {
    if (uretimGirisiKaydi.fason) {
      const uretim = await DFasonUretim.findByPk(uretimGirisiKaydi.uretimId);
      if (uretim) {
        const updatedUretim = await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar + uretimGirisiKaydi.uretimAdedi,
        });

        return updatedUretim;
      }
      return null;
    }

    const uretim = await DNormalUretim.findByPk(uretimGirisiKaydi.uretimId);

    if (uretim) {
      const updatedUretim = await uretim.update({
        uretilenMiktar: uretim.uretilenMiktar + uretimGirisiKaydi.uretimAdedi,
        uretilmeyenMiktar: uretim.uretilmeyenMiktar - uretimGirisiKaydi.uretimAdedi,
      });

      return updatedUretim;
    }
    return null;
  }

  static async gidenVeKalanMiktarlariGuncelle(uretimGirisiKaydi) {
    const uretimGirisiIdleri = uretimGirisiKaydi.uretimGirisiIdleri.split(",").map(Number);
    const uretimGirisiList = await UretimGirisi.findAll({ where: { id: uretimGirisiIdleri, referansNo: uretimGirisiKaydi.referansNo } });

    // eslint-disable-next-line no-restricted-syntax
    for (const uretimGirisi of uretimGirisiList) {
      if (uretimGirisiKaydi.Referanslar.fason) {
        const fasonUretim = await DFasonUretim.findOne({ where: { id: uretimGirisi.uretimId } });

        if (fasonUretim && !uretimGirisiKaydi.fasona) {
          // irsaliye fasona kesiliyorsa sevkEdilenMiktar değişmeyecek
          console.log("Fason Uretim ID: ", fasonUretim.id);
          console.log("Eklenecek adet: ", uretimGirisi.uretimAdedi);
          const updatedUretim = await fasonUretim.update({
            sevkEdilenMiktar: fasonUretim.sevkEdilenMiktar + uretimGirisi.uretimAdedi,
          });

          console.log(`${updatedUretim.id} id li fason üretim verileri güncellendi: Sevk Edilen: ${updatedUretim.sevkEdilenMiktar}`);
        } else {
          console.log(`Fason Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
        }
      } else {
        const normalUretim = await DNormalUretim.findOne({ where: { id: uretimGirisi.uretimId } });

        if (normalUretim) {
          console.log("Normal Uretim ID: ", normalUretim.id);
          console.log("Eklenecek adet: ", uretimGirisi.uretimAdedi);

          const updatedUretim = await normalUretim.update({
            gidenMiktar: normalUretim.gidenMiktar + uretimGirisi.uretimAdedi,
            kalanMiktar: normalUretim.kalanMiktar - uretimGirisi.uretimAdedi,
          });

          console.log(`${updatedUretim.id} id li normal üretim verileri güncellendi: Giden: ${updatedUretim.gidenMiktar} -- Kalan: ${updatedUretim.kalanMiktar}`);
        } else {
          console.log(`Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
        }
      }
    }

    return null;
  }

  static async gidenVeKalanMiktarlariGuncellePromiseAll(uretimGirisiKaydi) {
    const uretimGirisiIdleri = uretimGirisiKaydi.uretimGirisiIdleri.split(",").map(Number);
    const uretimGirisiList = await UretimGirisi.findAll({ where: { id: uretimGirisiIdleri, referansNo: uretimGirisiKaydi.referansNo } });

    console.log("uretimGirisiList", uretimGirisiList);

    await Promise.all(
      uretimGirisiList.map(async (uretimGirisi) => {
        if (uretimGirisiKaydi.Referanslar.fason) {
          const fasonUretim = await DFasonUretim.findOne({ where: { id: uretimGirisi.uretimId } });

          if (fasonUretim && !uretimGirisiKaydi.fasona) {
            console.log("Fason Uretim ID: ", fasonUretim.id);
            console.log("Eklenecek adet: ", uretimGirisi.uretimAdedi);
            const updatedUretim = await fasonUretim.update({
              sevkEdilenMiktar: fasonUretim.sevkEdilenMiktar + uretimGirisi.uretimAdedi,
            });

            console.log(`${updatedUretim.id} id li fason üretim verileri güncellendi: Giden: ${updatedUretim.gidenMiktar} -- Kalan: ${updatedUretim.kalanMiktar}`);
          } else {
            console.log(`Fason Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
          }
        } else {
          const normalUretim = await DNormalUretim.findOne({ where: { id: uretimGirisi.uretimId } });

          if (normalUretim) {
            console.log("Normal Uretim ID: ", normalUretim.id);
            console.log("Eklenecek adet: ", uretimGirisi.uretimAdedi);

            const updatedUretim = await normalUretim.update({
              gidenMiktar: normalUretim.gidenMiktar + uretimGirisi.uretimAdedi,
              kalanMiktar: normalUretim.kalanMiktar - uretimGirisi.uretimAdedi,
            });

            console.log(`${updatedUretim.id} id li normal üretim verileri güncellendi: Giden: ${updatedUretim.gidenMiktar} -- Kalan: ${updatedUretim.kalanMiktar}`);
          } else {
            console.log(`Uretim ID ${uretimGirisi.uretimId} bulunamadı.`);
          }
        }
      }),
    );

    return null;
  }

  static async uretimMiktarlariniGeriAl(uretimGirisiKaydi) {
    if (uretimGirisiKaydi.Referanslar.fason) {
      const uretim = await DFasonUretim.findByPk(uretimGirisiKaydi.uretimId);
      if (uretim) {
        await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar - uretimGirisiKaydi.uretimAdedi,
        });
      } else {
        console.log("Böyle bir fason üretim bulunamadı", uretimGirisiKaydi.uretimId);
      }
    } else {
      const uretim = await DNormalUretim.findByPk(uretimGirisiKaydi.uretimId);

      if (uretim) {
        await uretim.update({
          uretilenMiktar: uretim.uretilenMiktar - uretimGirisiKaydi.uretimAdedi,
          uretilmeyenMiktar: uretim.uretilmeyenMiktar + uretimGirisiKaydi.uretimAdedi,
        });
      } else {
        console.log("Böyle bir normal üretim bulunamadı", uretimGirisiKaydi.uretimId);
      }
    }
  }
}
