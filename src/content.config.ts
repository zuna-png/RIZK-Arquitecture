import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const texto = z.object({
  titulo: z.string(),
  descripcion: z.string(),
});

const proyectos = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/proyectos' }),
  schema: ({ image }) =>
    z.object({
      orden: z.number(),
      /** Línea de negocio: visualización (render para terceros) o arquitectura (diseño propio). */
      tipo: z.enum(['visualizacion', 'arquitectura']),
      categoria: z.enum(['residencial', 'vivienda-vertical', 'comercial', 'interiorismo', 'rehabilitacion']),
      vista: z.enum(['exterior', 'interior', 'aerea']),
      portada: image(),
      /** Encuadre de la imagen al recortarse (CSS object-position). */
      encuadre: z.string().default('50% 50%'),
      cliente: z.string().optional(),
      ubicacion: z.string().optional(),
      anio: z.number().optional(),
      publicado: z.boolean().default(true),
      es: texto,
      en: texto,
    }),
});

export const collections = { proyectos };
