import { Flex } from "antd";
import getUrlByEnvVariables from "utils/getServerUrl";

export default function ReferansResmi({ record }) {
  return (
    <Flex align="center" justify="center">
      <img
        alt="Resim bulunamadı"
        src={`${getUrlByEnvVariables()}/uploads/referanslar/${
          record.Referanslar.ReferansUretim.resimUrl
        }?t=${new Date().getTime()}`}
        style={{ maxHeight: "90vh", maxWidth: "100%" }}
      />
    </Flex>
  );
}
