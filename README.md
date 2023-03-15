## Shopping-Rest-API
Repo ini dibuat menggunakan 2 hal, yakni:
- NodeJS menggunakan Typescript dengan Framework ExpressJS
- Postgresql

## How to run the app
1. Cloning repo ini
2. Jalankan `docker-compose up -d` untuk membuat postgresql atau jalan psql di komputer tanpa docker
3. Ubah `.env` pada projek ini sesuai dengan konfigurasi postgresql di laptop masing-masing.
4. Jalankan `npm install` untuk menginstall semua dependencies
5. Jalankan `npm run dev` untuk menjalankan aplikasi

## How the app built
1. Aplikasi ini dibuat menggunakan ExpressJS dan Typescript
2. Aplikasi ini dibuat menggunakan MVC pattern
3. Aplikasi ini dibuat menggunakan ORM Sequelize

ERD dari aplikasi ini adalah sebagai berikut:
![ERD](https://github.com/radityarestan/shopping-rest-api/blob/master/pic/shopping-erd.png?raw=true)

Saat menjalankan aplikasi, aplikasi akan otomatis membuat struktur tabel di sql dan juga data seeding yang ada pada folder `seeders`. Data seeding ini akan membuat 2 user yang nantinya akan dipakai yakni user dengan id 1 dan 2. Selain itu, kategori produk, produk, dan discount juga akan dibuat secara otomatis.


## Scenario how the app works
[https://documenter.getpostman.com/view/14598787/2s93JwPNL6](https://documenter.getpostman.com/view/14598787/2s93JwPNL6)
