import { CommonModule, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/utils.component';
import { Register } from '../models/register.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  fb = inject(FormBuilder);

  constructor(
    private registerService: AuthService
  ) {}

  formUtils = FormUtils;

  myForm = this.fb.group({
    name: [
      '',
      [Validators.required, Validators.pattern('^[a-zA-Z]+ [a-zA-Z]+$')],
    ],
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
        fullName: this.myForm.get('name')?.value || '',
        email: this.myForm.get('email')?.value || '',
        password: this.myForm.get('password')?.value || '',
      };

      console.log('Payload enviado:', payload);

      this.registerService.register(payload).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          alert('Usuario registrado exitosamente');
        },
        error: (error) => {
          console.error('Error al registrar el usuario:', error);
          alert('Error al registrar el usuario. Por favor, inténtalo de nuevo.');
        },
      });
    } else {
      console.log('Errores del formulario:', this.myForm.errors);
      Object.keys(this.myForm.controls).forEach((key) => {
        const control = this.myForm.get(key);
        console.log(`${key} - valid: ${control?.valid}, errors:`, control?.errors);
      });
      alert('Por favor, corrige los errores antes de enviar.');
    }
  }

}
