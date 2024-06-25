const parseComplexData = require("../utils/parse.util");

const dataYarat = (toplam, net, dara, nebu, adet, v) => {
  return `A${toplam}0${net}4${dara}1${nebu}2${adet}C??7?7?3?7?80${v}BE*@3`;
};

// yapay data yaratma fonksiyonu
// dataYarat(5.2, 10.6, 10.0, 0, 450);

const inputs = [
  "A324.10284.6431.51285.4021001C??7?7?3?7?80V2BE*@3",
  "A 0.1 0 -38.4 4 31.5 1 285.40 2 135 C??7?7?3?7?80V2BE*@",
  "A 69.1 0 30.3 4 38.5 1 285.40 2 107 C??7?7?3?7?80V2BE*@3",
  "A 393.0 0 354.5 4 38.5 1 285.40 2 1242 C??7?7?3?7?80V2BE*@3",
  "A -0.001 0 -0.001 4 0.000 1 285.40 2 0  C??7?7?3?7?80V18D*@3",
  "A 0.320 0  0.320 4 0.000 1 285.40 2 1  C??7?7?3?7?80V1BE«@3",
  "A 1.150 0  1.150 4 0.000 1 285.40 2 4  C??7?7?3?7?80V1BE*@3",
  "A 3.808 0  3.808 4 0.000 1 285.40 2 13 C??727?377?80V1BA*@",
  "A 1683.8 0  1683.832 4 1.603 1 1285.31 2 1453 C??727?377?80V2BA*@",
];

inputs.forEach((input) => {
  console.log(parseComplexData(input));
});
