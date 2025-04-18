import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { FormUtils } from '../utils/utils.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  fb = inject(FormBuilder);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  formUtils = FormUtils;

  myForm = this.fb.group({
    email: [
      '',
      [Validators.required, Validators.email],
    ],
    password: [
      '',
      [Validators.required, Validators.minLength(8)],
    ],
  });

  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.valid) {
      const payload = {
        email: this.myForm.get('email')?.value || '',
        password: this.myForm.get('password')?.value || '',
      };

      this.authService.login(payload).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);

          // Acceder al token dentro de response.user.access_token
          if (response.user?.access_token) {
            localStorage.setItem('token', response.user.access_token);
            this.router.navigate(['/documents/upload']);
          } else {
            console.error('No se encontró el token en la respuesta:', response);
            alert('Error: No se recibió un token válido del servidor.');
          }
        },
        error: (error) => {
          console.error('Error al iniciar sesión:', error);
          alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        },
      });
    } else {
      alert('Por favor, corrige los errores antes de enviar.');
    }
  }

}
