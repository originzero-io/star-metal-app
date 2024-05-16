import { notification } from "antd";
import axios from "axios";

class BaseHttp {
  constructor() {
    this.service = axios;
  }

  createService(baseURL) {
    this.service = axios.create({
      baseURL, // Sunucunuzun base URL'si
      timeout: 5000, // İsteğin zaman aşımını ayarlayın
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
          });
        } else if (error.request) {
          notification.error({
            message: "Sunucu Yanıt Vermedi",
            description: "Sunucudan yanıt alınamadı. Lütfen daha sonra tekrar deneyin.",
            duration: 5,
          });
        } else {
          notification.error({
            message: "İstek Hatası",
            description: error.message,
            duration: 5,
          });
        }
        return Promise.reject(error);
      },
    );

    return this.service;
  }
}

export default BaseHttp;
