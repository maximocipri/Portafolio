/* ═══════════════════════════════════════════════
   Máximo Cipriani — Portfolio
   main.js
   ═══════════════════════════════════════════════ */

/* ════════════════════════════════════════════
   1. LOADER
════════════════════════════════════════════ */
(function initLoader() {
  const pctEl   = document.getElementById('loader-pct');
  const barEl   = document.getElementById('loader-bar');
  const loader  = document.getElementById('loader');
  const labelEl = document.getElementById('loader-label');
  const labels  = ['Cargando módulos', 'Trazando vectores', 'Compilando sistema', 'Listo'];
  let pct = 0;

  const tick = () => {
    const inc = pct < 70 ? Math.random() * 4 + 1 : Math.random() * 2 + 0.5;
    pct = Math.min(100, pct + inc);
    const p = Math.floor(pct);

    pctEl.innerHTML = String(p).padStart(3, '0') +
      '<span style="font-size:0.5em;opacity:0.5">%</span>';
    barEl.style.width = pct + '%';

    if      (p < 30) labelEl.textContent = labels[0];
    else if (p < 60) labelEl.textContent = labels[1];
    else if (p < 90) labelEl.textContent = labels[2];
    else             labelEl.textContent = labels[3];

    if (pct < 100) {
      setTimeout(tick, pct < 50 ? 28 : pct < 80 ? 40 : 55);
    } else {
      setTimeout(() => loader.classList.add('done'), 400);
    }
  };

  setTimeout(tick, 300);
})();

/* ════════════════════════════════════════════
   2. CUSTOM CURSOR
════════════════════════════════════════════ */
(function initCursor() {
  const cur   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let mx = 0, my = 0, tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top  = my + 'px';
  });

  const animTrail = () => {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  };
  animTrail();

  document.addEventListener('mousedown', () => {
    cur.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1.6)';
  });
  document.addEventListener('mouseup', () => {
    cur.style.transform = 'translate(-50%,-50%) rotate(45deg) scale(1)';
  });
})();

/* ════════════════════════════════════════════
   3. MOUSE LANTERN
════════════════════════════════════════════ */
(function initLantern() {
  const el = document.getElementById('lantern');
  let lx = window.innerWidth / 2;
  let ly = window.innerHeight / 2;
  let cx = lx, cy = ly;

  document.addEventListener('mousemove', e => {
    lx = e.clientX;
    ly = e.clientY;
  });

  const animate = () => {
    cx += (lx - cx) * 0.07;
    cy += (ly - cy) * 0.07;
    el.style.background =
      `radial-gradient(650px circle at ${cx}px ${cy}px, rgba(0,80,255,0.06) 0%, transparent 70%)`;
    requestAnimationFrame(animate);
  };
  animate();
})();

/* ════════════════════════════════════════════
   4. CANVAS BACKGROUND — Lightweight triangle mesh
════════════════════════════════════════════ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, pts;
  let mx = 0, my = 0;
  let last = 0;

  const resize = () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initPoints();
  };

  const initPoints = () => {
    const count = Math.min(40, Math.floor(W * H / 32000));
    pts = Array.from({ length: count }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
    }));
  };

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  const draw = (t) => {
    // Cap at ~20 fps to save CPU
    if (t - last < 50) { requestAnimationFrame(draw); return; }
    last = t;
    ctx.clearRect(0, 0, W, H);

    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    }

    const D = 180;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(0,210,255,${0.12 * (1 - d / D)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Highlight near mouse
      const dx = pts[i].x - mx;
      const dy = pts[i].y - my;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,210,255,${0.5 * (1 - d / 120)})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  };

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ════════════════════════════════════════════
   5. SCROLL REVEAL
════════════════════════════════════════════ */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════════
   6. CONTACT FORM — EmailJS
   ─────────────────────────────────────────────
   SETUP (una sola vez):
   1. Creá cuenta gratis en https://www.emailjs.com
   2. Add Service → Gmail → conectá maximocipri@gmail.com → copiá el SERVICE_ID
   3. Email Templates → Create Template → usá estas variables:
        {{from_name}}, {{from_email}}, {{subject}}, {{message}}
      En "To email" poné: maximocipri@gmail.com → copiá el TEMPLATE_ID
   4. Account → API Keys → copiá tu PUBLIC_KEY
   5. Reemplazá los tres valores de abajo y listo.
════════════════════════════════════════════ */
(function initContactForm() {
  // ── CONFIGURACIÓN ──────────────────────────
  const EMAILJS_PUBLIC_KEY  = '5ll0BpVyEYBdaE6bO';   // ej: 'aBcDeFgHiJkLmNoP'
  const EMAILJS_SERVICE_ID  = 'service_ato8317';   // ej: 'service_xxxxxxx'
  const EMAILJS_TEMPLATE_ID = 'template_2cfed1a';  // ej: 'template_xxxxxxx'
  // ───────────────────────────────────────────

  const btn      = document.getElementById('f-submit');
  const feedback = document.getElementById('f-feedback');
  if (!btn) return;

  // Inicializar EmailJS con la public key
  emailjs.init(EMAILJS_PUBLIC_KEY);

  const showFeedback = (msg, type) => {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const setLoading = (loading) => {
    if (loading) {
      btn.innerHTML        = '<span>Enviando...</span><span class="submit-icon">⟳</span>';
      btn.style.background = 'rgba(0,210,255,0.15)';
      btn.style.color      = 'var(--blue)';
      btn.disabled         = true;
    } else {
      btn.innerHTML        = '<span>Enviar mensaje</span><span class="submit-icon">→</span>';
      btn.style.background = '';
      btn.style.color      = '';
      btn.disabled         = false;
    }
  };

  btn.addEventListener('click', async () => {
    const name    = document.getElementById('f-name').value.trim();
    const email   = document.getElementById('f-email').value.trim();
    const subject = document.getElementById('f-subject').value.trim();
    const msg     = document.getElementById('f-msg').value.trim();

    // Validación
    if (!name || !email || !msg) {
      showFeedback('// ERROR: Completá nombre, email y mensaje antes de enviar.', 'error');
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      showFeedback('// ERROR: El formato del email no es válido.', 'error');
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name:  name,
        from_email: email,
        subject:    subject || `Contacto desde portfolio — ${name}`,
        message:    msg,
      });

      showFeedback('✓ Mensaje enviado correctamente. ¡Te respondo a la brevedad!', 'success');

      // Limpiar campos
      document.getElementById('f-name').value    = '';
      document.getElementById('f-email').value   = '';
      document.getElementById('f-subject').value = '';
      document.getElementById('f-msg').value     = '';

    } catch (err) {
      console.error('EmailJS error:', err);
      showFeedback('// ERROR: No se pudo enviar el mensaje. Intentá de nuevo o escribime a maximocipri@gmail.com', 'error');
    } finally {
      setLoading(false);
    }
  });
})();