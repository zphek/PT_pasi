"use client"
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Page() {
  const router = useRouter();

  async function handleOnSubmit(e:any){
    e.preventDefault();
    const FORM = new FormData(e.target);
    const EMAIL:any = FORM.get("email");
    const PASSWORD:any = FORM.get("password");

    if(EMAIL && PASSWORD){
        toast.promise(
          axios.post('http://localhost:3000/api/login', { email: EMAIL, password: PASSWORD }, 
          {
            headers: {
              'Content-Type': 'application/json'
            },
            withCredentials: true
          }).then(response => {
            console.log(response);
            if (response.status !== 200) throw new Error('Error en la autenticación');

            setTimeout(()=>{
              router.push("/products")
            }, 2000)
            return response;
          }),
          {
            loading: "Intentando iniciar sesion...",
            success: <b>Haz iniciado sesion!</b>,
            error: <b>Credenciales incorrectos.</b>
          }
        )
    } else {
      toast.error("Faltan campos por llenar.")
    }
}

  return (
    <form className="min-h-screen w-full flex items-center justify-center bg-gray-50" onSubmit={handleOnSubmit}>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Bienvenido de nuevo</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="email" 
                type="email" 
                name='email'
                placeholder="nombre@ejemplo.com"
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input 
                id="password" 
                type="password" 
                name='password'
                className="pl-10"
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type='submit'>Iniciar sesión</Button>
          <div className="text-sm text-center text-gray-500">
            ¿No tienes una cuenta?{' '}
            <a href="/register" className="text-primary hover:underline">
              Regístrate
            </a>
          </div>
        </CardFooter>
      </Card>

      <Toaster/>
    </form>
  );
}