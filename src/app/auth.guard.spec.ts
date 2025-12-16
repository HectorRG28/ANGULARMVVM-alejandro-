import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service'; // Asegúrate de importar tu servicio

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Permitir el acceso
    } else {
      // Redirigir al usuario a la página de inicio de sesión si no está autenticado
      this.router.navigate(['/login']);
      return false; // Denegar el acceso
    }
  }
}