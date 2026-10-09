# Avinya Vidya Mandir — Production Deployment Guide
**School Entity:** Avinya Vidya Mandir (*Vani Avitya Mandir*)  
**Campus:** 35-17/2 Virander Nagar Burari Delhi 110084  
**Contact:** +91 9911102005 | admin@avinyaschool.com  
**Virtual Tour:** https://avinyaschool.dharamgraphics.in/  

---

## 1. System Architecture Overview
The Avinya Vidya Mandir website is engineered with a **zero-heavy-npm, native Node.js architecture**:
- **Runtime:** Native Node.js HTTP server (`node:http`) with `node:zlib` Gzip stream compression and ETag 304 caching.
- **Database:** Synchronous embedded SQLite (`node:sqlite.DatabaseSync` or native SQLite3) stored at `school.db`.
- **Admin Portal & Visual CMS:** In-browser visual page editor (`?editor=true`), automated timestamped HTML rollback backups in `backups/pages/`, candidate resume management in `uploads/resumes/`, and automated live SEO audits (`/api/seo-audit/run`).
- **Memory Footprint:** Typically < 25MB RSS in production with sub-millisecond response latency.

---

## 2. Quick Start (Local & VPS Bare-Metal)

### Prerequisites
- Node.js version 20+ or 22+ LTS installed.

### Launching the Application
```bash
# Clone or copy workspace
cd /path/to/AVINYA-WEBSITE

# Ensure storage directories exist
mkdir -p uploads/resumes uploads/images backups/pages

# Run test verification audit
node test-audit.js

# Start server
node server.js
```
The server will bind to `http://0.0.0.0:3001`.

---

## 3. Production Deployment with PM2 (Recommended)

To run the application with automatic restarts and zero-downtime reloads:
```bash
# Install PM2 globally if not present
npm install -g pm2

# Start daemon
pm2 start server.js --name "avinya-school" -i 1 --max-memory-restart 200M

# Save PM2 process list and configure systemd startup
pm2 save
pm2 startup
```

---

## 4. Docker & Container Deployment

### Build and Run with Docker Compose
```bash
docker compose up -d --build
```

### Healthcheck
The container includes a built-in automated healthcheck that queries the SEO audit endpoint every 30 seconds:
```bash
docker inspect --format='{{json .State.Health}}' avinya_school_app
```

---

## 5. Nginx Reverse Proxy & SSL (Let's Encrypt Certbot)

Place the following configuration in `/etc/nginx/sites-available/avinyaschool.com`:

```nginx
server {
    server_name avinyaschool.com www.avinyaschool.com;

    # Gzip is natively handled by the Node.js server, but Nginx proxying is seamless
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 10M;
    }
}
```

Enable SSL:
```bash
sudo certbot --nginx -d avinyaschool.com -d www.avinyaschool.com
```

---

## 6. Admin Credentials & Access
- **Admin Portal URL:** `https://avinyaschool.com/admin.html`
- **Default Username:** `admin`
- **Default Password:** `Avinya@2026!`
- **Visual Editor:** Append `?editor=true` to any website page when logged into the admin session.
