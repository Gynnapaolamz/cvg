import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../utils/utils.component';
import { DocumentsService } from '../services/documents.service';
import { DocumentPayload } from '../models/documents.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-doc',
  imports: [CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './upload-doc.component.html',
  styleUrl: './upload-doc.component.css'
})
export class UploadDocComponent implements OnInit {
  uploadForm: FormGroup;
  serverResponse: string | null = null;
  isDragging: boolean = false;
  public FormUtils = FormUtils;

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentsService,
    private router: Router
  ) {
    this.uploadForm = this.fb.group({
      fileName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      extension: ['', [Validators.required, Validators.pattern('^(doc|pdf|txt|xls)$')]],
      fileContent: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para acceder a esta página.');
      this.router.navigate(['/login']);
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFile(input.files[0]);
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }


  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }


  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }


  private processFile(file: File): void {

    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.serverResponse = 'El archivo excede el tamaño máximo permitido de 5 MB.';
      return;
    }

    const fileName = file.name;
    const fileExtension = fileName.split('.').pop()?.toLowerCase();


    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const base64String = this.arrayBufferToBase64(arrayBuffer);

      this.uploadForm.patchValue({
        fileName: fileName,
        extension: fileExtension,
        fileContent: base64String,
      });
      this.serverResponse = null;
    };
    reader.readAsArrayBuffer(file);
  }


  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }


  onSubmit(): void {
    if (this.uploadForm.invalid) {
      this.serverResponse = 'Por favor corrige los errores del formulario.';
      return;
    }

    const payload = this.uploadForm.value;
    this.documentsService.uploadDocument(payload).subscribe({
      next: () => {
        this.serverResponse = 'Archivo subido exitosamente.';
        this.router.navigate(['/documents']);
      },
      error: (err) => {
        this.serverResponse = `Error al subir el archivo: ${err?.message || 'Error desconocido.'}`;
      },
    });
  }
}
