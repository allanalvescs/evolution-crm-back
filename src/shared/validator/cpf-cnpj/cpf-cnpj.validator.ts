import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { EClientType } from '../../enum/client-type';

@ValidatorConstraint({ name: 'isCpfCnpj', async: false })
export class IsCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    const object = args.object as any;
    const type = object.type;

    if (!value || !type) {
      return false;
    }

    // Remove qualquer caractere não numérico
    const cleanValue = value.replace(/\D/g, '');

    if (type === EClientType.PF) {
      // CPF deve ter exatos 11 dígitos
      return cleanValue.length === 11;
    } else if (type === EClientType.PJ) {
      // CNPJ deve ter exatos 14 dígitos
      return cleanValue.length === 14;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    const object = args.object as any;
    const type = object.type;

    if (type === EClientType.PF) {
      return 'CPF deve conter exatos 11 dígitos para PF';
    } else if (type === EClientType.PJ) {
      return 'CNPJ deve conter exatos 14 dígitos para PJ';
    }

    return 'cpfCnpj inválido para o tipo de cliente';
  }
}
