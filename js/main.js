/**
 * Hibilet — Hassle-free ticketing for everyone
 */

document.addEventListener('DOMContentLoaded', function() {
  // Success story count-up animation
  const successSection = document.querySelector('.success-map-section');
  const successValues = document.querySelectorAll('.success-value[data-count]');

  function formatNumber(n) {
    if (n >= 1000) {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return n.toString();
  }

  function animateValue(el, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el.textContent = prefix + formatNumber(current) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  function runCountUp() {
    successValues.forEach(function(el) {
      const target = parseInt(el.dataset.count, 10);
      const start = el.dataset.start ? parseInt(el.dataset.start, 10) : 0;
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      animateValue(el, start, target, 1500, prefix, suffix);
    });
  }

  if (successSection && successValues.length) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          runCountUp();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(successSection);
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your message. We will be in touch shortly.');
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('mainNav');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Pricing calculator
  const ticketSlider = document.getElementById('ticketSlider');
  const ticketPriceSelect = document.getElementById('ticketPriceSelect');
  if (ticketSlider) {
    const TICKET_STEPS = [100, 250, 500, 1000, 2000, 5000, 10000];
    const COMMISSION_RATE = 0.075;
    const TIERS = {
      starter: { max: 500, monthly: 199 },
      growth: { max: 5000, monthly: 499 },
      enterprise: { max: Infinity, monthly: null }
    };

    function getTierForTickets(count) {
      if (count <= 500) return 'starter';
      if (count <= 5000) return 'growth';
      return 'enterprise';
    }

    function formatNumber(n) {
      if (n >= 1000) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return n.toString();
    }

    function getTicketValue() {
      return ticketPriceSelect ? parseInt(ticketPriceSelect.value, 10) : 30;
    }

    function updatePricingCalculator() {
      const index = parseInt(ticketSlider.value, 10);
      const tickets = TICKET_STEPS[index];
      const tier = getTierForTickets(tickets);
      const ticketValue = getTicketValue();

      const traditionalCost = tickets * ticketValue * COMMISSION_RATE;
      const hibiletCost = TIERS[tier].monthly;
      let savingsPercent = 0;

      if (hibiletCost !== null) {
        const savings = traditionalCost - hibiletCost;
        savingsPercent = Math.round((savings / traditionalCost) * 100);
        savingsPercent = Math.min(99, Math.max(0, savingsPercent));
      } else {
        const estEnterpriseCost = 1500;
        const savings = traditionalCost - estEnterpriseCost;
        savingsPercent = Math.round((savings / traditionalCost) * 100);
        savingsPercent = Math.min(99, Math.max(50, savingsPercent));
      }

      document.getElementById('ticketCount').textContent = formatNumber(tickets);
      document.getElementById('savingsPercent').textContent = savingsPercent;

      const tierFeeEl = document.getElementById('tierFeeDisplay');
      if (tierFeeEl) {
        const tierNames = { starter: 'Starter', growth: 'Growth', enterprise: 'Enterprise' };
        const tierName = tierNames[tier];
        tierFeeEl.textContent = hibiletCost !== null ? `— €${hibiletCost}/mo  with ${tierName} tier` : `— Contact us`;
      }

      const tooltipEl = document.querySelector('.pricing-tooltip-wrap');
      if (tooltipEl) {
        tooltipEl.setAttribute('title', `Based on 7.5% industry average commission. Your savings may vary.`);
      }

      document.querySelectorAll('.pricing-card').forEach(card => {
        card.classList.remove('pricing-card-active');
        if (card.dataset.tier === tier) {
          card.classList.add('pricing-card-active');
        }
      });
    }

    ticketSlider.addEventListener('input', updatePricingCalculator);
    if (ticketPriceSelect) {
      ticketPriceSelect.addEventListener('change', updatePricingCalculator);
    }
    updatePricingCalculator();

    const tooltipEl = document.querySelector('.pricing-tooltip-wrap');
    if (tooltipEl && typeof bootstrap !== 'undefined') {
      new bootstrap.Tooltip(tooltipEl);
    }
  }
});
