import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import IndexPage from '../../pages/index.vue';

describe('License Plate Generator - Functionality Tests', () => {
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

  describe('Pattern Increment Logic', () => {
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

      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await wrapper.find('button').trigger('click');

      expect(wrapper.vm.pattern).toBe('ZZZZZZ');
      expect(alertSpy).toHaveBeenCalledWith(
        'Maximum reached! The license plate counter has reached its absolute limit: ZZZZZZ'
      );

      alertSpy.mockRestore();
    });
  });

  describe('Carry Over Logic', () => {
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

  describe('Edge Cases', () => {
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

  describe('Pattern Validation', () => {
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
