import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const status = req.body.status || req.query.status;
    const baseUrl = "https://bilginpcmarket.com";

    if (status === 'success') {
      return res.redirect(303, `${baseUrl}/sepet?payment=success`);
    } else {
      return res.redirect(303, `${baseUrl}/sepet?payment=failed`);
    }
  } catch (error) {
    return res.redirect(303, `https://bilginpcmarket.com/sepet?payment=error`);
  }
}