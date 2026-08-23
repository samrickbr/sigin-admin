import { z } from 'zod';

export const enderecoSchema = z.object({
  cep: z.string().min(1, 'CEP é obrigatório.'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório.'),
  numero: z.string().min(1, 'Número é obrigatório.'),
  complemento: z.string().optional(),
  bairro: z.string().min(1, 'Bairro é obrigatório.'),
  cidade: z.string().min(1, 'Cidade é obrigatória.'),
  uf: z.string().min(2, 'UF é obrigatória.').max(2, 'UF deve possuir 2 caracteres.'),
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
