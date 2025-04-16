# UVW Mühendislik - Görev Yönetim Backend API

## Get Start

-npm install
-npm run dev

Bu proje, görev yönetimi, kullanıcı yetkilendirmesi ve proje yönetimi gibi temel işlevleri sağlayan bir RESTful API'dir. Express.js ve MongoDB kullanılarak geliştirilmiştir.

---

## 🚀 Kullanılan Teknolojiler

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** ile kimlik doğrulama
- **bcrypt** ile şifreleme
- **Zod/Joi** (opsiyonel) ile validasyon
- **Dotenv** ile ortam değişken yönetimi

- **controllers/** → İş mantığı
- **routes/** → API endpoint tanımları
- **models/** → Mongoose veri modelleri
- **middlewares/** → JWT doğrulama ve rol bazlı erişim
- **utils/** → Yardımcı fonksiyonlar

### Auth

- `POST /auth/register` – Kullanıcı kaydı
- `POST /auth/login` – Kullanıcı girişi
- `GET /auth/users` – Kullanı Listesi
- `PUT /auth//:userId/role` – Kullanı Role Değişimi

### Projeler

- `GET /projects` – Kullanıcının projelerini getir
- `GET /projects/:id` – Proje detaylarını getir
- `POST /projects` – Yeni proje oluştur
- `PUT /projects/:projectId` – Proje detaylarını güncelle

### Görevler

- `GET /projects/:id/tasks` – Projeye ait görevleri getir
- `POST /projects/:id/tasks` – Projeye görev ekle
- `PUT /tasks/:id` – Görev güncelle
- `DELETE /tasks/:id` – Görev sil

### Loglar (Ek Özellik)

- `GET /projects/:projectId/tasks/:taskId/logs` – Görev geçmişini getir

---

## ✨ Ek Özellik: Görev Güncelleme Logları

- Her görev güncellemesinde, yapılan değişiklikleri ayrı bir log koleksiyonunda saklar.
- Log kayıtları kullanıcı tarafından görüntülenebilir.

---

## 🛠 Ortam Değişkenleri `.env`

```env
MONGO_URI = mongodb+srv://schwayzer:schwayzer147@cluster1.ezjdo98.mongodb.net/taskdb?retryWrites=true&w=majority
CHECKOUT_DOMAIN = http://localhost:3001/
PORT = 3000
JWT_SECRET=sch123
```
