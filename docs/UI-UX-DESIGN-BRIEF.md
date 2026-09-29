# Avinya Vidya Mandir — UI/UX Design Brief

## 1. Experience Goal
The website should feel like a digital visit to Avinya Vidya Mandir: warm, refined, trustworthy, child-centred, rooted in Indian values, and forward-looking.
Primary journey: Discover → Understand → Experience → Trust → Visit → Enquire
Primary conversion actions: Book a Visit, WhatsApp Us, Enquire Now

## 2. Visual Direction
Design character: boutique rather than generic school-template; editorial and photographic rather than illustration-heavy; warm, calm, refined, intelligent, and welcoming; modern education with visible cultural grounding; real Avinya photography as the primary visual asset.
Brand tokens: Crest Navy #0B2038; Sage / Seafoam Teal #4EA685; Sunrise Amber #F7B538; Terracotta #E05A36; Warm Alabaster #FDFBF7; Border Cream #EAE6DF.
Typography: Display / headings = Cinzel; Body / UI = Plus Jakarta Sans.

## 3. Brand Motifs
Use the official Avinya crest consistently in the sticky header, footer, favicon / metadata, and selected branded UI states.
The four crest quadrants should inform a recurring ethos system: Rooted in Values; Rising in Excellence; Holistic Development; Nurturing Care.
Use Sanskrit as an editorial layer, not decoration. Curated examples: विद्यां ददाति विनयम्; विद्यारम्भं करिष्यामि...; गुरुर्ब्रह्मा गुरुर्विष्णुः...; असतो मा सद्गमय...; चरैवेति चरैवेति.
Every Sanskrit verse published in production must have its source / attribution verified.

## 4. Global Navigation
Desktop: Logo | About Us | Academics | Campus | Care & Safety | Admissions | Contact | Book a Visit
Mobile: compact sticky header, slide-out navigation, persistent bottom utility bar, WhatsApp Us, Book Visit.
Minimum touch target: 48px.

## 5. Homepage UX
Recommended sequence: Announcement strip; Hero with real Avinya photography; Motto / positioning; 1:10 mentorship story; Academic Spectrum; Experiential learning; Care & Safety; Campus photography; 360° virtual tour; K–12 journey; Life at Avinya; Admissions / Book Visit CTA; Contact / location; Footer.
Hero should keep the message simple: Rooted in Values, Rising in Excellence, with a supporting message focused on a thoughtful foundational beginning.

## 6. Core Interaction Patterns
Book Visit modal: Parent Name; WhatsApp / Phone; Grade Applying For; Preferred Visit Date.
Modal requirements: keyboard accessible, focus trap, Escape to close, inline validation, mobile full-height or bottom-sheet adaptation when useful.
Academic Spectrum tabs: Pre-Nursery | Nursery | LKG | UKG | Class 1. Changing a tab updates the content in place without page reload.
Campus Gallery filters: Smart Labs | Play Turf | Classrooms | Discovery Studios.
Lightbox: full-screen image, caption, accessible close, previous / next, Book Visit CTA.
360° Tour: embed https://avinyaschool.dharamgraphics.in/ using a reusable VirtualTour component, with a graceful fallback link if embedding is blocked.

## 7. Page Architecture
Public: /, /about, /academics, /journey, /campus, /care-and-safety, /life-at-avinya, /faculty, /admissions, /visit, /news, /news/[slug], /gallery, /contact.
Footer / legal: /mandatory-disclosure, /privacy-policy, /terms, /accessibility.
Admin: /admin/login, /admin, /admin/inquiries, /admin/inquiries/[id], /admin/builder, /admin/media, /admin/content, /admin/settings, /admin/audit.

## 8. Mobile UX
Design mobile-first. Priorities: thumb-friendly actions, short readable sections, high-quality image cropping, sticky conversion actions, minimal horizontal scrolling, accessible accordions for dense content, and a touch-friendly 360° viewer.
Avoid tiny pill navigation, desktop layouts simply stacked vertically, huge autoplay video backgrounds, excessive animation, and long uninterrupted text blocks.

## 9. Photography Rules
Only use school-approved real Avinya imagery for production.
Preferred imagery: real children learning; teacher-child interaction; classrooms; smart learning; play and gross-motor activity; discovery studios; cultural moments; campus details; events.
Images should be curated, captioned, have alt text, and be optimized for responsive delivery.
Recommended media metadata: Category; Caption; Alt text; Featured; Web Approved; Published; Sort order.

## 10. Accessibility / Quality
Target: semantic HTML; keyboard navigation; visible focus states; accessible dialogs and lightboxes; correct heading hierarchy; sufficient contrast; reduced-motion support; 48px+ touch targets; accessible forms and errors.

## 11. Content / Publishing UX
Admin editing should use structured sections, not a free-form page builder.
Publishing flow: Draft → Preview → Publish.
Important publish actions should be auditable.

## 12. Design Principle
The school itself is the hero.
Prefer real photography + typography + space + restrained motion + clear information.
Avoid stock imagery, generic school illustrations, visual clutter, excessive gradients, or feature lists without the human story behind them.