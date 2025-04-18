import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Decode'
})
export class TransformPipe implements PipeTransform {
  transform(value: string): string {
    try {
      return atob(value); 
    } catch (e) {
      console.error('Error al decodificar Base64:', e);
      return value;
    }
  }

}
