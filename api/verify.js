// api/verify.js - 修復版本，支持電腦指紋驗證

import crypto from 'crypto';

export default function handler(req, res) {
    // 只允許 POST 請求
  if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  try {
        const { license_key, computer_fingerprint } = req.body;

      // 驗證輸入
      if (!license_key) {
              return res.status(400).json({ status: 'error', message: 'license_key is required' });
      }

      // 獲取環境變量中的許可證序號列表
      const licenseKeysEnv = process.env.LICENSE_KEYS || '';
        const validKeys = licenseKeysEnv.split(',').map(key => key.trim());

      // 檢查許可證序號是否在列表中
      if (!validKeys.includes(license_key)) {
              return res.status(401).json({ status: 'error', message: 'License key is invalid' });
      }

      // 如果提供了電腦指紋，驗證綁定
      if (computer_fingerprint) {
              // 檢查黑名單（可選）
          const blacklistEnv = process.env.BLACKLIST_KEYS || '';
              const blacklistedKeys = blacklistEnv.split(',').map(key => key.trim()).filter(key => key);

          if (blacklistedKeys.includes(license_key)) {
                    return res.status(401).json({ status: 'error', message: 'License key has been revoked' });
          }

          // 生成激活令牌（基於許可證序號 + 電腦指紋）
          const tokenData = `${license_key}:${computer_fingerprint}:${Math.floor(Date.now() / 1000)}`;
              const token = crypto.createHash('sha256').update(tokenData).digest('hex');

          // 計算過期時間（24 小時後）
          const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60);

          return res.status(200).json({
                    status: 'success',
                    message: 'License key is valid',
                    token: token,
                    computer_fingerprint: computer_fingerprint,
                    expires: expiresAt,
                    license_key: license_key
          });
      }

      // 如果沒有提供電腦指紋，只進行基本驗證
      const expiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
        const token = crypto.createHash('sha256').update(license_key + Date.now()).digest('hex');

      return res.status(200).json({
              status: 'success',
              message: 'License key is valid',
              token: token,
              expires: expiresAt,
              license_key: license_key
      });

  } catch (error) {
        console.error('Verification error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error', error: error.message });
  }
}
