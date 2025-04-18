import { Component, OnInit } from '@angular/core';
import { DocumentsService } from '../services/documents.service';
import { CommonModule } from '@angular/common';
import { TransformPipe } from '../transform.pipe';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-documents',
  imports: [CommonModule, TransformPipe,
    FormsModule
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit{
  documents: any[] = [];
  paginatedDocuments: any[] = [];
  errorMessage: string | null = null;

  selectedDocument: { fileContent: string; extension: string } | null = null;
  safeUrl: SafeResourceUrl | null = null;

  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;
  isLoading: boolean = false; 

  constructor(
    private documentsService: DocumentsService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.isLoading = true;
    this.documentsService.getDocuments().subscribe({
      next: (response: any) => {
        this.documents = response.documents || [];
        this.totalPages = Math.ceil(this.documents.length / this.pageSize);
        this.updatePaginatedDocuments();
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = 'No se pudieron cargar los documentos. Intenta nuevamente.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  updatePaginatedDocuments(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedDocuments = this.documents.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedDocuments();
    }
  }

  onPreview(document: any): void {
    this.selectedDocument = {
      fileContent: document.fileContent,
      extension: document.extension,
    };

    if (document.extension === 'pdf') {
      const unsafeUrl = `data:application/pdf;base64,${document.fileContent}`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
    } else {
      this.safeUrl = null;
    }
  }

  closePreview(): void {
    this.selectedDocument = null;
    this.safeUrl = null;
  }

  deleteDocument(documentId: string): void {
    this.documentsService.deleteDocument(documentId).subscribe({
      next: () => {
        this.documents = this.documents.filter(doc => doc._id !== documentId);
        this.totalPages = Math.ceil(this.documents.length / this.pageSize);
        this.updatePaginatedDocuments();
      },
      error: (error) => {
        this.errorMessage = 'No se pudo eliminar el documento. Intenta nuevamente.';
      },
    });
  }

  confirmDelete(documentId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      this.deleteDocument(documentId);
    }
  }

  goToCreateDocument(): void {
    this.router.navigate(['/documents/upload']);
  }

}
