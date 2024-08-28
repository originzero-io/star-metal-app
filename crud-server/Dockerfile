# Resmi Node.js imajını temel al
FROM node:18-alpine

# Uygulamanın çalışacağı dizini oluştur ve çalışma dizini olarak ayarla
WORKDIR /usr/src/app

# package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Uygulama kodunu çalışma dizinine kopyala
COPY . .

# Uygulamanın dışarıya açacağı portu belirt
EXPOSE 6333

# Uygulamayı başlat
CMD ["npm", "run", "dev"]
