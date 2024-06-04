export default function getUrlByEnvVariables() {
  return import.meta.env.VITE_HOST_ENV === "development"
    ? "http://localhost:6333"
    : import.meta.env.VITE_SERVER_URL;
}
