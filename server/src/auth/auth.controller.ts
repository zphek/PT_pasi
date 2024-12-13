import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { response, Response } from 'express';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async SignUp(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.SignUp(createAuthDto);
  }

  @Post("signin")
  async SignIn(@Body() loginAuthDto: LoginAuthDto, @Res({ passthrough: true }) response: Response){
    const Response =  await this.authService.SignIn(loginAuthDto, response);
    console.log(Response);

    return Response;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get("signout")
  async SignOut(@Res() response: Response){
    console.log(response.getHeaders())
    response.clearCookie("accessToken", { path: '/' });

    return "XD"
    // return await this.authService.LogOut(response);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get("verify")
  async VerifySession(@Req() request: Request){
    return await this.authService.verifySession(request);
  }
}
