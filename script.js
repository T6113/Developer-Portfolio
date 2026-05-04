// Global variables
let particles = [];
let animationId;

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  initializePortfolio();
});

// Initialize all portfolio functionality
function initializePortfolio() {
  setupMobileNavigation();
  setupSmoothScrolling();
  setupScrollAnimations();
  setupSkillBars();
  createParticles();
  animateParticles();
  setupIntersectionObserver();
}

// Mobile Navigation Setup
function setupMobileNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navLinkItems = document.querySelectorAll(".nav-link");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
      document.body.style.overflow = navLinks.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close mobile menu when clicking on a link
    navLinkItems.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
  const navLinks = document.querySelectorAll(".nav-link");
  const heroButtons = document.querySelectorAll(".hero-buttons .btn");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  // Handle navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle hero buttons
  heroButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = button.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle scroll indicator
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", () => {
      const skillsSection = document.querySelector("#skills");
      if (skillsSection) {
        const offsetTop = skillsSection.offsetTop - 70;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    // Navbar background on scroll
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(26, 26, 26, 0.98)";
      } else {
        navbar.style.background = "rgba(26, 26, 26, 0.95)";
      }
    }

    // Update active nav link
    updateActiveNavLink();
  });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
    }
  });
}

// Skill Bars Animation
function setupSkillBars() {
  const skillItems = document.querySelectorAll(".skill-item");

  skillItems.forEach((item) => {
    const progressBar = item.querySelector(".skill-progress");
    const targetWidth = progressBar.getAttribute("data-width");

    // Add hover effects
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateX(5px)";
      item.style.transition = "transform 0.3s ease";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateX(0)";
    });

    // Store the target width for intersection observer
    progressBar.targetWidth = targetWidth;
  });
}

// Intersection Observer for animations
function setupIntersectionObserver() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate skill bars
        if (entry.target.classList.contains("skill-item")) {
          const progressBar = entry.target.querySelector(".skill-progress");
          if (progressBar && progressBar.targetWidth) {
            setTimeout(() => {
              progressBar.style.width = progressBar.targetWidth + "%";
            }, 200);
          }
        }

        // Animate sections
        if (entry.target.classList.contains("section-header")) {
          animateCounter(entry.target);
        }

        // Animate About section stats
        if (entry.target.classList.contains("stat-item")) {
          const parentSection = entry.target.closest(".about");
          if (parentSection) {
            setTimeout(() => {
              animateCounter(entry.target);
            }, 300);
          }
        }
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const elementsToObserve = [
    ".skill-item",
    ".section-header",
    ".about-card",
    ".stat-item",
    ".contact-item",
    ".projects-placeholder",
  ];

  elementsToObserve.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.classList.add("fade-in-up");
      observer.observe(el);
    });
  });
}

// Animate counters (for about section stats)
function animateCounter(element) {
  const counters = element.querySelectorAll("[data-count]");

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-count"));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

// Particle System
function createParticles() {
  const particlesContainer = document.getElementById("particles");

  if (!particlesContainer) {
    console.log("Particles container not found");
    return;
  }

  const particleCount = window.innerWidth < 768 ? 30 : 60;

  // Clear existing particles
  particlesContainer.innerHTML = "";
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random position
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    particle.style.left = x + "px";
    particle.style.top = y + "px";

    // Random delay for animation
    particle.style.animationDelay = Math.random() * 6 + "s";

    // Random size variation
    const size = Math.random() * 3 + 1;
    particle.style.width = size + "px";
    particle.style.height = size + "px";

    particlesContainer.appendChild(particle);

    // Store particle data
    particles.push({
      element: particle,
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: size,
    });
  }
}

// Animate particles
function animateParticles() {
  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Wrap around screen
    if (particle.x < 0) particle.x = window.innerWidth;
    if (particle.x > window.innerWidth) particle.x = 0;
    if (particle.y < 0) particle.y = window.innerHeight;
    if (particle.y > window.innerHeight) particle.y = 0;

    particle.element.style.left = particle.x + "px";
    particle.element.style.top = particle.y + "px";
  });

  animationId = requestAnimationFrame(animateParticles);
}

// Typing Effect (for future hero text animation)
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = "";

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Parallax effect for sections
function setupParallax() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".parallax");

    parallaxElements.forEach((element) => {
      const speed = element.getAttribute("data-speed") || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Utility function to throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Handle window resize
window.addEventListener(
  "resize",
  throttle(() => {
    // Recreate particles for new window size
    createParticles();
  }, 250),
);

// Loading animation
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  // Add staggered animation to skill items
  const skillItems = document.querySelectorAll(".skill-item");
  skillItems.forEach((item, index) => {
    item.style.animationDelay = index * 0.1 + "s";
  });
});

// Add custom cursor effect (optional)
function setupCustomCursor() {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Add cursor interaction with buttons and links
  const interactiveElements = document.querySelectorAll("a, button, .btn");
  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("cursor-hover");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("cursor-hover");
    });
  });
}

// Easter egg: Console message
console.log(`
🚀 Welcome to Thomisha's Portfolio!
💻 Built with vanilla HTML, CSS, and JavaScript
🎨 Designed with modern web technologies
✨ Thanks for checking out the code!

Feel free to reach out: thomishamyers3@gmail.com
`);

// Performance monitoring (optional)
function logPerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      const perfData = performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      console.log(`Page loaded in ${pageLoadTime}ms`);
    });
  }
}

// Initialize performance monitoring
logPerformance();

// Cleanup function
function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
}

// Cleanup on page unload
window.addEventListener("beforeunload", cleanup);
