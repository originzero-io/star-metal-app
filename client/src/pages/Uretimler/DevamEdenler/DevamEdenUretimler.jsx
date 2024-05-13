import { CaretRightOutlined } from "@ant-design/icons";
import { FcSynchronize } from "react-icons/fc";
import { Badge, Collapse, Flex } from "antd";
import PageHeader from "components/shared/PageHeader";
import { useDBContext } from "context/DBProvider";
import collapseStyle from "components/shared/StyledCollapse";
import FasonUretimlerTablo from "./FasonUretimlerTablo";
import NormalUretimlerTablo from "./NormalUretimlerTablo";

function DevamEdenUretimler() {
  const { devamEdenUretimler } = useDBContext();

  return (
    <div>
      <PageHeader label="Devam Eden Üretimler" icon={<FcSynchronize />} />

      <Collapse
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        bordered={false}
        defaultActiveKey={["normal", "fason"]}
        // style={{ userSelect: "none" }}
        items={[
          {
            key: "normal",
            style: collapseStyle.parentCollapseItem,
            label: (
              <Flex justify="center">
                <Badge count={devamEdenUretimler.normalUretimler?.length} offset={[20, 9]}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Star Metal Üretimler
                  </div>
                </Badge>
              </Flex>
            ),
            children: <NormalUretimlerTablo data={devamEdenUretimler.normalUretimler || []} />,
          },
          {
            key: "fason",
            style: collapseStyle.parentCollapseItem,
            label: (
              <Flex justify="center">
                <Badge
                  count={devamEdenUretimler.fasonUretimler?.length}
                  offset={[20, 9]}
                  color="blue"
                >
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#474747",
                    }}
                  >
                    Fason Üretimler
                  </div>
                </Badge>
              </Flex>
            ),
            children: <FasonUretimlerTablo data={devamEdenUretimler.fasonUretimler || []} />,
          },
        ]}
      />
    </div>
  );
}

export default DevamEdenUretimler;
