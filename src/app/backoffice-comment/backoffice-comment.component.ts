import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../services/comment.service';  // Asegúrate de tener este servicio
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';  // Componente de diálogo de confirmación
import { CommentCreateComponent } from '../components/comment-create/comment-create.component';  // Componente para crear comentarios
import { Comment } from '../models/comment.model';  // Tu modelo de comentario

@Component({
  selector: 'app-comments',
  templateUrl: './backoffice-comment.component.html',
  styleUrls: ['./backoffice-comment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, CommentCreateComponent],
})
export class CommentComponent implements OnInit {
  comments: Comment[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 0;
  totalComments = 0;
  pages: number[] = [];
  loading = false;
  error = '';
  loadedComments = false;
  showCreateModal = false;
  showEditModal = false;
  showViewModal = false;
  selectedComment: Comment | null = null;
  selectedType: string = '';
  paginatedComments: any[] = [];
  filteredComments: any[] = [];

  // Dades d'exemple (si no obtienes los comentarios del backend)
  allMockComments: Comment[] = [
    { _id: '1', author: 'Author1', activity: 'Activity1', content: 'Comment content 1', isEddited: false },
    { _id: '2', author: 'Author2', activity: 'Activity2', content: 'Comment content 2', isEddited: false },
    { _id: '3', author: 'Author3', activity: 'Activity3', content: 'Comment content 3', isEddited: true },
    { _id: '4', author: 'Author4', activity: 'Activity4', content: 'Comment content 4', isEddited: false },
    { _id: '5', author: 'Author5', activity: 'Activity5', content: 'Comment content 5', isEddited: false },
    { _id: '6', author: 'Author6', activity: 'Activity6', content: 'Comment content 6', isEddited: true },
  ];

  constructor(
    private commentService: CommentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('Inicializando componente de comentarios');
    this.getComments();
  }

  getComments(): void {
    console.log('Obteniendo comentarios');
    this.loadedComments = false;
    this.loading = true;

    this.commentService.getPaginatedComments(this.currentPage, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          if (response && response.comments) {
            this.comments = response.comments;
            this.filteredComments = [...this.comments];
            this.paginatedComments = this.filteredComments;
            
            // También actualiza la paginación
            this.totalComments = response.totalComments || 0;
            this.totalPages = response.totalPages || 1;
          } else {
            console.warn('La respuesta no contiene comentarios:', response);
            this.paginatedComments = [];
          }
          
          this.loading = false;
          this.loadedComments = true;
        },
        error: (err) => {
          console.error('Error al cargar comentarios:', err);
          this.error = 'Error al cargar comentarios';
          this.loading = false;

          // Si hay error, usar datos de prueba
          this.testPagination();
          this.generatePageNumbers();
          this.loadedComments = true;
        }
      });
    console.log('Comentarios recibidos:', this.comments);
    console.log('Comentarios filtrados:', this.filteredComments);
  }

  // Método para simular la paginación con datos de prueba
  testPagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.allMockComments.length);

    // Obtener los comentarios de la página actual
    this.comments = this.allMockComments.slice(startIndex, endIndex);

    // Calcular el total de comentarios y páginas
    this.totalComments = this.allMockComments.length;
    this.totalPages = Math.ceil(this.totalComments / this.itemsPerPage);
    console.log('Comentarios paginados:', this.paginatedComments);
  }

  generatePageNumbers(): void {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.getComments();
  }

  showCreateCommentForm(): void {
    this.showCreateModal = true;
    this.showEditModal = false;
    this.showViewModal = false;
    this.selectedComment = null;
  }

  updateComment(comment: Comment): void {
    console.log('Editar comentario:', comment);
    this.selectedComment = { ...comment }; // Crear una copia para no modificar directamente el original
    this.showEditModal = true;
    this.showCreateModal = false;
    this.showViewModal = false;
  }

  deleteComment(comment: Comment): void {
    console.log('Eliminar comentario:', comment);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `¿Estás seguro de que quieres eliminar este comentario?` }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.commentService.deleteComment(comment._id).subscribe({
          next: () => {
            console.log(`Comentario ${comment._id} eliminado`);
            // Eliminar el comentario de la lista
            const index = this.allMockComments.findIndex(c => c._id === comment._id);
            if (index !== -1) {
              this.allMockComments.splice(index, 1);
            }
            this.getComments();
          },
          error: (error) => {
            console.error('Error al eliminar el comentario:', error);
            this.error = 'Error al eliminar el comentario';
            this.loading = false;
          }
        });
      }
    });
  }

  onCommentCreated(success: boolean): void {
    this.showCreateModal = false;
    if (success) {
      this.getComments();
    }
  }

  onCommentEdited(success: boolean): void {
    if (success && this.selectedComment) {
      // Actualizar el comentario en el backend
      this.commentService.updateComment(this.selectedComment._id, this.selectedComment).subscribe({
        next: () => {
          console.log(`Comentario ${this.selectedComment?._id} actualizado correctamente.`);
          this.showEditModal = false;
          this.getComments();
        },
        error: (error) => {
          console.error('Error al actualizar el comentario:', error);
        }
      });
    } else {
      this.showEditModal = false;
    }
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedComment = null;
  }

  trackByCommentId(index: number, comment: Comment): string {
    return comment._id;
  }
}
