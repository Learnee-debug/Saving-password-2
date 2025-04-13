const MIN = 100;
const MAX = 999;

const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');

// Store in localStorage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve from localStorage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate random 3-digit number
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// SHA256 hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Get or generate the hash
async function getSHA256Hash() {
  let cachedHash = retrieve('sha256');
  if (cachedHash) {
    return cachedHash;
  }

  const randomPin = getRandomNumber(MIN, MAX).toString();
  const hash = await sha256(randomPin);
  store('sha256', hash);
  return hash;
}

// Main: initialize UI with the hash
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Validate and test input
async function testGuess() {
  const pin = pinInput.value;

  if (pin.length !== 3 || isNaN(pin)) {
    resultView.innerHTML = '💡 Please enter a 3-digit number.';
    resultView.classList.remove('hidden');
    return;
  }

  const enteredHash = await sha256(pin);
  const actualHash = sha256HashView.textContent;

  if (enteredHash === actualHash) {
    resultView.innerHTML = '🎉 Correct!';
    resultView.style.backgroundColor = '#4BB543';
  } else {
    resultView.innerHTML = '❌ Incorrect. Try again!';
    resultView.style.backgroundColor = '#FF6347';
  }

  resultView.classList.remove('hidden');
}

// Restrict input to 3-digit numbers
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach event
document.getElementById('check').addEventListener('click', testGuess);

// Run on load
main();
