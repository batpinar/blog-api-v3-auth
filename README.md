# Blog API v3 - Authentication

Bu proje, bir blog platformu için geliştirilmiş bir RESTful API'dir. Kullanıcı yönetimi, kimlik doğrulama, kategori, gönderi, yorum ve etiket yönetimi gibi özellikler sunar. Proje, **Node.js**, **Express**, **Prisma ORM** ve **TypeScript** kullanılarak geliştirilmiştir.

## Özellikler

- Kullanıcı kayıt ve giriş işlemleri
- JWT tabanlı kimlik doğrulama
- Kullanıcı rolleri (ADMIN, MODERATOR, MEMBER)
- Kategori, gönderi, yorum ve etiket yönetimi
- Silinmiş içerikleri listeleme ve yönetme
- Zod ile veri doğrulama

## Proje Yapısı

### Önemli Dosyalar ve Klasörler

- **`src/app.ts`**: Uygulamanın giriş noktası.
- **`src/routes/`**: API rotalarını tanımlar.
- **`src/controllers/`**: İş mantığını içeren kontrolörler.
- **`src/models/`**: Veritabanı işlemleri için kullanılan modeller.
- **`src/middlewares/`**: Kimlik doğrulama ve yetkilendirme gibi ara yazılımlar.
- **`prisma/schema.prisma`**: Veritabanı şeması.

## Kurulum

### Gereksinimler

- Node.js (v16+)
- PostgreSQL
- npm veya yarn

### Adımlar

1. Depoyu klonlayın:
   ```bash
   git clone <repository-url>
   cd blog-api-v3-auth
   ```

2. Ortam değişkenlerini ayarlayın:
   ```bash
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database>"
   JWT_SECRET="your-jwt-secret"
   REFRESH_TOKEN_SECRET="your-refresh-token-secret"
   PORT=3001
   ```

3. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

4. Veritabanı migrasyonlarını çalıştırın:
   ```bash
   npx prisma migrate dev
   ```

5. Uygulamayı başlatın:
   ```bash
   npm start
   ```
API Endpointleri

Auth
POST /api/auth/register: Kullanıcı kaydı
POST /api/auth/login: Kullanıcı girişi
POST /api/auth/refresh-token: Token yenileme
POST /api/auth/logout: Çıkış yapma
GET /api/auth/me: Kullanıcı bilgilerini al

Kullanıcılar

GET /api/users: Tüm kullanıcıları listele
GET /api/users/:id: Belirli bir kullanıcıyı getir
POST /api/users: Yeni kullanıcı ekle
PUT /api/users/:id: Kullanıcıyı güncelle
DELETE /api/users/:id: Kullanıcıyı sil

Kategoriler

GET /api/categories: Tüm kategorileri listele
GET /api/categories/:id: Belirli bir kategoriyi getir
POST /api/categories: Yeni kategori ekle
PUT /api/categories/:id: Kategoriyi güncelle
DELETE /api/categories/:id: Kategoriyi sil

Gönderiler

GET /api/posts: Tüm gönderileri listele
GET /api/posts/:id: Belirli bir gönderiyi getir
POST /api/posts: Yeni gönderi ekle
PUT /api/posts/:id: Gönderiyi güncelle
DELETE /api/posts/:id: Gönderiyi sil
POST /api/posts/:id/tags: Gönderiye etiket ekle
DELETE /api/posts/:id/tags: Gönderiden etiketi kaldır

Yorumlar

GET /api/comments: Tüm yorumları listele
GET /api/comments/:id: Belirli bir yorumu getir
POST /api/comments: Yeni yorum ekle
PUT /api/comments/:id: Yorumu güncelle
DELETE /api/comments/:id: Yorumu sil

Etiketler

GET /api/tags: Tüm etiketleri listele
GET /api/tags/:id: Belirli bir etiketi getir
POST /api/tags: Yeni etiket ekle
PUT /api/tags/:id: Etiketi güncelle
DELETE /api/tags/:id: Etiketi sil

Kullanılan Teknolojiler

Node.js: Sunucu tarafı JavaScript çalıştırma ortamı
Express: Web uygulama çerçevesi
Prisma: ORM (Object-Relational Mapping) aracı
TypeScript: JavaScript'in tip güvenli bir süper seti
Zod: Veri doğrulama ve şema tanımlama kütüphanesi
JWT: JSON Web Token ile kimlik doğrulama
Argon2: Şifreleme algoritması
Katkıda Bulunma
Bu projeyi forklayın.
Yeni bir dal oluşturun: git checkout -b feature/ozellik-adi
Değişikliklerinizi commit edin: git commit -m 'Yeni bir özellik ekle'
Dalınızı push edin: git push origin feature/ozellik-adi
Bir Pull Request oluşturun.
Lisans