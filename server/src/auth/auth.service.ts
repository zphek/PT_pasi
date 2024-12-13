import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthError, createClient, SupabaseClient } from '@supabase/supabase-js';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private supabaseClient: SupabaseClient;
  constructor(){
      this.supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  }

  async SignUp(dto: CreateAuthDto) {
    try {
      const { error } = await this.supabaseClient.auth.signUp({
        email: dto.email,
        password: dto.password,
        options: {
          emailRedirectTo: process.env.EMAIL_REDIRECT_URL,
        }
      });

      if (error) {
        return {
          message: 'Registration failed',
          success: false
        };
      }

      return {
        message: 'Successfully registered. We sent you a confirmation message to your email.',
        success: true
      };
    } catch (error) {
      return {
        message: 'An error occurred during registration',
        success: false
      };
    }
  }

  async SignIn(dto: LoginAuthDto, response: Response) {
    try {
      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      
      if (error) {
        throw new Error("Invalid credentials.")
      }

      console.log(data.session.access_token, "XDDD");
      
      if (data.session) {
        const expiresIn = new Date(data.session.expires_at).getTime();

        response.setHeader('Set-Cookie', [
          `accessToken=${data.session.access_token}; ` +
          `Max-Age=${Math.abs(Math.floor(expiresIn / 1000))}; ` + // Convertir a segundos
          'Path=/; ' +
          'HttpOnly; ' +
          'SameSite=Lax'
        ]);        
      }

      return {
        message: 'Successfully signed in',
        success: true
      };
    } catch (error) {
      return new NotFoundException(error);
    }
  }

  async verifySession(request: Request) {
    try {
      const cookies = request.headers['cookie'];
    
      if (!cookies) {
        throw new UnauthorizedException('No token found');
      }
  
      const match = cookies.match(/accessToken=([^;]+)/);
      const accessToken = match ? match[1] : null;
  
      if (!accessToken) {
        throw new UnauthorizedException('Access token not found');
      }
  
      const { data: { user }, error } = await this.supabaseClient.auth.getUser(accessToken);
  
      if (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
  
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
  
      return {
        message: 'Session is valid',
        user,
        success: true
      };
  
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error verifying session');
    }
  }

  async LogOut(response: Response) {
    console.log("XD");
    try {
      response.clearCookie("accessToken", { path: '/' });

      console.log("P2")

      return {
        message: 'Successfully signed out',
        success: true
      };
  
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error during sign out process');
    }
  }
}
