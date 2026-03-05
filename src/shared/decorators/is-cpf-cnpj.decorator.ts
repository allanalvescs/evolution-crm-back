import { Validate } from 'class-validator';
import { IsCpfCnpjConstraint } from 'src/shared/validator/cpf-cnpj.validator';

export function IsCpfCnpj() {
  return Validate(IsCpfCnpjConstraint);
}
