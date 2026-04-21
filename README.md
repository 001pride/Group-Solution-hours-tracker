# Group-Solution Hours Tracker

A simple app to track teaching hours and payments.  
Teachers log hours each day, mark them paid/unpaid, and see totals.  
Admins manage teachers and can view/edit a **separate copy** of each teacher’s hours (so admin records can differ from what the teacher sees).

---

## How It Works

- **Teachers** log in with credentials given by the admin.
- They see a calendar. Click a day → enter number of hours → mark as paid or unpaid → save.
- Once a day is marked paid, the teacher cannot change it.
- Below the calendar, totals show **paid hours** and **hours pending payment**.

- **Admins** log in with their own account.
- They see a list of all teachers.
- They can **add new teachers** (set email and password) and **delete teachers**.
- Clicking “View Activity” shows a teacher’s calendar – but this is the **admin’s copy**.
- The admin can edit any day (even paid ones) and the changes are stored separately from the teacher’s own records.
- This allows discrepancies (e.g., admin corrects a missed entry without affecting the teacher’s view).

- **Footer** always shows: “Group-Solution Hours Tracker ©2026 by EXCELSIOR” with a round logo placeholder.

---

## What You Need to Run It

**No installation!**  
The app is a **static website** (HTML, CSS, JavaScript with React).  
All you need is a web browser.  

- **For offline use and installable PWA**: you need to serve the files over **HTTPS** (or locally on `localhost`).  
- **To host it**: just put the files on any web server (like Vercel, Netlify, GitHub Pages) that provides HTTPS.

**No packages to install** – the app loads React from a CDN (Content Delivery Network).  
If you want to develop locally, simply open the `index.html` file in a browser. The service worker will work if you serve the files via a local server (like `python -m http.server` or `npx serve`).

---


