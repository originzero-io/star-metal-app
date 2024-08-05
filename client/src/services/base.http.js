import { notification } from "antd";
import axios from "axios";

class BaseHttp {
  constructor() {
    this.service = axios;
  }

  createService(serviceName, baseURL) {
    this.service = axios.create({
      baseURL, // Sunucunuzun base URL'si
      timeout: 10000, // İsteğin zaman aşımını ayarlayın
    });

    // İstek interceptor
    this.service.interceptors.request.use(
      (config) =>
        // İsteği göndermeden önce yapılacak işlemler
        // Örneğin, header'lara bir token ekleyebilirsiniz
        // config.headers['Authorization'] = `Bearer ${token}`;
        config,
      (error) => Promise.reject(error),
    );

    // Yanıt interceptor
    this.service.interceptors.response.use(
      (response) =>
        // Yanıt başarıyla alındığında yapılacak işlemler
        response,
      (error) => {
        console.log("Response error in BaseHTTP class ==>", error);
        if (error.response) {
          const message = error.response;
          notification.error({
            message: message.statusText,
            description: `${message.data || "Bilinmeyen hata"}`,
            duration: 5,
            placement: "top",
          });
        } else if (error.request) {
          notification.error({
            message: `${serviceName} sunucusundan yanıt alınamadı`,
            // message: "Sunucu Yanıt Vermedi",
            description: error.config.url + " => " + error.message,
            // description: `${serviceName} sunucusundan yanıt alınamadı. Lütfen tekrar deneyin.`,
            duration: 5,
            placement: "top",
          });
        } else {
          notification.error({
            message: "İstek Hatası",
            description: error.config.url + " => " + error.message,
            duration: 5,
            placement: "top",
          });
        }
        return Promise.reject(error);
      },
    );

    return this.service;
  }
}

export default BaseHttp;
