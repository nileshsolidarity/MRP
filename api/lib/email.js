import { Resend } from 'resend';
import { getResendApiKey, getHrApprovalEmail } from './config.js';

function getResend() {
  const key = getResendApiKey();
  if (!key) throw new Error('RESEND_API_KEY not configured');
  return new Resend(key);
}

export async function sendApprovalEmail(applicantName, applicantEmail, approvalUrl) {
  const resend = getResend();
  const hrEmail = getHrApprovalEmail();

  await resend.emails.send({
    from: 'MRP Group <onboarding@resend.dev>',
    to: hrEmail,
    subject: `Employee Registration Approval: ${applicantName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;">
  <div style="max-width:480px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">MRP Group</h1>
      <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Employee Registration Request</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px;">
        A new employee has requested access to the MRP Process Repository:
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Name</p>
        <p style="margin:0 0 16px;color:#1e293b;font-size:16px;font-weight:600;">${applicantName}</p>
        <p style="margin:0 0 8px;color:#64748b;font-size:13px;">Email</p>
        <p style="margin:0;color:#1e293b;font-size:16px;font-weight:600;">${applicantEmail}</p>
      </div>
      <a href="${approvalUrl}" style="display:block;background:#16a34a;color:#ffffff;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;">
        Approve Employee
      </a>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:20px 0 0;">
        This link expires in 72 hours. If you didn't expect this request, you can safely ignore it.
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendPasswordResetEmail(userName, userEmail, resetUrl) {
  const resend = getResend();

  await resend.emails.send({
    from: 'MRP Group <onboarding@resend.dev>',
    to: userEmail,
    subject: 'Set Your Password — MRP Group Process Repository',
    html: `
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6;">
  <div style="max-width:480px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:32px 24px;text-align:center;">
      <h1 style="color:#ffffff;margin:0;font-size:22px;">MRP Group</h1>
      <p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">Welcome to the Process Repository</p>
    </div>
    <div style="padding:32px 24px;">
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 8px;">
        Hi ${userName},
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Your registration has been approved! Please set your password to start using the MRP Process Repository.
      </p>
      <a href="${resetUrl}" style="display:block;background:#2563eb;color:#ffffff;text-align:center;padding:14px 24px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:600;">
        Set My Password
      </a>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:20px 0 0;">
        This link expires in 24 hours. If you didn't request this, you can safely ignore it.
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}
