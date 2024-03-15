import { dirname } from "path";
import { fileURLToPath } from "url";

// fonksiyonun çağırıldığı dosyanın yolunu döndürür
export const findDirname = (metaUrl) => {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = dirname(__filename);
  return __dirname;
};
