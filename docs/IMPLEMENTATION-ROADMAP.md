# Avinya Vidya Mandir — Implementation Roadmap

## Phase 1 — UI/UX Foundation
- Design system tokens
- Responsive layout primitives
- Global header / footer / mobile utility bar
- Button, card, modal and form primitives
- Typography and brand implementation

## Phase 2 — Homepage Experience
- Hero using approved school photography
- Motto and four-part ethos
- 1:10 mentorship story
- Academic Spectrum
- Experiential learning
- Care & Safety
- K–12 trajectory
- 360° tour
- Visit CTA

## Phase 3 — Public Information Architecture
- About
- Academics
- Journey
- Campus
- Care & Safety
- Life at Avinya
- Faculty
- Admissions
- Visit
- News
- Gallery
- Contact
- Compliance / legal pages

## Phase 4 — Admissions Platform
- PostgreSQL + Prisma
- Inquiry model and lifecycle
- Validation and consent
- Book Visit persistence
- Inquiry detail timeline
- WhatsApp / phone actions
- CSV export

## Phase 5 — Content & Media
- Media library
- Web-approved flag
- Structured page content
- News / events
- Gallery categorisation
- Alt text and captions

## Phase 6 — Admin Platform
- Authentication
- Roles
- Dashboard
- Inquiries
- Builder
- Media
- Content
- Settings
- Audit log

## Phase 7 — Publishing
- Draft
- Preview
- Publish
- Published version
- Audit trail
- Rollback

## Phase 8 — Quality & Launch
- Accessibility
- SEO
- Image optimisation
- Anti-spam / rate limiting
- Analytics
- Error monitoring
- CI
- Production deployment at avinyaschool.com

## Asset rule
Production pages should use only school-approved Avinya photography. The initial homepage expects:
- /images/hero.jpg
- /images/classroom.jpg

The complete approved media set should later be organised into category folders and connected to the Media Library.
