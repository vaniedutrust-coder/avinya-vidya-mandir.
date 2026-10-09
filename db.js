const { DatabaseSync } = require('node:sqlite');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

let DB_PATH = path.join(__dirname, 'school.db');
if (process.env.VERCEL) {
  const tmpDb = path.join('/tmp', 'school.db');
  if (!fs.existsSync(tmpDb) && fs.existsSync(DB_PATH)) {
    try {
      fs.copyFileSync(DB_PATH, tmpDb);
    } catch (e) {
      console.warn('[DB] Failed to copy seed DB to /tmp, will initialize new DB:', e);
    }
  }
  DB_PATH = tmpDb;
}
const db = new DatabaseSync(DB_PATH);

function hashPassword(password, customSalt) {
  const salt = customSalt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  try {
    const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
  } catch (e) {
    return false;
  }
}

function initDb() {
  // 1. Admissions Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admissions_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_no TEXT UNIQUE NOT NULL,
      student_name TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      parent_email TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      grade_applied TEXT NOT NULL,
      dob TEXT,
      locality TEXT,
      previous_school TEXT,
      status TEXT DEFAULT 'PENDING',
      counselor_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Campus Tours Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS campus_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_ref TEXT UNIQUE NOT NULL,
      parent_name TEXT NOT NULL,
      parent_phone TEXT NOT NULL,
      parent_email TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      preferred_time_slot TEXT NOT NULL,
      grade_interest TEXT NOT NULL,
      attendee_count INTEGER DEFAULT 2,
      special_queries TEXT DEFAULT '',
      status TEXT DEFAULT 'CONFIRMED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Careers & Faculty Applications Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_id TEXT UNIQUE NOT NULL,
      candidate_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      position_applied TEXT NOT NULL,
      qualification TEXT NOT NULL,
      experience_years INTEGER NOT NULL,
      cover_note TEXT DEFAULT '',
      resume_filename TEXT,
      resume_original_name TEXT,
      status TEXT DEFAULT 'NEW',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Alumni Directory Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS alumni_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      batch_year INTEGER NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      current_org TEXT NOT NULL,
      current_role TEXT NOT NULL,
      city TEXT,
      linkedin_url TEXT,
      mentorship_opt_in INTEGER DEFAULT 1,
      is_verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Contact & Helpdesk Inquiries Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      category TEXT DEFAULT 'GENERAL',
      subject TEXT,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'NEW',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Safe migrations for preexisting databases
  try { db.exec(`ALTER TABLE contact_messages ADD COLUMN ticket_id TEXT;`); } catch(e) {}
  try { db.exec(`ALTER TABLE contact_messages ADD COLUMN category TEXT DEFAULT 'GENERAL';`); } catch(e) {}

  // 6. Newsletter Subscribers Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Admin Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      full_name TEXT DEFAULT 'Principal & Admissions Office',
      role TEXT DEFAULT 'SUPER_ADMIN',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try { db.exec(`ALTER TABLE admin_users ADD COLUMN full_name TEXT DEFAULT 'Director & Admissions Office';`); } catch(e) {}

  // Ensure default admin user exists
  const checkAdmin = db.prepare('SELECT id FROM admin_users WHERE username = ?');
  const existing = checkAdmin.get('admin');
  if (!existing) {
    const { salt, hash } = hashPassword('Avinya@2026!');
    const insertAdmin = db.prepare(`
      INSERT INTO admin_users (username, password_hash, salt, full_name, role)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertAdmin.run('admin', hash, salt, 'Director & Admissions Office', 'SUPER_ADMIN');
    console.log('[DB] Initialized default admin credentials (admin / Avinya@2026!)');
  }

  // Pre-seed sample realistic inquiries if empty so dashboard is alive
  const countInq = db.prepare('SELECT COUNT(*) as count FROM admissions_inquiries').get();
  if (countInq.count === 0) {
    const insertSample = db.prepare(`
      INSERT INTO admissions_inquiries 
      (app_no, student_name, parent_name, parent_email, parent_phone, grade_applied, dob, locality, previous_school, status, counselor_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertSample.run(
      'AVM-2026-001', 'Aarav Sharma', 'Rajesh Sharma', 'rajesh.sharma@example.com', '+91 98712 34567',
      'Class 1', '2020-04-12', 'Sant Nagar, Burari', 'First Step Playway', 'VISIT_SCHEDULED', 'Interested in sports curriculum and annual grade expansion roadmap.'
    );
    insertSample.run(
      'AVM-2026-002', 'Ananya Gupta', 'Pooja Gupta', 'pooja.gupta@example.com', '+91 99100 87654',
      'UKG', '2021-08-20', 'Kaushik Enclave, Burari', 'Little Angels Pre-School', 'CONTACTED', 'Requested details about school bus route from Shastri Park Extn.'
    );
    insertSample.run(
      'AVM-2026-003', 'Kabir Verma', 'Sunil Verma', 'sunil.v@example.com', '+91 98112 23344',
      'Nursery', '2022-02-15', 'Nathupura, Delhi', 'None (First School)', 'ENROLLED', 'Founders waiver granted. Welcome kit dispatched.'
    );
    insertSample.run(
      'AVM-2026-004', 'Meera Rao', 'Suresh Rao', 'suresh.rao@example.com', '+91 98109 44556',
      'Playgroup', '2023-01-10', 'Virander Nagar, Burari', 'None', 'PENDING', 'Close walking distance to 1-acre campus. Inquired about toddler security.'
    );
  }

  // Pre-seed sample campus tours
  const countTours = db.prepare('SELECT COUNT(*) as count FROM campus_tours').get();
  if (countTours.count === 0) {
    const insertTour = db.prepare(`
      INSERT INTO campus_tours 
      (booking_ref, parent_name, parent_phone, parent_email, preferred_date, preferred_time_slot, grade_interest, attendee_count, special_queries, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertTour.run('TOUR-2026-088', 'Dr. Meenakshi Iyer', '+91 98104 55112', 'meenakshi.iyer@example.com', '2026-10-14', 'Morning (9:30 AM - 11:00 AM)', 'Class 1', 3, 'Interested in STEM and outdoor sports turf.', 'CONFIRMED');
    insertTour.run('TOUR-2026-089', 'Gaurav Batra', '+91 98111 88990', 'gaurav.batra@example.com', '2026-10-15', 'Midday (11:30 AM - 1:00 PM)', 'LKG', 2, 'Requires campus tour of kindergarten sensory garden.', 'CONFIRMED');
  }

  // Pre-seed sample faculty job applicants
  const countJobs = db.prepare('SELECT COUNT(*) as count FROM job_applications').get();
  if (countJobs.count === 0) {
    const insertJob = db.prepare(`
      INSERT INTO job_applications 
      (app_id, candidate_name, email, phone, position_applied, qualification, experience_years, cover_note, resume_filename, resume_original_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertJob.run('AVM-FAC-2026-012', 'Sunita Rawat', 'sunita.rawat.edu@example.com', '+91 98109 23344', 'Pre-Primary / Nursery Educator', 'M.A., NTT & Montessori Certified', 5, 'Passionate early childhood educator with focus on joyful phonics and sensory mathematics.', null, null, 'SHORTLISTED');
    insertJob.run('AVM-FAC-2026-013', 'Rohit Chawla', 'rohit.sports@example.com', '+91 98711 44556', 'Physical Education & Athletics Coach', 'B.P.Ed, NIS Certified (Athletics)', 4, 'Coached sub-junior district athletics. Expertise in child safety and gross motor play.', null, null, 'NEW');
  }

  // Pre-seed sample alumni
  const countAlumni = db.prepare('SELECT COUNT(*) as count FROM alumni_members').get();
  if (countAlumni.count === 0) {
    const insertAlumni = db.prepare(`
      INSERT INTO alumni_members 
      (full_name, batch_year, email, phone, current_org, current_role, city, linkedin_url, mentorship_opt_in, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertAlumni.run('Priyanka Sharma', 2024, 'priyanka.s@example.com', '+91 98100 11223', 'IIT Delhi Tech Research', 'Robotics Systems Lead', 'New Delhi', 'https://linkedin.com', 1, 1);
    insertAlumni.run('Rohan Kapoor', 2023, 'rohan.k@example.com', '+91 98101 22334', 'All India Institute of Medical Sciences', 'Medical Scholar', 'New Delhi', 'https://linkedin.com', 1, 1);
  }

  // Pre-seed sample contact messages
  const countContacts = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get();
  if (countContacts.count === 0) {
    const insertMsg = db.prepare(`
      INSERT INTO contact_messages (ticket_id, name, email, phone, category, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertMsg.run('TICK-2026-041', 'Deepak Chopra', 'deepak.c@example.com', '+91 98115 67788', 'TRANSPORT', 'Bus Route Query', 'Could you please confirm if the school bus has a dedicated pickup stop near Sant Nagar Main Market?', 'UNREAD');
  }

  console.log('[DB] SQLite database fully initialized at', DB_PATH);
}

const queries = {
  // --- ADMISSIONS INQUIRIES ---
  createAdmission(data) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const app_no = `AVM-2026-${randomSuffix}`;
    const stmt = db.prepare(`
      INSERT INTO admissions_inquiries 
      (app_no, student_name, parent_name, parent_email, parent_phone, grade_applied, dob, locality, previous_school, status, counselor_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)
    `);
    stmt.run(
      app_no,
      data.studentName || data.student_name || '',
      data.parentName || data.parent_name || '',
      data.email || data.parent_email || '',
      data.phone || data.parent_phone || '',
      data.grade || data.grade_applied || '',
      data.dob || '',
      data.locality || '',
      data.previousSchool || data.previous_school || '',
      data.notes || data.counselor_notes || ''
    );
    return app_no;
  },

  createInquiry(data) {
    const app_no = this.createAdmission(data);
    return { success: true, app_no };
  },

  getAdmissions(filter = {}) {
    let sql = 'SELECT * FROM admissions_inquiries WHERE 1=1';
    const params = [];
    if (filter.status && filter.status !== 'ALL') {
      sql += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.grade && filter.grade !== 'ALL') {
      sql += ' AND grade_applied = ?';
      params.push(filter.grade);
    }
    sql += ' ORDER BY id DESC';
    return db.prepare(sql).all(...params);
  },

  getAllInquiries() {
    return this.getAdmissions();
  },

  updateAdmissionStatus(id, status, notes) {
    if (notes !== undefined) {
      db.prepare('UPDATE admissions_inquiries SET status = ?, counselor_notes = ? WHERE id = ?').run(status, notes, id);
    } else {
      db.prepare('UPDATE admissions_inquiries SET status = ? WHERE id = ?').run(status, id);
    }
    return true;
  },

  updateInquiryStatus(id, status, notes) {
    this.updateAdmissionStatus(id, status, notes);
    return { success: true };
  },

  // --- CAMPUS TOURS ---
  createTour(data) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const booking_ref = `TOUR-${randomSuffix}`;
    const stmt = db.prepare(`
      INSERT INTO campus_tours 
      (booking_ref, parent_name, parent_phone, parent_email, preferred_date, preferred_time_slot, grade_interest, attendee_count, special_queries, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')
    `);
    stmt.run(
      booking_ref,
      data.parentName || data.parent_name || '',
      data.phone || data.parent_phone || '',
      data.email || data.parent_email || '',
      data.date || data.preferred_date || '',
      data.timeSlot || data.preferred_time_slot || 'Morning (9:30 AM - 11:00 AM)',
      data.grade || data.grade_interest || 'Class 1',
      Number(data.attendees || data.attendee_count) || 2,
      data.notes || data.special_queries || ''
    );
    return booking_ref;
  },

  getTours() {
    return db.prepare('SELECT * FROM campus_tours ORDER BY id DESC').all();
  },

  getAllTours() {
    return this.getTours();
  },

  updateTourStatus(id, status) {
    db.prepare('UPDATE campus_tours SET status = ? WHERE id = ?').run(status, id);
    return { success: true };
  },

  // --- CAREERS & JOB APPLICATIONS ---
  createJobApplication(data) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const app_id = `AVM-FAC-2026-${randomSuffix}`;
    const stmt = db.prepare(`
      INSERT INTO job_applications 
      (app_id, candidate_name, email, phone, position_applied, qualification, experience_years, cover_note, resume_filename, resume_original_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `);
    stmt.run(
      app_id,
      data.candidateName || data.fullName || '',
      data.email || '',
      data.phone || '',
      data.position || data.position_applied || '',
      data.qualification || '',
      Number(data.experience || data.experience_years) || 0,
      data.coverNote || data.cover_note || '',
      data.resumeFilename || null,
      data.resumeOriginalName || null
    );
    return app_id;
  },

  getJobApplications() {
    return db.prepare('SELECT * FROM job_applications ORDER BY id DESC').all();
  },

  updateJobStatus(id, status) {
    db.prepare('UPDATE job_applications SET status = ? WHERE id = ?').run(status, id);
    return true;
  },

  // --- ALUMNI DIRECTORY ---
  createAlumni(data) {
    const stmt = db.prepare(`
      INSERT INTO alumni_members 
      (full_name, batch_year, email, phone, current_org, current_role, city, linkedin_url, mentorship_opt_in, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `);
    stmt.run(
      data.fullName || data.full_name || '',
      Number(data.batchYear || data.batch_year) || 2024,
      data.email || '',
      data.phone || '',
      data.currentOrg || data.current_org || '',
      data.currentRole || data.current_role || '',
      data.city || 'Delhi',
      data.linkedinUrl || data.linkedin_url || '',
      data.mentorship ? 1 : 0
    );
    return true;
  },

  getAlumni(onlyVerified = true) {
    if (onlyVerified) {
      return db.prepare('SELECT * FROM alumni_members WHERE is_verified = 1 ORDER BY batch_year DESC, id DESC').all();
    }
    return db.prepare('SELECT * FROM alumni_members ORDER BY id DESC').all();
  },

  // --- CONTACT MESSAGES ---
  createContactMessage(data) {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const ticket_id = `TICK-2026-${randomSuffix}`;
    const stmt = db.prepare(`
      INSERT INTO contact_messages 
      (ticket_id, name, email, phone, category, subject, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'UNREAD')
    `);
    stmt.run(
      ticket_id,
      data.name || '',
      data.email || '',
      data.phone || '',
      data.category || 'GENERAL',
      data.subject || '',
      data.message || ''
    );
    return ticket_id;
  },

  createContact(data) {
    return this.createContactMessage(data);
  },

  getContactMessages() {
    return db.prepare('SELECT * FROM contact_messages ORDER BY id DESC').all();
  },

  getAllContacts() {
    return this.getContactMessages();
  },

  updateContactStatus(id, status) {
    db.prepare('UPDATE contact_messages SET status = ? WHERE id = ?').run(status, id);
    return true;
  },

  // --- NEWSLETTER ---
  subscribeNewsletter(email) {
    try {
      const stmt = db.prepare('INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)');
      stmt.run(email);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // --- ADMIN AUTH & OVERVIEW STATS ---
  verifyAdminCredentials(username, password) {
    const user = db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
    if (!user) return null;
    if (verifyPassword(password, user.salt, user.password_hash)) {
      return { id: user.id, username: user.username, fullName: user.full_name || 'School Administrator', role: user.role };
    }
    return null;
  },

  getAdmin(username) {
    return db.prepare('SELECT * FROM admin_users WHERE username = ?').get(username);
  },

  getOverviewStats() {
    const totalAdmissions = db.prepare('SELECT COUNT(*) as c FROM admissions_inquiries').get().c;
    const pendingAdmissions = db.prepare("SELECT COUNT(*) as c FROM admissions_inquiries WHERE status = 'PENDING'").get().c;
    const enrolledCount = db.prepare("SELECT COUNT(*) as c FROM admissions_inquiries WHERE status = 'ENROLLED'").get().c;
    const totalTours = db.prepare('SELECT COUNT(*) as c FROM campus_tours').get().c;
    const totalJobs = db.prepare('SELECT COUNT(*) as c FROM job_applications').get().c;
    const unreadMessages = db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'UNREAD' OR status = 'NEW'").get().c;
    const totalAlumni = db.prepare('SELECT COUNT(*) as c FROM alumni_members').get().c;

    const recentAdmissions = db.prepare('SELECT * FROM admissions_inquiries ORDER BY id DESC LIMIT 5').all();
    const recentTours = db.prepare('SELECT * FROM campus_tours ORDER BY id DESC LIMIT 5').all();

    return {
      stats: {
        totalAdmissions,
        pendingAdmissions,
        enrolledCount,
        totalTours,
        totalJobs,
        unreadMessages,
        totalAlumni
      },
      recentAdmissions,
      recentTours
    };
  },

  getStats() {
    const ov = this.getOverviewStats();
    return {
      totalInquiries: ov.stats.totalAdmissions,
      enrolledCount: ov.stats.enrolledCount,
      pendingInquiries: ov.stats.pendingAdmissions,
      totalTours: ov.stats.totalTours,
      totalContacts: ov.stats.unreadMessages
    };
  }
};

module.exports = {
  db,
  initDb,
  queries,
  verifyPassword,
  hashPassword
};
