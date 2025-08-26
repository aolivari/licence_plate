<template>
  <div>
    <div style="margin-top: 20px">
      <p>Licence Plate: {{ pattern }}</p>
      <button
        style="
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        "
        @click="increment"
      >
        Increment
      </button>
    </div>
  </div>
</template>

<script setup>
// Reactive state to store the complete pattern as string
const pattern = ref('ZZZZZY');

// Function to increment the pattern
const increment = () => {
  // Check if we're already at the absolute maximum
  const isCurrentMaximum = pattern.value === 'ZZZZZZ';

  if (isCurrentMaximum) {
    alert(
      'Maximum reached! The license plate counter has reached its absolute limit: ZZZZZZ'
    );
    console.log('Cannot increment further - absolute maximum reached: ZZZZZZ');
    return;
  }

  const characters = pattern.value.split('');

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

  pattern.value = characters.join('');
  console.log(`Current pattern: ${pattern.value}`);
};
</script>
