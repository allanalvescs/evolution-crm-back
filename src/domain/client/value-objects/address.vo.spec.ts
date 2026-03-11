import { Address, InvalidAddressException, AddressProps } from './address.vo';

describe('Address Value Object', () => {
  const validAddressProps: AddressProps = {
    street: 'Av. Paulista',
    number: '1000',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    complement: 'Apto 101',
  };

  describe('create', () => {
    it('should create valid address with all fields', () => {
      const address = Address.create(validAddressProps);

      expect(address.street).toBe('Av. Paulista');
      expect(address.number).toBe('1000');
      expect(address.neighborhood).toBe('Bela Vista');
      expect(address.city).toBe('São Paulo');
      expect(address.state).toBe('SP');
      expect(address.zipCode).toBe('01310100');
      expect(address.complement).toBe('Apto 101');
    });

    it('should create address without complement', () => {
      const props = { ...validAddressProps };
      delete props.complement;

      const address = Address.create(props);

      expect(address.complement).toBeUndefined();
    });

    it('should trim whitespaces from fields', () => {
      const props: AddressProps = {
        street: '  Av. Paulista  ',
        number: '  1000  ',
        neighborhood: '  Bela Vista  ',
        city: '  São Paulo  ',
        state: '  SP  ',
        zipCode: '01310-100',
        complement: '  Apto 101  ',
      };

      const address = Address.create(props);

      expect(address.street).toBe('Av. Paulista');
      expect(address.number).toBe('1000');
      expect(address.neighborhood).toBe('Bela Vista');
      expect(address.city).toBe('São Paulo');
      expect(address.state).toBe('SP');
      expect(address.complement).toBe('Apto 101');
    });

    it('should convert state to uppercase', () => {
      const props = { ...validAddressProps, state: 'sp' };

      const address = Address.create(props);

      expect(address.state).toBe('SP');
    });

    it('should clean zipCode formatting', () => {
      const formats = ['01310-100', '01310100', '01.310-100'];

      formats.forEach((zipCode) => {
        const props = { ...validAddressProps, zipCode };
        const address = Address.create(props);
        expect(address.zipCode).toBe('01310100');
      });
    });
  });

  describe('Validation', () => {
    it('should reject empty street', () => {
      const props = { ...validAddressProps, street: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject empty number', () => {
      const props = { ...validAddressProps, number: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject empty neighborhood', () => {
      const props = { ...validAddressProps, neighborhood: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject empty city', () => {
      const props = { ...validAddressProps, city: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject empty state', () => {
      const props = { ...validAddressProps, state: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject empty zipCode', () => {
      const props = { ...validAddressProps, zipCode: '' };
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });

    it('should reject invalid state format', () => {
      const invalidStates = ['S', 'SPP', 'S1', '12'];

      invalidStates.forEach((state) => {
        const props = { ...validAddressProps, state };
        expect(() => Address.create(props)).toThrow(InvalidAddressException);
      });
    });

    it('should reject non-existing Brazilian states', () => {
      const invalidStates = ['XX', 'YY', 'ZZ', 'AB'];

      invalidStates.forEach((state) => {
        const props = { ...validAddressProps, state };
        expect(() => Address.create(props)).toThrow(InvalidAddressException);
      });
    });

    it('should accept all valid Brazilian states', () => {
      const validStates = [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO',
      ];

      validStates.forEach((state) => {
        const props = { ...validAddressProps, state };
        const address = Address.create(props);
        expect(address.state).toBe(state);
      });
    });

    it('should reject zipCode with wrong length', () => {
      const invalidZipCodes = ['0131010', '013101000', '01310'];

      invalidZipCodes.forEach((zipCode) => {
        const props = { ...validAddressProps, zipCode };
        expect(() => Address.create(props)).toThrow(InvalidAddressException);
      });
    });

    it('should reject zipCode with letters', () => {
      const props = { ...validAddressProps, zipCode: '0131A-100' };

      // Isso não deve lançar erro, pois letras são removidas
      // Mas o resultado não terá 8 dígitos
      expect(() => Address.create(props)).toThrow(InvalidAddressException);
    });
  });

  describe('formattedZipCode', () => {
    it('should return formatted zipCode', () => {
      const address = Address.create(validAddressProps);

      expect(address.formattedZipCode).toBe('01310-100');
    });
  });

  describe('toString', () => {
    it('should return formatted address string with all fields', () => {
      const address = Address.create(validAddressProps);

      const expected =
        'Av. Paulista, 1000, Apto 101, Bela Vista, São Paulo - SP, 01310-100';

      expect(address.toString()).toBe(expected);
    });

    it('should return formatted address string without complement', () => {
      const props = { ...validAddressProps };
      delete props.complement;

      const address = Address.create(props);

      const expected =
        'Av. Paulista, 1000, Bela Vista, São Paulo - SP, 01310-100';

      expect(address.toString()).toBe(expected);
    });
  });

  describe('equals', () => {
    it('should compare addresses by value', () => {
      const address1 = Address.create(validAddressProps);
      const address2 = Address.create({ ...validAddressProps });

      expect(address1.equals(address2)).toBe(true);
    });

    it('should return false for different addresses', () => {
      const address1 = Address.create(validAddressProps);
      const address2 = Address.create({
        ...validAddressProps,
        number: '2000',
      });

      expect(address1.equals(address2)).toBe(false);
    });

    it('should return false when complement is different', () => {
      const address1 = Address.create(validAddressProps);
      const props2 = { ...validAddressProps, complement: 'Apto 202' };
      const address2 = Address.create(props2);

      expect(address1.equals(address2)).toBe(false);
    });

    it('should return false when one has complement and other does not', () => {
      const address1 = Address.create(validAddressProps);
      const props2 = { ...validAddressProps };
      delete props2.complement;
      const address2 = Address.create(props2);

      expect(address1.equals(address2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const address = Address.create(validAddressProps);

      expect(address.equals(null as any)).toBe(false);
    });
  });

  describe('Immutability', () => {
    it('should be immutable - TypeScript enforces readonly', () => {
      const address = Address.create(validAddressProps);

      // TypeScript garante imutabilidade em tempo de compilação
      // Este teste documenta a expectativa de imutabilidade
      expect(address.street).toBe('Av. Paulista');
      expect(address.city).toBe('São Paulo');

      // Tentar mudar resultaria em erro de compilação TypeScript:
      // address._street = 'Outra Rua'; // Error: Cannot assign to '_street' because it is a read-only property
    });
  });

  describe('Edge cases', () => {
    it('should accept number as "S/N" (sem número)', () => {
      const props = { ...validAddressProps, number: 'S/N' };
      const address = Address.create(props);

      expect(address.number).toBe('S/N');
    });

    it('should accept very long street names', () => {
      const props = {
        ...validAddressProps,
        street: 'Avenida Brigadeiro Faria Lima',
      };
      const address = Address.create(props);

      expect(address.street).toBe('Avenida Brigadeiro Faria Lima');
    });

    it('should handle addresses with special characters', () => {
      const props = {
        ...validAddressProps,
        street: 'Rua São João',
        neighborhood: 'Jardim América',
      };
      const address = Address.create(props);

      expect(address.street).toBe('Rua São João');
      expect(address.neighborhood).toBe('Jardim América');
    });
  });
});
