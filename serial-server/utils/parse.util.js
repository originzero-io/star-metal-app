// read_data_v5

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

module.exports = parseComplexData;
