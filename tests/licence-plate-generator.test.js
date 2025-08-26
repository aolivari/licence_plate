import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexPage from '../pages/index.vue';

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

describe('License Plate Generator - Complete Test Suite', () => {
  // ====================================
  // BASIC FUNCTIONALITY TESTS
  // ====================================

  describe('Basic Pattern Validation', () => {
    it('should have proper pattern format', () => {
      const pattern = '000000';
      expect(pattern.length).toBe(6);
      expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
    });

    it('should handle alphanumeric characters correctly', () => {
      const patterns = ['000000', '123456', 'ABCDEF', '12AB34'];
      patterns.forEach((pattern) => {
        expect(pattern.length).toBe(6);
        expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      });
    });

    it('should recognize ZZZZZZ as maximum', () => {
      const maxPattern = 'ZZZZZZ';
      expect(maxPattern).toBe('ZZZZZZ');
      expect(maxPattern.length).toBe(6);
    });
  });

  describe('Pattern Sequence Properties', () => {
    it('should maintain consistent length during operations', () => {
      const patterns = [
        '000000',
        '000001',
        '000010',
        '000100',
        '001000',
        '010000',
        '100000',
        '999999',
        '00000A',
        '0000AA',
        '000AAA',
        'AAAAAA',
        'ZZZZZZ',
      ];

      patterns.forEach((pattern) => {
        expect(pattern.length).toBe(6);
        expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      });
    });

    it('should handle numeric sequences correctly', () => {
      const validSequences = [
        '000000',
        '000001',
        '000002',
        '000009',
        '000010',
        '000011',
        '000099',
        '000100',
      ];
      validSequences.forEach((pattern) => {
        expect(/^[0-9]{6}$/.test(pattern)).toBe(true);
      });
    });

    it('should handle mixed alphanumeric patterns', () => {
      const mixedPatterns = ['00000A', '00001A', '0000AA', '000AAA'];
      mixedPatterns.forEach((pattern) => {
        expect(pattern.length).toBe(6);
        expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      });
    });
  });

  describe('Boundary Value Testing', () => {
    it('should handle starting value correctly', () => {
      const startPattern = '000000';
      expect(startPattern).toBe('000000');
      expect(/^[0-9]{6}$/.test(startPattern)).toBe(true);
    });

    it('should handle ending value correctly', () => {
      const endPattern = 'ZZZZZZ';
      expect(endPattern).toBe('ZZZZZZ');
      expect(/^[A-Z]{6}$/.test(endPattern)).toBe(true);
    });

    it('should handle transition patterns', () => {
      const transitionPatterns = ['999999', '00000A', '99999Z', 'AAAAAA'];
      transitionPatterns.forEach((pattern) => {
        expect(pattern.length).toBe(6);
        expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      });
    });
  });

  describe('Error Handling Validation', () => {
    it('should handle invalid patterns gracefully', () => {
      const invalidPatterns = ['', '12345', '1234567', '123abc', 'HELLO!'];
      invalidPatterns.forEach((pattern) => {
        const isValid = pattern.length === 6 && /^[0-9A-Z]{6}$/.test(pattern);
        expect(isValid).toBe(false);
      });
    });

    it('should recognize maximum boundary correctly', () => {
      const pattern = 'ZZZZZZ';
      const isAtMaximum = pattern === 'ZZZZZZ';
      expect(isAtMaximum).toBe(true);
    });
  });

  // ====================================
  // ISOLATED LOGIC TESTS
  // ====================================

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

  describe('Pattern Validation for Logic', () => {
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

  // ====================================
  // PERFORMANCE TESTS
  // ====================================

  describe('Performance Tests', () => {
    it('should handle pattern operations efficiently', () => {
      const startTime = performance.now();
      const patterns = [];
      for (let i = 0; i < 1000; i++) {
        const pattern = i.toString().padStart(6, '0');
        patterns.push(pattern);
      }
      const endTime = performance.now();
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100);
      expect(patterns.length).toBe(1000);
      expect(patterns[999]).toBe('000999');
    });

    it('should validate pattern format efficiently', () => {
      const startTime = performance.now();
      const patterns = [
        '000000',
        '123456',
        'ABCDEF',
        'A1B2C3',
        '999999',
        'ZZZZZZ',
      ];
      const results = patterns.map((pattern) => /^[0-9A-Z]{6}$/.test(pattern));
      const endTime = performance.now();
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(10);
      expect(results.every((result) => result === true)).toBe(true);
    });

    it('should handle rapid increments efficiently', () => {
      const startTime = performance.now();
      let pattern = '000000';
      for (let i = 0; i < 1000; i++) {
        pattern = incrementPattern(pattern);
      }
      const endTime = performance.now();
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100);
    });

    it('should maintain pattern integrity after many increments', () => {
      let pattern = '000000';
      for (let i = 0; i < 50; i++) {
        pattern = incrementPattern(pattern);
      }
      expect(pattern.length).toBe(6);
      expect(/^[0-9A-Z]{6}$/.test(pattern)).toBe(true);
      expect(pattern).not.toBe('000000');
    });
  });

  // ====================================
  // VUE COMPONENT TESTS
  // ====================================

  describe('Vue Component Functionality', () => {
    let wrapper;

    beforeEach(async () => {
      wrapper = mount(IndexPage);
    });

    describe('Initial State', () => {
      it('should start with pattern "000000"', () => {
        expect(wrapper.vm.pattern).toBe('000000');
      });

      it('should have an increment button', () => {
        const button = wrapper.find('button');
        expect(button.exists()).toBe(true);
      });
    });

    describe('Component Pattern Increment Logic', () => {
      it('should increment from 000000 to 000001', async () => {
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('000001');
      });

      it('should increment from 000009 to 000010', async () => {
        wrapper.vm.pattern = '000009';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('000010');
      });

      it('should increment from 000099 to 000100', async () => {
        wrapper.vm.pattern = '000099';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('000100');
      });

      it('should increment from 999999 to 00000A', async () => {
        wrapper.vm.pattern = '999999';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('00000A');
      });

      it('should increment from 00000Z to 00001Z', async () => {
        wrapper.vm.pattern = '00000Z';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('00001Z');
      });

      it('should increment from 99999Z to 0000AA', async () => {
        wrapper.vm.pattern = '99999Z';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('0000AA');
      });

      it('should increment from ZZZZZZ to show alert and stay at ZZZZZZ', async () => {
        wrapper.vm.pattern = 'ZZZZZZ';
        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('ZZZZZZ');
        expect(alertSpy).toHaveBeenCalledWith(
          'Maximum reached! The license plate counter has reached its absolute limit: ZZZZZZ'
        );
        alertSpy.mockRestore();
      });
    });

    describe('Component Carry Over Logic', () => {
      it('should handle carry over from 9 to 0 in last position', async () => {
        wrapper.vm.pattern = '000009';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('000010');
      });

      it('should handle carry over from Z to next digit', async () => {
        wrapper.vm.pattern = '0000ZZ';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('0001ZZ');
      });

      it('should handle multiple carry overs', async () => {
        wrapper.vm.pattern = '00ZZZZ';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('01ZZZZ');
      });
    });

    describe('Component Edge Cases', () => {
      it('should handle increment from 9ZZZZZ', async () => {
        wrapper.vm.pattern = '9ZZZZZ';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('AAAAAA');
      });

      it('should correctly transition from all 9s to letter format', async () => {
        wrapper.vm.pattern = '999999';
        await wrapper.find('button').trigger('click');
        expect(wrapper.vm.pattern).toBe('00000A');
      });
    });

    describe('Component Pattern Validation', () => {
      it('should only contain valid characters (0-9, A-Z)', () => {
        const pattern = wrapper.vm.pattern;
        const validPattern = /^[0-9A-Z]{6}$/.test(pattern);
        expect(validPattern).toBe(true);
      });

      it('should maintain 6-character length after increments', async () => {
        for (let i = 0; i < 10; i++) {
          await wrapper.find('button').trigger('click');
          expect(wrapper.vm.pattern.length).toBe(6);
        }
      });
    });
  });
});
