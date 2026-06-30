# 🔑 Demo Logins — Erniekay Splendor

> **Demo environment only.** There is no real authentication, database check, or session.
> The login form routes you based on what the **email field contains**. The **password is
> ignored** — any non-empty value works.

---

## Academy Portal

**Login page:** http://localhost:3000/academy/portal

| Role        | Email (or anything containing the keyword) | Password         | Lands on                          |
| ----------- | ------------------------------------------ | ---------------- | --------------------------------- |
| **Student** | `student@test.com`                         | _anything_       | `/academy/portal/dashboard`       |
| **Admin**   | `admin@test.com`                           | _anything_       | `/academy/admin`                  |

### How it actually works
The form does a simple substring check on the lowercased email — it does **not** validate
the password:

- Email **contains `"admin"`**  → `/academy/admin`
- Email **contains `"student"`** → `/academy/portal/dashboard`
- Anything else → `"Invalid credentials"` alert

So `admin@anything.com`, `the-admin`, or `student123@x.com` all work too. The official demo
hints shown on the page are `admin@test.com` and `student@test.com`.

_Source: [`app/academy/portal/page.tsx`](app/academy/portal/page.tsx) (`handleSubmit`, lines 19–32)._

---

## Direct links (skip the login)

Because there's no auth guard, you can open any portal/admin page directly:

| Area                | URL                                              |
| ------------------- | ------------------------------------------------ |
| Student dashboard   | http://localhost:3000/academy/portal/dashboard   |
| Student schedule    | http://localhost:3000/academy/portal/schedule    |
| Student grades      | http://localhost:3000/academy/portal/grades      |
| Student courses     | http://localhost:3000/academy/portal/courses     |
| Student portfolio   | http://localhost:3000/academy/portal/portfolio   |
| Student profile     | http://localhost:3000/academy/portal/profile     |
| Admin               | http://localhost:3000/academy/admin              |

---

## Other forms (no login)

These pages have inputs but are **not** logins — they're booking/inquiry/application
forms with no credentials:

- `/booking` — appointment booking
- `/contact` — contact / admissions inquiry
- `/bridal` — bridal inquiry
- `/academy/admissions/*` — multi-step enrolment application

---

_⚠️ Before production: replace the dummy `handleSubmit` routing with real authentication
(server-side credential check + session) and add an auth guard on the portal/admin routes._
