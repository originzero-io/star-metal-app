import { Modal } from "antd";
import { useUIContext } from "context/UIProvider";
import { useRef, useState } from "react";
import Draggable from "react-draggable";

const defaultWindowBounds = {
  left: 0,
  top: 0,
  bottom: 0,
  right: 0,
};

const FormModal = () => {
  const { modal, showModal } = useUIContext();

  const handleOk = () => {
    showModal(false);
  };

  // const handleCancel = () => {
  //   showModal(false);
  //   setBounds(defaultWindowBounds);
  // };

  /////!
  const [disabled, setDisabled] = useState(true);

  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const handleCancel = () => {
    showModal(false);
    setBounds({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
    });
    setDisabled(true);
  };
  return (
    // <Modal
    //   title={
    //     <div
    //       style={{
    //         marginBottom: "20px",
    //         fontWeight: "bold",
    //         // background: "linear-gradient(90deg, rgba(35,34,50,1) 13%, rgba(255,255,255,1) 95%)",
    //         background:
    //           "linear-gradient(90deg, rgba(35,34,50,1) 26%, #b70a04 62%, rgba(255,255,255,1) 96%)",
    //         color: "whitesmoke",
    //         borderRadius: "4px",
    //         padding: "6px",
    //         paddingLeft: "12px",
    //         cursor: "move",
    //       }}
    //       onMouseOver={() => {
    //         if (disabled) {
    //           setDisabled(false);
    //         }
    //       }}
    //       onMouseOut={() => {
    //         setDisabled(true);
    //       }}
    //     >
    //       {modal.title}
    //     </div>
    //   }
    //   open={modal.title}
    //   onOk={handleOk}
    //   onCancel={handleCancel}
    //   maskClosable={false}
    //   centered
    //   // style={{ maxHeight: "80%", overflow: "auto" }}
    //   width={1000}
    //   footer={null}
    //   modalRender={(_modal) => (
    //     <Draggable
    //       disabled={disabled}
    //       bounds={bounds}
    //       nodeRef={draggleRef}
    //       position={{ x: 0, y: 0 }}
    //       onStart={(event, uiData) => onStart(event, uiData)}
    //     >
    //       <div ref={draggleRef}>{_modal}</div>
    //     </Draggable>
    //   )}
    // >
    //   {modal.content}
    // </Modal>
    <Modal
      title={
        <div
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            // background: "linear-gradient(90deg, rgba(35,34,50,1) 13%, rgba(255,255,255,1) 95%)",
            background:
              "linear-gradient(90deg, rgba(35,34,50,1) 26%, #860400 72%, rgba(255,255,255,1) 96%)",
            // "linear-gradient(90deg, rgba(35,34,50,1) 26%, #b70a04 62%, rgba(255,255,255,1) 96%)",
            color: "whitesmoke",
            borderRadius: "4px",
            padding: "6px",
            paddingLeft: "12px",
          }}
        >
          {modal.title}
        </div>
      }
      open={modal.title}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      style={{ maxHeight: "80%", overflow: "auto" }}
      width={modal.width || 1000}
      footer={null}
    >
      {modal.content}
    </Modal>
  );
};

export default FormModal;
