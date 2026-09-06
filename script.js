// Global Hôtel Etena — interactions du site

// Menu mobile (burger)
const burger = document.querySelector('.menu-burger');
const menu = document.querySelector('.menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const ouvert = menu.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
  });
  menu.querySelectorAll('a').forEach(lien => {
    lien.addEventListener('click', () => {
      menu.classList.remove('ouvert');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Lien de navigation actif selon la section visible
const sections = document.querySelectorAll('main section[id]');
const liensNav = document.querySelectorAll('nav.menu a[href^="#"]');
if ('IntersectionObserver' in window && sections.length) {
  const observateurNav = new IntersectionObserver((entrees) => {
    entrees.forEach(entree => {
      if (entree.isIntersecting) {
        liensNav.forEach(lien => lien.classList.remove('actif'));
        const lienActif = document.querySelector(`nav.menu a[href="#${entree.target.id}"]`);
        lienActif?.classList.add('actif');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(section => observateurNav.observe(section));
}

// Lightbox galerie photo
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
document.querySelectorAll('.photo-galerie').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
  });
});
document.querySelector('.lightbox-fermer')?.addEventListener('click', () => { lightbox.hidden = true; });
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.hidden = true; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lightbox && !lightbox.hidden) lightbox.hidden = true; });

// Révélation douce au défilement
if ('IntersectionObserver' in window) {
  document.querySelectorAll('.section, .carte-pourquoi, .carte-chambre, .carte-avis').forEach(el => el.classList.add('reveal'));
  const observateurReveal = new IntersectionObserver((entrees, obs) => {
    entrees.forEach(entree => {
      if (entree.isIntersecting) {
        entree.target.classList.add('visible');
        obs.unobserve(entree.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observateurReveal.observe(el));
}

// Formulaire de contact → envoi via WhatsApp
const formulaire = document.getElementById('formulaire-contact');
formulaire?.addEventListener('submit', (e) => {
  e.preventDefault();
  const nom = document.getElementById('nom').value.trim();
  const telephone = document.getElementById('telephone').value.trim();
  const message = document.getElementById('message').value.trim();
  const texte = `Bonjour, je m'appelle ${nom}${telephone ? ' (' + telephone + ')' : ''}. ${message}`;
  window.open(`https://wa.me/23565855839?text=${encodeURIComponent(texte)}`, '_blank');
});
