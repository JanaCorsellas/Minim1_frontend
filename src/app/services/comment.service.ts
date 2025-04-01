import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';  // Ajusta la ruta según tu proyecto

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/api/comments';  // URL de la API

  constructor(private http: HttpClient) { }

  // Obtener comentarios paginados de una actividad
  getPaginatedComments(activityId: string, page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    // Llamada HTTP GET para obtener los comentarios
    return this.http.get<any>(`${this.apiUrl}/activity/${activityId}`, { params });
  }

  // Buscar comentarios por contenido
  searchComments(query: string): Observable<Comment[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Comment[]>(`${this.apiUrl}/search`, { params });
  }

  // Obtener un comentario por ID
  getCommentById(commentId: string): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }

  // Crear un nuevo comentario
  createComment(commentData: any): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, commentData);
  }

  // Actualizar un comentario
  updateComment(commentId: string, commentData: any): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, commentData);
  }

  // Eliminar un comentario
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`);
  }
}
