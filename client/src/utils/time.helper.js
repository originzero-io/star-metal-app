/* eslint-disable import/prefer-default-export */
import moment from "moment";

export function getCurrentDateTime() {
  return moment().format("DD.MM.YYYY HH:mm:ss");
}
