import { useAuth } from "context/AuthProvider";
import { useUIContext } from "context/UIProvider";
import { useEffect } from "react";

export default function useDetectUserInteraction() {
  const { showAlert } = useUIContext();
  const { user, logout } = useAuth();
  useEffect(() => {
    let timeoutId;

    // Kullanıcı etkin olduğunda çağrılacak fonksiyon
    const resetTimeout = () => {
      if (!user) return;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        showAlert("warning", "10 dakikadır işlem yapmıyorsunuz. Yeniden giriş yapın.");
        logout();
      }, 600000); // 10 dakika = 600000 milisaniye
    };

    // Etkinlik dinleyicileri için kullanılacak event listesi
    const events = ["mousemove", "keydown", "scroll", "touchstart"];

    // Event listener'ları ekleyin
    events.forEach((event) => {
      window.addEventListener(event, resetTimeout, true);
    });

    // İlk timeout'u başlat
    resetTimeout();

    // Component unmount olduğunda, event listener'ları ve timeout'u temizle
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [user, logout]);
}
