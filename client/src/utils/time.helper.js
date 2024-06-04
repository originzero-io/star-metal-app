/* eslint-disable import/prefer-default-export */
import moment from "moment";

export function getCurrentDateTime() {
  return moment().format("DD.MM.YYYY HH:mm:ss");
}

export function getCurrentDate() {
  return moment().format("DD.MM.YYYY");
}

export function getCurrentTime() {
  return moment().format("HH:mm:ss");
}

export function getCurrentTimeWithLogoFormat() {
  return moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
}
