const express = require("express");
const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const app = express();
const port = 3001; // Backend server port

app.use(express.json());

const serialPort = new SerialPort({
  path: "COM3", // COM portunuzu buraya yazın
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

const parser = serialPort.pipe(new Readline({ delimiter: "\r\n" }));

app.get("/kantar-oku", (req, res) => {
  parser.on("data", (data) => {
    const response = parseComplexData(data);
    console.log(response);
    res.json(response);

    // Veri alındıktan sonra listener'ı kaldırın, aksi halde her seferinde yeni bir tane eklenir.
    parser.removeAllListeners("data");
    serialPort.close((err) => {
      if (err) {
        console.error("Port kapatılırken bir hata oluştu:", err.message);
      } else {
        console.log("Port başarıyla kapatıldı.");
      }
    });
  });

  serialPort.on("error", (err) => {
    console.error("Seri port hatası:", err.message);
    res.status(500).send({ error: err.message });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function parseComplexData(input) {
  const data = {
    Toplam: "",
    Net: "",
    Dara: "",
    Nebu: "",
    Adet: "",
  };

  // Versiyon bilgisini çıkarma
  const version = input.includes("V1") ? 3 : 1;

  // Toplam değerini çıkarma
  let start = input.indexOf("A") + 1;
  let end = findNumberEnd(input, start, version);
  data.Toplam = parseFloat(input.substring(start, end));

  // Net değerini çıkarma
  start = input.indexOf("0", end) + 1;
  end = findNumberEnd(input, start, version);
  data.Net = parseFloat(input.substring(start, end));

  // Dara değerini çıkarma
  start = input.indexOf("4", end) + 1;
  end = findNumberEnd(input, start, version);
  data.Dara = parseFloat(input.substring(start, end));

  // Nebu değerini çıkarma
  start = input.indexOf("1", end) + 1;
  end = findNumberEnd(input, start, 2);
  data.Nebu = parseFloat(input.substring(start, end));

  // Adet değerini çıkarma
  start = input.indexOf("2", end) + 1;
  end = input.indexOf("C", start);
  data.Adet = parseInt(input.substring(start, end).trim());

  return data;
}

function findNumberEnd(str, start, decimalPlaces) {
  const pointIndex = str.indexOf(".", start);
  return pointIndex + 1 + decimalPlaces;
}
