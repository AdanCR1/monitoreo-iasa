// src/services/reviews.service.ts
import { reviewsHttp } from './http';

export const reviewsService = {
  dashboard: () =>
    reviewsHttp.get('/api/v1/metrics/dashboard').then((r) => r.data),

  auditoria: (params?: { limit?: number; offset?: number; entidad?: string }) =>
    reviewsHttp.get('/api/v1/metrics/auditoria', { params }).then((r) => r.data),

  emitirDictamen: (payload: {
    informe_id: string;
    informe_version_id: string;
    resultado: string;
    dictamen_general: string;
    observaciones?: string[];
  }) => reviewsHttp.post('/api/v1/revisiones', payload).then((r) => r.data),
};