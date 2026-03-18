import { Email, InvalidEmailException } from './email.vo';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create valid email', () => {
      const email = Email.create('usuario@exemplo.com');

      expect(email.value).toBe('usuario@exemplo.com');
    });

    it('should create email with uppercase and convert to lowercase', () => {
      const email = Email.create('Usuario@EXEMPLO.COM');

      expect(email.value).toBe('usuario@exemplo.com');
    });

    it('should trim whitespaces', () => {
      const email = Email.create('  usuario@exemplo.com  ');

      expect(email.value).toBe('usuario@exemplo.com');
    });

    it('should accept email with subdomain', () => {
      const email = Email.create('usuario@mail.exemplo.com');

      expect(email.value).toBe('usuario@mail.exemplo.com');
    });

    it('should accept email with special characters in local part', () => {
      const validEmails = [
        'user.name@exemplo.com',
        'user+tag@exemplo.com',
        'user_name@exemplo.com',
        'user-name@exemplo.com',
        'user123@exemplo.com',
      ];

      validEmails.forEach((emailStr) => {
        const email = Email.create(emailStr);
        expect(email.value).toBe(emailStr);
      });
    });

    it('should reject empty email', () => {
      expect(() => Email.create('')).toThrow(InvalidEmailException);
      expect(() => Email.create('   ')).toThrow(InvalidEmailException);
    });

    it('should reject null or undefined', () => {
      expect(() => Email.create(null as any)).toThrow(InvalidEmailException);
      expect(() => Email.create(undefined as any)).toThrow(
        InvalidEmailException,
      );
    });

    it('should reject email without @', () => {
      expect(() => Email.create('usuarioexemplo.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should reject email without domain', () => {
      expect(() => Email.create('usuario@')).toThrow(InvalidEmailException);
    });

    it('should reject email without local part', () => {
      expect(() => Email.create('@exemplo.com')).toThrow(InvalidEmailException);
    });

    it('should reject email with multiple @', () => {
      expect(() => Email.create('usuario@@exemplo.com')).toThrow(
        InvalidEmailException,
      );
      expect(() => Email.create('user@io@exemplo.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should reject email with invalid characters', () => {
      expect(() => Email.create('usuario espaço@exemplo.com')).toThrow(
        InvalidEmailException,
      );
      expect(() => Email.create('usuario[invalid]@exemplo.com')).toThrow(
        InvalidEmailException,
      );
    });

    it('should reject email with local part > 64 characters', () => {
      const longLocalPart = 'a'.repeat(65) + '@exemplo.com';
      expect(() => Email.create(longLocalPart)).toThrow(InvalidEmailException);
    });

    it('should reject email with domain > 255 characters', () => {
      const longDomain = 'usuario@' + 'a'.repeat(256) + '.com';
      expect(() => Email.create(longDomain)).toThrow(InvalidEmailException);
    });

    it('should reject email with domain part > 63 characters', () => {
      const longDomainPart = 'usuario@' + 'a'.repeat(64) + '.com';
      expect(() => Email.create(longDomainPart)).toThrow(InvalidEmailException);
    });

    it('should reject email without TLD', () => {
      expect(() => Email.create('usuario@exemplo')).toThrow(
        InvalidEmailException,
      );
    });
  });

  describe('domain', () => {
    it('should return domain part', () => {
      const email = Email.create('usuario@exemplo.com');

      expect(email.domain).toBe('exemplo.com');
    });

    it('should return domain with subdomain', () => {
      const email = Email.create('usuario@mail.exemplo.com.br');

      expect(email.domain).toBe('mail.exemplo.com.br');
    });
  });

  describe('localPart', () => {
    it('should return local part', () => {
      const email = Email.create('usuario@exemplo.com');

      expect(email.localPart).toBe('usuario');
    });

    it('should return local part with special characters', () => {
      const email = Email.create('user.name+tag@exemplo.com');

      expect(email.localPart).toBe('user.name+tag');
    });
  });

  describe('equals', () => {
    it('should compare emails by value', () => {
      const email1 = Email.create('usuario@exemplo.com');
      const email2 = Email.create('USUARIO@EXEMPLO.COM');
      const email3 = Email.create('outro@exemplo.com');

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const email = Email.create('usuario@exemplo.com');

      expect(email.equals(null as any)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be immutable - TypeScript enforces readonly', () => {
      const email = Email.create('usuario@exemplo.com');

      // TypeScript garante imutabilidade em tempo de compilação
      // Este teste documenta a expectativa de imutabilidade
      expect(email.value).toBe('usuario@exemplo.com');

      // Tentar mudar resultaria em erro de compilação TypeScript:
      // email._value = 'outro@exemplo.com'; // Error: Cannot assign to '_value' because it is a read-only property
    });
  });
});
