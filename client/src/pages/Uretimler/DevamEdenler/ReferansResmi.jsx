import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { referansUretimHttp } from "services/crud-server/referanslar.http";
import getUrlByEnvVariables from "utils/getServerUrl";

export default function ReferansResmi({ record }) {
  const [referansResimUrl, setReferansResimUrl] = useState();

  useEffect(() => {
    async function getReferansUretim() {
      const referansUretim = await referansUretimHttp.getOneData(record.Referanslar);
      setReferansResimUrl(referansUretim.resimUrl);
    }

    getReferansUretim();
  }, [record]);

  return (
    <Flex justify="center">
      <img
        alt="Resim bulunamadı"
        src={`${getUrlByEnvVariables()}/uploads/referanslar/${referansResimUrl}?t=${new Date().getTime()}`}
        style={{ maxHeight: "90vh", maxWidth: "100%" }}
      />
    </Flex>
  );
}
