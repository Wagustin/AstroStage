// Benchmark helper using global performance or Date.now
const getNow = () => (typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now());

// Setup DOM simulation
const container = document.createElement('div');
container.style.height = '2000px';

const expSection = document.createElement('div');
expSection.id = 'experiencia';
expSection.style.marginTop = '800px';
expSection.style.height = '500px';
expSection.getBoundingClientRect = () => ({
  top: 800,
  bottom: 1300,
  left: 0,
  right: 1000,
  width: 1000,
  height: 500,
  x: 0,
  y: 800,
  toJSON: () => {}
});

document.body.appendChild(expSection);

// Benchmark current behavior
function benchmarkCurrent(iterations: number) {
  const particles: any[] = [];
  const start = getNow();

  for (let i = 0; i < iterations; i++) {
    const e = { clientX: 100, clientY: 900 + (i % 100) };
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const el = document.getElementById('experiencia');
    if (el) {
      const rect = el.getBoundingClientRect();
      if (mouseY < rect.top) {
        continue;
      }
    }

    particles.push({
      x: mouseX + (Math.random() - 0.5) * 4,
      y: mouseY + (Math.random() - 0.5) * 4,
      life: 1,
      size: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2 + 0.1
    });
  }

  const end = getNow();
  return end - start;
}

// Benchmark optimized behavior
function benchmarkOptimized(iterations: number) {
  const particles: any[] = [];
  const el = document.getElementById('experiencia');
  let expTop = el ? el.getBoundingClientRect().top : 0;

  // In real implementation expTop updates on scroll/resize
  const start = getNow();

  for (let i = 0; i < iterations; i++) {
    const e = { clientX: 100, clientY: 900 + (i % 100) };
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (el) {
      if (mouseY < expTop) {
        continue;
      }
    }

    particles.push({
      x: mouseX + (Math.random() - 0.5) * 4,
      y: mouseY + (Math.random() - 0.5) * 4,
      life: 1,
      size: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2 + 0.1
    });
  }

  const end = getNow();
  return end - start;
}

describe('Cursor Trail Performance Benchmark', () => {
  it('measures baseline vs optimized mousemove handling', () => {
    const iterations = 100000;
    // Warmup
    benchmarkCurrent(1000);
    benchmarkOptimized(1000);

    const timeCurrent = benchmarkCurrent(iterations);
    const timeOptimized = benchmarkOptimized(iterations);

    console.log(`\n================ PERFORMANCE BENCHMARK RESULTS ================`);
    console.log(`Iterations: ${iterations}`);
    console.log(`Baseline (document.getElementById + getBoundingClientRect): ${timeCurrent.toFixed(2)} ms`);
    console.log(`Optimized (Cached element & rect.top): ${timeOptimized.toFixed(2)} ms`);
    console.log(`Speedup: ${(timeCurrent / timeOptimized).toFixed(2)}x faster (${((1 - timeOptimized / timeCurrent) * 100).toFixed(1)}% reduction in time)`);
    console.log(`===============================================================\n`);

    expect(timeOptimized).toBeLessThan(timeCurrent);
  });
});
