const express = require("express");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const cors = require("cors");
const parseComplexData = require("./utils/parse.util");

const app = express();
const port = 3001; // Backend server port

app.use(express.json());
app.use(cors());

const serialPort = new SerialPort({
  path: "COM3", // COM portunuzu buraya yazın
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

const parser = serialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

app.get("/kantar-oku", (req, res) => {
  parser.on("data", (data) => {
    const response = parseComplexData(data);
    console.log("response", response);
    res.json(response);

    // Veri alındıktan sonra listener'ı kaldırın, aksi halde her seferinde yeni bir tane eklenir.
    parser.removeAllListeners("data");
    // serialPort.close((err) => {
    //   if (err) {
    //     console.error("Port kapatılırken bir hata oluştu:", err.message);
    //   } else {
    //     console.log("Port başarıyla kapatıldı.");
    //   }
    // });
  });

  serialPort.on("error", (err) => {
    console.error("Seri port hatası:", err.message);
    res.status(500).send({ error: err.message });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
