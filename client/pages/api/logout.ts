import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verificar si el usuario está autenticado
    const verifyResponse = await axios.get(
      `http://localhost:3000/auth/verify`,
      {
        headers: {
          Cookie: req.headers.cookie || ''
        }
      }
    );

    // Si la verificación es exitosa y el usuario está autenticado
    if (verifyResponse.data.success && verifyResponse.data.user) {
      // Eliminar completamente la cookie
      res.removeHeader('Set-Cookie');
      res.setHeader('Set-Cookie', 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly');

      return res.status(200).json({
        success: true,
        message: 'Successfully logged out'
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'No active session found'
      });
    }

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
}