import { Validate } from 'class-validator';
import { IsCpfCnpjConstraint } from '../validator/cpf-cnpj/cpf-cnpj.validator';

export function IsCpfCnpj() {
  return Validate(IsCpfCnpjConstraint);
}
