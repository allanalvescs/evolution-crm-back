import { CpfCnpj, InvalidCpfCnpjException } from './cpf-cnpj.vo';

describe('CpfCnpj Value Object', () => {
  describe('CPF', () => {
    describe('create', () => {
      it('should create valid CPF without formatting', () => {
        const cpf = CpfCnpj.create('12345678909');

        expect(cpf.value).toBe('12345678909');
        expect(cpf.isCpf()).toBe(true);
        expect(cpf.isCnpj()).toBe(false);
      });

      it('should create valid CPF with formatting', () => {
        const cpf = CpfCnpj.create('123.456.789-09');

        expect(cpf.value).toBe('12345678909');
        expect(cpf.isCpf()).toBe(true);
      });

      it('should reject CPF with all same digits', () => {
        expect(() => CpfCnpj.create('111.111.111-11')).toThrow(
          InvalidCpfCnpjException,
        );
        expect(() => CpfCnpj.create('00000000000')).toThrow(
          InvalidCpfCnpjException,
        );
      });

      it('should reject CPF with invalid check digits', () => {
        expect(() => CpfCnpj.create('123.456.789-00')).toThrow(
          InvalidCpfCnpjException,
        );
      });

      it('should reject empty CPF', () => {
        expect(() => CpfCnpj.create('')).toThrow(InvalidCpfCnpjException);
      });

      it('should reject null or undefined', () => {
        expect(() => CpfCnpj.create(null as any)).toThrow(
          InvalidCpfCnpjException,
        );
        expect(() => CpfCnpj.create(undefined as any)).toThrow(
          InvalidCpfCnpjException,
        );
      });

      it('should reject CPF with wrong length', () => {
        expect(() => CpfCnpj.create('123456789')).toThrow(
          InvalidCpfCnpjException,
        );
        expect(() => CpfCnpj.create('12345678901')).toThrow(
          InvalidCpfCnpjException,
        );
      });
    });

    describe('formatted', () => {
      it('should format CPF correctly', () => {
        const cpf = CpfCnpj.create('12345678909');

        expect(cpf.formatted()).toBe('123.456.789-09');
      });
    });

    describe('equals', () => {
      it('should compare CPFs by value', () => {
        const cpf1 = CpfCnpj.create('12345678909');
        const cpf2 = CpfCnpj.create('123.456.789-09');
        const cpf3 = CpfCnpj.create('98765432100');

        expect(cpf1.equals(cpf2)).toBe(true);
        expect(cpf1.equals(cpf3)).toBe(false);
      });

      it('should return false when comparing with null', () => {
        const cpf = CpfCnpj.create('12345678909');

        expect(cpf.equals(null as any)).toBe(false);
      });
    });
  });

  describe('CNPJ', () => {
    describe('create', () => {
      it('should create valid CNPJ without formatting', () => {
        const cnpj = CpfCnpj.create('11222333000181');

        expect(cnpj.value).toBe('11222333000181');
        expect(cnpj.isCnpj()).toBe(true);
        expect(cnpj.isCpf()).toBe(false);
      });

      it('should create valid CNPJ with formatting', () => {
        const cnpj = CpfCnpj.create('11.222.333/0001-81');

        expect(cnpj.value).toBe('11222333000181');
        expect(cnpj.isCnpj()).toBe(true);
      });

      it('should reject CNPJ with all same digits', () => {
        expect(() => CpfCnpj.create('11.111.111/1111-11')).toThrow(
          InvalidCpfCnpjException,
        );
        expect(() => CpfCnpj.create('00000000000000')).toThrow(
          InvalidCpfCnpjException,
        );
      });

      it('should reject CNPJ with invalid check digits', () => {
        expect(() => CpfCnpj.create('11.222.333/0001-00')).toThrow(
          InvalidCpfCnpjException,
        );
      });

      it('should reject CNPJ with wrong length', () => {
        expect(() => CpfCnpj.create('1122233300018')).toThrow(
          InvalidCpfCnpjException,
        );
        expect(() => CpfCnpj.create('112223330001810')).toThrow(
          InvalidCpfCnpjException,
        );
      });
    });

    describe('formatted', () => {
      it('should format CNPJ correctly', () => {
        const cnpj = CpfCnpj.create('11222333000181');

        expect(cnpj.formatted()).toBe('11.222.333/0001-81');
      });
    });

    describe('equals', () => {
      it('should compare CNPJs by value', () => {
        const cnpj1 = CpfCnpj.create('11222333000181');
        const cnpj2 = CpfCnpj.create('11.222.333/0001-81');
        const cnpj3 = CpfCnpj.create('12345678000195');

        expect(cnpj1.equals(cnpj2)).toBe(true);
        expect(cnpj1.equals(cnpj3)).toBe(false);
      });
    });
  });

  describe('Type checking', () => {
    it('should correctly identify CPF type', () => {
      const cpf = CpfCnpj.create('12345678909');

      expect(cpf.isCpf()).toBe(true);
      expect(cpf.isCnpj()).toBe(false);
    });

    it('should correctly identify CNPJ type', () => {
      const cnpj = CpfCnpj.create('11222333000181');

      expect(cnpj.isCnpj()).toBe(true);
      expect(cnpj.isCpf()).toBe(false);
    });
  });
});
