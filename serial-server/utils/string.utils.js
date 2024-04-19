function extractValue(str, startChar, endChar) {
  const start = str.indexOf(startChar) + 1;
  const end = str.indexOf(endChar, start);
  if (start === 0 || end === -1) return ""; // startChar veya endChar bulunamazsa

  return str.substring(start, end) + str.charAt(end);
}

function readAmount(varStr) {
  let tempStr = varStr; // Orijinal string'i değiştirmemek için kopya kullan

  // İlk nokta konumunu bul
  const periodPos = tempStr.indexOf(".");
  if (periodPos !== -1) {
    tempStr = tempStr.slice(periodPos + 10); // Noktadan sonraki 10 karakteri at
  } else {
    tempStr = tempStr.slice(9); // Nokta yoksa ilk 9 karakteri at
  }

  const cPos = tempStr.indexOf("C");
  const amountStr = tempStr.slice(0, cPos - 1);
  const amount = parseFloat(amountStr); // String'i float'a çevir

  console.log(`Amount: ${amount}`);
}

///? Virgülden sonra 3 basamak
// parser.on("data", (data) => {
//   let total = extractValue(data, "A", ".", 3);
//   let net = extractValue(data, "0", ".", 3);
//   let dara = extractValue(data, "4", ".", 3);

//   if (total === "") total = "0";
//   if (net === "") net = "0";
//   if (dara === "") dara = "0";

//   console.log(`Total: ${total}, Net: ${net}, Dara: ${dara}`);
//   readAmount(varStr);
// });

// function extractValue(str, startChar, endChar, decimals) {
//   const start = str.indexOf(startChar) + 1;
//   const end = str.indexOf(endChar, start);
//   if (start === 0 || end === -1) return ""; // startChar veya endChar bulunamazsa

//   const base = str.substring(start, end);
//   const decimalPart = str.substring(end + 1, end + 1 + decimals);
//   return base + "." + decimalPart;
// }

// function readAmount(varStr) {
//   let tempStr = varStr; // Orijinal string'i değiştirmemek için kopya kullan

//   // İlk nokta konumunu bul
//   const periodPos = tempStr.indexOf(".");
//   if (periodPos !== -1) {
//     tempStr = tempStr.slice(periodPos + 1 + 10); // Noktadan sonraki 10 karakteri at
//   } else {
//     tempStr = tempStr.slice(10); // Nokta yoksa ilk 10 karakteri at
//   }

//   const cPos = tempStr.indexOf("C");
//   const amountStr = tempStr.slice(0, cPos - 1);
//   const amount = parseFloat(amountStr); // String'i float'a çevir

//   console.log(`Amount: ${amount}`);
// }
module.exports = {
  extractValue,
  readAmount,
};
