const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function runAudit() {
  console.log('======================================================================');
  console.log('🧪 Starting Avinya Vidya Mandir Comprehensive Parity & Production Audit');
  console.log('======================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Static Assets & 81 Real Photos Verification
  console.log('\n[1] Verifying Static Assets, Logo & Real School Photos...');
  assert(fs.existsSync(path.join(__dirname, 'assets', 'logo', 'logo-nav.png')), 'Navbar logo exists');
  assert(fs.existsSync(path.join(__dirname, 'assets', 'logo', 'favicon.png')), 'Favicon exists');
  assert(fs.existsSync(path.join(__dirname, 'assets', 'images', 'catalog.json')), 'Gallery catalog.json exists');
  assert(fs.existsSync(path.join(__dirname, 'sitemap.xml')), 'sitemap.xml exists');
  assert(fs.existsSync(path.join(__dirname, 'robots.txt')), 'robots.txt exists');
  assert(fs.existsSync(path.join(__dirname, 'Dockerfile')), 'Dockerfile exists');
  assert(fs.existsSync(path.join(__dirname, 'docker-compose.yml')), 'docker-compose.yml exists');
  assert(fs.existsSync(path.join(__dirname, 'DEPLOYMENT.md')), 'DEPLOYMENT.md exists');

  const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets', 'images', 'catalog.json')));
  assert(catalog.length === 81, `Catalog contains all 81 photos (found ${catalog.length})`);

  let allImagesOnDisk = true;
  for (const item of catalog) {
    if (!fs.existsSync(path.join(__dirname, item.web_src)) || !fs.existsSync(path.join(__dirname, item.thumb_src))) {
      allImagesOnDisk = false;
      break;
    }
  }
  assert(allImagesOnDisk, 'All 81 web images and thumbnails verified on disk');

  // 2. Test All 19 HTML Pages and Core Assets
  console.log('\n[2] Testing All 19 HTML Pages & Core Web Assets...');

  const pages = [
    '/',
    '/index.html',
    '/about.html',
    '/academics.html',
    '/admissions.html',
    '/campus.html',
    '/student-life.html',
    '/gallery.html',
    '/contact.html',
    '/news-events.html',
    '/mandatory-disclosure.html',
    '/parents.html',
    '/careers.html',
    '/alumni.html',
    '/calendar.html',
    '/robotics-lab.html',
    '/privacy-policy.html',
    '/terms.html',
    '/404.html',
    '/admin.html',
    '/styles.css',
    '/script.js',
    '/visual-editor.css',
    '/visual-editor.js',
    '/sitemap.xml',
    '/robots.txt'
  ];

  for (const p of pages) {
    try {
      const res = await fetch(`${BASE_URL}${p}`);
      assert(res.status === 200, `Page/Asset ${p} returned HTTP 200`);
    } catch (e) {
      assert(false, `Page/Asset ${p} fetch failed: ${e.message}`);
    }
  }

  // 3. Test Gallery API
  console.log('\n[3] Testing /api/gallery API...');
  try {
    const res = await fetch(`${BASE_URL}/api/gallery`);
    const data = await res.json();
    assert(res.status === 200 && Array.isArray(data) && data.length === 81, 'API /api/gallery returns 81 cataloged photos');
  } catch (e) {
    assert(false, `Gallery API failed: ${e.message}`);
  }

  // 4. Test Admissions Inquiry API
  console.log('\n[4] Testing /api/admissions/apply Submission...');
  try {
    const postRes = await fetch(`${BASE_URL}/api/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: 'Avinya Parity Test Child',
        parent_name: 'Parity Test Parent',
        parent_phone: '+91 99111 02005',
        parent_email: 'audit.parent@avinyaschool.com',
        grade_applied: 'Class 1',
        locality: '35-17/2 Virander Nagar Burari'
      })
    });
    const postData = await postRes.json();
    const appRef = postData.appNo || postData.app_no || postData.refNumber;
    assert(postRes.status === 201 && postData.success && appRef && appRef.startsWith('AVM-'), `Admissions inquiry created with Ref: ${appRef}`);
  } catch (e) {
    assert(false, `Admissions inquiry submission failed: ${e.message}`);
  }

  // 5. Test Campus Walkthrough Booking API
  console.log('\n[5] Testing /api/tours/book Walkthrough Booking...');
  try {
    const tourRes = await fetch(`${BASE_URL}/api/tours/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parent_name: 'Campus Tour Parent',
        parent_phone: '+91 99111 02005',
        parent_email: 'tour.parent@avinyaschool.com',
        preferred_date: '2026-11-20',
        preferred_time_slot: 'Morning (9:30 AM - 11:00 AM)',
        grade_interest: 'Playgroup'
      })
    });
    const tourData = await tourRes.json();
    const tourRef = tourData.bookingRef || tourData.booking_ref;
    assert(tourRes.status === 201 && tourData.success && tourRef && tourRef.startsWith('TOUR-'), `Walkthrough booked with Ref: ${tourRef}`);
  } catch (e) {
    assert(false, `Tour booking failed: ${e.message}`);
  }

  // 6. Test Careers & Resume Upload API
  console.log('\n[6] Testing /api/careers/apply Recruitment Application...');
  try {
    const careerRes = await fetch(`${BASE_URL}/api/careers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateName: 'Dr. Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 99111 99111',
        position: 'Foundational Early Years Educator',
        qualification: 'M.Ed / ECCE Diploma',
        experience: '5 years',
        coverNote: 'Passionate about play-way pedagogy and foundational literacy.',
        resumeBase64: 'data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjggMDAwMDAgbiAKMDAwMDAwMDEyNSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE3OQolJUVPRg==',
        resumeFilename: 'aarav_sharma_cv.pdf'
      })
    });
    const careerData = await careerRes.json();
    const appId = careerData.appId || careerData.applicationRef;
    assert(careerRes.status === 201 && careerData.success && appId && (appId.startsWith('APP-') || appId.startsWith('AVM-')), `Career application submitted with Ref: ${appId}`);
  } catch (e) {
    assert(false, `Career application failed: ${e.message}`);
  }

  // 7. Test Alumni Network APIs (/api/alumni/register & /api/alumni/directory)...
  console.log('\n[7] Testing Alumni Network APIs (/api/alumni/register & /api/alumni/directory)...');
  try {
    const regRes = await fetch(`${BASE_URL}/api/alumni/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Meera Deshmukh',
        batchYear: 2021,
        email: 'meera.deshmukh@example.com',
        phone: '+91 99111 88888',
        currentOrg: 'IIT Delhi',
        currentRole: 'Computer Science Scholar',
        city: 'Delhi',
        linkedinUrl: 'https://linkedin.com/in/meera-deshmukh',
        mentorship: true
      })
    });
    const regData = await regRes.json();
    assert(regRes.status === 201 && regData.success, `Alumni registered successfully: ${regData.message}`);

    const dirRes = await fetch(`${BASE_URL}/api/alumni/directory`);
    const dirData = await dirRes.json();
    const alumniList = Array.isArray(dirData) ? dirData : (dirData.alumni || []);
    assert(dirRes.status === 200 && alumniList.length > 0, `Alumni directory returns ${alumniList.length} active alumni records`);
  } catch (e) {
    assert(false, `Alumni APIs failed: ${e.message}`);
  }

  // 8. Test Contact & Newsletter APIs
  console.log('\n[8] Testing /api/contact/send & /api/newsletter APIs...');
  try {
    const contactRes = await fetch(`${BASE_URL}/api/contact/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Rohan Mehra',
        email: 'rohan.mehra@example.com',
        phone: '+91 99111 77777',
        category: 'ADMISSIONS',
        message: 'Inquiring about bus routes to Virander Nagar.'
      })
    });
    const contactData = await contactRes.json();
    const ticketId = contactData.ticketId || contactData.ticket_id;
    assert(contactRes.status === 201 && contactData.success && ticketId, `Contact ticket generated: ${ticketId}`);

    const newsRes = await fetch(`${BASE_URL}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'newsletter.test@avinyaschool.com' })
    });
    const newsData = await newsRes.json();
    assert((newsRes.status === 200 || newsRes.status === 201) && newsData.success, 'Newsletter subscription successful');
  } catch (e) {
    assert(false, `Contact/Newsletter APIs failed: ${e.message}`);
  }

  // 9. Test SEO Real-Time Audit Engine
  console.log('\n[9] Testing Live SEO Audit Engine (/api/seo-audit/run)...');
  try {
    const seoRes = await fetch(`${BASE_URL}/api/seo-audit/run`);
    const seoData = await seoRes.json();
    const pagesCount = seoData.totalPagesAudited || seoData.pagesAudited || 0;
    assert(seoRes.status === 200 && typeof seoData.overallScore === 'number', `SEO Audit Score: ${seoData.overallScore}/100 across ${pagesCount} pages`);
  } catch (e) {
    assert(false, `SEO audit engine failed: ${e.message}`);
  }

  // 10. Test Admin Authentication & Visual Page Editor APIs
  console.log('\n[10] Testing Admin Auth, Visual CMS & Overview APIs...');
  try {
    const authRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'Avinya@2026!'
      })
    });
    const authData = await authRes.json();
    assert(authRes.status === 200 && authData.success && authData.token, 'Super-admin authenticated with JWT session token');

    const authHeaders = { 'Authorization': `Bearer ${authData.token}` };

    // Overview KPIs
    const overviewRes = await fetch(`${BASE_URL}/api/admin/overview`, { headers: authHeaders });
    const overviewData = await overviewRes.json();
    const totalAdm = overviewData.stats?.totalAdmissions || overviewData.metrics?.totalInquiries || 0;
    assert(overviewRes.status === 200 && totalAdm > 0, `Admin Overview metrics verified: ${totalAdm} admissions in system`);

    // Visual Editor Pages
    const pagesRes = await fetch(`${BASE_URL}/api/editor/pages`, { headers: authHeaders });
    const pagesData = await pagesRes.json();
    assert(pagesRes.status === 200 && Array.isArray(pagesData.pages) && pagesData.pages.length >= 17, `Visual Page Editor lists ${pagesData.pages.length} editable site pages`);

    // CSV Data Exports
    const exportRes = await fetch(`${BASE_URL}/api/admin/export/admissions`, { headers: authHeaders });
    const exportCsv = await exportRes.text();
    assert(exportRes.status === 200 && exportCsv.includes('Application No'), 'Admissions CSV Export successfully exported');
  } catch (e) {
    assert(false, `Admin / Visual CMS APIs failed: ${e.message}`);
  }

  console.log('\n======================================================================');
  console.log(`📊 Final Audit Result: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
