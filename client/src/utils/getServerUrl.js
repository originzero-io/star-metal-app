/* eslint-disable no-nested-ternary */
export default function getUrlByEnvVariables() {
  return import.meta.env.VITE_HOST_ENV === "development"
    ? "http://localhost:6333"
    : import.meta.env.VITE_HOST_ENV === "docker"
      ? "http://db-server:6333"
      : import.meta.env.VITE_SERVER_URL;
}
// export default function getUrlByEnvVariables() {
//   return import.meta.env.VITE_HOST_ENV === "development"
//     ? "http://db-server"
//     : import.meta.env.VITE_SERVER_URL;
// }
