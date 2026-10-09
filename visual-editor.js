/**
 * AVINYA VIDYA MANDIR — IN-BROWSER VISUAL PAGE EDITOR (VANILLA JS)
 * Zero external dependencies. Works on all school pages.
 */
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const isEditorParam = urlParams.get('editor') === 'true';

  if (!isEditorParam && !window.__AVINYA_FORCE_EDITOR__) {
    return;
  }

  // Derive current filename
  let pageName = window.location.pathname.split('/').pop() || 'index.html';
  if (!pageName.endsWith('.html')) pageName = 'index.html';

  let isDirty = false;
  let isEditMode = true;
  let activeImageTarget = null;

  // Real Avinya photo presets from catalog
  const SCHOOL_ASSETS = [
    { name: 'Welcoming Campus Entrance', url: 'assets/images/school_photo_46.jpg' },
    { name: 'Sports Turf & Athletics Arena', url: 'assets/images/school_photo_13.jpg' },
    { name: 'Montessori Activity Classroom', url: 'assets/images/school_photo_01.jpg' },
    { name: 'Director & Foundational Students', url: 'assets/images/school_photo_45.jpg' },
    { name: 'Courtyard Garden & Assembly', url: 'assets/images/school_photo_28.jpg' },
    { name: 'Creative Arts & Fingerprinting', url: 'assets/images/school_photo_35.jpg' },
    { name: 'Theme Day Learning Exploration', url: 'assets/images/school_photo_49.jpg' },
    { name: 'Science Curiosity & Nature Walk', url: 'assets/images/school_photo_15.jpg' },
    { name: 'Amphitheater & Stage Arena', url: 'assets/images/school_photo_12.jpg' },
    { name: 'Admissions & Reception Lounge', url: 'assets/images/school_photo_44.jpg' },
    { name: 'Official Nav Crest Logo', url: 'assets/logo/logo-nav.png' },
    { name: 'Official School Crest', url: 'assets/logo/avinya-logo.png' }
  ];

  // 6 Pre-designed Avinya Section Components
  const SECTION_TEMPLATES = {
    feature_grid: {
      name: 'Panchakosha Feature Grid (3 Cards)',
      icon: '🌟',
      desc: 'Three pillar cards for facilities, curriculum highlights, or values.',
      html: `
    <section class="section" style="padding: 60px 0; background: #FFFFFF;">
      <div class="container">
        <div class="section-header" style="text-align: center; margin-bottom: 40px;">
          <span class="section-eyebrow">🌟 Panchakosha Excellence</span>
          <h2 class="section-title">Nurturing Every Dimension</h2>
          <p class="section-subtitle" style="max-width: 650px; margin: 0 auto;">Comprehensive growth through academic rigor, artistic expression, and moral character.</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
          <div class="pillar-card">
            <div class="pillar-icon" style="background:var(--saffron-100); color:var(--saffron-700);">🔬</div>
            <h3 class="pillar-title">Hands-On STEM &amp; Curiosity</h3>
            <p class="pillar-text">Interactive science and computing labs that transform curiosity into lively discovery.</p>
          </div>
          <div class="pillar-card">
            <div class="pillar-icon" style="background:var(--emerald-100); color:var(--emerald-700);">🎨</div>
            <h3 class="pillar-title">Creative &amp; Performing Arts</h3>
            <p class="pillar-text">Daily pottery, sketching, drama, and vocal studios that ignite imagination and self-confidence.</p>
          </div>
          <div class="pillar-card">
            <div class="pillar-icon" style="background:var(--gold-100); color:var(--gold-600);">🏃</div>
            <h3 class="pillar-title">Sports Turf &amp; Athletics</h3>
            <p class="pillar-text">Dedicated outdoor 1-acre sports ground building lifelong health, resilience, and team spirit.</p>
          </div>
        </div>
      </div>
    </section>`
    },
    stat_row: {
      name: 'Metric Counter Row (4 Stats)',
      icon: '📊',
      desc: 'High-contrast achievement band highlighting numerical metrics.',
      html: `
    <section class="section section-navy" style="padding: 50px 0;">
      <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; text-align: center;">
          <div>
            <div style="font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700; color: var(--gold-400); line-height: 1; margin-bottom: 8px;">1-Acre</div>
            <div style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF;">Green Campus</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">Dedicated educational plot</div>
          </div>
          <div>
            <div style="font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700; color: var(--gold-400); line-height: 1; margin-bottom: 8px;">1:15</div>
            <div style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF;">Teacher-Student Ratio</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">Individualized mentorship</div>
          </div>
          <div>
            <div style="font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700; color: var(--gold-400); line-height: 1; margin-bottom: 8px;">K-12</div>
            <div style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF;">Annual Expansion</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">CBSE-aligned progression</div>
          </div>
          <div>
            <div style="font-family: var(--font-serif); font-size: 2.8rem; font-weight: 700; color: var(--gold-400); line-height: 1; margin-bottom: 8px;">100%</div>
            <div style="font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #FFFFFF;">Child-Safe Campus</div>
            <div style="font-size: 0.85rem; color: #cbd5e1; margin-top: 4px;">Verified staff &amp; CCTV coverage</div>
          </div>
        </div>
      </div>
    </section>`
    },
    cta_banner: {
      name: 'Admissions Callout Banner',
      icon: '📢',
      desc: 'Call-to-action strip with direct action buttons.',
      html: `
    <section class="section" style="padding: 60px 0; background: linear-gradient(135deg, var(--navy-900) 0%, var(--emerald-800) 100%); color: #FFFFFF;">
      <div class="container" style="text-align: center; max-width: 800px;">
        <span class="badge-tag" style="background: rgba(255,255,255,0.15); color: #FFFFFF;">Admissions Open 2026–27</span>
        <h2 style="font-family: var(--font-serif); font-size: clamp(2rem, 3.5vw, 2.7rem); margin: 16px 0 12px; color: #FFFFFF;">Begin Your Child’s Journey at Avinya</h2>
        <p style="font-size: 1.05rem; color: #d8e5f3; margin-bottom: 28px;">Tour our 1-acre campus in Burari, meet our educators, and claim the Founders' Admission Fee Waiver.</p>
        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary btn-lg" data-open-modal="tour">Schedule Campus Tour</button>
          <a href="https://avinyaschool.dharamgraphics.in/" target="_blank" rel="noopener" class="btn btn-tour-360 btn-lg">🌐 Launch 360° Tour</a>
        </div>
      </div>
    </section>`
    }
  };

  // Toast Notification
  function showToast(msg, type = 'success') {
    let toast = document.querySelector('.avinya-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'avinya-toast';
      document.body.appendChild(toast);
    }
    toast.className = `avinya-toast ${type}`;
    toast.innerHTML = (type === 'success' ? '✅ ' : '⚠️ ') + msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3500);
  }

  function markDirty() {
    isDirty = true;
    const pill = document.querySelector('.avinya-dirty-pill');
    if (pill) pill.style.display = 'inline-block';
  }

  // Inject Stylesheet if not already present
  if (!document.querySelector('link[href*="visual-editor.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'visual-editor.css';
    document.head.appendChild(link);
  }

  // Create Editor Dock
  function createDock() {
    document.body.classList.add('avinya-editor-active', 'avinya-edit-mode');

    const dock = document.createElement('div');
    dock.id = 'avinyaVisualEditorDock';
    dock.innerHTML = `
      <div class="avinya-dock-left">
        <div class="avinya-editor-brand">
          <img src="assets/logo/logo-nav.png" alt="Avinya Crest">
          <span>Avinya Editor</span>
        </div>
        <span class="avinya-page-badge">${pageName}</span>
        <span class="avinya-dirty-pill">● Unsaved Changes</span>
      </div>

      <div class="avinya-dock-center">
        <div class="avinya-mode-toggle">
          <button class="avinya-mode-btn active" id="btnModeEdit">✏️ Edit Mode</button>
          <button class="avinya-mode-btn" id="btnModePreview">👁️ Preview</button>
        </div>
        <button class="avinya-dock-btn" id="btnAddSection">➕ Add Section</button>
      </div>

      <div class="avinya-dock-right">
        <button class="avinya-dock-btn" id="btnExitEditor">✕ Exit</button>
        <button class="avinya-dock-btn btn-save" id="btnSavePage">💾 Save &amp; Publish</button>
      </div>
    `;
    document.body.appendChild(dock);

    // Create Component Drawer
    const drawer = document.createElement('div');
    drawer.id = 'avinyaComponentDrawer';
    drawer.innerHTML = `
      <div class="avinya-drawer-header">
        <div class="avinya-drawer-title">🧩 Insert Section Component</div>
        <button class="avinya-drawer-close" id="btnCloseDrawer">✕</button>
      </div>
      <div class="avinya-drawer-body">
        ${Object.entries(SECTION_TEMPLATES).map(([key, tpl]) => `
          <div class="avinya-component-item" data-template="${key}">
            <div class="avinya-component-title">${tpl.icon} ${tpl.name}</div>
            <div class="avinya-component-desc">${tpl.desc}</div>
          </div>
        `).join('')}
      </div>
    `;
    document.body.appendChild(drawer);

    // Create Image Replace Modal
    const modal = document.createElement('div');
    modal.id = 'avinyaImageModal';
    modal.innerHTML = `
      <div class="avinya-modal-box">
        <div class="avinya-modal-header">
          <h3>🖼️ Replace Image</h3>
          <button class="avinya-drawer-close" id="btnCloseImgModal">✕</button>
        </div>
        <div class="avinya-modal-body">
          <div class="avinya-upload-dropzone" id="imgDropzone">
            <div style="font-size: 2rem; margin-bottom: 6px;">📁</div>
            <strong>Click to upload new image</strong> or drag and drop here
            <div style="font-size: 11px; color: #888; margin-top: 4px;">Supports JPG, PNG, WEBP, SVG</div>
            <input type="file" id="imgFileInput" accept="image/*" style="display:none;">
          </div>
          <h4 style="font-size: 13px; margin: 16px 0 10px; color: var(--editor-navy);">Choose from School Photo Presets:</h4>
          <div class="avinya-preset-grid">
            ${SCHOOL_ASSETS.map(asset => `
              <div class="avinya-preset-thumb" data-src="${asset.url}" title="${asset.name}">
                <img src="${asset.url}" alt="${asset.name}">
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Bind Dock Events
    document.getElementById('btnModeEdit').addEventListener('click', () => setEditMode(true));
    document.getElementById('btnModePreview').addEventListener('click', () => setEditMode(false));
    document.getElementById('btnAddSection').addEventListener('click', () => {
      drawer.classList.toggle('open');
    });
    document.getElementById('btnCloseDrawer').addEventListener('click', () => {
      drawer.classList.remove('open');
    });
    document.getElementById('btnExitEditor').addEventListener('click', () => {
      if (isDirty && !confirm('You have unsaved changes. Exit editor mode?')) return;
      window.location.href = pageName;
    });
    document.getElementById('btnSavePage').addEventListener('click', savePage);

    // Component Insertion
    drawer.querySelectorAll('.avinya-component-item').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-template');
        const tpl = SECTION_TEMPLATES[key];
        if (tpl) {
          const div = document.createElement('div');
          div.innerHTML = tpl.html.trim();
          const target = document.querySelector('main') || document.querySelector('section') || document.body;
          target.appendChild(div.firstChild);
          drawer.classList.remove('open');
          makeElementsEditable();
          markDirty();
          showToast(`Inserted "${tpl.name}" into page!`);
        }
      });
    });

    // Image Modal Events
    document.getElementById('btnCloseImgModal').addEventListener('click', () => {
      modal.classList.remove('active');
    });
    modal.querySelectorAll('.avinya-preset-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const src = thumb.getAttribute('data-src');
        if (activeImageTarget) {
          activeImageTarget.src = src;
          markDirty();
          modal.classList.remove('active');
          showToast('Image updated successfully.');
        }
      });
    });

    // File Upload via Dropzone
    const dropzone = document.getElementById('imgDropzone');
    const fileInput = document.getElementById('imgFileInput');
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) handleImageUpload(file);
    });
  }

  function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Data = e.target.result;
      try {
        const res = await fetch('/api/editor/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, base64Data })
        });
        const data = await res.json();
        if (data.success && data.imageUrl) {
          if (activeImageTarget) {
            activeImageTarget.src = data.imageUrl;
            markDirty();
          }
          document.getElementById('avinyaImageModal').classList.remove('active');
          showToast('Image uploaded and applied!');
        } else {
          showToast(data.error || 'Failed to upload image.', 'error');
        }
      } catch (err) {
        showToast('Image upload failed.', 'error');
      }
    };
    reader.readAsDataURL(file);
  }

  function setEditMode(edit) {
    isEditMode = edit;
    const btnEdit = document.getElementById('btnModeEdit');
    const btnPrev = document.getElementById('btnModePreview');
    if (edit) {
      document.body.classList.add('avinya-edit-mode');
      btnEdit.classList.add('active');
      btnPrev.classList.remove('active');
    } else {
      document.body.classList.remove('avinya-edit-mode');
      btnPrev.classList.add('active');
      btnEdit.classList.remove('active');
    }
  }

  function makeElementsEditable() {
    const targets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span.section-eyebrow, span.badge-tag, a.btn, button.btn');
    targets.forEach(el => {
      if (el.closest('#avinyaVisualEditorDock') || el.closest('#avinyaComponentDrawer') || el.closest('#avinyaImageModal')) return;
      el.setAttribute('contenteditable', 'true');
      el.addEventListener('input', markDirty);
    });

    document.querySelectorAll('img').forEach(img => {
      if (img.closest('#avinyaVisualEditorDock') || img.closest('#avinyaComponentDrawer') || img.closest('#avinyaImageModal')) return;
      img.addEventListener('click', (e) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.stopPropagation();
        activeImageTarget = img;
        document.getElementById('avinyaImageModal').classList.add('active');
      });
    });
  }

  async function savePage() {
    const btn = document.getElementById('btnSavePage');
    btn.textContent = '⏳ Saving...';
    btn.disabled = true;

    // Clone doc and strip editor chrome before saving
    const clone = document.documentElement.cloneNode(true);

    const dock = clone.querySelector('#avinyaVisualEditorDock');
    if (dock) dock.remove();
    const drawer = clone.querySelector('#avinyaComponentDrawer');
    if (drawer) drawer.remove();
    const modal = clone.querySelector('#avinyaImageModal');
    if (modal) modal.remove();
    const toast = clone.querySelector('.avinya-toast');
    if (toast) toast.remove();

    clone.classList.remove('avinya-editor-active', 'avinya-edit-mode');
    const body = clone.querySelector('body');
    if (body) {
      body.classList.remove('avinya-editor-active', 'avinya-edit-mode');
      body.style.paddingTop = '';
    }

    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));

    const htmlContent = '<!DOCTYPE html>\n<html lang="en">' + clone.innerHTML + '</html>';

    try {
      const res = await fetch('/api/editor/save-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: pageName, htmlContent })
      });
      const data = await res.json();
      if (data.success) {
        isDirty = false;
        const pill = document.querySelector('.avinya-dirty-pill');
        if (pill) pill.style.display = 'none';
        showToast('Page published successfully with backup!');
      } else {
        showToast(data.error || 'Failed to save page.', 'error');
      }
    } catch (err) {
      showToast('Error communicating with server.', 'error');
    } finally {
      btn.textContent = '💾 Save & Publish';
      btn.disabled = false;
    }
  }

  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    createDock();
    makeElementsEditable();
  });
})();
