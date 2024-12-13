import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Caché en memoria
let authCache: {
  [token: string]: {
    isValid: boolean;
    timestamp: number;
  }
} = {};

// Tiempo de caché (5 minutos)
const CACHE_DURATION = 5 * 60 * 1000;

// Función para limpiar caché antigua
function cleanOldCache() {
  const now = Date.now();
  Object.keys(authCache).forEach(token => {
    if (now - authCache[token].timestamp > CACHE_DURATION) {
      delete authCache[token];
    }
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rutas protegidas y públicas
  const protectedRoutes = ['/customers', '/products', '/reservations'];
  const publicRoutes = ['/login', '/register'];
  
  // Obtener el token
  const token = request.cookies.get('accessToken');
  
  try {
    // Si es una ruta protegida
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Verificar si hay una respuesta en caché válida
      if (
        authCache[token.value] && 
        Date.now() - authCache[token.value].timestamp < CACHE_DURATION
      ) {
        if (!authCache[token.value].isValid) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
      }

      // Si no hay caché o expiró, hacer la verificación
      const verifyResponse = await fetch(`${process.env.BASE_URL}/auth/verify`, {
        headers: {
          'Cookie': `accessToken=${token.value}`
        },
        credentials: 'include'
      });

      // Guardar resultado en caché
      authCache[token.value] = {
        isValid: verifyResponse.ok,
        timestamp: Date.now()
      };

      // Limpiar caché antigua ocasionalmente
      if (Math.random() < 0.1) { // 10% de probabilidad
        cleanOldCache();
      }

      if (!verifyResponse.ok) {
        return NextResponse.redirect(new URL('/login', request.url));
      }

      return NextResponse.next();
    }

    // Si es una ruta pública
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      if (token) {
        // Verificar caché primero
        if (
          authCache[token.value] && 
          Date.now() - authCache[token.value].timestamp < CACHE_DURATION
        ) {
          if (authCache[token.value].isValid) {
            return NextResponse.redirect(new URL('/products', request.url));
          }
          return NextResponse.next();
        }

        const verifyResponse = await fetch(`${process.env.BASE_URL}/auth/verify`, {
          headers: {
            'Cookie': `accessToken=${token.value}`
          },
          credentials: 'include'
        });

        // Guardar en caché
        authCache[token.value] = {
          isValid: verifyResponse.ok,
          timestamp: Date.now()
        };

        if (verifyResponse.ok) {
          return NextResponse.redirect(new URL('/products', request.url));
        }
      }
      return NextResponse.next();
    }

    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware error:', error);
    // En caso de error, invalidar caché para ese token
    if (token) {
      delete authCache[token.value];
    }
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/products/:path*',
    '/customers/:path*',
    '/reservations/:path*',
    '/login',
    '/register'
  ]
};