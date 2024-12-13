import { Controller, Get, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags("AUTH")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Este endpoint permite registrar un nuevo usuario en el sistema utilizando un correo y una contraseña.',
  })
  @ApiBody({ 
    type: CreateAuthDto, 
    description: 'Datos necesarios para crear una cuenta: correo electrónico y contraseña.' 
  })
  async SignUp(@Body() createAuthDto: CreateAuthDto) {
    await this.authService.SignUp(createAuthDto);
    return { message: 'Usuario registrado exitosamente.' };
  }

  @Post("signin")
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Este endpoint permite a un usuario autenticarse utilizando su correo y contraseña.',
  })
  @ApiBody({ 
    type: LoginAuthDto, 
    description: 'Credenciales del usuario para iniciar sesión: correo electrónico y contraseña.' 
  })
  async SignIn(@Body() loginAuthDto: LoginAuthDto, @Res({ passthrough: true }) response: Response) {
    const Response = await this.authService.SignIn(loginAuthDto, response);
    console.log(Response);

    return Response;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get("signout")
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Este endpoint permite a un usuario autenticado cerrar sesión eliminando su token de acceso.',
  })
  async SignOut(@Res() response: Response) {
    console.log(response.getHeaders());
    response.clearCookie("accessToken", { path: '/' });

    return { message: 'Sesión cerrada exitosamente.' };
  }

  @UseGuards(SupabaseAuthGuard)
  @Get("verify")
  @ApiOperation({
    summary: 'Verificar sesión',
    description: 'Este endpoint verifica si el usuario autenticado tiene una sesión válida.',
  })
  async VerifySession(@Req() request: Request) {
    return await this.authService.verifySession(request);
  }
}