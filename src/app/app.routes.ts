// app.routes.ts actualizado
import { Routes } from '@angular/router';
import { BackOfficeComponent } from './backoffice/backoffice.component';
import { ActivitiesComponent } from './backoffice-activity/backoffice-activity.component';
import { CommentComponent } from './backoffice-comment/backoffice-comment.component';

export const routes: Routes = [
    { path: 'admin', component: BackOfficeComponent },
    { path: 'activities', component: ActivitiesComponent },
    { path : 'comments', component: CommentComponent },
    //{ path: '', redirectTo: '/admin', pathMatch: 'full' }
];