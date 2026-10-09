const http = require('node:http');

const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;

async function runSecurityAudit() {
  console.log('======================================================================');
  console.log('🔒 Running Avinya Vidya Mandir Security & Vulnerability Test Suite');
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

  // 1. Database & Source Code Download Protection (CWE-200, CWE-552)
  console.log('[1] Testing Information Disclosure & Sensitive File Download Protections...');
  const blockedPaths = [
    '/school.db',
    '/server.js',
    '/db.js',
    '/package.json',
    '/package-lock.json',
    '/.env.example',
    '/backups/pages',
    '/Dockerfile',
    '/test-audit.js'
  ];

  for (const p of blockedPaths) {
    try {
      const res = await fetch(`${BASE_URL}${p}`);
      assert(res.status === 403, `Blocked access to ${p} (returned HTTP ${res.status})`);
    } catch (e) {
      assert(false, `Request to ${p} failed: ${e.message}`);
    }
  }

  // 2. Path Traversal Protection (CWE-22)
  console.log('\n[2] Testing Directory Traversal Defenses...');
  const traversalPaths = [
    '/..%2fpackage.json',
    '/%2e%2e/school.db',
    '/assets/../../server.js',
    '/uploads/../../db.js'
  ];

  for (const p of traversalPaths) {
    try {
      const res = await fetch(`${BASE_URL}${p}`);
      assert(res.status === 403 || res.status === 404, `Directory traversal ${p} rejected with HTTP ${res.status}`);
    } catch (e) {
      assert(false, `Traversal test ${p} failed: ${e.message}`);
    }
  }

  // 3. Resume PII Access Control (CWE-306)
  console.log('\n[3] Testing Candidate Resume Document Authorization...');
  try {
    const unauthRes = await fetch(`${BASE_URL}/uploads/resumes/cv_1791553419261_aarav_sharma_cv.pdf`);
    assert(unauthRes.status === 401, `Unauthenticated resume access correctly rejected with HTTP 401`);

    // Authenticate as admin
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Avinya@2026!' })
    });
    const loginData = await loginRes.json();
    assert(loginData.success && !!loginData.token, 'Staff session authenticated');

    const authRes = await fetch(`${BASE_URL}/uploads/resumes/cv_1791553419261_aarav_sharma_cv.pdf`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    assert(authRes.status === 200, `Authenticated staff session successfully permitted to view resume (HTTP 200)`);
  } catch (e) {
    assert(false, `Resume access control test failed: ${e.message}`);
  }

  // 4. Security Headers & CSP (CWE-346, CWE-1021)
  console.log('\n[4] Testing HTTP Security Headers & Content-Security-Policy...');
  try {
    const res = await fetch(`${BASE_URL}/`);
    const csp = res.headers.get('content-security-policy') || '';
    const nosniff = res.headers.get('x-content-type-options');
    const xframe = res.headers.get('x-frame-options');
    const refPolicy = res.headers.get('referrer-policy');
    const permPolicy = res.headers.get('permissions-policy');

    assert(csp.includes("default-src 'self'"), 'Content-Security-Policy enforces default-src \'self\'');
    assert(csp.includes("frame-src"), 'Content-Security-Policy restricts frame-src to authorized maps and 360 tour');
    assert(nosniff === 'nosniff', 'X-Content-Type-Options: nosniff header verified');
    assert(xframe === 'SAMEORIGIN', 'X-Frame-Options: SAMEORIGIN header verified');
    assert(refPolicy === 'strict-origin-when-cross-origin', 'Referrer-Policy header verified');
    assert(permPolicy && permPolicy.includes('camera=()'), 'Permissions-Policy header verified');
  } catch (e) {
    assert(false, `Security header check failed: ${e.message}`);
  }

  // 5. CSV Export Formula Injection Sanitization (CWE-1236)
  console.log('\n[5] Testing CSV Export Neutralization against Formula Injection...');
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Avinya@2026!' })
    });
    const loginData = await loginRes.json();

    // Inject inquiry with spreadsheet formula symbols
    const testPayload = {
      student_name: '=SUM(1+1)',
      parent_name: '+9911102005',
      parent_phone: '+91 99111 02005',
      parent_email: '@formula.attack@example.com',
      grade_applied: 'Class 1',
      locality: '-Burari Delhi'
    };

    const inqRes = await fetch(`${BASE_URL}/api/admissions/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload)
    });
    const inqData = await inqRes.json();
    assert(inqData.success, 'Test inquiry created');

    const csvRes = await fetch(`${BASE_URL}/api/admin/export/admissions`, {
      headers: { 'Authorization': `Bearer ${loginData.token}` }
    });
    const csvContent = await csvRes.text();

    assert(csvContent.includes("\"'=SUM(1+1)\""), 'Formula =SUM(1+1) neutralized with leading quote');
    assert(csvContent.includes("\"'+9911102005\""), 'Formula +9911102005 neutralized with leading quote');
    assert(csvContent.includes("\"'@formula.attack@example.com\""), 'Formula @formula.attack neutralized with leading quote');
    assert(csvContent.includes("\"'-Burari Delhi\""), 'Formula -Burari Delhi neutralized with leading quote');
  } catch (e) {
    assert(false, `CSV sanitization check failed: ${e.message}`);
  }

  // 6. SVG Upload Restriction (CWE-434, Stored XSS)
  console.log('\n[6] Testing Image Upload Validation & SVG Restriction...');
  try {
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'Avinya@2026!' })
    });
    const loginData = await loginRes.json();

    const svgUploadRes = await fetch(`${BASE_URL}/api/editor/upload-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      },
      body: JSON.stringify({
        filename: 'malicious.svg',
        base64Data: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>').toString('base64')
      })
    });
    assert(svgUploadRes.status === 400, 'SVG image upload correctly rejected (HTTP 400)');
  } catch (e) {
    assert(false, `SVG upload test failed: ${e.message}`);
  }

  console.log('\n======================================================================');
  console.log(`🛡️  Security Audit Result: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runSecurityAudit();
