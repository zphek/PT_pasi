"use client"

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-40" />
      
      <Card className="w-full max-w-md relative bg-white/70 backdrop-blur-lg border-2">
        <CardHeader className="space-y-1 pt-8">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Crear cuenta
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Regístrate para comenzar tu experiencia
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Formulario de registro */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                <Input 
                  id="name" 
                  type="text" 
                  placeholder="Juan Pérez"
                  className="pl-10 h-12 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nombre@ejemplo.com"
                  className="pl-10 h-12 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                <Input 
                  id="password" 
                  type="password"
                  placeholder="Mínimo 8 caracteres"
                  className="pl-10 h-12 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="text-xs text-gray-500">
                La contraseña debe tener al menos 8 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative group">
                <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                <Input 
                  id="confirmPassword" 
                  type="password"
                  placeholder="Repite tu contraseña"
                  className="pl-10 h-12 transition-all border-gray-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full h-12 text-lg font-medium relative group">
            Crear cuenta
            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="text-sm text-center text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a href="/login" className="text-primary hover:underline font-medium">
              Inicia sesión
            </a>
          </div>

          <p className="text-xs text-center text-gray-500">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-primary hover:underline">
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-primary hover:underline">
              política de privacidad
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}