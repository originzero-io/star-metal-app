const SerialPort = require("serialport").SerialPort;
const { ReadlineParser } = require("@serialport/parser-readline");

// Seri portu yapılandırın
const port = new SerialPort({ path: "COM3", baudRate: 9600, dataBits: 8, parity: "none", stopBits: 1, flowControl: false });
// const port = new SerialPort({ path: "COM3", baudRate: 9600,dataBits: 7, parity: "even", stopBits:1, flowControl:false  });

// Yeni bir satır karakteriyle sonlanan verileri okumak için bir parser oluşturun
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

// ? 3 BASAMAK VE TEK BASAMAĞI AYRI AYRI DOĞRU OKUYAN KOD. DENENDİ. ÇALIŞIYOR

parser.on("data", (data) => {
  console.log("**************");

  const d = extractData3Basamak(data);
  const e = extractData(data);

  console.log(d);
  console.log(e);
});

function extractData3Basamak(input) {
  let varStr = input;
  let data = {
    Total: "",
    Net: "",
    Dara: "",
    Amount: 0,
  };

  let a, b;

  // Toplamı çıkar
  a = varStr.indexOf("A") + 1;
  b = varStr.indexOf(".", a);
  data.Total = extractDecimalValue3Basamak(varStr, a, b, 3);
  varStr = varStr.slice(b + 4); // Noktadan sonra 3 basamak + nokta

  // Net'i çıkar
  a = varStr.indexOf("0") + 1;
  b = varStr.indexOf(".", a);
  data.Net = extractDecimalValue3Basamak(varStr, a, b, 3);
  varStr = varStr.slice(b + 4);

  // Dara'yı çıkar
  a = varStr.indexOf("4") + 1;
  b = varStr.indexOf(".", a);
  data.Dara = extractDecimalValue3Basamak(varStr, a, b, 3);
  varStr = varStr.slice(b + 4);

  // Amount'u çıkar (Amount için başka bir işlem yapılıyor ise)
  if (data.Total !== "0.0") {
    let a = varStr.indexOf(".");
    varStr = a !== -1 ? varStr.slice(a + 11) : varStr.slice(10); // Noktadan sonraki ilk 10 karakteri atla

    let b = varStr.indexOf("C");
    if (b !== -1) {
      data.Amount = parseFloat(varStr.substring(0, b).trim());
    }
  }

  return data;
}

function extractDecimalValue3Basamak(str, start, end, decimals = 3) {
  const base = str.substring(start, end); // Temel değeri al
  const decimalPart = str.substring(end + 1, end + 1 + decimals); // Ondalık kısmı al, varsayılan olarak 3 basamak
  return base + "." + decimalPart; // Ondalık değeri birleştir
}

function extractData(input) {
  let varStr = input;
  let data = {
    Total: "",
    Net: "",
    Dara: "",
    Amount: 0,
  };

  let a, b;

  // Toplamı çıkar
  a = varStr.indexOf("A") + 1;
  b = varStr.indexOf(".", a);
  data.Total = extractDecimalValue(varStr, a, b);
  varStr = varStr.slice(b + 2);

  // Net'i çıkar
  a = varStr.indexOf("0") + 1;
  b = varStr.indexOf(".", a);
  data.Net = extractDecimalValue(varStr, a, b);
  varStr = varStr.slice(b + 2);

  // Dara'yı çıkar
  a = varStr.indexOf("4") + 1;
  b = varStr.indexOf(".", a);
  data.Dara = extractDecimalValue(varStr, a, b);
  varStr = varStr.slice(b + 2);

  // Amount'u çıkar (Amount için başka bir işlem yapılıyor ise)
  if (data.Total !== "0.0") {
    a = varStr.indexOf(".");
    varStr = a !== -1 ? varStr.slice(a + 11) : varStr.slice(10); // Noktadan sonraki ilk 10 karakteri atla

    b = varStr.indexOf("C");
    if (b !== -1) {
      data.Amount = parseFloat(varStr.substring(0, b).trim());
    }
  }

  return data;
}

function extractDecimalValue(str, start, end) {
  const base = str.substring(start, end); // Temel değeri al
  const decimalPart = str.charAt(end + 1); // Ondalık kısmı al
  return base + "." + decimalPart; // Ondalık değeri birleştir
}

port.on("error", (err) => {
  console.error("Seri port hatası:", err.message);
});
