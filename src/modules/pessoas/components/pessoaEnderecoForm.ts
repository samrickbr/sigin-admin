import { z } from 'zod';

export const enderecoSchema = z.object({
  cep: z
    .string()
    .min(1, 'CEP é obrigatório.')
    .regex(/^\d{8}$/, 'CEP deve possuir 8 números.'),

  logradouro: z.string().trim().min(1, 'Logradouro é obrigatório.'),

  numero: z
    .string()
    .trim()
    .min(1, 'Número é obrigatório.')
    .max(20, 'Número deve possuir no máximo 20 caracteres.'),

  complemento: z
    .string()
    .trim()
    .max(100, 'Complemento deve possuir no máximo 100 caracteres.')
    .optional(),

  bairro: z
    .string()
    .trim()
    .min(1, 'Bairro é obrigatório.')
    .max(100, 'Bairro deve possuir no máximo 100 caracteres.'),

  cidade: z
    .string()
    .trim()
    .min(1, 'Cidade é obrigatória.')
    .max(100, 'Cidade deve possuir no máximo 100 caracteres.'),

  uf: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, 'UF deve possuir 2 letras.')
    .transform((value) => value.toUpperCase()),

  principal: z.boolean(),
});

export type EnderecoFormData = z.infer<typeof enderecoSchema>;

export const enderecoDefaultValues: EnderecoFormData = {
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  principal: false,
};
