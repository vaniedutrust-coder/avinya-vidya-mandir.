# Avinya Vidya Mandir (Vani Avitya Mandir) — Official Web Portal

> **Motto:** *"Rooted in Values, Rising in Excellence"*  
> **Campus:** 1-Acre Dedicated Green Campus, 35-17/2 Virander Nagar Burari Delhi 110084  
> **Offerings:** Playgroup, Nursery, LKG, UKG, Class 1 (Expanding annually to CBSE K-12)  
> **Contact:** +91 9911102005 / admin@avinyaschool.com  

---

## 🌟 Overview & School Identity

Avinya Vidya Mandir is built upon an expansive **1-acre contiguous green campus in Burari, Delhi**. Conceived as a high-touch, joyful educational sanctuary:
- **Foundational Stage:** Nurturing students from Playgroup up to **Class 1**.
- **Organic Growth Model:** Adds exactly one new grade each academic session as our founding cohorts advance, guaranteeing a seamless path all the way to **Class 12 in accordance with CBSE standards**.
- **Visual Branding:** Built around the school crest (`avinya.png`), featuring the temple of learning, radiant sun of wisdom, living leaf of nature, and flowing streams of inquiry.
- **Genuine Photography:** Over **80 real school photographs** processed, auto-oriented, and integrated across all pages (academics, sports field, grand Ramayan stage play, kindergarten graduation, sensory water play, Earth Day, and community celebrations).

---

## 🚀 Key Features

1. **High-Performance Architecture:** Zero external heavyweight dependencies; built using native Node.js HTTP (`node:http`), native SQLite (`node:sqlite`), and native crypto (`node:crypto`).
2. **Interactive Admissions Fee Calculator:** Live tuition preview with 100% Founders' admission fee waiver, sibling concessions (50% for 2nd sibling, 100% for 3rd sibling), and after-school club selection.
3. **Curated 81-Photo Interactive Gallery:** Filterable category tabs, lazy-loading, responsive grid, and fullscreen lightbox viewer with keyboard controls.
4. **Admissions Inquiry & Tour Booking Modals:** Instant application references (`AVM-2026-XXXX`) and tour confirmations (`TOUR-XXXXXX`).
5. **Administrative Management Portal (`admin.html`):**
   - Secure login with scrypt password hashing (`admin` / `Avinya@2026!`)
   - Real-time management of admissions inquiries, counselor notes, and status updates
   - One-click CSV export of inquiries for school counselors
6. **CBSE & Statutory Disclosures (`mandatory-disclosure.html`):** Public transparency covering 1-acre land documentation, safety certificates, and child protection committees.

---

## 📁 Project Structure

```
AVINYA WEBSITE/
├── assets/
│   ├── logo/
│   │   ├── avinya-logo.png      # Original high-res crest
│   │   ├── logo-nav.png         # Retina navigation logo
│   │   └── favicon.png          # Browser favicon
│   └── images/
│       ├── school_photo_01.jpg .. school_photo_81.jpg  # Web-optimized photos
│       ├── thumbnails/          # Lightweight gallery thumbnails
│       └── catalog.json         # JSON catalog with metadata & tags
├── SCHOOL images/               # Original photographic archive (81 images)
├── avinya.png                   # Master brand crest
├── index.html                   # Home page & 1-Acre growth showcase
├── about.html                   # School vision, leadership & philosophy
├── academics.html               # Foundational curriculum & CBSE K-12 roadmap
├── admissions.html              # Criteria, fee structure & application form
├── campus.html                  # 1-Acre grounds, sports turf, safety & transport
├── student-life.html            # Ramayan play, sports meets, graduation day & daily routine
├── gallery.html                 # 81-photo categorized gallery with lightbox
├── news-events.html             # Circulars, announcements & calendar
├── contact.html                 # Location map, contact desk & tour booking
├── mandatory-disclosure.html    # CBSE compliance & trust details
├── privacy-policy.html          # Privacy policy
├── terms.html                   # Terms & conditions
├── admin.html                   # Staff administrative dashboard
├── 404.html                     # Error fallback page
├── styles.css                   # Custom stylesheet
├── script.js                    # Interactive modals, lightbox & fee calculator
├── server.js                    # Native Node.js web server & REST API
├── db.js                        # SQLite database module
├── test-audit.js                # Production verification suite
└── package.json                 # Project configuration
```

---

## 🛠️ Running the Application

### 1. Start Server
```bash
node server.js
```
The portal runs on `http://localhost:3001` (or your configured `PORT`).

### 2. Run Test Audit
```bash
node test-audit.js
```

### 3. Administrative Login
- **URL:** `http://localhost:3001/admin.html`
- **Username:** `admin`
- **Password:** `Avinya@2026!`
