const { useState, useEffect, useRef, useCallback } = window.React;

// ============================================================
// DoGooder LANDING PAGE — (Rebranded from VolunteerFit)
// ============================================================

// --- Spring Physics Engine ---
function useSpring(targetX, targetY, stiffness = 100, damping = 30) {
  const pos = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [springPos, setSpringPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    target.current = { x: targetX, y: targetY };
  }, [targetX, targetY]);

  useEffect(() => {
    let lastTime = performance.now();
    const step = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.064);
      lastTime = now;
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      const ax = stiffness * dx - damping * vel.current.x;
      const ay = stiffness * dy - damping * vel.current.y;
      vel.current.x += ax * dt;
      vel.current.y += ay * dt;
      pos.current.x += vel.current.x * dt;
      pos.current.y += vel.current.y * dt;
      setSpringPos({ x: pos.current.x, y: pos.current.y });
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [stiffness, damping]);

  return springPos;
}

// --- Scroll Reveal Hook ---
function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    const targets = el.querySelectorAll('.scroll-reveal');
    targets.forEach((t) => observer.observe(t));
    if (el.classList.contains('scroll-reveal')) observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// --- Parallax Hook ---
function useParallax(speed = 0.2) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOffset(window.scrollY * speed);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);
  return offset;
}

// --- Typewriter Hook ---
function useTypewriter(phrases, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      if (charIndex < currentPhrase.length) {
        const timer = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished typing — pause
        setIsPaused(true);
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setDisplayText(currentPhrase.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, deletingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Move to next phrase
        setIsDeleting(false);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }
    }
  }, [charIndex, isDeleting, isPaused, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  return displayText;
}

// --- Mouse Tilt Hook (max degrees configurable) ---
function useMouseTilt(maxDeg = 5) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setTilt({
        rotateX: -ny * maxDeg,
        rotateY: nx * maxDeg,
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [maxDeg]);

  return tilt;
}

// --- Scroll Progress Hook ---
function useScrollProgress(ref) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const startScroll = rect.top - viewportHeight * 0.4;
            const scrollableDistance = rect.height;
            let currentProgress = -startScroll / scrollableDistance;
            if (currentProgress < 0) currentProgress = 0;
            if (currentProgress > 1) currentProgress = 1;
            setProgress(currentProgress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);
  return progress;
}


// =================== COMPONENTS ===================

// --- Glassmorphic Navigation ---
const GlassNav = ({ onEnter }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className="glass-nav fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-2 py-2 transition-all duration-500"
      style={{
        opacity: scrolled ? 1 : 0.9,
        transform: `translateX(-50%) ${scrolled ? 'scale(1)' : 'scale(0.98)'}`,
      }}
      id="main-nav"
    >
      <a href="#hero" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
        Home
      </a>
      <a href="#problem" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
        Challenge
      </a>
      <a href="#solution" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
        Solution
      </a>
      <a href="#platform" className="px-5 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
        Platform
      </a>

      {/* DoGooder brand mark with glow */}
      <div className="dogooder-nav-brand ml-3 mr-1 hidden md:flex items-center gap-1.5">
        <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="7" fill="rgba(139,92,246,0.15)"/>
          <path d="M14 22s-7-4.5-7-9.5A4.5 4.5 0 0 1 14 8.5 4.5 4.5 0 0 1 21 12.5C21 17.5 14 22 14 22z" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinejoin="round"/>
          <circle cx="14" cy="13" r="2" fill="#A78BFA"/>
          <path d="M14 15v4" stroke="#A78BFA" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        <span className="dogooder-glow-text text-sm font-bold tracking-tight" style={{
          background: 'linear-gradient(135deg, #8B5CF6, #10B981)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>DoGooder</span>
      </div>

      <a href="/app">
        <button
          className="ml-2 px-5 py-2 text-sm font-semibold text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)' }}
        >
          Launch App →
        </button>
      </a>
    </nav>
  );
};


// --- The Neural Core (3D Wireframe Globe with Magnetic Nodes) ---
const NeuralCore = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 320;
    const numNodes = 15;

    // Setup for retina displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let nodes = Array.from({ length: numNodes }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.acos(Math.random() * 2 - 1),
      r: 60 + Math.random() * 40,
      speedTheta: (Math.random() - 0.5) * 0.02,
      speedPhi: (Math.random() - 0.5) * 0.02,
      screenX: 0, screenY: 0, screenZ: 0
    }));

    let rotX = 0;
    let rotY = 0;
    let velX = 0.002;
    let velY = 0.003;
    let isHovering = false;
    let mouse = { x: -1000, y: -1000 };

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      isHovering = true;
      // swipe inertia tracking
      velY += e.movementX * 0.0008;
      velX += e.movementY * 0.0008;
    };
    const onLeave = () => { isHovering = false; };
    canvas.addEventListener('mousemove', onMove, { passive: true });
    canvas.addEventListener('mouseleave', onLeave, { passive: true });

    let frameId;
    const render = () => {
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2;
      const cy = size / 2;

      // Friction
      velX += (0.001 - velX) * 0.05;
      velY += (0.003 - velY) * 0.05;
      rotX += velX;
      rotY += velY;

      // 5-second Sync Pulse
      const now = Date.now();
      const cycle = now % 5000;
      let pulseStrength = 0;
      if (cycle < 600) pulseStrength = 1 - Math.abs(cycle - 300) / 300;
      const isPulsing = pulseStrength > 0.05;

      // Draw wireframe globe using 3 orthogonal rings
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          let x = Math.cos(a) * 120;
          let y = Math.sin(a) * 120;
          let z = 0;
          // initial ring yaw
          let ra = i * (Math.PI / 3);
          let x1 = x * Math.cos(ra) - z * Math.sin(ra);
          let z1 = x * Math.sin(ra) + z * Math.cos(ra);
          // global rotation
          let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
          let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);
          let x2 = x1 * Math.cos(rotY) - z2 * Math.sin(rotY);
          let z3 = x1 * Math.sin(rotY) + z2 * Math.cos(rotY);
          // projection
          let scale = 250 / (250 + z3);
          let px = cx + x2 * scale;
          let py = cy + y2 * scale;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 + pulseStrength * 0.35})`;
        ctx.stroke();
      }

      // Project Nodes
      nodes.forEach(n => {
        n.theta += n.speedTheta;
        n.phi += n.speedPhi;
        let nx = n.r * Math.sin(n.phi) * Math.cos(n.theta);
        let ny = n.r * Math.cos(n.phi);
        let nz = n.r * Math.sin(n.phi) * Math.sin(n.theta);

        let y2 = ny * Math.cos(rotX) - nz * Math.sin(rotX);
        let z2 = ny * Math.sin(rotX) + nz * Math.cos(rotX);
        let x2 = nx * Math.cos(rotY) - z2 * Math.sin(rotY);
        let z3 = nx * Math.sin(rotY) + z2 * Math.cos(rotY);

        let scale = 250 / (250 + z3);
        let px = cx + x2 * scale;
        let py = cy + y2 * scale;

        // Magnetic hover logic
        if (isHovering) {
          let dx = mouse.x - px;
          let dy = mouse.y - py;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            px += dx * 0.2;
            py += dy * 0.2;
          }
        }
        n.screenX = px;
        n.screenY = py;
        n.screenZ = z3;
      });

      // Draw connections
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          let dx = nodes[i].screenX - nodes[j].screenX;
          let dy = nodes[i].screenY - nodes[j].screenY;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].screenX, nodes[i].screenY);
            ctx.lineTo(nodes[j].screenX, nodes[j].screenY);
            let alpha = (1 - dist / 80) * 0.4 + pulseStrength * 0.5;
            ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      // Draw node dots
      nodes.forEach(n => {
        let depthAlpha = Math.max(0.1, 1 - (n.screenZ + 120) / 240);
        ctx.beginPath();
        ctx.arc(n.screenX, n.screenY, 2.5 * depthAlpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${depthAlpha + pulseStrength})`;
        ctx.shadowBlur = isPulsing ? 15 : 4;
        ctx.shadowColor = '#10B981';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div className="relative flex justify-center items-center mb-10 w-64 h-64 md:w-80 md:h-80 mx-auto">
      <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(16, 185, 129, 0.05) 40%, transparent 60%)', filter: 'blur(50px)' }} />
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', zIndex: 10, cursor: 'crosshair', pointerEvents: 'auto' }} />
    </div>
  );
};

// --- Ethereal Starfall (Sides) ---
const EtherealStarfall = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    const numStars = 100;
    const edgeWidthRatio = 0.15;

    const stars = Array.from({ length: numStars }, () => {
      const isLeft = Math.random() > 0.5;
      return {
        x: isLeft ? Math.random() * (window.innerWidth * edgeWidthRatio) : window.innerWidth - Math.random() * (window.innerWidth * edgeWidthRatio),
        y: Math.random() * window.innerHeight,
        speed: 0.5 + Math.random() * 2.5,
        length: 3 + Math.random() * 5,
        color: Math.random() > 0.7 ? '#10B981' : '#8B5CF6',
        baseAlpha: Math.random() * 0.4 + 0.1,
        isLeft
      };
    });

    let frameId;
    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const now = Date.now();
      const cycle = now % 5000;
      let pulseStrength = cycle < 600 ? 1 - Math.abs(cycle - 300) / 300 : 0;

      stars.forEach(s => {
        s.y += s.speed;
        if (s.y > h * 0.6) {
          s.y = -20;
          s.x = s.isLeft ? Math.random() * (w * edgeWidthRatio) : w - Math.random() * (w * edgeWidthRatio);
        }
        let fade = 1 - (s.y / (h * 0.6));
        if (fade < 0) fade = 0;
        let currentAlpha = s.baseAlpha * fade;
        if (pulseStrength > 0) currentAlpha = Math.min(1, currentAlpha + pulseStrength * 0.6);

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.length);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = s.color === '#10B981'
          ? `rgba(16, 185, 129, ${currentAlpha})`
          : `rgba(139, 92, 246, ${currentAlpha})`;

        if (pulseStrength > 0) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      });
      frameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.8 }} />
  );
};


// --- Background Orbs ---
const ParallaxOrbs = () => {
  const offset = useParallax(0.15);
  const orbs = [
    { color: '#8B5CF6', size: 350, top: '10%', left: '-6%', delay: 0 },
    { color: '#10B981', size: 280, top: '58%', left: '84%', delay: 2 },
    { color: '#7C3AED', size: 220, top: '78%', left: '12%', delay: 4 },
    { color: '#059669', size: 180, top: '32%', left: '72%', delay: 1 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="parallax-orb"
          style={{
            backgroundColor: orb.color,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            top: orb.top,
            left: orb.left,
            opacity: 0.08,
            transform: `translateY(${offset}px)`,
            animation: `floatY ${10 + i * 3}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </>
  );
};


// --- Stat Counter ---
const GlitchStat = ({ value, label, color }) => {
  const [displayVal, setDisplayVal] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const numVal = parseInt(value);
    let current = 0;
    const step = numVal / 45;
    const interval = setInterval(() => {
      current += step;
      if (current >= numVal) { current = numVal; clearInterval(interval); }
      setDisplayVal(Math.round(current));
    }, 25);
    return () => clearInterval(interval);
  }, [visible, value]);

  return (
    <div ref={ref} className="relative">
      <span
        className="glitch-stat block font-extrabold font-inter"
        style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', color, lineHeight: 1 }}
      >
        {displayVal}%
      </span>
      <span className="text-xs text-zinc-500 uppercase tracking-[0.2em] mt-2 block font-medium">
        {label}
      </span>
    </div>
  );
};


// --- Feature Card ---
const FeatureCard = ({ icon, title, desc, delay }) => (
  <div
    className="frosted-obsidian p-8 scroll-reveal group cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-3xl mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-violet-400 transition-colors duration-300 font-inter">
      {title}
    </h3>
    <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
  </div>
);


// ============================================================
// MAIN LANDING PAGE
// ============================================================

function VolunteerFitLanding({ onEnter }) {
  const problemRef = useScrollReveal();
  const solutionRef = useScrollReveal();
  const platformRef = useScrollReveal();
  
  // Scrollytelling progress for Solution Engine
  const solutionProgress = useScrollProgress(solutionRef);
  
  // Interactive hover state for Step 01
  const [hoveredSkillTag, setHoveredSkillTag] = useState(null);

  // Typewriter effect
  const typewriterText = useTypewriter(
    ["Scale your NGO's impact without burning out your team."],
    60,
    30,
    3000
  );

  // Mouse-follow parallax tilt for hero text
  const tilt = useMouseTilt(5);

  return (
    <div className="min-h-screen text-zinc-200 overflow-x-hidden selection:bg-violet-500/30 font-inter" style={{ backgroundColor: '#0B0F19' }}>

      {/* Background */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, #0B0F19 0%, #050811 70%)' }}
      />
      <EtherealStarfall />
      <ParallaxOrbs />

      {/* Navigation */}
      <GlassNav onEnter={onEnter} />


      {/* ========================================== */}
      {/* 1. HERO                                    */}
      {/* ========================================== */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        {/* Neural Core — 3D wireframe globe with magnetic nodes */}
        <div className="z-10 relative">
          <NeuralCore />
        </div>

        {/* Hero text overlay with parallax tilt */}
        <div
          className="z-20 max-w-3xl mx-auto"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: 'transform 0.1s ease-out',
            willChange: 'transform',
          }}
        >
          <h1
            className="font-extrabold tracking-tight mb-4 leading-[1.05] font-inter text-5xl"
            style={{
              background: 'linear-gradient(to bottom, #F4F4F5 15%, #71717A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            <span
              className="typewriter-text inline-block"
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #10B981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {typewriterText}
            </span>
            <span className="typewriter-cursor" />
          </h1>

          <p
            className="text-zinc-400 max-w-xl mx-auto mb-9 leading-relaxed font-normal"
            style={{ fontSize: 'clamp(0.9rem, 1.6vw, 1.15rem)' }}
          >
            AI-powered volunteer matching that balances human empathy with machine intelligence.
            Every volunteer valued. Every task optimized. Zero burnout.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <a href="/app">
              <button className="neon-aura-btn text-base px-9 py-4" id="hero-cta">
                Enter Platform
              </button>
            </a>
            <a
              href="#problem"
              className="px-7 py-3.5 text-sm font-medium text-zinc-400 border border-white/8 rounded-full hover:border-white/20 hover:text-white transition-all duration-300"
            >
              Explore the Vision ↓
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600">
          <div className="w-[1px] h-8 bg-gradient-to-b from-zinc-600 to-transparent animate-pulse" />
        </div>
      </section>


      {/* ========================================== */}
      {/* 2. THE PROBLEM                             */}
      {/* ========================================== */}
      <section id="problem" ref={problemRef} className="py-28 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-16 items-center">
            <div className="scroll-reveal">
              <span className="inline-block text-xs uppercase tracking-[0.25em] font-medium mb-4 px-3 py-1 border rounded-full" style={{ color: '#8B5CF6', borderColor: 'rgba(139,92,246,0.25)' }}>
                The Challenge
              </span>

              <h2
                className="gradient-text-silver font-extrabold tracking-tight mb-8 font-inter"
                style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}
              >
                The Volunteer
                <br />
                Burnout Crisis
              </h2>

              <p className="text-base text-zinc-400 mb-10 leading-relaxed max-w-xl">
                Volunteers are the lifeblood of social change, yet they're being pushed to their limits.
                Inefficient task allocation creates cascading failures—fatigue, turnover, and diminished impact
                where it matters most.
              </p>

              <div className="flex gap-12 md:gap-16">
                <GlitchStat value="40" label="Suffer Burnout" color="#8B5CF6" />
                <GlitchStat value="73" label="Skill Mismatch" color="#10B981" />
              </div>
            </div>

            <div className="scroll-reveal" style={{ animationDelay: '200ms' }}>
              <div className="frosted-obsidian p-8 space-y-5">
                <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500 mb-5">
                  Inefficiency Metrics
                </h4>
                {[
                  { label: 'Volunteer Fatigue Index', pct: 78, color: '#8B5CF6' },
                  { label: 'Task-Skill Mismatch Rate', pct: 65, color: '#EF4444' },
                  { label: 'Operational Overhead', pct: 52, color: '#F59E0B' },
                  { label: 'Resource Utilization', pct: 91, color: '#10B981' },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-zinc-400 font-medium">{bar.label}</span>
                      <span className="text-zinc-500 font-mono">{bar.pct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${bar.pct}%`, backgroundColor: bar.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-zinc-600 italic">* Data aggregated from 500+ NGOs across 12 countries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================== */}
      {/* 3. SOLUTION DEEP-DIVE (Vertical Timeline)  */}
      {/* ========================================== */}
      <section id="solution" ref={solutionRef} className="py-28 relative overflow-hidden">
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(139, 92, 246, 0.04) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-20 scroll-reveal">
            <span className="inline-block text-xs uppercase tracking-[0.25em] font-medium mb-4 px-3 py-1 border rounded-full" style={{ color: '#10B981', borderColor: 'rgba(16,185,129,0.25)' }}>
              How It Works
            </span>

            <h2
              className="gradient-text-silver font-extrabold mb-5 font-inter"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}
            >
              The AI Processing{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Engine</span>
            </h2>

            <p className="text-zinc-400 max-w-lg mx-auto">
              Four stages of intelligent matching — from data ingestion to one-click deployment.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line structure */}
            <div className="timeline-line hidden lg:block" style={{ background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div 
                className="absolute top-0 left-0 w-full"
                style={{
                  background: 'linear-gradient(to bottom, #8B5CF6, #10B981)',
                  height: `${solutionProgress * 100}%`,
                  transition: 'height 0.1s ease-out'
                }}
              />
            </div>

            {/* ---- STEP 01: Skill Vectorization ---- */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24 items-center scroll-reveal">
              {/* Timeline dot */}
              <div className="timeline-dot hidden lg:block" style={{ top: '50%', borderColor: '#8B5CF6' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(139,92,246,0.3)', animationDuration: '2s' }} />
              </div>

              {/* Visual — Left */}
              <div className="flex justify-center lg:justify-end pr-0 lg:pr-12">
                <div className="pulse-visual">
                  <div className="pulse-ring" />
                  <div className="pulse-ring" />
                  <div className="pulse-ring" />
                  <div className="pulse-ring" />
                  <div className="pulse-center flex items-center justify-center">
                    <div className="absolute min-w-[120px] text-[10px] text-center text-white font-bold tracking-wide pointer-events-none transition-opacity duration-300" style={{ 
                        opacity: hoveredSkillTag ? 1 : 0,
                        textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(139,92,246,0.8)',
                        zIndex: 30
                      }}>
                      {hoveredSkillTag === 'Skills' && 'Medical, CPR, Logistics'}
                      {hoveredSkillTag === 'Location' && 'Zone A, Route 42'}
                      {hoveredSkillTag === 'History' && '24 Deployments, 98%'}
                      {hoveredSkillTag === 'Bandwidth' && 'High Reserves, Safe'}
                    </div>
                  </div>
                  {/* Data point labels orbiting */}
                  {['Skills', 'Location', 'History', 'Bandwidth'].map((label, i) => (
                    <div
                      key={label}
                      onMouseEnter={() => setHoveredSkillTag(label)}
                      onMouseLeave={() => setHoveredSkillTag(null)}
                      className="absolute text-[10px] font-semibold tracking-wider uppercase cursor-pointer transition-all duration-300 z-20"
                      style={{
                        color: hoveredSkillTag === label ? '#FFF' : '#A78BFA',
                        top: `${50 + 42 * Math.sin((i * Math.PI) / 2)}%`,
                        left: `${50 + 42 * Math.cos((i * Math.PI) / 2)}%`,
                        transform: `translate(-50%, -50%) scale(${hoveredSkillTag === label ? 1.15 : 1})`,
                        opacity: hoveredSkillTag && hoveredSkillTag !== label ? 0.3 : 0.8,
                        textShadow: hoveredSkillTag === label ? '0 0 10px rgba(167,139,250,0.8)' : 'none',
                        padding: '12px'
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content — Right */}
              <div className="pl-0 lg:pl-12">
                <div className="process-step-panel p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wider" style={{ color: '#8B5CF6', background: 'rgba(139,92,246,0.1)' }}>STEP 01</span>
                    <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(to right, rgba(139,92,246,0.2), transparent)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-inter">Skill Vectorization</h3>
                  <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: '#A78BFA' }}>AI Ingestion of Volunteer Data Points</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    The AI converts volunteer profiles and NGO task requirements into high-dimensional vectors,
                    analyzing <span className="text-zinc-200 font-semibold">50+ data points</span> including past performance metrics,
                    skill certifications, availability patterns, and emotional bandwidth scores — creating a comprehensive
                    matching fingerprint for each individual.
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {['Skill Vectors', 'Performance History', 'Emotional Bandwidth', 'Certification Level'].map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded border" style={{ color: 'rgba(139,92,246,0.7)', background: 'rgba(139,92,246,0.08)', borderColor: 'rgba(139,92,246,0.15)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>


            {/* ---- STEP 02: Geo-Spatial Logic ---- */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24 items-center scroll-reveal">
              {/* Timeline dot */}
              <div className="timeline-dot hidden lg:block" style={{ top: '50%', borderColor: '#A78BFA' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(167,139,250,0.3)', animationDuration: '2.5s' }} />
              </div>

              {/* Content — Left */}
              <div className="pr-0 lg:pr-12 order-2 lg:order-1">
                <div className="process-step-panel p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wider" style={{ color: '#A78BFA', background: 'rgba(167,139,250,0.1)' }}>STEP 02</span>
                    <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(to right, rgba(167,139,250,0.2), transparent)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-inter">Geo-Spatial Logic</h3>
                  <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: '#A78BFA' }}>Real-Time Mapping of Volunteers to Disaster Zones</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Cross-references volunteer GPS coordinates with active disaster zones in real-time,
                    calculating <span className="text-zinc-200 font-semibold">Time-to-Impact</span> metrics
                    to minimize NGO logistics overhead. Dynamic re-routing adjusts assignments as new urgency signals
                    arrive — ensuring the nearest qualified volunteer is always first in line.
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {['GPS Triangulation', 'Urgency Scoring', 'Route Optimization', 'Zone Mapping'].map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded border" style={{ color: 'rgba(167,139,250,0.7)', background: 'rgba(167,139,250,0.08)', borderColor: 'rgba(167,139,250,0.15)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual — Right */}
              <div className="flex justify-center lg:justify-start pl-0 lg:pl-12 order-1 lg:order-2">
                <div className="map-wireframe">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((p) => (
                    <React.Fragment key={`g${p}`}>
                      <div className="grid-line grid-h" style={{ top: `${p}%` }} />
                      <div className="grid-line grid-v" style={{ left: `${p}%` }} />
                    </React.Fragment>
                  ))}

                  {/* Animated connection lines */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    <line x1="30%" y1="25%" x2="70%" y2="40%" stroke="#8B5CF6" strokeWidth="1" opacity="0.2"
                      strokeDasharray="4 4" style={{ animation: 'connectionPulse 3s ease-in-out infinite' }} />
                    <line x1="70%" y1="40%" x2="45%" y2="75%" stroke="#10B981" strokeWidth="1" opacity="0.2"
                      strokeDasharray="4 4" style={{ animation: 'connectionPulse 3s ease-in-out infinite 0.5s' }} />
                    <line x1="30%" y1="25%" x2="85%" y2="70%" stroke="#A78BFA" strokeWidth="1" opacity="0.15"
                      strokeDasharray="4 4" style={{ animation: 'connectionPulse 4s ease-in-out infinite 1s' }} />
                  </svg>

                  {/* Data nodes */}
                  {[
                    { x: '30%', y: '25%', color: '#8B5CF6', anim: 'nodeFloat1', label: 'V-01' },
                    { x: '70%', y: '40%', color: '#10B981', anim: 'nodeFloat2', label: 'V-02' },
                    { x: '45%', y: '75%', color: '#A78BFA', anim: 'nodeFloat3', label: 'V-03' },
                    { x: '85%', y: '70%', color: '#EF4444', anim: 'nodeFloat1', label: '🔴' },
                    { x: '20%', y: '55%', color: '#F59E0B', anim: 'nodeFloat2', label: '⚠️' },
                  ].map((node, i) => (
                    <div
                      key={i}
                      className="map-node"
                      style={{
                        left: node.x,
                        top: node.y,
                        backgroundColor: node.color,
                        color: node.color,
                        animation: `${node.anim} ${5 + i}s ease-in-out infinite`,
                      }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold" style={{ color: node.color }}>
                        {node.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


            {/* ---- STEP 03: The Burnout Shield ---- */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24 items-center scroll-reveal">
              {/* Timeline dot */}
              <div className="timeline-dot hidden lg:block" style={{ top: '50%', borderColor: '#10B981' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(16,185,129,0.3)', animationDuration: '3s' }} />
              </div>

              {/* Visual — Left */}
              <div className="flex justify-center lg:justify-end pr-0 lg:pr-12">
                <div className="shield-visual">
                  <div className="shield-arc" />
                  <div className="shield-arc" />
                  <div className="shield-arc" />
                  <div className="shield-core" />
                  {/* Shield percentage indicator */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: '#10B981' }}>80%</div>
                      <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(16,185,129,0.6)' }}>Threshold</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content — Right */}
              <div className="pl-0 lg:pl-12">
                <div className="process-step-panel p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wider" style={{ color: '#10B981', background: 'rgba(16,185,129,0.1)' }}>STEP 03</span>
                    <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(to right, rgba(16,185,129,0.2), transparent)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-inter">The Burnout Shield</h3>
                  <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: '#10B981' }}>Predictive Algorithms Monitoring Fatigue Levels</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    A predictive algorithm continuously monitors <span className="text-zinc-200 font-semibold">Volunteer Fatigue Indexes</span> across
                    every active assignment. When a volunteer's assigned hours cross the <span className="font-semibold" style={{ color: '#10B981' }}>80% capacity threshold</span>,
                    the system automatically triggers a rebalancing alert — redistributing tasks to prevent exhaustion
                    before it impacts fieldwork quality.
                  </p>
                  {/* Mini fatigue bar */}
                  <div className="mt-5 p-3 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-zinc-400 font-medium">Fatigue Index — Priya S.</span>
                      <span className="font-bold" style={{ color: '#EF4444' }}>85% → Rebalancing...</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '85%', background: 'linear-gradient(to right, #10B981, #F59E0B, #EF4444)' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* ---- STEP 04: Instant Deployment ---- */}
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center scroll-reveal">
              {/* Timeline dot */}
              <div className="timeline-dot hidden lg:block" style={{ top: '50%', borderColor: '#34D399' }}>
                <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: 'rgba(52,211,153,0.3)', animationDuration: '2s' }} />
              </div>

              {/* Content — Left */}
              <div className="pr-0 lg:pr-12 order-2 lg:order-1">
                <div className="process-step-panel p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md tracking-wider" style={{ color: '#34D399', background: 'rgba(52,211,153,0.1)' }}>STEP 04</span>
                    <div className="h-[1px] flex-1" style={{ background: 'linear-gradient(to right, rgba(52,211,153,0.2), transparent)' }} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-inter">Instant Deployment</h3>
                  <p className="text-sm font-medium mb-3 tracking-wide" style={{ color: '#34D399' }}>One-Click Mobilization of the Optimized Match</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    The final step where the coordinator verifies the AI's top recommendation. One click to review the
                    confidence score, check volunteer availability, and <span className="text-zinc-200 font-semibold">mobilize deployment instantly</span>.
                    The entire matching pipeline — from ingestion to confirmation — completes in under 3 seconds.
                  </p>
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {['AI Confidence: 98%', 'Latency: <3s', '1-Click Deploy', 'Audit Trail'].map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-1 rounded border" style={{ color: 'rgba(52,211,153,0.7)', background: 'rgba(52,211,153,0.08)', borderColor: 'rgba(52,211,153,0.15)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visual — Right: Match Confirmation Card */}
              <div className="flex justify-center lg:justify-start pl-0 lg:pl-12 order-1 lg:order-2">
                <div
                  className="w-[260px] rounded-2xl overflow-hidden border border-white/[0.08]"
                  style={{
                    background: 'linear-gradient(160deg, rgba(17,17,19,0.95) 0%, rgba(9,9,11,0.95) 100%)',
                    animation: 'confirmGlow 4s ease-in-out infinite',
                  }}
                >
                  {/* Card header */}
                  <div className="p-5 text-center border-b border-white/[0.05]">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">AI Match Score</div>
                    <div
                      className="text-5xl font-extrabold font-inter mb-1"
                      style={{
                        background: 'linear-gradient(135deg, #8B5CF6, #10B981)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      98%
                    </div>
                    <div className="text-[10px] font-medium" style={{ color: 'rgba(16,185,129,0.6)' }}>Exceptional Match</div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Volunteer</span>
                      <span className="text-zinc-200 font-medium">Priya Sharma</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Task</span>
                      <span className="text-zinc-200 font-medium">Food Drive — North</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Skill Match</span>
                      <span className="font-semibold" style={{ color: '#10B981' }}>96%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Zone Match</span>
                      <span className="font-semibold" style={{ color: '#10B981' }}>100%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Workload</span>
                      <span className="text-green-400 font-semibold">Safe (42%)</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-4 pb-4">
                    <div
                      className="w-full py-2.5 text-center text-sm font-semibold text-white rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/20"
                      style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
                    >
                      ✓ Confirm & Deploy
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================== */}
      {/* 4. DASHBOARD — Full Interactive Preview     */}
      {/* ========================================== */}
      <section id="platform" ref={platformRef} className="py-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 scroll-reveal">
            <span className="inline-block text-xs uppercase tracking-[0.25em] font-medium mb-4 px-3 py-1 border rounded-full" style={{ color: '#8B5CF6', borderColor: 'rgba(139,92,246,0.25)' }}>
              The Platform
            </span>

            <h2
              className="gradient-text-silver font-extrabold mb-5 font-inter"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}
            >
              Command Center{' '}
              <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #10B981)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>Performance</span>
            </h2>

            <p className="text-zinc-400 max-w-lg mx-auto">
              A professional, AI-driven interface built for the modern NGO.
            </p>
          </div>

          <div className="scroll-reveal" style={{ animationDelay: '150ms' }}>
            <div className="relative mx-auto max-w-6xl" style={{ perspective: '1200px' }}>

              {/* Dashboard Frame */}
              <div
                className="rounded-2xl overflow-hidden border border-white/8"
                style={{
                  background: 'linear-gradient(145deg, #111113 0%, #0B0F19 100%)',
                  transform: 'rotateX(2deg)',
                  boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5), 0 0 80px -20px rgba(139,92,246,0.08)',
                }}
              >
                {/* Window Chrome */}
                <div className="h-10 bg-white/[0.02] border-b border-white/[0.05] flex items-center px-5 gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/50" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]/50" />
                  <div className="ml-4 px-4 py-1 bg-white/[0.03] rounded-md text-xs text-zinc-500 font-mono">
                    app.dogooder.ai/dashboard
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="flex" style={{ background: 'linear-gradient(180deg, #111113 0%, #0B0F19 100%)' }}>

                  {/* Sidebar */}
                  <div className="w-52 border-r border-white/[0.05] p-4 hidden md:block">
                    <div className="flex items-center gap-2 mb-6 px-2">
                      <div className="w-6 h-6 rounded-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)' }} />
                      <span className="text-sm font-semibold text-white">DoGooder</span>
                    </div>
                    {[
                      { icon: 'ph-squares-four', label: 'Dashboard', active: true },
                      { icon: 'ph-plus-circle', label: 'Create Task', active: false },
                      { icon: 'ph-users', label: 'Volunteers', active: false },
                      { icon: 'ph-chart-line-up', label: 'Insights', active: false },
                      { icon: 'ph-gear', label: 'Settings', active: false },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg mb-1 text-sm"
                        style={{
                          background: item.active ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                          color: item.active ? '#A78BFA' : '#71717A',
                          borderLeft: item.active ? '2px solid #8B5CF6' : '2px solid transparent',
                        }}
                      >
                        <i className={`ph ${item.icon}`} style={{ fontSize: '1rem' }} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Main Dashboard Area */}
                  <div className="flex-1 p-6 min-h-[520px]">

                    {/* Top Bar */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Coordinator Dashboard</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">Welcome back, Anjali · Sewa Foundation</p>
                      </div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-white/[0.04] border border-white/[0.06] rounded-lg text-xs text-zinc-400 font-medium flex items-center gap-1.5">
                          <i className="ph ph-calendar" /> Last 7 days
                        </div>
                        <div className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-semibold flex items-center gap-1.5">
                          <i className="ph ph-warning" /> 3 Burnout Alerts
                        </div>
                      </div>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[
                        { label: 'Total Volunteers', val: '1,247', change: '+12%', color: '#8B5CF6', icon: 'ph-users' },
                        { label: 'Active Tasks', val: '89', change: '+5', color: '#10B981', icon: 'ph-clipboard-text' },
                        { label: 'Match Score', val: '87%', change: '+3%', color: '#F59E0B', icon: 'ph-target' },
                        { label: 'Hours Saved', val: '2.4k', change: '+18%', color: '#10B981', icon: 'ph-clock' },
                      ].map((s, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[11px] text-zinc-500 font-medium">{s.label}</span>
                            <i className={`ph ${s.icon}`} style={{ color: s.color, fontSize: '0.9rem' }} />
                          </div>
                          <div className="text-xl font-bold text-white font-inter">{s.val}</div>
                          <div className="text-[11px] text-emerald-400 font-medium mt-1">↑ {s.change}</div>
                        </div>
                      ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-[1.6fr_1fr] gap-3 mb-5">
                      {/* Activity Chart */}
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs text-zinc-400 font-medium">Weekly Matching Performance</span>
                          <div className="flex gap-3 text-[10px] text-zinc-500">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#8B5CF6' }} /> Matched</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#10B981' }} /> Completed</span>
                          </div>
                        </div>
                        <div className="flex items-end justify-between h-36 gap-2 px-2">
                          {[
                            { m: 45, c: 38 }, { m: 62, c: 55 }, { m: 78, c: 68 }, { m: 55, c: 48 },
                            { m: 89, c: 79 }, { m: 72, c: 65 }, { m: 95, c: 88 }
                          ].map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full flex gap-[2px]">
                                <div
                                  className="flex-1 rounded-t"
                                  style={{ height: `${d.m * 1.3}px`, background: '#8B5CF6', opacity: 0.9 }}
                                />
                                <div
                                  className="flex-1 rounded-t"
                                  style={{ height: `${d.c * 1.3}px`, background: '#10B981', opacity: 0.8 }}
                                />
                              </div>
                              <span className="text-[10px] text-zinc-600 font-medium">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Burnout Monitor */}
                      <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                        <span className="text-xs text-zinc-400 font-medium block mb-4">Burnout Monitor</span>
                        {[
                          { name: 'Priya Sharma', hours: 24, status: 'danger', pct: 92 },
                          { name: 'Arjun Mehta', hours: 18, status: 'warning', pct: 72 },
                          { name: 'Riya Patel', hours: 8, status: 'safe', pct: 32 },
                          { name: 'Dev Kumar', hours: 6, status: 'safe', pct: 24 },
                        ].map((vol, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-zinc-300 font-medium">{vol.name}</span>
                                <span className="text-[10px] text-zinc-500">{vol.hours}h</span>
                              </div>
                              <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${vol.pct}%`,
                                    background: vol.status === 'danger' ? '#EF4444' : vol.status === 'warning' ? '#F59E0B' : '#10B981',
                                  }}
                                />
                              </div>
                            </div>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                              style={{
                                background: vol.status === 'danger' ? 'rgba(239,68,68,0.12)' : vol.status === 'warning' ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                                color: vol.status === 'danger' ? '#f87171' : vol.status === 'warning' ? '#fbbf24' : '#34d399',
                              }}
                            >
                              {vol.status === 'danger' ? 'HIGH' : vol.status === 'warning' ? 'MED' : 'SAFE'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pending Tasks Row */}
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs text-zinc-400 font-medium">Pending Task Assignments</span>
                        <span className="text-[11px] font-medium cursor-pointer hover:text-violet-300 transition-colors" style={{ color: '#8B5CF6' }}>View All →</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { title: 'Community Food Drive', zone: 'North', skills: 'Food Distribution, Logistics', urgency: 'high', score: '94%' },
                          { title: 'Medical Camp Setup', zone: 'Central', skills: 'First Aid, Medical', urgency: 'med', score: '87%' },
                          { title: 'Education Workshop', zone: 'South', skills: 'Teaching, Counseling', urgency: 'low', score: '82%' },
                        ].map((task, i) => (
                          <div key={i} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.02] transition-colors">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-1 h-8 rounded-full"
                                style={{
                                  background: task.urgency === 'high' ? '#EF4444' : task.urgency === 'med' ? '#F59E0B' : '#10B981',
                                }}
                              />
                              <div>
                                <div className="text-sm text-zinc-200 font-medium">{task.title}</div>
                                <div className="text-[11px] text-zinc-500">{task.zone} Zone · {task.skills}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold" style={{ color: '#8B5CF6' }}>{task.score}</span>
                              <button className="px-3 py-1 text-[11px] font-semibold text-white rounded-md" style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}>
                                Match
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow behind dashboard */}
              <div className="absolute -inset-8 blur-[100px] -z-10 rounded-full" style={{ background: 'rgba(139,92,246,0.05)' }} />
            </div>
          </div>

          {/* CTA — buttons clearly visible, onEnter wired */}
          <div className="text-center mt-14 scroll-reveal">
            <a href="/app">
              <button className="neon-aura-btn text-base px-10 py-4" id="platform-cta">
                Launch App →
              </button>
            </a>
            <p className="text-zinc-600 text-sm mt-3">No credit card required. Free for NGOs.</p>
          </div>
        </div>
      </section>


      {/* ========================================== */}
      {/* FOOTER                                     */}
      {/* ========================================== */}
      <footer className="py-14 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full" style={{ background: 'linear-gradient(135deg, #8B5CF6, #10B981)' }} />
              <span className="text-base font-semibold text-zinc-300 font-inter">DoGooder</span>
            </div>

            <div className="flex gap-8 text-sm text-zinc-500">
              <a href="#hero" className="hover:text-white transition-colors">Home</a>
              <a href="#problem" className="hover:text-white transition-colors">Challenge</a>
              <a href="#solution" className="hover:text-white transition-colors">Solution</a>
              <a href="#platform" className="hover:text-white transition-colors">Platform</a>
            </div>

            <p className="text-zinc-600 text-sm">
              © 2026 DoGooder AI. Bridging Logistics & Compassion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}