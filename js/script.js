/* Global Hôtel Etena — script.js
   Modules : menu mobile, en-tête, diaporama d'accueil, carrousel des chambres,
   apparition des sections, galerie (filtres + lightbox), FAQ, formulaires → WhatsApp. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const NUMERO = '23565855839';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduit = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const ouvrirWA = t => window.open(`https://wa.me/${NUMERO}?text=${encodeURIComponent(t)}`, '_blank', 'noopener');
  const dateFr = v => { const [a, m, j] = v.split('-').map(Number); return new Date(a, m - 1, j).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); };

  function initMenu() {
    const burger = $('.menu-burger'), menu = $('#menu-principal'), voile = $('.menu-voile');
    if (!burger || !menu) return;
    const basculer = ouvert => {
      menu.classList.toggle('ouvert', ouvert);
      burger.setAttribute('aria-expanded', ouvert);
      burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
      if (voile) voile.hidden = !ouvert;
      document.body.style.overflow = ouvert ? 'hidden' : '';
    };
    burger.addEventListener('click', () => basculer(!menu.classList.contains('ouvert')));
    menu.addEventListener('click', e => { if (e.target.closest('a')) basculer(false); });
    if (voile) voile.addEventListener('click', () => basculer(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') basculer(false); });
    matchMedia('(min-width:861px)').addEventListener('change', () => basculer(false));
  }

  function initEntete() {
    const entete = $('#entete'), haut = $('.haut-page');
    if (!entete) return;
    const maj = () => {
      entete.classList.toggle('defile', scrollY > 40);
      if (haut) haut.hidden = scrollY < 600;
    };
    maj();
    addEventListener('scroll', maj, { passive: true });
    if (haut) haut.addEventListener('click', () => scrollTo({ top: 0, behavior: reduit ? 'auto' : 'smooth' }));
  }

  function initHero() {
    const imgs = $$('.hero-img');
    if (imgs.length < 2 || reduit) return;
    let i = 0;
    setInterval(() => {
      imgs[i].classList.remove('actif');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('actif');
    }, 6000);
  }

  function initCarrousels() {
    if (reduit) return;
    $$('.carte-chambre-img').forEach(bloc => {
      const images = $$('img', bloc);
      if (images.length < 2) return;
      let i = 0, pause = false;
      bloc.addEventListener('mouseenter', () => pause = true);
      bloc.addEventListener('mouseleave', () => pause = false);
      setInterval(() => {
        if (pause || document.hidden) return;
        images[i].classList.remove('actif');
        i = (i + 1) % images.length;
        images[i].classList.add('actif');
      }, 3500);
    });
  }

  function initReveal() {
    const els = $$('.section, .bandeau-atouts');
    if (reduit || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entrees => entrees.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
    }), { threshold: 0.06 });
    els.forEach(el => { el.classList.add('reveal'); io.observe(el); });
  }

  function initFiltres() {
    const boutons = $$('.filtre');
    if (!boutons.length) return;
    boutons.forEach(b => b.addEventListener('click', () => {
      boutons.forEach(x => { x.classList.toggle('actif', x === b); x.setAttribute('aria-pressed', x === b); });
      $$('.grille-galerie .photo-galerie').forEach(p => { p.hidden = b.dataset.cat !== 'tout' && p.dataset.cat !== b.dataset.cat; });
    }));
  }

  function initLightbox() {
    const box = $('#lightbox'), cible = $('#lightbox-img');
    if (!box || !cible) return;
    let liste = [], idx = 0;
    const mk = (cls, label, txt) => { const b = document.createElement('button'); b.className = `lightbox-nav ${cls}`; b.setAttribute('aria-label', label); b.textContent = txt; return b; };
    const prec = mk('lightbox-prec', 'Image précédente', '‹'), suiv = mk('lightbox-suiv', 'Image suivante', '›');
    box.append(prec, suiv);
    const afficher = i => {
      idx = (i + liste.length) % liste.length;
      cible.src = liste[idx].currentSrc || liste[idx].src;
      cible.alt = liste[idx].alt;
      prec.hidden = suiv.hidden = liste.length < 2;
    };
    const fermer = () => { box.hidden = true; cible.src = ''; document.body.style.overflow = ''; };
    document.addEventListener('click', e => {
      const photo = e.target.closest('.photo-galerie');
      if (photo) {
        liste = $$('.photo-galerie').filter(p => !p.hidden);
        afficher(liste.indexOf(photo));
        box.hidden = false;
        document.body.style.overflow = 'hidden';
        return;
      }
      if (e.target === prec) afficher(idx - 1);
      else if (e.target === suiv) afficher(idx + 1);
      else if (e.target === box || e.target.closest('.lightbox-fermer')) fermer();
    });
    document.addEventListener('keydown', e => {
      if (box.hidden) return;
      if (e.key === 'Escape') fermer();
      if (e.key === 'ArrowLeft') afficher(idx - 1);
      if (e.key === 'ArrowRight') afficher(idx + 1);
    });
  }

  function initFaq() {
    const items = $$('.item-faq');
    items.forEach(d => d.addEventListener('toggle', () => { if (d.open) items.forEach(o => { if (o !== d) o.open = false; }); }));
  }

  function initFormulaire() {
    const form = $('#formulaire-contact');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      ouvrirWA(`Bonjour, je suis ${d.get('nom').trim()}.` + (d.get('telephone') ? ` Mon numéro : ${d.get('telephone')}.` : '') + `\n${d.get('message').trim()}`);
    });
  }

  function initReservation() {
    const form = $('#reservation');
    if (!form) return;
    const arrivee = $('#arrivee'), depart = $('#depart');
    const aujourdhui = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    arrivee.min = depart.min = aujourdhui;
    const verifier = () => {
      depart.setCustomValidity(arrivee.value && depart.value && depart.value <= arrivee.value ? 'Le départ doit être après l\'arrivée.' : '');
    };
    arrivee.addEventListener('change', () => {
      depart.min = arrivee.value || aujourdhui;
      if (depart.value && depart.value <= arrivee.value) depart.value = '';
      verifier();
    });
    depart.addEventListener('change', verifier);
    form.addEventListener('submit', e => {
      e.preventDefault();
      verifier();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const nuits = Math.round((new Date(d.get('depart')) - new Date(d.get('arrivee'))) / 864e5);
      ouvrirWA(`Bonjour, je souhaite réserver : ${d.get('type')}, du ${dateFr(d.get('arrivee'))} au ${dateFr(d.get('depart'))} (${nuits} nuit${nuits > 1 ? 's' : ''}), pour ${d.get('personnes')} personne(s). Merci de me confirmer la disponibilité et le tarif.`);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMenu(); initEntete(); initHero(); initCarrousels(); initReveal();
    initFiltres(); initLightbox(); initFaq(); initFormulaire(); initReservation();
  });
})();
