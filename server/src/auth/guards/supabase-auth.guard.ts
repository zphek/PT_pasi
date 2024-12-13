import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase: SupabaseClient;

  constructor() {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Obtener el token de la cookie 'accessToken'
    const accessToken = request.cookies['accessToken'];

    console.log(accessToken);

    if (!accessToken) {
      throw new UnauthorizedException('No authentication token found');
    }

    try {
      // Verificar el token JWT y obtener el payload
      const tokenPayload = this.decodeJWT(accessToken);
      
      // Verificar la expiración del token
      if (this.isTokenExpired(tokenPayload.exp)) {
        throw new UnauthorizedException('Token has expired');
      }

      // Verificar el token con Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(accessToken);

      if (error || !user) {
        throw new UnauthorizedException('Invalid authentication token');
      }

      // Agregar el usuario y el token al request para uso posterior
      request.user = user;
      request.accessToken = accessToken;

      return true;
    } catch (error) {
      console.error('Auth error:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Authentication failed');
    }
  }

  private decodeJWT(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const payload = Buffer.from(base64Payload, 'base64').toString('utf-8');
      return JSON.parse(payload);
    } catch (error) {
      throw new UnauthorizedException('Invalid token format');
    }
  }

  private isTokenExpired(exp: number): boolean {
    if (!exp) return true;
    
    // exp está en segundos, convertir a milisegundos
    const expirationTime = exp * 1000;
    const currentTime = Date.now();
    
    return currentTime >= expirationTime;
  }
}

// Decorator personalizado para usar el guard
import { applyDecorators, UseGuards } from '@nestjs/common';

export function Auth() {
  return applyDecorators(
    UseGuards(SupabaseAuthGuard)
  );
}