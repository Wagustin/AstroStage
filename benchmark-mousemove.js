const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <div style="height: 1000px;">Header</div>
  <div id="experiencia" style="height: 500px;">Experiencia</div>
</body></html>`);

const window = dom.window;
const document = window.document;

const expSection = document.getElementById('experiencia');
expSection.getBoundingClientRect = () => ({
  top: 500,
  bottom: 1000,
  left: 0,
  right: 1000,
  width: 1000,
  height: 500,
  x: 0,
  y: 500
});

const ITERATIONS = 500000;

function unoptimizedHandler(e) {
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  const expSection = document.getElementById('experiencia');
  if (expSection) {
    const rect = expSection.getBoundingClientRect();
    if (mouseY < rect.top) {
      return;
    }
  }
}

let cachedExpSection = null;
let cachedExpTopDoc = 0;

function updateExpSectionTop() {
  if (!cachedExpSection || !cachedExpSection.isConnected) {
    cachedExpSection = document.getElementById('experiencia');
  }
  if (cachedExpSection) {
    cachedExpTopDoc = cachedExpSection.getBoundingClientRect().top + (window.scrollY || 0);
  }
}

updateExpTopDoc();

function optimizedHandler(e) {
  let mouseX = e.clientX;
  let mouseY = e.clientY;

  if (!cachedExpSection || !cachedExpSection.isConnected) {
    updateExpSectionTop();
  }

  if (cachedExpSection) {
    if (mouseY < cachedExpTopDoc - (window.scrollY || 0)) {
      return;
    }
  }
}

function updateExpTopDoc() {
  updateExpSectionTop();
}

const mockEvent = { clientX: 100, clientY: 600 };

// Warmup
for (let i = 0; i < 10000; i++) {
  unoptimizedHandler(mockEvent);
  optimizedHandler(mockEvent);
}

// Baseline measurement
const start1 = process.hrtime.bigint();
for (let i = 0; i < ITERATIONS; i++) {
  unoptimizedHandler(mockEvent);
}
const end1 = process.hrtime.bigint();
const time1 = Number(end1 - start1) / 1e6;

// Optimized measurement
const start2 = process.hrtime.bigint();
for (let i = 0; i < ITERATIONS; i++) {
  optimizedHandler(mockEvent);
}
const end2 = process.hrtime.bigint();
const time2 = Number(end2 - start2) / 1e6;

console.log(`--- BENCHMARK RESULTS ---`);
console.log(`Unoptimized: ${time1.toFixed(3)} ms (${(ITERATIONS / (time1 / 1000)).toFixed(0)} ops/sec)`);
console.log(`Optimized:   ${time2.toFixed(3)} ms (${(ITERATIONS / (time2 / 1000)).toFixed(0)} ops/sec)`);
console.log(`Speedup:     ${(time1 / time2).toFixed(2)}x faster (${((1 - time2 / time1) * 100).toFixed(1)}% time reduction)`);
