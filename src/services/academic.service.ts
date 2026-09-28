// src/services/academic.service.ts
import { academicHttp } from './http';

export const academicService = {
  listProyectos: () =>
    academicHttp.get('/api/v1/proyectos').then((r) => r.data),

  crearProyecto: (payload: { titulo: string; descripcion: string }) =>
    academicHttp.post('/api/v1/proyectos', payload).then((r) => r.data),

  listInformes: (params?: { estado?: string }) =>
    academicHttp.get('/api/v1/informes', { params }).then((r) => r.data),

  getInforme: (id: string) =>
    academicHttp.get(`/api/v1/informes/${id}`).then((r) => r.data),

  transicion: (id: string, payload: { nuevo_estado: string; comentario?: string }) =>
    academicHttp.post(`/api/v1/informes/${id}/transicion`, payload).then((r) => r.data),
};