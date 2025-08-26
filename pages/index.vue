<template>
  <div class="container">
    <div class="header">
      <h1>License Plate Generator</h1>
      <p>Generate unique license plate combinations</p>
    </div>

    <div class="license-plate-container">
      <div class="license-plate">
        <div class="plate-header">
          <span class="country">USA</span>
          <span class="state">CALIFORNIA</span>
        </div>
        <div class="plate-number">
          {{ pattern }}
        </div>
        <div class="plate-footer">
          <span class="slogan">Golden State</span>
        </div>
      </div>
    </div>

    <div class="controls">
      <button class="increment-btn" @click="increment">
        <span class="btn-icon">⚡</span>
        Generate Next
      </button>
    </div>
  </div>
</template>

<script setup>
// Reactive state to store the complete pattern as string
const pattern = ref('000000');

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

<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.license-plate-container {
  margin: 30px 0;
  transform: perspective(1000px) rotateX(5deg);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
}

.license-plate {
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
  border: 8px solid #2c3e50;
  border-radius: 15px;
  padding: 20px 30px;
  width: 400px;
  text-align: center;
  position: relative;
  box-shadow:
    inset 0 2px 10px rgba(255, 255, 255, 0.8),
    inset 0 -2px 10px rgba(0, 0, 0, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.3);
}

.license-plate::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 2px solid #34495e;
  border-radius: 8px;
  pointer-events: none;
}

.plate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #2c3e50;
}

.country {
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
}

.state {
  color: #2c3e50;
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.plate-number {
  font-family: 'Courier New', monospace;
  font-size: 4rem;
  font-weight: bold;
  color: #2c3e50;
  letter-spacing: 8px;
  margin: 20px 0;
  text-shadow: 2px 2px 0px rgba(255, 255, 255, 0.8);
  background: linear-gradient(145deg, transparent 0%, rgba(0, 0, 0, 0.05) 100%);
  padding: 15px;
  border-radius: 8px;
  position: relative;
}

.plate-footer {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #7f8c8d;
  font-style: italic;
}

.slogan {
  border-top: 1px solid #bdc3c7;
  padding-top: 8px;
  display: inline-block;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
}

.increment-btn {
  background: linear-gradient(145deg, #3498db, #2980b9);
  border: none;
  border-radius: 50px;
  padding: 15px 40px;
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 25px rgba(52, 152, 219, 0.3);
}

.increment-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(52, 152, 219, 0.4);
  background: linear-gradient(145deg, #5dade2, #3498db);
}

.increment-btn:active {
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1.2rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.info {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 25px;
  color: white;
  text-align: center;
}

.current-display {
  margin: 0;
  font-size: 1rem;
}

.highlight {
  color: #f39c12;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
}

/* Responsive design */
@media (max-width: 600px) {
  .license-plate {
    width: 320px;
    padding: 15px 20px;
  }

  .plate-number {
    font-size: 2.8rem;
    letter-spacing: 4px;
  }

  .header h1 {
    font-size: 2rem;
  }
}
</style>
