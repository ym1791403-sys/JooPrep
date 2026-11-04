/* Interactive Topographic Contour Canvas Engine
   Features:
   - Continuous organic harmonic wave undulation
   - Real-time mouse magnetic displacement & fluid drag wake
   - Interactive click / tap radial ripples
   - Particle constellation with proximity connections
   - Glowing cursor aura
   - High-DPI support & 60fps optimized
*/
(function() {
  function initInteractiveTopoCanvas(canvasId, containerSelector) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;
    let animationFrameId = null;

    // Mouse & Touch State
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
      isHovered: false,
      down: false,
      radius: 160
    };

    // Ripples triggered on click/tap
    const ripples = [];

    // Floating Particles
    const PARTICLE_COUNT = 24;
    const particles = [];

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Re-init particles within bounds
      if (particles.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.4,
            size: 1.5 + Math.random() * 2,
            baseAlpha: 0.25 + Math.random() * 0.5,
            hue: Math.random() > 0.4 ? '#00c982' : '#06b6d4'
          });
        }
      }
    }

    // Attach mouse / pointer events to parent container so user can play anywhere over the panel
    const parent = canvas.closest(containerSelector) || canvas.parentElement || canvas;

    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      mouse.targetX = clientX - rect.left;
      mouse.targetY = clientY - rect.top;
      mouse.isHovered = true;
    }

    function onPointerLeave() {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    }

    function onPointerDown(e) {
      mouse.down = true;
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      ripples.push({
        x: px,
        y: py,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.9,
        amplitude: 22,
        speed: 4.5,
        decay: 0.96
      });
    }

    function onPointerUp() {
      mouse.down = false;
    }

    parent.addEventListener('mousemove', onPointerMove, { passive: true });
    parent.addEventListener('mouseenter', onPointerMove, { passive: true });
    parent.addEventListener('mouseleave', onPointerLeave, { passive: true });
    parent.addEventListener('mousedown', onPointerDown, { passive: true });
    window.addEventListener('mouseup', onPointerUp, { passive: true });

    parent.addEventListener('touchstart', (e) => {
      onPointerMove(e);
      onPointerDown(e);
    }, { passive: true });
    parent.addEventListener('touchmove', onPointerMove, { passive: true });
    parent.addEventListener('touchend', () => {
      onPointerUp();
      onPointerLeave();
    }, { passive: true });

    // Number of horizontal contour lines
    const LINE_COUNT = 15;
    const SAMPLE_STEPS = 55;
    let time = 0;

    function draw() {
      if (!canvas.offsetParent) {
        // If hidden (e.g., switched tab), pause loop until visible
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      if (width === 0 || height === 0) {
        resize();
      }

      time += 0.018;

      // Smooth mouse lerping & velocity
      if (mouse.isHovered) {
        mouse.vx = (mouse.targetX - mouse.x) * 0.2;
        mouse.vy = (mouse.targetY - mouse.y) * 0.2;
        mouse.x += mouse.vx;
        mouse.y += mouse.vy;
      } else {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
        mouse.vx = 0;
        mouse.vy = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing aura around mouse if inside
      if (mouse.x > -50 && mouse.x < width + 50 && mouse.y > -50 && mouse.y < height + 50) {
        const radGrad = ctx.createRadialGradient(mouse.x, mouse.y, 10, mouse.x, mouse.y, mouse.radius * 1.2);
        radGrad.addColorStop(0, 'rgba(0, 201, 130, 0.18)');
        radGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
        radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Update ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += rip.speed;
        rip.amplitude *= rip.decay;
        if (rip.radius > rip.maxRadius || rip.amplitude < 0.2) {
          ripples.splice(r, 1);
        }
      }

      // 3. Render Topographic Contours
      const spacing = height / (LINE_COUNT + 1);

      for (let i = 1; i <= LINE_COUNT; i++) {
        const baseY = i * spacing;
        const lineFraction = i / LINE_COUNT;

        // Dynamic gradient for each contour
        const lineGrad = ctx.createLinearGradient(0, baseY, width, baseY);
        if (i % 3 === 0) {
          lineGrad.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
          lineGrad.addColorStop(0.5, 'rgba(0, 201, 130, 0.55)');
          lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0.2)');
        } else if (i % 3 === 1) {
          lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
          lineGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.45)');
          lineGrad.addColorStop(1, 'rgba(0, 201, 130, 0.15)');
        } else {
          lineGrad.addColorStop(0, 'rgba(0, 201, 130, 0.18)');
          lineGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.5)');
          lineGrad.addColorStop(1, 'rgba(6, 182, 212, 0.18)');
        }

        ctx.beginPath();

        let prevX = 0;
        let prevY = baseY;

        for (let s = 0; s <= SAMPLE_STEPS; s++) {
          const x = (s / SAMPLE_STEPS) * width;

          // Harmonic multi-frequency waves
          const wave1 = Math.sin(x * 0.008 + time + i * 0.45) * 14;
          const wave2 = Math.cos(x * 0.014 - time * 0.7 + i) * 8;
          const wave3 = Math.sin(x * 0.022 + time * 1.3) * 4;
          let y = baseY + wave1 + wave2 + wave3;

          // Mouse Magnetic & Warp Field
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const factor = (1 - dist / mouse.radius);
            // Non-linear Gaussian bell curve pull & push
            const pull = Math.sin(factor * Math.PI) * 28;
            // Velocity drag wake
            const velInfluence = (mouse.vy * 0.4 + mouse.vx * 0.2) * factor;
            y += (dy > 0 ? pull : -pull) * 0.8 + velInfluence;
          }

          // Apply Ripples
          for (let r = 0; r < ripples.length; r++) {
            const rip = ripples[r];
            const rDist = Math.sqrt((x - rip.x) * (x - rip.x) + (y - rip.y) * (y - rip.y));
            const deltaR = Math.abs(rDist - rip.radius);
            if (deltaR < 45) {
              const ripFactor = (1 - deltaR / 45) * rip.amplitude;
              y += Math.sin(deltaR * 0.15) * ripFactor;
            }
          }

          if (s === 0) {
            ctx.moveTo(x, y);
          } else {
            // Smooth quadratic curve midpoint for fluid curves
            const cx = (prevX + x) / 2;
            const cy = (prevY + y) / 2;
            ctx.quadraticCurveTo(prevX, prevY, cx, cy);
          }
          prevX = x;
          prevY = y;
        }

        ctx.lineTo(prevX, prevY);

        ctx.strokeStyle = lineGrad;
        // Make lines near mouse slightly bolder
        const isFocal = Math.abs(baseY - mouse.y) < 60;
        ctx.lineWidth = isFocal ? 2.0 : (1.2 + (i % 2) * 0.4);
        ctx.stroke();
      }

      // 4. Floating glowing particles & proximity threads
      for (let p = 0; p < particles.length; p++) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Wrap around bounds
        if (pt.x < -10) pt.x = width + 10;
        if (pt.x > width + 10) pt.x = -10;
        if (pt.y < -10) pt.y = height + 10;
        if (pt.y > height + 10) pt.y = -10;

        // Mouse attraction
        const pdx = mouse.x - pt.x;
        const pdy = mouse.y - pt.y;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pdist < mouse.radius && mouse.isHovered) {
          pt.x += (pdx / pdist) * 1.2;
          pt.y += (pdy / pdist) * 1.2;

          // Draw neon connecting thread to mouse
          if (pdist < 100) {
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 201, 130, ${(1 - pdist / 100) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.hue;
        ctx.globalAlpha = pt.baseAlpha + (pdist < mouse.radius ? 0.4 : 0);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    return {
      resize,
      destroy: () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', resize);
      }
    };
  }

  window.initInteractiveTopoCanvas = initInteractiveTopoCanvas;
})();
