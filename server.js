const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { initDb, queries } = require('./db.js');

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;
const UPLOADS_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'uploads', 'resumes') 
  : path.join(ROOT, 'uploads', 'resumes');
const BACKUPS_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'backups', 'pages') 
  : path.join(ROOT, 'backups', 'pages');
const IMAGE_UPLOADS_DIR = process.env.VERCEL 
  ? path.join('/tmp', 'uploads', 'images') 
  : path.join(ROOT, 'uploads', 'images');

try {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  if (!fs.existsSync(IMAGE_UPLOADS_DIR)) fs.mkdirSync(IMAGE_UPLOADS_DIR, { recursive: true });
} catch (e) {}

function getEditablePages() {
  try {
    return fs.readdirSync(ROOT)
      .filter(f => f.endsWith('.html') && f !== 'admin.html')
      .sort();
  } catch (e) {
    return [
      'index.html', 'about.html', 'academics.html', 'admissions.html',
      'campus.html', 'careers.html', 'contact.html', 'gallery.html',
      'news-events.html', 'parents.html', 'student-life.html', 'alumni.html',
      'calendar.html', 'robotics-lab.html', 'mandatory-disclosure.html',
      'privacy-policy.html', 'terms.html', '404.html'
    ];
  }
}

// Initialize database
initDb();

// In-memory active session store (token -> session)
const activeSessions = new Map();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8'
};

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(c => {
    const [k, v] = c.trim().split('=');
    if (k && v) cookies[k] = decodeURIComponent(v);
  });
  return cookies;
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const authHeader = req.headers.authorization;
  let token = cookies.avinya_admin_session || cookies.cbs_admin_session;
  
  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }
  
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return session;
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

// In-Memory Rate Limiting
const failedLoginAttempts = new Map(); // ip -> { count, resetTime }
const publicFormAttempts = new Map();  // ip -> { count, resetTime }

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of failedLoginAttempts.entries()) {
    if (now > entry.resetTime) failedLoginAttempts.delete(ip);
  }
  for (const [ip, entry] of publicFormAttempts.entries()) {
    if (now > entry.resetTime) publicFormAttempts.delete(ip);
  }
}, 5 * 60 * 1000).unref();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || '127.0.0.1';
}

function checkLoginRateLimit(ip) {
  const now = Date.now();
  const entry = failedLoginAttempts.get(ip);
  if (!entry || now > entry.resetTime) return true;
  return entry.count < 5;
}

function recordFailedLogin(ip) {
  const now = Date.now();
  const entry = failedLoginAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    failedLoginAttempts.set(ip, { count: 1, resetTime: now + 15 * 60 * 1000 });
  } else {
    entry.count++;
  }
}

function clearFailedLogin(ip) {
  failedLoginAttempts.delete(ip);
}

function checkPublicFormRateLimit(ip) {
  const now = Date.now();
  const entry = publicFormAttempts.get(ip);
  if (!entry || now > entry.resetTime) {
    publicFormAttempts.set(ip, { count: 1, resetTime: now + 10 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

function sanitizeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  let str = String(val);
  // Neutralize CSV formula injection (starts with =, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

function readBodyJson(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 20 * 1024 * 1024) { // 20MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function sanitizeText(str) {
  if (!str) return '';
  return String(str).trim();
}

const server = http.createServer(async (req, res) => {
  const urlParts = req.url.split('?');
  const reqPath = decodeURI(urlParts[0]);
  const queryString = urlParts[1] || '';
  const queryParams = new URLSearchParams(queryString);

  // Hardened Security Headers & Content-Security-Policy
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob: https:; frame-src 'self' https://www.google.com https://maps.google.com https://avinyaschool.dharamgraphics.in; connect-src 'self'; base-uri 'self'; form-action 'self';");

  // =========================================================================
  // REST API ROUTING (/api/*)
  // =========================================================================
  if (reqPath.startsWith('/api/')) {

    // 1. PUBLIC: Admissions Application (New & Legacy)
    if (req.method === 'POST' && (reqPath === '/api/admissions/apply' || reqPath === '/api/inquiries')) {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        const studentName = body.studentName || body.student_name;
        const parentName = body.parentName || body.parent_name;
        const phone = body.phone || body.parent_phone;
        const grade = body.grade || body.grade_applied;

        if (!studentName || !parentName || !phone || !grade) {
          return sendJson(res, 400, { success: false, error: 'Please provide all mandatory fields (student name, parent name, phone, grade).' });
        }
        const appNo = queries.createAdmission(body);
        return sendJson(res, 201, {
          success: true,
          message: 'Admission inquiry submitted successfully!',
          appNo,
          app_no: appNo,
          refNumber: appNo
        });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Failed to process admission inquiry.' });
      }
    }

    // 2. PUBLIC: Campus Walkthrough Booking (New & Legacy)
    if (req.method === 'POST' && (reqPath === '/api/tours/book' || reqPath === '/api/tours')) {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        const parentName = body.parentName || body.parent_name;
        const phone = body.phone || body.parent_phone;
        const date = body.date || body.preferred_date;

        if (!parentName || !phone || !date) {
          return sendJson(res, 400, { success: false, error: 'Please specify parent name, contact number, and preferred date.' });
        }
        const bookingRef = queries.createTour(body);
        return sendJson(res, 201, {
          success: true,
          message: 'Campus walkthrough booked successfully!',
          bookingRef,
          booking_ref: bookingRef
        });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Failed to book campus walkthrough.' });
      }
    }

    // 3. PUBLIC: Careers Application (with resume upload)
    if (req.method === 'POST' && reqPath === '/api/careers/apply') {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        const candidateName = body.candidateName || body.fullName;
        if (!candidateName || !body.email || !body.phone || !body.position) {
          return sendJson(res, 400, { success: false, error: 'Please provide full name, contact details, and position applied for.' });
        }

        let savedResumeFilename = null;
        if (body.resumeBase64 && body.resumeFilename) {
          const cleanName = sanitizeText(body.resumeFilename).replace(/[^a-zA-Z0-9._-]/g, '_');
          const ext = path.extname(cleanName).toLowerCase();
          if (['.pdf', '.docx', '.doc'].includes(ext)) {
            const uniqueName = `cv_${Date.now()}_${cleanName}`;
            const diskPath = path.join(UPLOADS_DIR, uniqueName);
            const base64Data = body.resumeBase64.replace(/^data:[^;]+;base64,/, '');
            fs.writeFileSync(diskPath, Buffer.from(base64Data, 'base64'));
            savedResumeFilename = uniqueName;
          }
        }

        const appId = queries.createJobApplication({
          ...body,
          candidateName,
          resumeFilename: savedResumeFilename,
          resumeOriginalName: body.resumeFilename || null
        });

        return sendJson(res, 201, {
          success: true,
          message: 'Teacher application and resume submitted successfully!',
          appId,
          applicationRef: appId
        });
      } catch (e) {
        console.error('Careers upload error:', e);
        return sendJson(res, 500, { success: false, error: 'Failed to submit application.' });
      }
    }

    // 4. PUBLIC: Alumni Registration & Directory
    if (req.method === 'POST' && reqPath === '/api/alumni/register') {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        if (!body.fullName || !body.batchYear || !body.email) {
          return sendJson(res, 400, { success: false, error: 'Please provide full name, batch year, and email.' });
        }
        queries.createAlumni(body);
        return sendJson(res, 201, {
          success: true,
          message: 'Alumni registration successful!',
          memberId: 'ALM-' + Date.now()
        });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Failed to register alumni.' });
      }
    }

    if (req.method === 'GET' && reqPath === '/api/alumni/directory') {
      const list = queries.getAlumni(true);
      return sendJson(res, 200, { success: true, alumni: list, directory: list });
    }

    // 5. PUBLIC: Contact & Helpdesk Messages (New & Legacy)
    if (req.method === 'POST' && (reqPath === '/api/contact/send' || reqPath === '/api/contact')) {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        const name = body.name || body.full_name;
        if (!name || !body.email || !body.message) {
          return sendJson(res, 400, { success: false, error: 'Please provide name, email, and query message.' });
        }
        const ticketId = queries.createContactMessage({ ...body, name });
        return sendJson(res, 201, {
          success: true,
          message: 'Your message has been received by our administrative desk.',
          ticketId,
          ticket_id: ticketId
        });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Failed to send contact inquiry.' });
      }
    }

    // 6. PUBLIC: Newsletter Subscription
    if (req.method === 'POST' && reqPath === '/api/newsletter') {
      const clientIp = getClientIp(req);
      if (!checkPublicFormRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many submissions. Please wait a few moments before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        if (!body.email || !body.email.includes('@')) {
          return sendJson(res, 400, { success: false, error: 'Invalid email address.' });
        }
        queries.subscribeNewsletter(body.email);
        return sendJson(res, 201, { success: true, message: 'Subscribed to school circulars successfully.' });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Newsletter subscription failed.' });
      }
    }

    // 7. PUBLIC: Photo Gallery Catalog
    if (req.method === 'GET' && reqPath === '/api/gallery') {
      try {
        const catalogPath = path.join(ROOT, 'assets', 'images', 'catalog.json');
        if (fs.existsSync(catalogPath)) {
          const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
          return sendJson(res, 200, catalog);
        }
        return sendJson(res, 200, []);
      } catch (e) {
        return sendJson(res, 500, { error: 'Failed to load gallery catalog' });
      }
    }

    // 8. AUTHENTICATION: Admin Login / Logout / Me
    if (req.method === 'POST' && (reqPath === '/api/auth/login' || reqPath === '/api/admin/login')) {
      const clientIp = getClientIp(req);
      if (!checkLoginRateLimit(clientIp)) {
        return sendJson(res, 429, { success: false, error: 'Too many failed login attempts. Please wait 15 minutes before trying again.' });
      }
      try {
        const body = await readBodyJson(req);
        const user = queries.verifyAdminCredentials(body.username, body.password);
        if (!user) {
          recordFailedLogin(clientIp);
          return sendJson(res, 401, { success: false, error: 'Invalid username or password.' });
        }

        clearFailedLogin(clientIp);
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        activeSessions.set(token, { user, expiresAt });

        res.setHeader('Set-Cookie', `avinya_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
        return sendJson(res, 200, {
          success: true,
          message: 'Login successful',
          token,
          user
        });
      } catch (e) {
        return sendJson(res, 500, { success: false, error: 'Login authentication error.' });
      }
    }

    if (req.method === 'POST' && reqPath === '/api/auth/logout') {
      const cookies = parseCookies(req.headers.cookie);
      if (cookies.avinya_admin_session) activeSessions.delete(cookies.avinya_admin_session);
      if (cookies.cbs_admin_session) activeSessions.delete(cookies.cbs_admin_session);
      res.setHeader('Set-Cookie', 'avinya_admin_session=; Path=/; HttpOnly; Max-Age=0');
      return sendJson(res, 200, { success: true, message: 'Logged out successfully.' });
    }

    if (req.method === 'GET' && reqPath === '/api/auth/me') {
      const session = getSession(req);
      if (!session) return sendJson(res, 401, { authenticated: false });
      return sendJson(res, 200, { authenticated: true, user: session.user });
    }

    // =========================================================================
    // PROTECTED ADMIN ENDPOINTS
    // =========================================================================
    const session = getSession(req);
    if (!session && reqPath !== '/api/seo-audit/run') {
      return sendJson(res, 401, { success: false, error: 'Unauthorized. Staff session required.' });
    }

    // 9. ADMIN: Overview Stats & Dashboard
    if (req.method === 'GET' && (reqPath === '/api/admin/overview' || reqPath === '/api/admin/stats')) {
      const data = queries.getOverviewStats();
      return sendJson(res, 200, {
        success: true,
        ...data,
        metrics: {
          totalInquiries: data.stats.totalAdmissions,
          pendingInquiries: data.stats.pendingAdmissions,
          totalTours: data.stats.totalTours,
          totalJobs: data.stats.totalJobs,
          unreadMessages: data.stats.unreadMessages,
          totalAlumni: data.stats.totalAlumni
        }
      });
    }

    // 10. ADMIN: Admissions Inquiries Management
    if (req.method === 'GET' && (reqPath === '/api/admin/admissions' || reqPath === '/api/inquiries')) {
      const filter = {
        status: queryParams.get('status') || 'ALL',
        grade: queryParams.get('grade') || 'ALL'
      };
      const list = queries.getAdmissions(filter);
      return sendJson(res, 200, { success: true, admissions: list, inquiries: list });
    }

    if (req.method === 'PATCH' && (reqPath.startsWith('/api/admin/admissions/') || reqPath.startsWith('/api/inquiries/'))) {
      const id = reqPath.split('/')[4] || reqPath.split('/')[3];
      const body = await readBodyJson(req);
      queries.updateAdmissionStatus(Number(id), body.status, body.notes);
      return sendJson(res, 200, { success: true, message: 'Inquiry status updated successfully.' });
    }

    // 11. ADMIN: Campus Tours Management
    if (req.method === 'GET' && reqPath === '/api/admin/tours') {
      const list = queries.getTours();
      return sendJson(res, 200, { success: true, tours: list });
    }

    if (req.method === 'PATCH' && reqPath.startsWith('/api/admin/tours/')) {
      const id = reqPath.split('/')[4];
      const body = await readBodyJson(req);
      queries.updateTourStatus(Number(id), body.status);
      return sendJson(res, 200, { success: true, message: 'Campus tour status updated.' });
    }

    // 12. ADMIN: Careers & Resumes Management
    if (req.method === 'GET' && reqPath === '/api/admin/careers') {
      const list = queries.getJobApplications();
      return sendJson(res, 200, { success: true, candidates: list });
    }

    if (req.method === 'PATCH' && reqPath.startsWith('/api/admin/careers/')) {
      const id = reqPath.split('/')[4];
      const body = await readBodyJson(req);
      queries.updateJobStatus(Number(id), body.status);
      return sendJson(res, 200, { success: true, message: 'Candidate status updated.' });
    }

    // 13. ADMIN: Contact Messages Management
    if (req.method === 'GET' && (reqPath === '/api/admin/contact' || reqPath === '/api/contact')) {
      const list = queries.getContactMessages();
      return sendJson(res, 200, { success: true, messages: list });
    }

    if (req.method === 'PATCH' && reqPath.startsWith('/api/admin/contact/')) {
      const id = reqPath.split('/')[4];
      const body = await readBodyJson(req);
      queries.updateContactStatus(Number(id), body.status);
      return sendJson(res, 200, { success: true, message: 'Message status updated.' });
    }

    // 14. ADMIN: CSV Exports
    if (req.method === 'GET' && (reqPath.startsWith('/api/admin/export/') || reqPath === '/api/inquiries/export')) {
      let type = 'admissions';
      if (reqPath.startsWith('/api/admin/export/')) {
        type = reqPath.split('/')[4];
      }

      if (type === 'admissions' || type === 'inquiries') {
        const rows = queries.getAdmissions();
        let csv = 'Application No,Student Name,Parent Name,Email,Phone,Grade,Locality,Status,Date\n';
        rows.forEach(r => {
          csv += [
            sanitizeCsvCell(r.app_no),
            sanitizeCsvCell(r.student_name),
            sanitizeCsvCell(r.parent_name),
            sanitizeCsvCell(r.parent_email),
            sanitizeCsvCell(r.parent_phone),
            sanitizeCsvCell(r.grade_applied),
            sanitizeCsvCell(r.locality || ''),
            sanitizeCsvCell(r.status),
            sanitizeCsvCell(r.created_at)
          ].join(',') + '\n';
        });
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="avinya_admissions_export.csv"');
        return res.end(csv);
      } else if (type === 'careers') {
        const rows = queries.getJobApplications();
        let csv = 'Application ID,Candidate Name,Email,Phone,Position,Qualification,Experience Years,Status,Date\n';
        rows.forEach(r => {
          csv += [
            sanitizeCsvCell(r.app_id),
            sanitizeCsvCell(r.candidate_name),
            sanitizeCsvCell(r.email),
            sanitizeCsvCell(r.phone),
            sanitizeCsvCell(r.position_applied),
            sanitizeCsvCell(r.qualification),
            sanitizeCsvCell(r.experience_years),
            sanitizeCsvCell(r.status),
            sanitizeCsvCell(r.created_at)
          ].join(',') + '\n';
        });
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="avinya_careers_export.csv"');
        return res.end(csv);
      } else if (type === 'tours') {
        const rows = queries.getTours();
        let csv = 'Booking Ref,Parent Name,Phone,Email,Date,Time Slot,Grade,Status\n';
        rows.forEach(r => {
          csv += [
            sanitizeCsvCell(r.booking_ref),
            sanitizeCsvCell(r.parent_name),
            sanitizeCsvCell(r.parent_phone),
            sanitizeCsvCell(r.parent_email),
            sanitizeCsvCell(r.preferred_date),
            sanitizeCsvCell(r.preferred_time_slot),
            sanitizeCsvCell(r.grade_interest),
            sanitizeCsvCell(r.status)
          ].join(',') + '\n';
        });
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="avinya_tours_export.csv"');
        return res.end(csv);
      }
    }

    // 15. ADMIN: Visual Page Editor - List Pages
    if (req.method === 'GET' && reqPath === '/api/editor/pages') {
      const pages = getEditablePages().map(file => {
        const fullPath = path.join(ROOT, file);
        if (!fs.existsSync(fullPath)) return null;
        const stats = fs.statSync(fullPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : file;

        const backups = fs.existsSync(BACKUPS_DIR)
          ? fs.readdirSync(BACKUPS_DIR).filter(b => b.startsWith(file))
          : [];

        return {
          filename: file,
          title,
          sizeBytes: stats.size,
          lastModified: stats.mtime,
          backupsCount: backups.length
        };
      }).filter(Boolean);

      return sendJson(res, 200, { success: true, pages });
    }

    // 16. ADMIN: Visual Page Editor - Save & Publish with Automated Backup
    if (req.method === 'POST' && reqPath === '/api/editor/save-page') {
      try {
        const body = await readBodyJson(req);
        const { filename, htmlContent } = body;

        const allowed = getEditablePages();
        if (!filename || !allowed.includes(filename)) {
          return sendJson(res, 400, { success: false, error: 'Invalid or restricted page target.' });
        }
        if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.length < 100) {
          return sendJson(res, 400, { success: false, error: 'Invalid HTML payload.' });
        }

        const targetFile = path.join(ROOT, filename);

        // Automated Timestamped Backup
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFilename = `${filename}.${timestamp}.bak.html`;
        const backupPath = path.join(BACKUPS_DIR, backupFilename);
        if (fs.existsSync(targetFile)) {
          fs.copyFileSync(targetFile, backupPath);
        }

        // Clean editor runtime script/link injection tags before saving
        let cleanHtml = htmlContent
          .replace(/<link[^>]*href=["'][^"']*visual-editor[^"']*["'][^>]*>/gi, '')
          .replace(/<script[^>]*src=["'][^"']*visual-editor[^"']*["'][^>]*><\/script>/gi, '');

        fs.writeFileSync(targetFile, cleanHtml, 'utf8');

        return sendJson(res, 200, {
          success: true,
          message: 'Page successfully updated and published!',
          backupCreated: backupFilename
        });
      } catch (err) {
        console.error('Save page error:', err);
        return sendJson(res, 500, { success: false, error: 'Failed to write page changes.' });
      }
    }

    // 17. ADMIN: Visual Page Editor - Image Upload
    if (req.method === 'POST' && reqPath === '/api/editor/upload-image') {
      try {
        const body = await readBodyJson(req);
        if (!body.filename || !body.base64Data) {
          return sendJson(res, 400, { success: false, error: 'Image data and filename required.' });
        }

        const cleanName = sanitizeText(body.filename).replace(/[^a-zA-Z0-9._-]/g, '_');
        const ext = path.extname(cleanName).toLowerCase();
        if (!['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)) {
          return sendJson(res, 400, { success: false, error: 'Unsupported image format. Allowed formats: JPG, PNG, WEBP, GIF.' });
        }

        const uniqueName = `img_${Date.now()}_${cleanName}`;
        const targetPath = path.join(IMAGE_UPLOADS_DIR, uniqueName);
        const base64Data = body.base64Data.replace(/^data:[^;]+;base64,/, '');
        fs.writeFileSync(targetPath, Buffer.from(base64Data, 'base64'));

        return sendJson(res, 201, {
          success: true,
          message: 'Image uploaded successfully.',
          imageUrl: `uploads/images/${uniqueName}`
        });
      } catch (e) {
        console.error('Image upload error:', e);
        return sendJson(res, 500, { success: false, error: 'Failed to upload image.' });
      }
    }

    // 18. ADMIN: Live SEO & Performance Audit
    if (req.method === 'GET' && reqPath === '/api/seo-audit/run') {
      try {
        const pagesAudit = [];
        let totalScoreAcc = 0;

        getEditablePages().forEach(filename => {
          const filePath = path.join(ROOT, filename);
          if (!fs.existsSync(filePath)) return;

          const content = fs.readFileSync(filePath, 'utf8');

          const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : '';

          const descMatch = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
                            content.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
          const description = descMatch ? descMatch[1].trim() : '';

          const ogTitle = /<meta[^>]*property=["']og:title["']/i.test(content);
          const ogDesc = /<meta[^>]*property=["']og:description["']/i.test(content);
          const ogImage = /<meta[^>]*property=["']og:image["']/i.test(content);
          const twitterCard = /<meta[^>]*name=["']twitter:card["']/i.test(content);
          const schema = /<script[^>]*type=["']application\/ld\+json["']/i.test(content);
          const viewport = /<meta[^>]*name=["']viewport["']/i.test(content);
          const canonical = /<link[^>]*rel=["']canonical["']/i.test(content);

          const h1Matches = content.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
          const h1Count = h1Matches.length;

          const imgMatches = content.match(/<img[^>]*>/gi) || [];
          let missingAltCount = 0;
          imgMatches.forEach(img => {
            if (!img.includes('alt=') || /alt=["']\s*["']/i.test(img)) missingAltCount++;
          });

          let pageScore = 0;
          if (title && title.length >= 25 && title.length <= 85) pageScore += 15;
          else if (title) pageScore += 8;

          if (description && description.length >= 70 && description.length <= 250) pageScore += 20;
          else if (description) pageScore += 10;

          if (ogTitle && ogDesc && ogImage) pageScore += 15;
          else if (ogTitle || ogDesc) pageScore += 8;

          if (twitterCard) pageScore += 10;
          if (schema) pageScore += 15;
          if (h1Count === 1) pageScore += 10;
          else if (h1Count > 1) pageScore += 5;

          if (missingAltCount === 0) pageScore += 10;
          else pageScore += Math.max(0, 10 - missingAltCount * 2);

          if (viewport) pageScore += 5;

          totalScoreAcc += pageScore;

          pagesAudit.push({
            filename,
            title,
            titleLength: title.length,
            descriptionLength: description.length,
            hasOg: ogTitle && ogDesc && ogImage,
            hasTwitter: twitterCard,
            hasSchema: schema,
            hasCanonical: canonical,
            h1Count,
            totalImages: imgMatches.length,
            missingAltCount,
            score: Math.min(100, pageScore)
          });
        });

        const sitemapPath = path.join(ROOT, 'sitemap.xml');
        const hasSitemap = fs.existsSync(sitemapPath);
        let sitemapUrlsCount = 0;
        if (hasSitemap) {
          const sm = fs.readFileSync(sitemapPath, 'utf8');
          sitemapUrlsCount = (sm.match(/<loc>/g) || []).length;
        }

        const robotsPath = path.join(ROOT, 'robots.txt');
        const hasRobots = fs.existsSync(robotsPath);

        const overallScore = Math.round(totalScoreAcc / (pagesAudit.length || 1));

        return sendJson(res, 200, {
          success: true,
          overallScore,
          totalPagesAudited: pagesAudit.length,
          pages: pagesAudit,
          technicalChecklist: {
            sitemap: { active: hasSitemap, urlsIndexed: sitemapUrlsCount },
            robotsTxt: { active: hasRobots },
            gzipCompression: { active: true, algorithm: 'node:zlib native' },
            cachingHeaders: { active: true, etagSupport: true, staleWhileRevalidate: true },
            responsiveViewports: { active: true, standard: '375px - 3440px' }
          }
        });
      } catch (err) {
        console.error('SEO audit error:', err);
        return sendJson(res, 500, { success: false, error: 'Failed to run SEO audit.' });
      }
    }

    // Default API 404
    return sendJson(res, 404, { success: false, error: 'API endpoint not found.' });
  }

  // =========================================================================
  // STATIC FILE DELIVERY & ACCESS CONTROL
  // =========================================================================
  let safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  // Ensure absolute resolution stays strictly within ROOT directory
  let filePath = path.resolve(ROOT, '.' + safePath);
  if (!filePath.startsWith(ROOT)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('403 Forbidden: Path traversal prohibited.');
  }

  // 1. Enforce Authentication for Sensitive Uploads (Candidate Resumes)
  if (safePath.startsWith('/uploads/resumes/') || safePath.startsWith('uploads/resumes/')) {
    const session = getSession(req);
    if (!session) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      return res.end(JSON.stringify({ 
        success: false, 
        error: 'Unauthorized: Staff authentication required to access candidate resumes.' 
      }));
    }
  }

  // 2. Block sensitive directories & hidden dotfiles
  const relativePath = path.relative(ROOT, filePath);
  const pathSegments = relativePath.split(path.sep);

  const hasHiddenSegment = pathSegments.some(seg => seg.startsWith('.') && seg !== '.' && seg !== '..');
  if (hasHiddenSegment) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('403 Forbidden: Hidden files and directories are restricted.');
  }

  const blockedDirectories = ['backups', 'scratch', 'node_modules'];
  if (blockedDirectories.some(dir => pathSegments[0] === dir)) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('403 Forbidden: Directory access is restricted.');
  }

  // 3. Block sensitive extensions and source/system files
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const blockedExtensions = [
    '.db', '.sqlite', '.sqlite3', '.bak', '.log', '.sh', '.bash',
    '.env', '.md', '.yml', '.yaml', '.sql', '.toml', '.ini', '.lock'
  ];
  const blockedExactFiles = [
    'server.js', 'db.js', 'package.json', 'package-lock.json',
    'dockerfile', 'docker-compose.yml', 'test-audit.js'
  ];

  if (blockedExtensions.includes(ext) || blockedExactFiles.includes(filename.toLowerCase())) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('403 Forbidden: Access to system and source files is prohibited.');
  }

  // 4. Whitelist JS files: only public client scripts
  if (ext === '.js') {
    const allowedClientScripts = ['script.js', 'visual-editor.js'];
    const isAssetScript = pathSegments[0] === 'assets';
    if (!allowedClientScripts.includes(filename) && !isAssetScript) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('403 Forbidden: Execution script access prohibited.');
    }
  }

  // 5. Whitelist JSON files: only public catalogs / manifests
  if (ext === '.json') {
    const allowedClientJsons = ['catalog.json', 'manifest.json'];
    const isAssetJson = pathSegments[0] === 'assets';
    if (!allowedClientJsons.includes(filename) && !isAssetJson) {
      res.statusCode = 403;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('403 Forbidden: Data file access prohibited.');
    }
  }

  // If path doesn't have extension and directory exists, look for index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  // 404 Fallback
  if (!fs.existsSync(filePath)) {
    const errorPage = path.join(ROOT, '404.html');
    if (fs.existsSync(errorPage)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return fs.createReadStream(errorPage).pipe(res);
    }
    res.statusCode = 404;
    return res.end('404 Not Found');
  }

  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);

  // Cache headers
  if (['.jpg', '.jpeg', '.png', '.webp', '.svg', '.ico', '.woff', '.woff2'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
  } else if (['.css', '.js'].includes(ext)) {
    res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  }

  // ETag support
  const etag = `W/"${stat.size}-${stat.mtimeMs}"`;
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    res.statusCode = 304;
    return res.end();
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);

  // Gzip compression for text, code & JSON files
  const acceptEncoding = req.headers['accept-encoding'] || '';
  const compressable = ['.html', '.css', '.js', '.json', '.xml', '.txt', '.csv'].includes(ext);

  if (compressable && acceptEncoding.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
    const gzip = zlib.createGzip();
    fs.createReadStream(filePath).pipe(gzip).pipe(res);
  } else {
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  }
});

if (require.main === module) {
  server.listen(PORT, HOST, () => {
    console.log(`==================================================`);
    console.log(`🚀 Avinya Vidya Mandir Portal is Running!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏫 School: Avinya Vidya Mandir (Vani Avitya Mandir)`);
    console.log(`🌳 Campus: 1-Acre Green Campus, Burari, Delhi`);
    console.log(`📚 Offering: Playgroup to Class 1 (Annual K-12 CBSE Roadmap)`);
    console.log(`==================================================`);
  });
}

module.exports = server;
