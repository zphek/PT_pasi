import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from '@/utilites/AuthRequests';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;
    // console.log('Received credentials:', { email, password });

    // Perform authentication
    const data: any = await signIn({ email, password });
    // Handle cookies from the response
    if (data.headers?.["set-cookie"]) {
      const cookies = data.headers["set-cookie"];
      if (Array.isArray(cookies)) {
          console.log(cookies[0]);
          res.setHeader('Set-Cookie', `${cookies[0]}`);
      }
  }

    console.log(data.data);

    if(data.data.status == 404){
      return res.status(data.data.status).json({
        error: true,
        message: data.data.message
      })
    }
    // Extract only the necessary data for the response
    const responseData = {
      success: true,
      data: res.getHeaders()
    };

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}