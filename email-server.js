const http = require('http');
const nodemailer = require('nodemailer');

const PORT = 3099;

// ═══════════════════════════════════════════
// YAHOO SMTP CONFIG
// Replace YOUR_APP_PASSWORD with the Yahoo App Password
// (NOT your regular Yahoo login password)
// ═══════════════════════════════════════════
const YAHOO_USER = 'has.oubella@yahoo.com';
const YAHOO_APP_PASSWORD = 'mhsuqlfdfffrbqav';

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: { user: YAHOO_USER, pass: YAHOO_APP_PASSWORD }
});

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  if (req.method === 'POST' && req.url === '/send') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const { to, subject, html } = JSON.parse(body);
        if (!to || !to.length) throw new Error('No recipients');

        const results = [];
        for (const email of to) {
          try {
            await transporter.sendMail({
              from: `"Hassan Oubella" <${YAHOO_USER}>`,
              to: email,
              subject: subject,
              html: html
            });
            results.push({ email, status: 'sent' });
            console.log(`✅ Sent to ${email}`);
          } catch (err) {
            results.push({ email, status: 'failed', error: err.message });
            console.log(`❌ Failed: ${email} — ${err.message}`);
          }
          // 5-second delay between emails to avoid Yahoo throttling
          await new Promise(r => setTimeout(r, 5000));
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, results }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
  } else {
    res.writeHead(404); res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`\n🚀 TourPilot Email Server running on http://localhost:${PORT}`);
  console.log(`📧 Sending from: ${YAHOO_USER}`);
  console.log(`\n→ Open email-template.html in your browser to send emails\n`);
});
