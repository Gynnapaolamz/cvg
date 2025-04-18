import {
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static allowedExtensions = ['doc', 'pdf', 'txt', 'xls'];
  static maxFileSizeMB = 5;

  static getTextError(errors: ValidationErrors) {
    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'pattern':
          return 'Formato no válido.';

        case 'fileSize':
          return `El archivo supera el tamaño máximo permitido de ${FormUtils.maxFileSizeMB} MB`;

        default:
          return `Error de validación no controlado: ${key}`;
      }
    }

    return null;
  }

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    return (
      !!form.controls[fieldName].errors && form.controls[fieldName].touched
    );
  }

 static getFieldError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};
    return FormUtils.getTextError(errors);
  }

  static validateFileName(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    return value === '' ? { required: true } : null;
  }

  static validateDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
    return isValidDate ? null : { invalidDate: true };
  }

  static validateFileSize(maxSizeInMB: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (file && file.size > maxSizeInMB * 1024 * 1024) {
        return { fileSize: true };
      }
      return null;
    };
  }

  static validateExtension(extension: string): boolean {
    return FormUtils.allowedExtensions.includes(extension.toLowerCase());
  }

  static prepareFileContent(content: string): string {
    try {
      return btoa(content);
    } catch (error) {
      console.error('Error al codificar contenido a Base64:', error);
      return '';
    }
  }

  static handleServerError(error: any): string {
    if (error.status === 401) {
      return 'No autorizado. Verifica tu token.';
    }
    if (error.status === 400) {
      return 'Solicitud inválida. Revisa los datos enviados.';
    }
    return 'Error desconocido. Inténtalo más tarde.';
  }
}
