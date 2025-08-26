import { describe, it, expect } from 'vitest';

// Copiamos la lógica de incremento exacta de la página para testearla directamente
function incrementPattern(currentPattern) {
  if (currentPattern === 'ZZZZZZ') {
    return 'ZZZZZZ'; // No cambia si ya es el máximo
  }

  const characters = currentPattern.split('');

  // Check if the current pattern needs transition (all numbers are 9)
  const needsTransition = () => {
    for (const char of characters) {
      if (!isNaN(char) && char !== '9') {
        return false;
      }
    }
    return true;
  };

  if (needsTransition()) {
    // Make the transition because all numbers are 9
    let allLettersZ = true;
    let hasLetters = false;

    for (const char of characters) {
      if (isNaN(char)) {
        hasLetters = true;
        if (char !== 'Z') {
          allLettersZ = false;
        }
      }
    }

    if (hasLetters && !allLettersZ) {
      // Increment the last letter that is not Z
      for (let i = characters.length - 1; i >= 0; i--) {
        if (isNaN(characters[i]) && characters[i] !== 'Z') {
          characters[i] = String.fromCharCode(characters[i].charCodeAt(0) + 1);

          // Reset all numbers to 0 and subsequent letters to A
          for (let j = 0; j < characters.length; j++) {
            if (!isNaN(characters[j])) {
              characters[j] = '0';
            } else if (j > i) {
              characters[j] = 'A';
            }
          }
          break;
        }
      }
    } else if (hasLetters && allLettersZ) {
      // Convert another digit to letter A
      for (let i = characters.length - 1; i >= 0; i--) {
        if (!isNaN(characters[i])) {
          characters[i] = 'A';

          // Reset everything else
          for (let j = 0; j < characters.length; j++) {
            if (j !== i) {
              if (!isNaN(characters[j])) {
                characters[j] = '0';
              } else {
                characters[j] = 'A';
              }
            }
          }
          break;
        }
      }
    } else {
      // First transition: convert last digit to A
      for (let i = characters.length - 1; i >= 0; i--) {
        if (!isNaN(characters[i])) {
          characters[i] = 'A';

          // Reset other numbers to 0
          for (let j = 0; j < i; j++) {
            if (!isNaN(characters[j])) {
              characters[j] = '0';
            }
          }
          break;
        }
      }
    }
  } else {
    // Normal increment
    let carry = 1;
    for (let i = characters.length - 1; i >= 0 && carry; i--) {
      if (!isNaN(characters[i])) {
        const num = parseInt(characters[i]) + carry;
        if (num > 9) {
          characters[i] = '0';
          carry = 1;
        } else {
          characters[i] = num.toString();
          carry = 0;
        }
      }
    }
  }

  return characters.join('');
}

describe('License Plate Generator - Logic Tests', () => {
  describe('Pattern Increment Logic', () => {
    it('should increment from 000000 to 000001', () => {
      expect(incrementPattern('000000')).toBe('000001');
    });

    it('should increment from 000009 to 000010', () => {
      expect(incrementPattern('000009')).toBe('000010');
    });

    it('should increment from 000099 to 000100', () => {
      expect(incrementPattern('000099')).toBe('000100');
    });

    it('should increment from 999999 to 00000A', () => {
      expect(incrementPattern('999999')).toBe('00000A');
    });

    it('should increment from 00000Z to 00001Z', () => {
      expect(incrementPattern('00000Z')).toBe('00001Z');
    });

    it('should increment from 99999Z to 0000AA', () => {
      expect(incrementPattern('99999Z')).toBe('0000AA');
    });

    it('should increment from ZZZZZ9 to AAAAAA', () => {
      expect(incrementPattern('ZZZZZ9')).toBe('AAAAAA');
    });

    it('should not increment from ZZZZZZ (maximum)', () => {
      expect(incrementPattern('ZZZZZZ')).toBe('ZZZZZZ');
    });
  });

  describe('Carry Over Logic', () => {
    it('should handle carry over from 9 to 0 in last position', () => {
      expect(incrementPattern('000009')).toBe('000010');
    });

    it('should handle carry over from Z to next digit', () => {
      expect(incrementPattern('0000ZZ')).toBe('0001ZZ');
    });

    it('should handle multiple carry overs', () => {
      expect(incrementPattern('00ZZZZ')).toBe('01ZZZZ');
    });
  });

  describe('Edge Cases', () => {
    it('should handle increment from 9ZZZZZ', () => {
      expect(incrementPattern('9ZZZZZ')).toBe('AAAAAA');
    });

    it('should handle increment from AZZZZ9', () => {
      expect(incrementPattern('AZZZZ9')).toBe('BAAAA0');
    });

    it('should correctly transition from all 9s to letter format', () => {
      expect(incrementPattern('999999')).toBe('00000A');
    });
  });

  describe('Pattern Validation', () => {
    it('should maintain 6-character length', () => {
      const patterns = ['000000', '000009', '99999Z', 'AAAAAA', 'ZZZZZZ'];
      patterns.forEach((pattern) => {
        const result = incrementPattern(pattern);
        expect(result.length).toBe(6);
      });
    });

    it('should only contain valid characters (0-9, A-Z)', () => {
      const patterns = ['000000', '000009', '99999Z', 'AAAAAA'];
      patterns.forEach((pattern) => {
        const result = incrementPattern(pattern);
        const validPattern = /^[0-9A-Z]{6}$/.test(result);
        expect(validPattern).toBe(true);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should handle rapid increments efficiently', () => {
      const startTime = performance.now();
      let pattern = '000000';

      for (let i = 0; i < 1000; i++) {
        pattern = incrementPattern(pattern);
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete 1000 increments in less than 100ms
      expect(duration).toBeLessThan(100);
    });

    it('should maintain pattern integrity after many increments', () => {
      let pattern = '000000';

      // Perform 50 increments
      for (let i = 0; i < 50; i++) {
        pattern = incrementPattern(pattern);
      }

      // Pattern should still be valid 6-character alphanumeric
      expect(pattern.length).toBe(6);
      expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      expect(pattern).not.toBe('000000');
    });
  });

  describe('Sequence Validation', () => {
    it('should follow correct numeric sequence', () => {
      let pattern = '000000';
      const expectedSequence = [
        '000001',
        '000002',
        '000003',
        '000004',
        '000005',
      ];

      expectedSequence.forEach((expected) => {
        pattern = incrementPattern(pattern);
        expect(pattern).toBe(expected);
      });
    });

    it('should correctly handle transition at 9', () => {
      expect(incrementPattern('000008')).toBe('000009');
      expect(incrementPattern('000009')).toBe('000010');
      expect(incrementPattern('00000A')).toBe('00001A');
    });

    it('should correctly handle transition at Z', () => {
      expect(incrementPattern('00000Y')).toBe('00001Y');
      expect(incrementPattern('00000Z')).toBe('00001Z');
      expect(incrementPattern('00001A')).toBe('00002A');
    });
  });
});
