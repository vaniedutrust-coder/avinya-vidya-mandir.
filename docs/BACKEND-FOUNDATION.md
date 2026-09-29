# Avinya Website Backend Foundation

## Objective

Move the Avinya public website from prototype interactions to a production-ready school communications platform without coupling the public website to private school ERP data.

## Recommended architecture

- **Next.js 16 App Router** — public website, server actions and route handlers.
- **PostgreSQL** — production relational database.
- **Prisma** — schema, migrations and typed database access.
- **Supabase Auth** — admin authentication only.
- **Supabase Storage** — approved school media where appropriate.
- **Vercel** — application hosting and deployment.
- **Server-side authorization** — never trust role, school or record identifiers supplied by the browser.

## First backend release

### 1. Visit / enquiry capture

Tables:

- `visit_requests`
- `inquiries`

Required visit fields:

- parent name
- phone / WhatsApp
- grade
- preferred date
- consent
- source
- status
- created_at
- updated_at

Inquiry fields should additionally support:

- email
- message
- source
- status
- assigned_to
- notes
- last_contacted_at

Suggested statuses:

`new`, `contacted`, `visit_scheduled`, `visited`, `application_started`, `admitted`, `closed`

### 2. Admin

Use Supabase Auth for credentials. Keep application authorization in an application-owned profile table.

Roles:

- `super_admin`
- `admin`
- `admissions`
- `editor`

Every privileged mutation must be authorized server-side and written to `audit_logs`.

### 3. Content

Structured CMS tables:

- `content_pages`
- `content_sections`
- `media_assets`
- `site_settings`

The public site should read only published content. Draft and preview content must never leak through public endpoints.

### 4. Media

Each asset should store:

- path
- category
- caption
- alt_text
- featured
- web_approved
- published
- sort_order
- uploaded_by
- created_at

Identifiable children should never be published without the school's approval.

### 5. Audit

Record:

- actor
- action
- entity type
- entity id
- before JSON
- after JSON
- IP metadata where legally appropriate
- timestamp

## Security requirements

- No service-role key in browser code.
- No public write access to database tables.
- Validate all form input on the server.
- Rate-limit public enquiry and visit endpoints.
- Store consent timestamp and consent version.
- Use parameterized database access through Prisma.
- Protect admin routes with authenticated server-side checks.
- Do not expose private admissions notes to public APIs.
- Keep website content isolated from the VANI School OS database.

## Database provisioning

The current connected Supabase account does **not** contain an Avinya-specific project. A new PostgreSQL/Supabase project should be provisioned before applying production migrations.

After provisioning:

1. Configure `DATABASE_URL`.
2. Configure `DIRECT_URL` if required for Prisma migrations.
3. Configure Supabase Auth credentials.
4. Apply the initial migration.
5. Seed only non-sensitive configuration data.
6. Connect Book Visit and Contact forms.
7. Build the admin enquiry queue.
8. Add audit logging.
9. Run positive/negative authorization tests.
10. Verify production deployment and database connectivity.

## Boundary

This backend belongs to Avinya Vidya Mandir's public website. It must not reuse or expose private VANI School OS records unless a deliberate, authenticated integration is designed later.
