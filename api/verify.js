const crypto = require('crypto');

export default function handler(req, res) {
  // 設置 CORS 頭
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  const { license_key } = req.body;

  if (!license_key) {
    return res.status(400).json({ status: 'error', message: 'License key is required' });
  }

  // 從環境變量中獲取有效的許可證序號列表
  const validKeys = (process.env.LICENSE_KEYS || '').split(',').map(k => k.trim()).filter(k => k);

  if (validKeys.length === 0) {
    return res.status(500).json({ status: 'error', message: 'Server configuration error' });
  }

  // 驗證許可證序號格式
  const keyRegex = /^RR-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[0-9]{4}$/;
  if (!keyRegex.test(license_key)) {
    return res.status(400).json({ status: 'error', message: 'Invalid license key format' });
  }

  // 檢查許可證序號是否在有效列表中
  if (validKeys.includes(license_key)) {
    // 生成驗證令牌（基於許可證序號和時間戳）
    const timestamp = Math.floor(Date.now() / 1000);
    const tokenData = `${license_key}:${timestamp}`;
    const token = crypto.createHash('sha256').update(tokenData).digest('hex');

    return res.status(200).json({
      status: 'success',
      message: 'License key is valid.',
      token: token,
      expires: timestamp + 86400 // 24小時後過期
    });
  }

  return res.status(401).json({ status: 'error', message: 'License key is invalid' });
}
