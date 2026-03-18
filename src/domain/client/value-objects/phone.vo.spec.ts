import { Phone, InvalidPhoneException } from './phone.vo';

describe('Phone Value Object', () => {
  describe('Cellphone (11 digits)', () => {
    describe('create', () => {
      it('should create valid cellphone without formatting', () => {
        const phone = Phone.create('11987654321');

        expect(phone.value).toBe('11987654321');
        expect(phone.isCellphone()).toBe(true);
        expect(phone.isLandline()).toBe(false);
      });

      it('should create valid cellphone with formatting', () => {
        const phone = Phone.create('(11) 98765-4321');

        expect(phone.value).toBe('11987654321');
        expect(phone.isCellphone()).toBe(true);
      });

      it('should create cellphone with various formats', () => {
        const formats = [
          '11 98765-4321',
          '11-98765-4321',
          '(11)98765-4321',
          '11 9 8765-4321',
        ];

        formats.forEach((format) => {
          const phone = Phone.create(format);
          expect(phone.value).toBe('11987654321');
        });
      });

      it('should reject cellphone without 9 as third digit', () => {
        expect(() => Phone.create('11887654321')).toThrow(
          InvalidPhoneException,
        );
      });

      it('should reject cellphone with all same digits', () => {
        expect(() => Phone.create('99999999999')).toThrow(
          InvalidPhoneException,
        );
      });
    });

    describe('properties', () => {
      it('should return DDD correctly', () => {
        const phone = Phone.create('11987654321');

        expect(phone.ddd).toBe('11');
      });

      it('should return number without DDD', () => {
        const phone = Phone.create('11987654321');

        expect(phone.number).toBe('987654321');
      });
    });

    describe('formatted', () => {
      it('should format cellphone correctly', () => {
        const phone = Phone.create('11987654321');

        expect(phone.formatted()).toBe('(11) 98765-4321');
      });
    });
  });

  describe('Landline (10 digits)', () => {
    describe('create', () => {
      it('should create valid landline without formatting', () => {
        const phone = Phone.create('1134567890');

        expect(phone.value).toBe('1134567890');
        expect(phone.isLandline()).toBe(true);
        expect(phone.isCellphone()).toBe(false);
      });

      it('should create valid landline with formatting', () => {
        const phone = Phone.create('(11) 3456-7890');

        expect(phone.value).toBe('1134567890');
        expect(phone.isLandline()).toBe(true);
      });

      it('should reject landline with 9 as third digit', () => {
        expect(() => Phone.create('1194567890')).toThrow(InvalidPhoneException);
      });

      it('should reject landline with all same digits', () => {
        expect(() => Phone.create('9999999999')).toThrow(InvalidPhoneException);
      });
    });

    describe('formatted', () => {
      it('should format landline correctly', () => {
        const phone = Phone.create('1134567890');

        expect(phone.formatted()).toBe('(11) 3456-7890');
      });
    });
  });

  describe('Validation', () => {
    it('should reject empty phone', () => {
      expect(() => Phone.create('')).toThrow(InvalidPhoneException);
      expect(() => Phone.create('   ')).toThrow(InvalidPhoneException);
    });

    it('should reject null or undefined', () => {
      expect(() => Phone.create(null as any)).toThrow(InvalidPhoneException);
      expect(() => Phone.create(undefined as any)).toThrow(
        InvalidPhoneException,
      );
    });

    it('should reject phone with wrong length', () => {
      expect(() => Phone.create('119876543')).toThrow(InvalidPhoneException);
      expect(() => Phone.create('119876543210')).toThrow(InvalidPhoneException);
    });

    it('should reject phone with invalid DDD', () => {
      expect(() => Phone.create('0987654321')).toThrow(InvalidPhoneException);
      expect(() => Phone.create('1087654321')).toThrow(InvalidPhoneException);
    });

    describe('Valid DDDs', () => {
      it('should accept all valid Brazilian DDDs', () => {
        const validDDDs = [
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19', // SP
          '21',
          '22',
          '24', // RJ
          '27',
          '28', // ES
          '31',
          '32',
          '33',
          '34',
          '35',
          '37',
          '38', // MG
          '41',
          '42',
          '43',
          '44',
          '45',
          '46', // PR
          '47',
          '48',
          '49', // SC
          '51',
          '53',
          '54',
          '55', // RS
          '61', // DF
          '62',
          '64', // GO
          '63', // TO
          '65',
          '66', // MT
          '67', // MS
          '68', // AC
          '69', // RO
          '71',
          '73',
          '74',
          '75',
          '77', // BA
          '79', // SE
          '81',
          '87', // PE
          '82', // AL
          '83', // PB
          '84', // RN
          '85',
          '88', // CE
          '86',
          '89', // PI
          '91',
          '93',
          '94', // PA
          '92',
          '97', // AM
          '95', // RR
          '96', // AP
          '98',
          '99', // MA
        ];

        validDDDs.forEach((ddd) => {
          const phone = Phone.create(`${ddd}987654321`);
          expect(phone.ddd).toBe(ddd);
        });
      });
    });
  });

  describe('equals', () => {
    it('should compare phones by value', () => {
      const phone1 = Phone.create('11987654321');
      const phone2 = Phone.create('(11) 98765-4321');
      const phone3 = Phone.create('21987654321');

      expect(phone1.equals(phone2)).toBe(true);
      expect(phone1.equals(phone3)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const phone = Phone.create('11987654321');

      expect(phone.equals(null as any)).toBe(false);
    });
  });

  describe('Type checking', () => {
    it('should correctly identify cellphone', () => {
      const cellphone = Phone.create('11987654321');

      expect(cellphone.isCellphone()).toBe(true);
      expect(cellphone.isLandline()).toBe(false);
    });

    it('should correctly identify landline', () => {
      const landline = Phone.create('1134567890');

      expect(landline.isLandline()).toBe(true);
      expect(landline.isCellphone()).toBe(false);
    });
  });
});
