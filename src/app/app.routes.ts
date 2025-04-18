import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UploadDocComponent } from './upload-doc/upload-doc.component';
import { DocumentsComponent } from './documents/documents.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',

  },
  {
    path: 'login',
    component: LoginComponent,

  },
  {
    path: 'register',
    component: RegisterComponent,

  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'documents/upload',
    component: UploadDocComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },

];
