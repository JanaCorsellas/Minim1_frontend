import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { ActivityService } from '../../services/activity.service'; // Si el comentario está asociado con una actividad, por ejemplo

@Component({
  selector: 'app-comment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent implements OnInit {
  commentForm: FormGroup;
  loading = false;
  error = '';
  
  @Output() commentCreated = new EventEmitter<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private commentService: CommentService,
    private activityService: ActivityService // Si el comentario está relacionado con una actividad
  ) {
    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.minLength(1)]],  // Contenido del comentario
      activityId: ['', [Validators.required]] // Puede ser opcional si el comentario está relacionado con una actividad
    });
  }

  ngOnInit(): void {
    // Si se necesita cargar alguna información adicional, lo puedes hacer aquí
  }

  onSubmit(): void {
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = this.commentForm.value;

    // Crear los datos necesarios para enviar al backend
    const requestData = {
      content: formData.content,
      activityId: formData.activityId // Enviar el ID de la actividad si es necesario
    };

    console.log("Enviando datos de comentario", requestData);

    this.commentService.createComment(requestData).subscribe({
      next: (response) => {
        console.log('Comentario creado:', response);
        this.loading = false;
        this.commentCreated.emit(true); // Emitir un evento para notificar al componente padre
        this.resetForm();
      },
      error: (error) => {
        this.loading = false;
        console.error('Error al crear comentario:', error);

        // Si es posible, mostrar el mensaje de error detallado
        if (error.error && error.error.message) {
          this.error = error.error.message;
        } else {
          this.error = error.message || "Error al crear el comentario";
        }
      }
    });
  }

  resetForm(): void {
    this.commentForm.reset(); // Resetear el formulario
  }

  cancel(): void {
    this.commentCreated.emit(false); // Emitir false si se cancela la creación del comentario
  }

  hasError(controlName: string, errorType: string): boolean {
    return !!this.commentForm.get(controlName)?.hasError(errorType) && 
           !!(this.commentForm.get(controlName)?.touched || this.commentForm.get(controlName)?.dirty);
  }
}
