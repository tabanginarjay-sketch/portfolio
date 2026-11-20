import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EduScholar | BCP Scholarship & Grants Platform</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b1120;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      padding: 0;
      margin: 0;
      overflow: hidden;
      width: 1280px;
      height: 720px;
    }
    .topbar {
      height: 60px;
      background: #0f172a;
      border-bottom: 2px solid #1e293b;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 16px;
      color: white;
      box-shadow: 0 0 16px rgba(37,99,235,0.6);
    }
    .brand-text h1 {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.01em;
    }
    .brand-text p {
      font-size: 11px;
      color: #38bdf8;
      font-weight: 500;
    }
    .top-status {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .railway-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.2);
      border: 1px solid #10b981;
      color: #34d399;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #34d399;
      box-shadow: 0 0 10px #34d399;
    }
    .user-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #1e293b;
      padding: 4px 12px 4px 6px;
      border-radius: 20px;
      border: 1px solid #334155;
    }
    .avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 11px;
      color: white;
    }
    .user-name {
      font-size: 11px;
      font-weight: 600;
      color: #f1f5f9;
    }
    .layout {
      display: flex;
      height: calc(720px - 60px);
    }
    .sidebar {
      width: 220px;
      background: #0f172a;
      border-right: 1px solid #1e293b;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
    }
    .nav-item.active {
      background: #1e293b;
      color: #38bdf8;
      border-left: 3px solid #0284c7;
    }
    .main-content {
      flex: 1;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #0b1329;
    }
    .header-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-section h2 {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
    }
    .header-section p {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .kpi-card {
      background: #131f37;
      border: 1px solid #233554;
      border-radius: 10px;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .kpi-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
      font-weight: 700;
    }
    .kpi-val {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
    }
    .kpi-badge {
      font-size: 10px;
      font-weight: 600;
      color: #34d399;
    }
    .kpi-badge.cyan { color: #38bdf8; }
    .kpi-badge.amber { color: #fbbf24; }
    .table-container {
      background: #131f37;
      border: 1px solid #233554;
      border-radius: 10px;
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .table-header {
      padding: 12px 18px;
      border-bottom: 1px solid #233554;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #16243f;
    }
    .table-title {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background: #0f1a30;
      padding: 10px 16px;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #233554;
    }
    td {
      padding: 11px 16px;
      font-size: 12px;
      color: #e2e8f0;
      border-bottom: 1px solid #1a2844;
    }
    tr:nth-child(even) td {
      background: #111b32;
    }
    .student-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .st-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 10px;
      color: white;
    }
    .st-name {
      font-weight: 700;
      color: #ffffff;
    }
    .st-id {
      font-size: 10px;
      color: #38bdf8;
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .pill-green {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid #10b981;
    }
    .pill-blue {
      background: rgba(56, 189, 248, 0.2);
      color: #38bdf8;
      border: 1px solid #38bdf8;
    }
    .pill-yellow {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      border: 1px solid #f59e0b;
    }
    .pill-purple {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      border: 1px solid #a855f7;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div class="brand">
      <div class="logo-badge">ES</div>
      <div class="brand-text">
        <h1>EduScholar Platform</h1>
        <p>Bestlink College of the Philippines (BCP) — Cloud Scholarship Portal</p>
      </div>
    </div>
    <div class="top-status">
      <div class="railway-pill">
        <span class="dot"></span>
        <span>Railway Cloud Deployed</span>
      </div>
      <div class="user-pill">
        <div class="avatar">AT</div>
        <span class="user-name">Ar-jay Tabangin (Admin)</span>
      </div>
    </div>
  </div>

  <div class="layout">
    <div class="sidebar">
      <div class="nav-item active">📊 Dashboard</div>
      <div class="nav-item">📋 Scholarship Intake</div>
      <div class="nav-item">📑 Document Verification</div>
      <div class="nav-item">💰 Grant Allocations</div>
      <div class="nav-item">🎓 Scholar Directory</div>
      <div class="nav-item">📈 Evaluation Reports</div>
    </div>

    <div class="main-content">
      <div class="header-section">
        <div>
          <h2>Scholarship Intake & Qualification Audit</h2>
          <p>Real-time intake tracking, qualification scoring, and automated document evaluation.</p>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Active Scholars</span>
          <span class="kpi-val">1,842</span>
          <span class="kpi-badge">↑ 14.8% Enrolled</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Disbursed Grants</span>
          <span class="kpi-val">₱5,480,000</span>
          <span class="kpi-badge cyan">100% Reconciled</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Pending Verification</span>
          <span class="kpi-val">28</span>
          <span class="kpi-badge amber">Queue active</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Qualification Rate</span>
          <span class="kpi-val">96.4%</span>
          <span class="kpi-badge">GWA Matrix Passed</span>
        </div>
      </div>

      <div class="table-container">
        <div class="table-header">
          <span class="table-title">Recent Scholarship Applications & Verification Queue</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Applicant Student</th>
              <th>Program & Year</th>
              <th>GWA</th>
              <th>Grant Classification</th>
              <th>Documents Status</th>
              <th>Review Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="student-cell">
                  <div class="st-avatar" style="background: #0284c7;">MA</div>
                  <div>
                    <div class="st-name">Mary Anne Santos</div>
                    <div class="st-id">BCP-2024-0891</div>
                  </div>
                </div>
              </td>
              <td>BS Information Technology (3rd Yr)</td>
              <td><strong style="color: #38bdf8; font-size: 13px;">1.18</strong></td>
              <td>Presidential Academic Merit</td>
              <td>4/4 Verified (PSA, Grades, ITR)</td>
              <td><span class="status-pill pill-green">Approved & Funded</span></td>
            </tr>
            <tr>
              <td>
                <div class="student-cell">
                  <div class="st-avatar" style="background: #059669;">JD</div>
                  <div>
                    <div class="st-name">John David Ramos</div>
                    <div class="st-id">BCP-2024-1142</div>
                  </div>
                </div>
              </td>
              <td>BS Computer Science (4th Yr)</td>
              <td><strong style="color: #38bdf8; font-size: 13px;">1.25</strong></td>
              <td>DICT Tech Scholar Grant</td>
              <td>4/4 Verified (Cert, Grades, Endorsement)</td>
              <td><span class="status-pill pill-blue">Active Grant</span></td>
            </tr>
            <tr>
              <td>
                <div class="student-cell">
                  <div class="st-avatar" style="background: #d97706;">CR</div>
                  <div>
                    <div class="st-name">Christine Reyes</div>
                    <div class="st-id">BCP-2025-0219</div>
                  </div>
                </div>
              </td>
              <td>BS Accountancy (2nd Yr)</td>
              <td><strong style="color: #38bdf8; font-size: 13px;">1.35</strong></td>
              <td>Tulong Dunong Program (TDP)</td>
              <td>3/4 Documents (Pending COE)</td>
              <td><span class="status-pill pill-yellow">Under Verification</span></td>
            </tr>
            <tr>
              <td>
                <div class="student-cell">
                  <div class="st-avatar" style="background: #7c3aed;">KC</div>
                  <div>
                    <div class="st-name">Kevin Castro</div>
                    <div class="st-id">BCP-2024-0733</div>
                  </div>
                </div>
              </td>
              <td>BS Information Technology (2nd Yr)</td>
              <td><strong style="color: #38bdf8; font-size: 13px;">1.22</strong></td>
              <td>Community Leadership Scholarship</td>
              <td>4/4 Verified (Barangay, Grades, Good Moral)</td>
              <td><span class="status-pill pill-purple">Final Endorsement</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;

async function run() {
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,720']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const outPath = path.resolve('public/images/projects/eduscholar.png');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await page.screenshot({ path: outPath, type: 'png' });
  console.log('Saved high-contrast EduScholar preview to', outPath);
  await browser.close();
}

run().catch(console.error);
