'use client';

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Bug, ChevronRight, CircleDot, Copy, Mail, Menu, MousePointer2, Sparkles, X } from 'lucide-react';
const projects = [
  { id: 'TC-001', number: '01', title: 'Interfaces en laboratoire', text: "Des sites imaginés et construits en vibecoding, avec l’envie de comprendre ce qui se passe vraiment sous le capot.", tags: ['UI', 'VIBECODING', 'EXPLORATION'], color: 'lime', status: 'PASSED' },
  { id: 'PRJ-002', number: '02', title: 'Expériences créatives', text: 'Un petit laboratoire interactif où tester, chercher, casser et recommencer. Certaines expériences fonctionnent déjà, les suivantes arrivent.', tags: ['PLAYGROUND', 'QA', 'CRÉATIF'], color: 'violet', status: 'LAB OUVERT' },
  { id: 'PRJ-003', number: '03', title: 'La suite arrive…', text: 'La formation QA va bientôt enrichir ce portfolio avec de nouveaux projets, des méthodes et un regard encore plus précis.', tags: ['QA', 'COMING SOON'], color: 'orange', status: 'À VENIR' },
];
const extraCrumbSpots = [
  { zone: 'hero', id: 'hero-2', left: '29%', top: '27%' }, { zone: 'hero', id: 'hero-3', left: '72%', top: '38%' }, { zone: 'hero', id: 'hero-4', left: '87%', top: '73%' }, { zone: 'hero', id: 'hero-5', left: '43%', top: '82%' },
  { zone: 'about', id: 'about-2', left: '6%', top: '37%' }, { zone: 'about', id: 'about-3', left: '58%', top: '13%' }, { zone: 'about', id: 'about-4', left: '89%', top: '64%' }, { zone: 'about', id: 'about-5', left: '34%', top: '88%' },
  { zone: 'projects', id: 'projects-2', left: '9%', top: '31%' }, { zone: 'projects', id: 'projects-3', left: '37%', top: '67%' }, { zone: 'projects', id: 'projects-4', left: '68%', top: '24%' }, { zone: 'projects', id: 'projects-5', left: '92%', top: '79%' },
  { zone: 'journey', id: 'journey-2', left: '14%', top: '24%' }, { zone: 'journey', id: 'journey-3', left: '48%', top: '59%' }, { zone: 'journey', id: 'journey-4', left: '81%', top: '35%' }, { zone: 'journey', id: 'journey-5', left: '65%', top: '86%' },
] as const;
const BUG_CRUMB_TOTAL = 21;
const bugHints: Record<number, string> = {
  1: 'Relisez attentivement chaque lettre de la navigation principale.', 2: 'Observez le panier avant d’avoir ajouté le moindre article.',
  3: 'Recalculez le prix à partir du pourcentage annoncé.', 4: 'Suivez le bord droit des éléments de la fiche produit.',
  5: 'Cherchez une action secondaire presque confondue avec le fond.', 6: 'Comparez la promesse de livraison avec les frais affichés.',
  7: 'Testez une adresse email incomplète.', 8: 'Observez ce qui est réellement affiché pendant la saisie du mot de passe.',
  9: 'Comparez l’apparence du bouton avec son comportement au clic.', 10: 'Essayez réellement le parcours « Mot de passe oublié ».',
  11: 'Ne vous fiez pas à la couleur du badge, lisez son message.', 12: 'Vérifiez si la valeur peut mathématiquement dépasser 100 %.',
  13: 'Comparez la dernière synchronisation avec la prochaine.', 14: 'Testez l’action la plus destructive et comptez les étapes de sécurité.',
  15: 'Comparez la valeur du résumé avec celle inscrite dans le graphique.', 16: 'Comparez le message d’état avec la convention de couleur utilisée.',
};
const bugFindings: Record<number, { title: string; explanation: string; detection: string; correction: string; level: string }> = {
  1: { title: 'Libellé de navigation incorrect', explanation: '« Accueil » contient un l minuscule à la place du second i.', detection: 'Relire les libellés caractère par caractère et les comparer aux maquettes ou au référentiel éditorial.', correction: 'Corriger le texte puis contrôler les autres occurrences et les versions responsive.', level: 'MINEUR' },
  2: { title: 'Panier fantôme', explanation: 'Le panier contient un article avant toute action utilisateur.', detection: 'Ouvrir une nouvelle session, vider le stockage local puis vérifier l’état initial du panier.', correction: 'Initialiser le compteur à zéro et tester ajout, retrait, rechargement et nouvelle session.', level: 'MAJEUR' },
  3: { title: 'Réduction incohérente', explanation: 'Le prix affiché ne correspond pas à la remise annoncée.', detection: 'Recalculer prix initial × (1 − remise/100), avec plusieurs produits et arrondis.', correction: 'Centraliser le calcul côté métier et ajouter des tests sur les pourcentages et les décimales.', level: 'MAJEUR' },
  4: { title: 'Désalignement du CTA', explanation: 'Le bouton principal dépasse de sa colonne.', detection: 'Comparer les bords avec une grille ou les outils de mesure du navigateur à plusieurs largeurs.', correction: 'Supprimer le décalage parasite et contrôler les principaux breakpoints.', level: 'MINEUR' },
  5: { title: 'Contraste insuffisant', explanation: 'L’action Favoris se confond presque avec son arrière-plan.', detection: 'Mesurer le ratio de contraste avec Lighthouse ou un contrast checker, puis tester au clavier.', correction: 'Ajuster couleur, graisse ou fond pour atteindre au moins le niveau WCAG AA.', level: 'ACCESSIBILITÉ' },
  6: { title: 'Règle de livraison contradictoire', explanation: 'La livraison est annoncée offerte, mais 7,90 € sont facturés.', detection: 'Tester juste avant, au niveau et au-dessus du seuil puis comparer panier, bandeau et total.', correction: 'Utiliser une règle métier unique et ajouter des tests aux valeurs limites.', level: 'MAJEUR' },
  7: { title: 'Validation email trop permissive', explanation: 'Une adresse sans domaine complet est acceptée.', detection: 'Tester un tableau de valeurs valides et invalides, dont domaine absent, espaces et caractères interdits.', correction: 'Appliquer une validation cohérente côté client et serveur, avec un message explicite.', level: 'MAJEUR' },
  8: { title: 'Mot de passe exposé', explanation: 'Le champ affiche les caractères sensibles en clair.', detection: 'Inspecter le type du champ et saisir une valeur en présence d’un observateur.', correction: 'Utiliser type="password" et proposer un bouton explicite pour afficher ou masquer.', level: 'CRITIQUE' },
  9: { title: 'État visuel trompeur', explanation: 'Le bouton paraît désactivé mais reste fonctionnel.', detection: 'Comparer états visuel, attribut disabled, tabulation et réaction au clic.', correction: 'Synchroniser style et état natif disabled, avec une raison accessible si nécessaire.', level: 'MAJEUR' },
  10: { title: 'Mauvaise redirection', explanation: 'La récupération du mot de passe mène au panier.', detection: 'Parcourir le lien et vérifier URL, titre, contenu et possibilité de retour.', correction: 'Corriger la route puis couvrir la navigation par un test end-to-end.', level: 'CRITIQUE' },
  11: { title: 'Signal de sécurité contradictoire', explanation: 'Un badge rassurant annonce pourtant que HTTPS est désactivé.', detection: 'Comparer couleur, icône, texte et état réseau réel dans les outils du navigateur.', correction: 'Afficher un état d’alerte cohérent et ne jamais simuler une sécurité absente.', level: 'CRITIQUE' },
  12: { title: 'Taux de conversion impossible', explanation: 'Le taux de 124 % dépasse le nombre total de visiteurs.', detection: 'Recalculer conversions ÷ visiteurs × 100 et tester zéro, valeurs extrêmes et périodes filtrées.', correction: 'Corriger la source ou la formule et ajouter des contrôles de cohérence métier.', level: 'MAJEUR' },
  13: { title: 'Chronologie impossible', explanation: 'La prochaine synchronisation précède la dernière.', detection: 'Comparer les dates dans le même fuseau et tester changement de jour, mois et heure d’été.', correction: 'Normaliser les dates et empêcher toute prochaine exécution antérieure à la dernière.', level: 'MAJEUR' },
  14: { title: 'Action destructive sans confirmation', explanation: 'La suppression complète est immédiate et irréversible.', detection: 'Déclencher l’action et vérifier confirmation, portée annoncée, annulation et permissions.', correction: 'Ajouter une confirmation précise, une protection selon le rôle et si possible une restauration.', level: 'CRITIQUE' },
  15: { title: 'Données contradictoires', explanation: 'Le résumé indique 62 visites, le graphique 68.', detection: 'Comparer toutes les représentations pour une même période, avec les mêmes filtres.', correction: 'Brancher les composants sur une source unique et tester les changements de filtres.', level: 'MAJEUR' },
  16: { title: 'Code couleur incohérent', explanation: 'Un état opérationnel est affiché en rouge.', detection: 'Comparer texte, icône et couleur à la légende du design system, y compris sans perception des couleurs.', correction: 'Appliquer le token de succès et conserver un libellé ou une icône non dépendante de la couleur.', level: 'MINEUR' },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [foundBugs, setFoundBugs] = useState<number[]>([]);
  const [creativeOpen, setCreativeOpen] = useState(false);
  const [creativeView, setCreativeView] = useState('home');
  const [hintLevel, setHintLevel] = useState(0);
  const [activeBugTest, setActiveBugTest] = useState<'shop' | 'login' | 'dashboard'>('shop');
  const [openingProject, setOpeningProject] = useState<string | null>(null);
  const [projectPreview, setProjectPreview] = useState<(typeof projects)[number] | null>(null);
  const [inspectionMode, setInspectionMode] = useState(false);
  const [selectedSize, setSelectedSize] = useState('41');
  const [cartItems, setCartItems] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [shopNotice, setShopNotice] = useState('');
  const [loginEmail, setLoginEmail] = useState('jonathan@povik');
  const [loginPassword, setLoginPassword] = useState('Povik2026!');
  const [loginNotice, setLoginNotice] = useState('');
  const [dashboardView, setDashboardView] = useState('Vue générale');
  const [findingId, setFindingId] = useState<number | null>(null);
  const [bugTrust, setBugTrust] = useState(0);
  const [bugCrumbs, setBugCrumbs] = useState<string[]>([]);
  const [bugVisited, setBugVisited] = useState<string[]>([]);
  const [bugGameOpen, setBugGameOpen] = useState(false);
  const [bugGameReady, setBugGameReady] = useState(false);
  const [bugGameMessage, setBugGameMessage] = useState('Pixel vous observe de loin.');
  const [heldCrumb, setHeldCrumb] = useState<string | null>(null);
  const [bugBait, setBugBait] = useState<{ id: string; x: number; y: number } | null>(null);
  const [bugResetConfirm, setBugResetConfirm] = useState(false);
  const [bugPetted, setBugPetted] = useState(false);
  const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
  const dragOrigin = useRef<{ pointerX: number; pointerY: number; windowX: number; windowY: number } | null>(null);
  const signalRef = useRef<HTMLDivElement>(null);
  const baitRef = useRef<{ id: string; x: number; y: number } | null>(null);
  const bugTrustRef = useRef(0);
  const lastBugInteraction = useRef(0);
  const bugPetUntil = useRef(0);
  const bugPanelCloseTimer = useRef<number | null>(null);
  const pointerPaintFrame = useRef<number | null>(null);
  const pointerPosition = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, time: 0 });

  useEffect(() => {
    const progressBar = document.querySelector<HTMLElement>('.scroll-progress');
    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  useEffect(() => {
    if (!findingId) return;
    const dismissFinding = () => setFindingId(null);
    window.addEventListener('pointerdown', dismissFinding, { once: true });
    return () => window.removeEventListener('pointerdown', dismissFinding);
  }, [findingId]);

  useEffect(() => { baitRef.current = bugBait; }, [bugBait]);
  useEffect(() => { bugTrustRef.current = bugTrust; }, [bugTrust]);

  useEffect(() => {
    if (!heldCrumb) return;
    document.body.classList.add('bug-dragging');
    const preventSelection = (event: Event) => event.preventDefault();
    const moveCrumb = (event: PointerEvent) => {
      document.documentElement.style.setProperty('--bait-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--bait-y', `${event.clientY}px`);
      if (baitRef.current) baitRef.current = { ...baitRef.current, x: event.clientX, y: event.clientY };
    };
    const releaseCrumb = () => {
      baitRef.current = null;
      setBugBait(null);
      setHeldCrumb(null);
      setBugGameMessage('Relâchée trop tôt. La miette retourne se cacher.');
    };
    window.addEventListener('pointermove', moveCrumb);
    window.addEventListener('pointerup', releaseCrumb, { once: true });
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('dragstart', preventSelection);
    return () => {
      document.body.classList.remove('bug-dragging');
      window.removeEventListener('pointermove', moveCrumb);
      window.removeEventListener('pointerup', releaseCrumb);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('dragstart', preventSelection);
    };
  }, [heldCrumb]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('povik-bug-game') || '{}') as { trust?: number; crumbs?: string[]; visited?: string[] };
      if (typeof saved.trust === 'number') setBugTrust(saved.trust);
      if (Array.isArray(saved.crumbs)) setBugCrumbs(saved.crumbs);
      if (Array.isArray(saved.visited)) setBugVisited(saved.visited);
    } catch { /* Une sauvegarde invalide redémarre simplement la partie. */ }
    setBugGameReady(true);
  }, []);

  useEffect(() => {
    if (!bugGameReady) return;
    localStorage.setItem('povik-bug-game', JSON.stringify({ trust: bugTrust, crumbs: bugCrumbs, visited: bugVisited }));
  }, [bugTrust, bugCrumbs, bugVisited, bugGameReady]);

  useEffect(() => {
    if (!bugGameReady) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !entry.target.id) continue;
        setBugVisited(current => {
          if (current.includes(entry.target.id)) return current;
          setBugTrust(value => Math.min(500, value + 20));
          setBugGameMessage('Pixel a exploré une nouvelle zone avec vous.');
          return [...current, entry.target.id];
        });
      }
    }, { threshold: .35 });
    document.querySelectorAll('#about,#projects,#journey,#contact').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [bugGameReady]);

  useEffect(() => {
    if (!creativeOpen && !projectPreview) return;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [creativeOpen, projectPreview]);

  useEffect(() => {
    if (!bugGameOpen) return;
    const elements = [
      document.querySelector<HTMLElement>('.bug-game-panel'),
      document.querySelector<HTMLElement>('.bug-game-launch'),
    ].filter((element): element is HTMLElement => Boolean(element));
    let hitAreas: DOMRect[] = [];
    const refreshHitAreas = () => { hitAreas = elements.map(element => element.getBoundingClientRect()); };
    refreshHitAreas();
    const cancelClose = () => {
      if (bugPanelCloseTimer.current !== null) window.clearTimeout(bugPanelCloseTimer.current);
      bugPanelCloseTimer.current = null;
    };
    const trackPanelHover = (event: PointerEvent) => {
      const isInside = hitAreas.some(rect => {
        return event.clientX >= rect.left - 8 && event.clientX <= rect.right + 8 && event.clientY >= rect.top - 12 && event.clientY <= rect.bottom + 12;
      });
      if (isInside) cancelClose();
      else if (bugPanelCloseTimer.current === null) bugPanelCloseTimer.current = window.setTimeout(() => {
        setBugGameOpen(false);
        bugPanelCloseTimer.current = null;
      }, 520);
    };
    window.addEventListener('pointermove', trackPanelHover, { passive: true });
    window.addEventListener('resize', refreshHitAreas, { passive: true });
    return () => {
      window.removeEventListener('pointermove', trackPanelHover);
      window.removeEventListener('resize', refreshHitAreas);
      cancelClose();
    };
  }, [bugGameOpen]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const motion = {
      x: window.innerWidth * .78,
      y: window.innerHeight * .42,
      vx: 0,
      vy: 0,
      targetX: window.innerWidth * .78,
      targetY: window.innerHeight * .42,
      nextTarget: 0,
      lastTime: performance.now(),
      angle: 0,
      curiousUntil: 0,
      curiosityCooldown: 0,
      nextCuriosityCheck: 0,
      nextHop: performance.now() + 3500,
      hoppingUntil: 0,
      restingUntil: 0,
      landingElement: null as HTMLElement | null,
      landingRect: null as DOMRect | null,
      bodyAngle: 0,
      headAngle: 0,
      lookUntil: 0,
      nextLook: performance.now() + 1200,
      snackingUntil: 0,
      nextSnack: performance.now() + 5000,
      groomingUntil: 0,
      nextGroom: performance.now() + 8000,
      hesitationUntil: 0,
      nextHesitation: performance.now() + 2600,
      perchedElement: null as HTMLElement | null,
      perchedLeft: 0,
      perchedTop: 0,
      scrollDirection: 0,
      scrollUntil: 0,
      lastScrollY: window.scrollY,
      fleeAfterSnack: false,
      calmStartedAt: 0,
      calmUiAt: 0,
      nextCalmReward: 0,
    };
    let textObstacles: { element: HTMLElement; rect: DOMRect }[] = [];
    let landingSurfaces: HTMLElement[] = [];
    let nextObstacleScan = 0;
    const scanObstacles = () => {
      textObstacles = Array.from(document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,p,a,button,blockquote,.eyebrow,.section-label,.metrics strong,.metrics span,.timeline-item>span,.timeline-item small,.ticker,.topbar'))
        .filter(element => !element.closest('.bug-signal') && element.offsetParent !== null)
        .map(element => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth);
      landingSurfaces = Array.from(document.querySelectorAll<HTMLElement>('.project-card,.metrics>div,.timeline-item,.experience-choice,.stamp,h1,h2,h3,blockquote,.about-copy>p,.quote-block,.section-label,.run-button,.ghost-button,.contact-actions,.contact footer'))
        .filter(element => element.offsetParent !== null)
        .filter(element => {
          const rect = element.getBoundingClientRect();
          const minimumHeight = element.matches('h1,h2,h3,blockquote,.about-copy>p') ? 18 : 70;
          return rect.width > 100 && rect.height > minimumHeight && rect.bottom > 90 && rect.top < window.innerHeight - 70;
        });
    };
    let frame = 0;
    const chooseTarget = (now: number) => {
      motion.perchedElement = null;
      const marginX = Math.min(150, window.innerWidth * .18);
      const marginY = Math.min(130, window.innerHeight * .18);
      for (let attempt = 0; attempt < 12; attempt += 1) {
        const candidateX = marginX + Math.random() * Math.max(1, window.innerWidth - marginX * 2);
        const candidateY = marginY + Math.random() * Math.max(1, window.innerHeight - marginY * 2);
        const overlapsText = textObstacles.some(({ rect }) => candidateX > rect.left - 70 && candidateX < rect.right + 70 && candidateY > rect.top - 60 && candidateY < rect.bottom + 60);
        if (!overlapsText || attempt === 11) {
          motion.targetX = candidateX;
          motion.targetY = candidateY;
          break;
        }
      }
      motion.nextTarget = now + 2600 + Math.random() * 3600;
    };
    const animateBug = (now: number) => {
      const element = signalRef.current;
      if (!element) { frame = requestAnimationFrame(animateBug); return; }
      const delta = Math.min(2, (now - motion.lastTime) / 16.67);
      motion.lastTime = now;
      const scrollDelta = window.scrollY - motion.lastScrollY;
      motion.lastScrollY = window.scrollY;
      if (Math.abs(scrollDelta) > .25) {
        motion.scrollDirection = scrollDelta > 0 ? 1 : -1;
        motion.scrollUntil = now + 220;
      }
      if (now > nextObstacleScan) {
        scanObstacles();
        nextObstacleScan = now + 1400;
      }
      if (now > motion.nextHop && !motion.hoppingUntil && now > motion.restingUntil && landingSurfaces.length) {
        const landing = landingSurfaces[Math.floor(Math.random() * landingSurfaces.length)];
        const rect = landing.getBoundingClientRect();
        motion.landingElement = landing;
        motion.perchedElement = null;
        motion.landingRect = rect;
        motion.targetX = Math.max(75, Math.min(window.innerWidth - 75, rect.left + rect.width * (.25 + Math.random() * .5)));
        motion.targetY = Math.max(64, Math.min(window.innerHeight - 64, rect.top - 28));
        motion.hoppingUntil = now + 3200;
        motion.nextTarget = motion.hoppingUntil;
        motion.nextHop = now + 4200 + Math.random() * 4200;
      }
      const landingDistance = Math.hypot(motion.targetX - motion.x, motion.targetY - motion.y);
      if (motion.hoppingUntil && landingDistance < 42) {
        motion.hoppingUntil = 0;
        motion.restingUntil = now + 900 + Math.random() * 1200;
        if (now > motion.nextSnack && Math.random() < .48) {
          motion.snackingUntil = now + 1200 + Math.random() * 1100;
          motion.restingUntil = Math.max(motion.restingUntil, motion.snackingUntil);
          motion.nextSnack = now + 6500 + Math.random() * 8500;
        }
        if (motion.landingElement) {
          const landedElement = motion.landingElement;
          const landedRect = landedElement.getBoundingClientRect();
          motion.perchedElement = landedElement;
          motion.perchedLeft = landedRect.left;
          motion.perchedTop = landedRect.top;
          landedElement.classList.remove('bug-visited');
          void landedElement.offsetWidth;
          landedElement.classList.add('bug-visited');
          window.setTimeout(() => landedElement.classList.remove('bug-visited'), 520);
        }
        motion.landingElement = null;
        motion.landingRect = null;
      }
      if (motion.perchedElement && !motion.hoppingUntil) {
        // Un élément posé suit simplement le défilement : aucune mesure de layout n'est nécessaire par frame.
        motion.y -= scrollDelta;
        motion.targetY -= scrollDelta;
        if (motion.y < 35 || motion.y > window.innerHeight - 35) {
          motion.perchedElement = null;
          motion.restingUntil = 0;
          chooseTarget(now);
        }
      }
      if (!motion.hoppingUntil && now > motion.restingUntil && now > motion.hesitationUntil && now > motion.nextHesitation) {
        motion.hesitationUntil = now + 260 + Math.random() * 740;
        motion.nextHesitation = now + 2400 + Math.random() * 4300;
      }
      if (!motion.hoppingUntil && now > motion.restingUntil && now > motion.hesitationUntil && (now > motion.nextTarget || landingDistance < 60)) chooseTarget(now);
      const activeBait = baitRef.current;
      if (activeBait) {
        motion.perchedElement = null;
        motion.hoppingUntil = 0;
        motion.restingUntil = 0;
        motion.hesitationUntil = 0;
        motion.curiousUntil = 0;
        motion.targetX = activeBait.x;
        motion.targetY = activeBait.y;
      }
      const targetDx = motion.targetX - motion.x;
      const targetDy = motion.targetY - motion.y;
      const targetDistance = Math.max(1, Math.hypot(targetDx, targetDy));
      if (activeBait && targetDistance < 38) {
        baitRef.current = null;
        setBugBait(null);
        setHeldCrumb(null);
        setBugCrumbs(current => current.includes(activeBait.id) ? current : [...current, activeBait.id]);
        setBugTrust(value => Math.min(500, value + 12));
        setBugGameMessage(bugTrustRef.current >= 350 ? 'Pixel mange dans votre main et reste près de vous.' : bugTrustRef.current >= 90 ? 'Pixel attrape la miette, vous observe, puis recule prudemment.' : 'Pixel saisit la miette et file se mettre à l’abri.');
        motion.snackingUntil = now + 1400;
        motion.restingUntil = now + (bugTrustRef.current >= 350 ? 3600 : 1900);
        motion.fleeAfterSnack = bugTrustRef.current < 220;
      }
      if (motion.fleeAfterSnack && now > motion.snackingUntil) {
        motion.fleeAfterSnack = false;
        motion.restingUntil = 0;
        chooseTarget(now);
      }
      const targetAngle = Math.atan2(targetDy, targetDx) * 180 / Math.PI + 90;
      const headingError = ((targetAngle - motion.bodyAngle + 540) % 360) - 180;
      const turnThrottle = Math.max(.16, 1 - Math.abs(headingError) / 105);
      const travelSpeed = now < motion.restingUntil || now < motion.hesitationUntil ? 0 : (motion.hoppingUntil ? 2.45 : .85) * turnThrottle;
      let desiredX = targetDx / targetDistance * travelSpeed;
      let desiredY = targetDy / targetDistance * travelSpeed;
      const cursorDx = motion.x - pointerPosition.current.x;
      const cursorDy = motion.y - pointerPosition.current.y;
      const cursorDistance = Math.max(1, Math.hypot(cursorDx, cursorDy));
      const velocityFactor = Math.max(0, 1 - (now - pointerPosition.current.time) / 160);
      const pointerVx = pointerPosition.current.vx * velocityFactor;
      const pointerVy = pointerPosition.current.vy * velocityFactor;
      const pointerSpeed = Math.hypot(pointerVx, pointerVy);
      const approachSpeed = (pointerVx * cursorDx + pointerVy * cursorDy) / cursorDistance;
      const isTamed = bugTrustRef.current >= 350;
      const isBeingPetted = bugPetUntil.current > now;
      const calmCandidate = !activeBait && cursorDistance > 105 && cursorDistance < 255 && pointerSpeed < .42 && Math.abs(approachSpeed) < .55 && now > motion.snackingUntil;
      const cursorIsChasing = !activeBait && !isBeingPetted && now > motion.snackingUntil && approachSpeed > (isTamed ? 12 : 2.2) && cursorDistance < (isTamed ? 70 : 230);
      if (calmCandidate && now >= motion.nextCalmReward) {
        if (!motion.calmStartedAt) motion.calmStartedAt = now;
        motion.hesitationUntil = Math.max(motion.hesitationUntil, now + 120);
        const calmDuration = Math.max(1900, 3900 - bugTrustRef.current * 3.4);
        const calmProgress = Math.min(1, (now - motion.calmStartedAt) / calmDuration);
        element.style.setProperty('--calm-progress', `${calmProgress}`);
        element.classList.add('is-calming');
        if (now - motion.calmUiAt > 120) {
          motion.calmUiAt = now;
          document.documentElement.style.setProperty('--calm-ui', `${Math.round(calmProgress * 100)}%`);
        }
        if (calmProgress >= 1) {
          setBugTrust(value => Math.min(500, value + 8));
          setBugGameMessage('Vous êtes resté parfaitement calme. Pixel s’est approché de lui-même.');
          motion.calmStartedAt = 0;
          motion.nextCalmReward = now + 12000;
          document.documentElement.style.setProperty('--calm-ui', '0%');
        }
      } else {
        const wasCalming = Boolean(motion.calmStartedAt);
        motion.calmStartedAt = 0;
        element.style.setProperty('--calm-progress', '0');
        element.classList.remove('is-calming');
        if (wasCalming) document.documentElement.style.setProperty('--calm-ui', '0%');
      }
      if (now > motion.nextCuriosityCheck) {
        motion.nextCuriosityCheck = now + 1200;
        if (!motion.hoppingUntil && now > motion.restingUntil && now > motion.curiosityCooldown && cursorDistance > 340 && cursorDistance < 680 && pointerSpeed < 7 && Math.random() < .2) motion.curiousUntil = now + 1200 + Math.random() * 750;
      }
      if (!activeBait && motion.curiousUntil > now && !cursorIsChasing) {
        const observationDistance = 255;
        motion.targetX = pointerPosition.current.x + cursorDx / cursorDistance * observationDistance;
        motion.targetY = pointerPosition.current.y + cursorDy / cursorDistance * observationDistance;
        const curiosityDx = motion.targetX - motion.x;
        const curiosityDy = motion.targetY - motion.y;
        const curiosityDistance = Math.max(1, Math.hypot(curiosityDx, curiosityDy));
        desiredX += curiosityDx / curiosityDistance * .7;
        desiredY += curiosityDy / curiosityDistance * .7;
      } else if (motion.curiousUntil && motion.curiousUntil <= now) {
        motion.curiousUntil = 0;
        motion.curiosityCooldown = now + 2600 + Math.random() * 2200;
        chooseTarget(now);
      }
      const wary = Math.max(0, 1 - cursorDistance / 330);
      if (!activeBait && !calmCandidate && wary > 0 && !cursorIsChasing) {
        desiredX += cursorDx / cursorDistance * wary * .42;
        desiredY += cursorDy / cursorDistance * wary * .42;
      }
      const normalFearRadius = isTamed ? 0 : bugTrustRef.current >= 220 ? 115 : 185;
      const alert = activeBait || calmCandidate || isBeingPetted || now < motion.snackingUntil || normalFearRadius === 0 ? 0 : Math.max(0, 1 - cursorDistance / (cursorIsChasing ? 245 : normalFearRadius));
      if (isBeingPetted) {
        motion.restingUntil = Math.max(motion.restingUntil, bugPetUntil.current);
        motion.hesitationUntil = Math.max(motion.hesitationUntil, bugPetUntil.current);
        desiredX = 0;
        desiredY = 0;
      }
      if (alert > 0 || cursorIsChasing) {
        motion.curiousUntil = 0;
        motion.hoppingUntil = 0;
        motion.restingUntil = 0;
        motion.snackingUntil = 0;
        motion.groomingUntil = 0;
        motion.hesitationUntil = 0;
        motion.landingElement = null;
        motion.landingRect = null;
        motion.perchedElement = null;
        if (cursorIsChasing) motion.curiosityCooldown = now + 3200;
        const escapeForce = alert * alert * 8.5 + (cursorIsChasing ? Math.min(5, approachSpeed * .65) : 0);
        desiredX += cursorDx / cursorDistance * escapeForce;
        desiredY += cursorDy / cursorDistance * escapeForce;
        if (cursorDistance < 155 || cursorIsChasing) {
          motion.targetX = Math.max(100, Math.min(window.innerWidth - 100, motion.x + cursorDx / cursorDistance * 420));
          motion.targetY = Math.max(100, Math.min(window.innerHeight - 100, motion.y + cursorDy / cursorDistance * 320));
          motion.nextTarget = now + 1800;
        }
      }
      for (const obstacle of textObstacles) {
        if (activeBait) break;
        const rect = obstacle.rect;
        if (motion.hoppingUntil && motion.landingElement === obstacle.element) continue;
        const nearestX = Math.max(rect.left, Math.min(motion.x, rect.right));
        const nearestY = Math.max(rect.top, Math.min(motion.y, rect.bottom));
        let obstacleDx = motion.x - nearestX;
        let obstacleDy = motion.y - nearestY;
        let obstacleDistance = Math.hypot(obstacleDx, obstacleDy);
        if (obstacleDistance < 1) {
          obstacleDx = motion.x - (rect.left + rect.width / 2);
          obstacleDy = motion.y - (rect.top + rect.height / 2);
          obstacleDistance = Math.max(1, Math.hypot(obstacleDx, obstacleDy));
        }
        if (obstacleDistance < 105) {
          const obstacleForce = (1 - obstacleDistance / 105) * 5.5;
          desiredX += obstacleDx / obstacleDistance * obstacleForce;
          desiredY += obstacleDy / obstacleDistance * obstacleForce;
        }
      }
      const damping = now < motion.restingUntil ? .72 : motion.hoppingUntil ? .86 : .91;
      motion.vx = motion.vx * damping + desiredX * (1 - damping);
      motion.vy = motion.vy * damping + desiredY * (1 - damping);
      motion.x += motion.vx * delta;
      motion.y += motion.vy * delta;
      const edgeX = 82;
      const edgeY = 112;
      motion.x = Math.max(edgeX, Math.min(window.innerWidth - edgeX, motion.x));
      motion.y = Math.max(edgeY, Math.min(window.innerHeight - edgeY, motion.y));
      const movementSpeed = Math.hypot(motion.vx, motion.vy);
      if (movementSpeed > .08) {
        const travelAngle = Math.atan2(motion.vy, motion.vx) * 180 / Math.PI + 90;
        const bodyDelta = ((travelAngle - motion.bodyAngle + 540) % 360) - 180;
        motion.bodyAngle += Math.max(-4.2, Math.min(4.2, bodyDelta * .055 * delta));
      }
      if (now > motion.nextGroom && now < motion.restingUntil && now > motion.snackingUntil && Math.random() < .018) {
        motion.groomingUntil = now + 900 + Math.random() * 900;
        motion.nextGroom = now + 9000 + Math.random() * 12000;
      }
      if (now > motion.nextLook) {
        motion.nextLook = now + 1800 + Math.random() * 3400;
        if (cursorDistance < 560 && Math.random() < .52) motion.lookUntil = now + 700 + Math.random() * 1300;
      }
      const isLookingAtCursor = motion.lookUntil > now || wary > .42 || cursorIsChasing;
      const cursorWorldAngle = Math.atan2(pointerPosition.current.y - motion.y, pointerPosition.current.x - motion.x) * 180 / Math.PI + 90;
      const relativeCursorAngle = ((cursorWorldAngle - motion.bodyAngle + 540) % 360) - 180;
      const desiredHeadAngle = isLookingAtCursor ? Math.max(-58, Math.min(58, relativeCursorAngle)) : Math.sin(now / 780) * 9;
      motion.headAngle += (desiredHeadAngle - motion.headAngle) * Math.min(1, .11 * delta);
      const lookX = isLookingAtCursor ? Math.max(-3, Math.min(3, (pointerPosition.current.x - motion.x) / 80)) : Math.sin(now / 640) * 1.2;
      const lookY = isLookingAtCursor ? Math.max(-2.5, Math.min(2.5, (pointerPosition.current.y - motion.y) / 80)) : 0;
      element.style.setProperty('--roam-x', `${motion.x - 110}px`);
      element.style.setProperty('--roam-y', `${motion.y - 110}px`);
      element.style.setProperty('--bug-rotate', `${motion.bodyAngle}deg`);
      element.style.setProperty('--bug-facing', motion.vx < -.04 ? '-1' : '1');
      element.style.setProperty('--head-rotate', `${motion.headAngle}deg`);
      element.style.setProperty('--bug-alert', `${alert}`);
      element.style.setProperty('--look-x', `${lookX}px`);
      element.style.setProperty('--look-y', `${lookY}px`);
      element.style.setProperty('--bug-speed', `${Math.max(.12, Math.min(.55, .48 - movementSpeed * .08))}s`);
      element.classList.toggle('is-moving', movementSpeed > .22);
      element.classList.toggle('is-turning', Math.abs(headingError) > 34 && now >= motion.restingUntil && now >= motion.hesitationUntil);
      element.classList.toggle('is-hesitating', now < motion.hesitationUntil);
      element.classList.toggle('is-hopping', Boolean(motion.hoppingUntil));
      element.classList.toggle('is-resting', now < motion.restingUntil);
      element.classList.toggle('is-eating', now < motion.snackingUntil);
      element.classList.toggle('is-grooming', now < motion.groomingUntil);
      element.classList.toggle('is-scrolling-down', now < motion.scrollUntil && motion.scrollDirection > 0);
      element.classList.toggle('is-scrolling-up', now < motion.scrollUntil && motion.scrollDirection < 0);
      frame = requestAnimationFrame(animateBug);
    };
    chooseTarget(performance.now());
    frame = requestAnimationFrame(animateBug);
    return () => cancelAnimationFrame(frame);
  }, []);

  function trackPointer(event: MouseEvent<HTMLElement>) {
    const previous = pointerPosition.current;
    const now = performance.now();
    const elapsed = Math.max(8, now - previous.time);
    pointerPosition.current = { x: event.clientX, y: event.clientY, vx: previous.time ? (event.clientX - previous.x) / elapsed * 16.67 : 0, vy: previous.time ? (event.clientY - previous.y) / elapsed * 16.67 : 0, time: now };
    if (pointerPaintFrame.current !== null) return;
    pointerPaintFrame.current = window.requestAnimationFrame(() => {
      const pointer = pointerPosition.current;
      document.documentElement.style.setProperty('--pointer-x', `${pointer.x}px`);
      document.documentElement.style.setProperty('--pointer-y', `${pointer.y}px`);
      document.documentElement.style.setProperty('--mouse-x', `${pointer.x / window.innerWidth - 0.5}`);
      document.documentElement.style.setProperty('--mouse-y', `${pointer.y / window.innerHeight - 0.5}`);
      pointerPaintFrame.current = null;
    });
  }

  function tiltCard(event: MouseEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty('--rx', `${y * -8}deg`);
    event.currentTarget.style.setProperty('--ry', `${x * 10}deg`);
  }

  function trackSurface(event: MouseEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--local-x', `${event.clientX - box.left}px`);
    event.currentTarget.style.setProperty('--local-y', `${event.clientY - box.top}px`);
  }

  function copyMail() {
    void navigator.clipboard.writeText('jonathan.ragot@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function discoverBug(id: number) {
    if (foundBugs.includes(id)) return;
    setFoundBugs(current => [...current, id]);
    setFindingId(id);
    setBugTrust(value => Math.min(500, value + 5));
    setBugGameMessage('Votre sens de l’observation l’impressionne.');
  }

  function holdBugCrumb(event: ReactPointerEvent<HTMLButtonElement>, id: string) {
    if (bugCrumbs.includes(id) || bugBait) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    window.getSelection()?.removeAllRanges();
    document.body.classList.add('bug-dragging');
    document.documentElement.style.setProperty('--bait-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--bait-y', `${event.clientY}px`);
    const bait = { id, x: event.clientX, y: event.clientY };
    baitRef.current = bait;
    setBugBait(bait);
    setHeldCrumb(id);
    setBugGameMessage('Gardez le clic appuyé et restez assez calme pour le laisser venir manger.');
  }

  function resetBugGame() {
    setBugTrust(0);
    setBugCrumbs([]);
    setBugVisited([]);
    setBugGameMessage('Pixel vous observe de loin.');
    setBugGameOpen(false);
    setBugResetConfirm(false);
    setHeldCrumb(null);
    setBugBait(null);
    baitRef.current = null;
  }

  function callBug() {
    setBugTrust(value => Math.min(500, value + 4));
    setBugGameMessage('Vous restez calme. Pixel hésite, puis s’approche un peu.');
  }

  function renderExtraCrumbs(zone: string) {
    return extraCrumbSpots.filter(spot => spot.zone === zone && !bugCrumbs.includes(spot.id) && heldCrumb !== spot.id).map(spot => <button type="button" key={spot.id} className="bug-crumb extra-crumb" style={{ left: spot.left, top: spot.top }} onPointerDown={event => holdBugCrumb(event, spot.id)} aria-label="Maintenir pour présenter une miette au bug"><i /> MIETTE</button>);
  }

  function interactWithBug() {
    const now = performance.now();
    if (bugPetUntil.current > now) return;
    if (now - lastBugInteraction.current < 350) return;
    lastBugInteraction.current = now;
    if (bugTrustRef.current < 350) {
      setBugGameMessage('Pixel esquive encore votre main. Un peu de nourriture devrait aider.');
      return;
    }
    setBugPetted(true);
    bugPetUntil.current = now + 1300;
    setBugTrust(value => Math.min(500, value + 2));
    setBugGameMessage(bugTrustRef.current >= 500 ? 'Pixel se laisse caresser et tapote doucement le curseur.' : 'Pixel se fige une seconde, puis accepte la caresse.');
    window.setTimeout(() => setBugPetted(false), 1300);
  }

  function inspectBug(event: MouseEvent<HTMLElement>, id: number) {
    if (!inspectionMode) return false;
    event.preventDefault();
    event.stopPropagation();
    discoverBug(id);
    return true;
  }

  function startWindowDrag(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragOrigin.current = { pointerX: event.clientX, pointerY: event.clientY, windowX: windowPosition.x, windowY: windowPosition.y };
  }

  function moveWindow(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragOrigin.current) return;
    const maxX = Math.max(0, window.innerWidth / 2 - 190);
    const maxY = Math.max(0, window.innerHeight / 2 - 110);
    setWindowPosition({
      x: Math.max(-maxX, Math.min(maxX, dragOrigin.current.windowX + event.clientX - dragOrigin.current.pointerX)),
      y: Math.max(-maxY, Math.min(maxY, dragOrigin.current.windowY + event.clientY - dragOrigin.current.pointerY)),
    });
  }

  function stopWindowDrag() {
    dragOrigin.current = null;
  }

  function openProject(project: (typeof projects)[number]) {
    if (openingProject) return;
    setOpeningProject(project.id);
    window.setTimeout(() => {
      setOpeningProject(null);
      setWindowPosition({ x: 0, y: 0 });
      if (project.id === 'PRJ-002') {
        setCreativeView('home');
        setCreativeOpen(true);
      } else {
        setProjectPreview(project);
      }
    }, 1000);
  }

  const activeBugIds = activeBugTest === 'shop' ? [1, 2, 3, 4, 5, 6] : activeBugTest === 'login' ? [7, 8, 9, 10, 11] : [12, 13, 14, 15, 16];
  const activeFound = activeBugIds.filter(id => foundBugs.includes(id)).length;
  const remainingBugIds = activeBugIds.filter(id => !foundBugs.includes(id));
  const activeHints = remainingBugIds.map(id => bugHints[id]);
  const visibleHintIndex = activeHints.length && hintLevel ? (hintLevel - 1) % activeHints.length : 0;
  const bugProgress = Math.min(100, Math.round(bugTrust / 5));
  const bugMood = bugTrust >= 500 ? 'COMPLICE' : bugTrust >= 350 ? 'APPRIVOISÉ' : bugTrust >= 220 ? 'CONFIANT' : bugTrust >= 90 ? 'CURIEUX' : 'CRAINTIF';
  const bugRank = bugTrust >= 500 ? '05 / BUG WHISPERER' : bugTrust >= 350 ? '04 / QA ASSISTANT' : bugTrust >= 220 ? '03 / ALLIÉ' : bugTrust >= 90 ? '02 / OBSERVATEUR' : '01 / INCONNU';
  // La jauge calme est pilotée directement en CSS afin de ne pas rerendre toute la page à chaque frame.
  const bugCalmProgress = 0;
  const nextCrumbGoal = bugCrumbs.length < 5 ? 5 : bugCrumbs.length < 12 ? 12 : 18;
  const bugMission = bugCrumbs.length < 18 ? `Donnez-lui encore ${nextCrumbGoal - bugCrumbs.length} miette${nextCrumbGoal - bugCrumbs.length > 1 ? 's' : ''} sans relâcher le clic.` : bugVisited.length < 4 ? `Explorez encore ${4 - bugVisited.length} section${4 - bugVisited.length > 1 ? 's' : ''} avec lui.` : foundBugs.length < 6 ? `Décelez encore ${6 - foundBugs.length} anomalie${6 - foundBugs.length > 1 ? 's' : ''} dans le Playground.` : bugTrust < 500 ? 'Continuez à l’appeler et découvrez tous ses rangs.' : 'Lien maximal atteint. Vous avez gagné sa confiance.';

  return (
    <main className={heldCrumb ? 'is-holding-crumb' : ''} data-held-crumb={heldCrumb || undefined} onMouseMove={trackPointer}>
      <div className="noise" aria-hidden="true" />
      <div className="pointer-light" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <nav className="topbar">
        <a href="#top" className="brand" aria-label="Accueil Povik.dev"><img className="brand-mark" src="./povik-logo-incline.png" alt="" /><span>POVIK<span className="brand-dot">.</span>DEV</span></a>
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <a href="#about" onClick={() => setMenuOpen(false)}><small>01</small><span>À PROPOS</span></a><a href="#projects" onClick={() => setMenuOpen(false)}><small>02</small><span>PROJETS</span></a><a href="#journey" onClick={() => setMenuOpen(false)}><small>03</small><span>PARCOURS</span></a><a href="#contact" onClick={() => setMenuOpen(false)}><small>04</small><span>CONTACT</span></a>
        </div>
        <div className="nav-actions"><span className="availability"><i /> WORK IN PROGRESS</span>{bugCrumbs.length > 0 && <button type="button" className="bug-game-launch" onClick={() => setBugGameOpen(value => !value)} aria-label="Ouvrir le carnet de Pixel"><Bug size={14} /><span>{bugMood}</span><i><em style={{ width: `${bugProgress}%` }} /></i></button>}<button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">{menuOpen ? <X /> : <Menu />}</button></div>
      </nav>

      <section className="hero" id="top">
        {!bugCrumbs.includes('hero') && heldCrumb !== 'hero' && <button type="button" className="bug-crumb crumb-hero" onPointerDown={event => holdBugCrumb(event, 'hero')} aria-label="Maintenir pour prendre une miette"><i /> MIETTE</button>}
        {renderExtraCrumbs('hero')}
        <div className="hero-grid" aria-hidden="true" />
        <div className="eyebrow reveal-1"><span>VERSION 2026.08</span><i /> EN ROUTE VERS LA QA</div>
        <h1 className="reveal-2 hero-title"><span>JE TROUVE</span><span className="outline-word bug-line">LES BUGS</span><span>AVANT QU’ILS</span><span className="hero-final-line">NE VOUS TROUVENT<span className="hot-dot">.</span></span></h1>
        <div className="hero-footer reveal-3">
          <div className="hero-intro"><span className="prompt">→</span><p><strong>Jonathan “Povik” Ragot</strong><br />Futur QA Tester, vibecoder curieux<br />et anomalie positive depuis 1989.</p></div>
          <div className="hero-cta"><a className="run-button" href="#about"><span>DÉCOUVRIR MON PARCOURS</span><ArrowDownRight /></a><a href="#projects" className="ghost-button">VOIR MES PROJETS <ArrowDownRight size={18} /></a></div>
        </div>
        <button type="button" className="bug-game-clue" onClick={() => document.querySelector<HTMLElement>('.bug-crumb')?.focus()}><Bug size={12} /><span>PSST... UNE PETITE PRÉSENCE VIT ICI. TROUVE DE QUOI L’AMADOUER.</span></button>
        <div className="floating-bug bug-a"><Bug size={16} /> ISSUE #37 <span>FEATURE, NOT A BUG</span></div><div className="floating-bug bug-b"><CircleDot size={12} /> STATUS: CURIOUS</div><div className="scroll-hint"><span>SCROLL TO INSPECT</span><ArrowDownRight size={16} /></div>
        <div ref={signalRef} className={`signal-card bug-signal top-bug game-bug ${bugPetted ? 'is-petted' : ''}`} onPointerDown={interactWithBug}><div className="bug-radar"><i /><i /></div><div className="bug-shadow" /><div className="cyber-bug" role="button" tabIndex={0} aria-label={bugTrust >= 350 ? 'Caresser le petit bug' : 'Ouvrir son carnet'} onClick={interactWithBug} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') interactWithBug(); }}><span className="bug-antenna left" /><span className="bug-antenna right" /><span className="bug-leg leg-1" /><span className="bug-leg leg-2" /><span className="bug-leg leg-3" /><span className="bug-leg leg-4" /><span className="bug-leg leg-5" /><span className="bug-leg leg-6" /><div className="bug-head"><i /><i /><b /></div><div className="bug-thorax" /><div className="bug-shell"><em className="bug-wing" /><em className="bug-segments" /><strong>P</strong><span>✓</span><i /></div></div><small>BUG / SIGNAL DÉTECTÉ</small></div>
      </section>

      {heldCrumb && <div className="held-bug-crumb" aria-hidden="true"><i /></div>}
      {bugGameOpen && <aside className="bug-game-panel" aria-label="Carnet de Pixel"><button className="bug-game-close" onClick={() => setBugGameOpen(false)} aria-label="Fermer"><X size={15} /></button><span>PIXEL / #001 · {bugRank}</span><div className="bug-game-title"><Bug size={19} /><strong>{bugMood}</strong></div><p>{bugGameMessage}</p><div className="bug-trust"><div><span>LIEN</span><b>{bugProgress}%</b></div><i><em style={{ width: `${bugProgress}%` }} /></i></div><dl><div><dt>MIETTES DONNÉES</dt><dd>{bugCrumbs.length}/{BUG_CRUMB_TOTAL}</dd></div><div><dt>ZONES VISITÉES</dt><dd>{bugVisited.length}/4</dd></div></dl><div className="bug-mission"><span>MISSION ACTUELLE</span><p>{bugMission}</p></div>{bugTrust < 350 ? <div className="bug-calm-guide"><span>APPROCHEZ-VOUS DOUCEMENT, PUIS NE BOUGEZ PLUS</span><i><em style={{ width: `${bugCalmProgress}%` }} /></i><small>{bugCalmProgress ? `${bugCalmProgress}% · RESTEZ IMMOBILE` : 'LE MOUVEMENT BRUSQUE ANNULE LA TENTATIVE'}</small></div> : <button className="bug-call" onClick={interactWithBug}>CARESSER PIXEL · +2</button>}{bugTrust >= 350 && <div className="bug-badge">✓ PIXEL ACCEPTE LES CARESSES</div>}{bugResetConfirm ? <div className="bug-reset-confirm"><p>Effacer toute la confiance de Pixel et faire réapparaître les miettes ?</p><div><button onClick={resetBugGame}>OUI, RECOMMENCER</button><button onClick={() => setBugResetConfirm(false)}>ANNULER</button></div></div> : <button className="bug-reset" onClick={() => setBugResetConfirm(true)}>RECOMMENCER LA RENCONTRE</button>}</aside>}

      <section className="ticker" aria-label="Compétences clés"><div className="ticker-track">{Array.from({ length: 6 }, (_, group) => <div className="ticker-group" key={group} aria-hidden={group > 0}><span>EXPLORATORY TESTING</span><Sparkles /><span>VIBECODING</span><Sparkles /><span>VEILLE TECHNO</span><Sparkles /><span>PROBLEM SOLVING</span><Sparkles /></div>)}</div></section>

      <section className="about section-pad" id="about" onMouseMove={trackSurface}>
        {!bugCrumbs.includes('about') && <button type="button" className="bug-crumb crumb-about" onPointerDown={event => holdBugCrumb(event, 'about')} aria-label="Maintenir pour prendre une miette"><i /> MIETTE</button>}
        {renderExtraCrumbs('about')}
        <div className="section-label"><span>01</span> À PROPOS</div>
        <div className="about-layout">
          <div className="about-title-wrap"><h2>PAS LE PARCOURS<br /><em>LE PLUS COURT.</em><br />MAIS LE BON.</h2><div className="stamp" aria-label="Autodidacte certifié curieux" onMouseMove={tiltCard} onMouseLeave={event => { event.currentTarget.style.setProperty('--rx', '0deg'); event.currentTarget.style.setProperty('--ry', '0deg'); }}><span className="stamp-index">PROFILE / 01</span><MousePointer2 /><div><strong>AUTODIDACTE</strong><span>CERTIFIÉ CURIEUX</span></div></div></div>
          <div className="about-copy">
            <p className="lead">Avant le dev et le QA, j’ai passé des années plateau en main. Aujourd’hui, je renverse surtout moins de choses.</p>
            <p>Mon premier terrain d’apprentissage, c’était la <strong>restauration pendant 15 ans</strong> : du rythme, des imprévus, des standards à tenir et aucun bouton “annuler”. J’y ai appris qu’un bon résultat tient souvent à des détails invisibles.</p>
            <p>Puis la vie m’a imposé une pause et, avec elle, une remise à plat. Sans effacer ces quinze années, ce changement de rythme m’a donné le déclic pour transformer une passion de toujours en nouveau départ professionnel.</p>
            <p>En parallèle, l’informatique n’a jamais été très loin. Une curiosité présente depuis l’enfance, devenue avec le temps un véritable terrain d’exploration. Nourri à la veille technologique et à l’apprentissage autonome, j’ai commencé à fabriquer mes propres sites en <strong>vibecoding</strong>. Pas seulement pour obtenir quelque chose qui marche, surtout pour comprendre <strong><em>pourquoi</em></strong> ça marche, comment l’améliorer et ce qui pourrait casser.</p>
            <p>L’<strong>intelligence artificielle, je préfère apprendre à m’en servir plutôt que la regarder passer</strong>. Pour moi, c’est un outil de plus dans la boîte : pour tester des idées, apprendre plus vite, automatiser ce qui peut l’être et aller chercher un peu plus loin. Mais générer quelque chose n’a jamais voulu dire que c’était bon. Il faut encore comprendre, vérifier, tester et parfois tout recommencer.</p>
            <p>Aujourd’hui, à 37 ans, je transforme cette curiosité un peu obsessionnelle en métier. Prochaine mise à jour : une <strong>formation professionnelle de testeur logiciel</strong>.</p>
            <div className="quote-block"><span>MANIFESTO.TXT</span><blockquote>“Je ne change pas de voie. Je compile enfin toutes les versions de moi-même.”</blockquote></div>
          </div>
        </div>
        <div className="metrics"><div><strong>37</strong><span>ANS D’EXPÉRIENCE<br />UTILISATEUR</span></div><div><strong>∞</strong><span>QUESTIONS<br />EN ATTENTE</span></div><div><strong>01</strong><span>RECONVERSION<br />EN COURS</span></div><div><strong>0</strong><span>BUG CRITIQUE<br />NON SIGNALÉ*</span></div></div>
      </section>

      <section className="projects section-pad" id="projects">
        {!bugCrumbs.includes('projects') && <button type="button" className="bug-crumb crumb-projects" onPointerDown={event => holdBugCrumb(event, 'projects')} aria-label="Maintenir pour prendre une miette"><i /> MIETTE</button>}
        {renderExtraCrumbs('projects')}
        <div className="section-heading"><div className="section-label light"><span>02</span> MES PROJETS</div><h2>DES IDÉES<br /><span>DEVENUES RÉELLES</span></h2><p>Une sélection d’expériences numériques. Les vraies fiches projets viendront progressivement raconter leur histoire.</p></div>
        <div className="project-list">{projects.map(project => <article className={`project-card ${project.color} clickable-card ${openingProject === project.id ? 'opening' : ''}`} key={project.id} role="button" tabIndex={0} aria-label={`Ouvrir ${project.title}`} onClick={() => openProject(project)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject(project); } }} onMouseMove={tiltCard} onMouseLeave={event => { event.currentTarget.style.setProperty('--rx', '0deg'); event.currentTarget.style.setProperty('--ry', '0deg'); }}><div className="card-shine" /><div className="project-top"><span>{project.id}</span><span className="status"><i /> {project.status}</span></div><span className="card-open-label">CLIQUER POUR OUVRIR</span><div className="project-number">{project.number}</div><div className="project-body"><h3>{project.title}</h3><p>{project.text}</p><div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><button className="inspect" tabIndex={-1} aria-hidden="true"><ArrowUpRight /></button></article>)}</div>
      </section>

      {projectPreview && <div className="creative-backdrop" role="presentation">
        <section className="creative-browser project-browser" role="dialog" aria-modal="true" aria-label={projectPreview.title} style={{ translate: `${windowPosition.x}px ${windowPosition.y}px` }}>
          <div className="browser-chrome" onPointerDown={startWindowDrag} onPointerMove={moveWindow} onPointerUp={stopWindowDrag} onPointerCancel={stopWindowDrag}><div className="browser-dots"><i /><i /><i /></div><div className="browser-tab"><span>✦</span> {projectPreview.id}</div><button type="button" className="browser-close" onPointerDown={event => event.stopPropagation()} onClick={() => setProjectPreview(null)} aria-label="Fermer"><X size={17} /></button></div>
          <div className="browser-toolbar"><button type="button">←</button><button type="button">↻</button><div className="browser-address"><span>⌁</span> povik.dev/projects/{projectPreview.number}</div><span className="browser-live"><i /> LOCAL</span></div>
          <div className={`project-preview ${projectPreview.id === 'PRJ-003' ? 'coming' : ''}`}><span>{projectPreview.id} / {projectPreview.status}</span><div className="preview-number">{projectPreview.number}</div><h3>{projectPreview.title}</h3>{projectPreview.id === 'TC-001' ? <><p>Une collection de sites et d’interfaces construits en vibecoding. Cette fenêtre accueillera bientôt les captures, les choix techniques et les problèmes rencontrés sur chaque création.</p><div className="preview-console"><span>STATUS</span><strong>PROJETS EN COURS D’INDEXATION</strong><small>Les premières études de cas arrivent ici.</small></div></> : <><p>Cette partie se remplira au fil de la formation QA avec des cas de test, des rapports d’anomalies et de nouveaux projets documentés.</p><div className="preview-console"><span>RELEASE</span><strong>WORK IN PROGRESS</strong><small>Prochaine version en préparation.</small></div></>}</div>
        </section>
      </div>}

      {creativeOpen && <div className="creative-backdrop" role="presentation">
        <section className="creative-browser" role="dialog" aria-modal="true" aria-label="Laboratoire d’expériences créatives" style={{ translate: `${windowPosition.x}px ${windowPosition.y}px` }}>
          <div className="browser-chrome" onPointerDown={startWindowDrag} onPointerMove={moveWindow} onPointerUp={stopWindowDrag} onPointerCancel={stopWindowDrag}>
            <div className="browser-dots"><i /><i /><i /></div>
            <div className="browser-tab"><span>✦</span> POVIK PLAYGROUND</div>
            <button type="button" className="browser-close" onPointerDown={event => event.stopPropagation()} onClick={() => setCreativeOpen(false)} aria-label="Fermer"><X size={17} /></button>
          </div>
          <div className="browser-toolbar"><button type="button" onClick={() => setCreativeView('home')} aria-label="Retour aux expériences">←</button><button type="button" aria-label="Actualiser">↻</button><div className="browser-address"><span>⌁</span> povik.dev/lab/{creativeView === 'home' ? '' : creativeView}</div><span className="browser-live"><i /> LOCAL</span></div>
          <div className="creative-viewport">
            {creativeView === 'home' ? <div className="experience-home"><div className="experience-heading"><span>POVIK CREATIVE LAB / 01</span><h3>CHOISISSEZ UNE<br />EXPÉRIENCE.</h3><p>De petits terrains de jeu pour observer une interface autrement.</p></div><div className="experience-grid">
              <button type="button" className="experience-choice available" onClick={() => { setCreativeView('bug-hunt'); setHintLevel(0); }}><span>01 / DISPONIBLE</span><Bug /><strong>BUG HUNT<br />PLAYGROUND</strong><small>6 anomalies à débusquer</small><ArrowUpRight /></button>
              <button type="button" className="experience-choice" onClick={() => setCreativeView('contrast')}><span>02 / WORK IN PROGRESS</span><Sparkles /><strong>CONTRAST<br />CHAOS</strong><small>Lisibilité et accessibilité</small></button>
              <button type="button" className="experience-choice" onClick={() => setCreativeView('memory')}><span>03 / WORK IN PROGRESS</span><MousePointer2 /><strong>CURSOR<br />MEMORY</strong><small>Mémoire et précision</small></button>
              <button type="button" className="experience-choice" onClick={() => setCreativeView('breakpoint')}><span>04 / WORK IN PROGRESS</span><CircleDot /><strong>BREAKPOINT<br />PANIC</strong><small>Le responsive sous pression</small></button>
            </div></div> : creativeView === 'bug-hunt' ? <div className={`full-bug-hunt ${inspectionMode ? 'inspect-mode' : ''} ${findingId ? 'finding-flash' : ''}`}>
              <header><div><span>EXPÉRIENCE 01</span><h3>BUG HUNT PLAYGROUND</h3></div><div className="hunt-score"><strong>{activeFound}/{activeBugIds.length}</strong><span>ANOMALIES<br />TROUVÉES</span></div></header>
              <div className="hunt-tabs"><button className={activeBugTest === 'shop' ? 'active' : ''} onClick={() => { setActiveBugTest('shop'); setHintLevel(0); setInspectionMode(false); }}>01 BOUTIQUE</button><button className={activeBugTest === 'login' ? 'active' : ''} onClick={() => { setActiveBugTest('login'); setHintLevel(0); setInspectionMode(false); }}>02 CONNEXION</button><button className={activeBugTest === 'dashboard' ? 'active' : ''} onClick={() => { setActiveBugTest('dashboard'); setHintLevel(0); setInspectionMode(false); }}>03 DASHBOARD</button></div>
              <div className="hunt-help"><p className="hunt-instruction">{inspectionMode ? 'Mode inspection actif. Cliquez sur une anomalie pour la signaler.' : 'Mode navigation actif. Utilisez librement la page, puis inspectez-la quand vous êtes prêt.'}</p><div className="hunt-tools"><button type="button" className={inspectionMode ? 'active' : ''} onClick={() => setInspectionMode(mode => !mode)}><Bug size={14} /> {inspectionMode ? 'QUITTER L’INSPECTION' : 'ACTIVER L’INSPECTION'}</button><button type="button" onClick={() => setHintLevel(level => activeHints.length ? level + 1 : 0)} disabled={!activeHints.length}><Sparkles size={14} /> {hintLevel ? 'INDICE SUIVANT' : 'DEMANDER UN INDICE'}</button></div></div>
              {hintLevel > 0 && activeHints.length > 0 && <div className="hint-panel"><span>INDICE {String(visibleHintIndex + 1).padStart(2, '0')}</span><p>{activeHints[visibleHintIndex]}</p><small>{visibleHintIndex + 1}/{activeHints.length} · {activeHints.length} RESTANTE{activeHints.length > 1 ? 'S' : ''}</small></div>}
              {findingId && <div className="finding-toast finding-guide" role="status"><div className="finding-check">✓</div><div><span>ANOMALIE CONFIRMÉE · {bugFindings[findingId].level}</span><strong>{bugFindings[findingId].title}</strong><p>{bugFindings[findingId].explanation}</p><dl><div><dt>COMMENT LA DÉCELER</dt><dd>{bugFindings[findingId].detection}</dd></div><div><dt>COMMENT LA CORRIGER</dt><dd>{bugFindings[findingId].correction}</dd></div></dl><button type="button">CLIQUER N’IMPORTE OÙ POUR CONTINUER</button></div><small>+1</small></div>}
              {activeBugTest === 'shop' && <div className={`demo-shop ${activeFound === activeBugIds.length ? 'complete' : ''}`}>
                <div className="demo-nav"><strong>NØVA SHOP</strong><button type="button" className={`hunt-target nav-typo ${foundBugs.includes(1) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 1)) return; setShopNotice('Accueil chargé.'); }}>ACCEUlL</button><button type="button" onClick={() => setShopNotice('Nouvelle collection chargée.')}>NOUVEAUTÉS</button><button type="button" className={`hunt-target cart-bug ${foundBugs.includes(2) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 2)) return; setShopNotice(`${Math.max(1, cartItems)} article dans le panier.`); }}>PANIER ({Math.max(1, cartItems)})</button></div>
                {shopNotice && <div className="page-notice">{shopNotice}<button onClick={() => setShopNotice('')}>×</button></div>}
                <div className="demo-product"><div className="demo-visual"><span>NEW DROP</span><div>404</div></div><div className="demo-details"><small>CHAUSSURES / 2026</small><h4>NOVA<br />RUNNER</h4><div className="demo-price"><strong>129,00 €</strong><button type="button" className={`hunt-target discount-bug ${foundBugs.includes(3) ? 'found' : ''}`} onClick={event => { inspectBug(event, 3); }}>−70%</button></div><label>TAILLE</label><div className="size-row">{['40', '41', '42', '43'].map(size => <button key={size} className={`${size === '42' ? 'disabled-size' : ''} ${selectedSize === size ? 'selected' : ''}`} disabled={size === '42'} onClick={() => setSelectedSize(size)}>{size}</button>)}</div><button type="button" className={`hunt-target buy-bug ${foundBugs.includes(4) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 4)) return; setCartItems(count => count + 1); setShopNotice(`Taille ${selectedSize} ajoutée au panier.`); }}>AJOUTER AU PANIER</button><button type="button" className={`hunt-target ghost-bug ${foundBugs.includes(5) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 5)) return; setFavorite(value => !value); }}>{favorite ? '♥ DANS LES FAVORIS' : '♡ AJOUTER AUX FAVORIS'}</button></div></div>
                <button type="button" className={`hunt-target overflow-bug ${foundBugs.includes(6) ? 'found' : ''}`} onClick={event => { inspectBug(event, 6); }}>LIVRAISON OFFERTE DÈS 50 € · FRAIS CALCULÉS : 7,90 €</button>
                <section className="shop-catalog"><div className="catalog-heading"><div><small>SÉLECTION DU MOMENT</small><h5>VOUS AIMEREZ AUSSI</h5></div><button onClick={() => setShopNotice('Catalogue complet chargé.')}>VOIR TOUT →</button></div><div className="catalog-grid">{['Orbit Sandal', 'Pixel Runner', 'Static Boot'].map((name, index) => <button key={name} onClick={() => setShopNotice(`${name} sélectionnée.`)}><span>{String(index + 1).padStart(2, '0')}</span><div>{index === 0 ? '◯' : index === 1 ? '◇' : '△'}</div><strong>{name}</strong><small>{89 + index * 25},00 €</small></button>)}</div></section>
                <section className="shop-story"><div><small>NOTRE MANIFESTE</small><h5>CONÇUES POUR<br />BOUGER.</h5></div><p>Des séries limitées, une fabrication suivie et des pièces pensées pour durer plus longtemps qu’une tendance.</p></section>
                <form className="shop-newsletter" onSubmit={event => { event.preventDefault(); setShopNotice('Inscription enregistrée.'); }}><div><small>NØVA LETTER</small><strong>Recevez les prochaines sorties.</strong></div><input aria-label="Adresse email pour la newsletter" placeholder="vous@exemple.fr" /><button>S’INSCRIRE</button></form>
                <footer className="shop-footer"><strong>NØVA SHOP</strong><div><span>AIDE</span><span>LIVRAISON</span><span>RETOURS</span><span>CONFIDENTIALITÉ</span></div><small>© 2026 NØVA DEMO</small></footer>
              </div>}
              {activeBugTest === 'login' && <div className={`test-page login-test ${activeFound === activeBugIds.length ? 'complete' : ''}`}><header className="secure-header"><div className="login-brand">SECURE<span>LY</span></div><nav><button>PRODUIT</button><button>TARIFS</button><button>AIDE</button></nav></header><div className="login-layout"><section className="login-promise"><span>ESPACE PRIVÉ / 2026</span><h5>VOS DONNÉES.<br />VOTRE ESPACE.</h5><p>Centralisez vos documents, partagez-les avec votre équipe et gardez le contrôle sur chaque accès.</p><ul><li>Chiffrement des documents</li><li>Historique des connexions</li><li>Support disponible 7 jours sur 7</li></ul><div className="trust-row"><span>4,8/5 UTILISATEURS</span><span>12 000 COMPTES</span></div></section><form className="login-panel" onSubmit={event => { event.preventDefault(); if (inspectionMode) { discoverBug(9); return; } setLoginNotice(loginEmail.includes('@') && loginPassword ? 'Connexion simulée réussie.' : 'Veuillez compléter le formulaire.'); }}><small>ESPACE CLIENT</small><h4>Bon retour.</h4><label htmlFor="demo-email">Adresse email</label><input id="demo-email" className={`hunt-target fake-input ${foundBugs.includes(7) ? 'found' : ''}`} value={loginEmail} onChange={event => setLoginEmail(event.target.value)} onClick={event => { inspectBug(event, 7); }} /><label htmlFor="demo-password">Mot de passe</label><input id="demo-password" type="text" className={`hunt-target fake-input ${foundBugs.includes(8) ? 'found' : ''}`} value={loginPassword} onChange={event => setLoginPassword(event.target.value)} onClick={event => { inspectBug(event, 8); }} /><label className="remember-row"><input type="checkbox" defaultChecked /> Garder ma session ouverte</label><button type="submit" className={`hunt-target login-submit ${foundBugs.includes(9) ? 'found' : ''}`}>SE CONNECTER</button><button type="button" className={`hunt-target reset-bug ${foundBugs.includes(10) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 10)) return; setLoginNotice('Redirection inattendue vers le panier…'); }}>Mot de passe oublié ?</button><div className="login-divider">OU</div><button type="button" className="create-account" onClick={() => setLoginNotice('Création de compte simulée.')}>CRÉER UN COMPTE</button><button type="button" className={`hunt-target security-bug ${foundBugs.includes(11) ? 'found' : ''}`} onClick={event => { inspectBug(event, 11); }}>✓ HTTPS DÉSACTIVÉ</button>{loginNotice && <div className="login-notice">{loginNotice}</div>}</form></div><footer className="secure-footer"><span>© SECURELY DEMO</span><span>CONFIDENTIALITÉ · CONDITIONS · CONTACT</span></footer></div>}
              {activeBugTest === 'dashboard' && <div className={`test-page dashboard-test ${activeFound === activeBugIds.length ? 'complete' : ''}`}><aside><strong>PULSE.</strong>{['Vue générale', 'Rapports', 'Équipe'].map(view => <button key={view} className={dashboardView === view ? 'active' : ''} onClick={() => setDashboardView(view)}>{view}</button>)}<div className="dashboard-user"><i>JR</i><span>Jonathan<br /><small>Administrateur</small></span></div></aside><div className="dashboard-main"><div className="dashboard-head"><div><small>TABLEAU DE BORD / {dashboardView.toUpperCase()}</small><h4>{dashboardView === 'Vue générale' ? 'Bonjour Jonathan' : dashboardView}</h4></div><div className="dashboard-actions"><button onClick={() => setDashboardView('Export terminé')}>EXPORTER</button><button className={`hunt-target danger-bug ${foundBugs.includes(14) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 14)) return; setDashboardView('Données supprimées'); }}>SUPPRIMER LES DONNÉES</button></div></div><div className="stat-grid"><button className={`hunt-target stat-bug ${foundBugs.includes(12) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 12)) return; setDashboardView('Rapports'); }}><small>CONVERSION</small><strong>124%</strong><span>+8,4 depuis hier</span></button><button className={`hunt-target status-bug ${foundBugs.includes(16) ? 'found' : ''}`} onClick={event => { inspectBug(event, 16); }}><small>STATUT SYSTÈME</small><strong>● OPÉRATIONNEL</strong><span>Dernier contrôle il y a 2 min</span></button></div><div className="chart-box"><div><small>VISITES CETTE SEMAINE</small><strong>62</strong><span>Objectif : 80</span></div><button className={`hunt-target chart-bug ${foundBugs.includes(15) ? 'found' : ''}`} onClick={event => { if (inspectBug(event, 15)) return; setDashboardView('Rapports'); }}><i /><i /><i /><i /><i /><span>68 VISITES</span></button></div><button className={`hunt-target date-bug ${foundBugs.includes(13) ? 'found' : ''}`} onClick={event => { inspectBug(event, 13); }}>DERNIÈRE SYNCHRO : 31 AOÛT · PROCHAINE : 30 AOÛT</button><section className="activity-panel"><div className="activity-head"><div><small>ACTIVITÉ RÉCENTE</small><h5>Dernières actions</h5></div><button onClick={() => setDashboardView('Historique complet')}>TOUT AFFICHER</button></div><div className="activity-table"><div><i>JR</i><span><strong>Jonathan</strong><small>a publié le rapport hebdomadaire</small></span><time>09:42</time></div><div><i>ML</i><span><strong>Marie L.</strong><small>a rejoint l’espace de travail</small></span><time>Hier</time></div><div><i>SYS</i><span><strong>Système</strong><small>sauvegarde automatique terminée</small></span><time>Hier</time></div></div></section><footer className="dashboard-footer"><span>PULSE ANALYTICS · DEMO</span><span>AIDE · API · STATUT</span></footer></div></div>}
              <div className="hunt-footer"><span style={{ width: `${activeFound / activeBugIds.length * 100}%` }} />{activeFound === activeBugIds.length ? <strong>✓ TEST EXPLORATOIRE TERMINÉ</strong> : <small>{activeBugIds.length - activeFound} anomalie{activeBugIds.length - activeFound > 1 ? 's' : ''} restante{activeBugIds.length - activeFound > 1 ? 's' : ''}</small>}</div>
            </div> : <div className="wip-experience"><span>EXPÉRIENCE EN CONSTRUCTION</span><h3>WORK IN<br />PROGRESS.</h3><p>Cette expérience mijote encore dans le laboratoire. Aucun bouton ne fonctionne ici pour le moment, et cette fois, c’est volontaire.</p><button type="button" onClick={() => setCreativeView('home')}>← RETOUR AU LAB</button></div>}
          </div>
        </section>
      </div>}

      <section className="journey section-pad" id="journey">
        {!bugCrumbs.includes('journey') && <button type="button" className="bug-crumb crumb-journey" onPointerDown={event => holdBugCrumb(event, 'journey')} aria-label="Maintenir pour prendre une miette"><i /> MIETTE</button>}
        {renderExtraCrumbs('journey')}
        <div className="section-label"><span>03</span> CHANGELOG</div>
        <div className="journey-grid"><div><h2>LES VERSIONS<br />PRÉCÉDENTES<br /><em>COMPTENT AUSSI.</em></h2><p>Un parcours n’est pas une ligne droite. C’est une suite de versions, de correctifs et de fonctionnalités qu’on ne savait pas encore pouvoir développer.</p></div>
          <div className="timeline"><div className="timeline-item"><span>v0.1</span><div><small>15 ANS D’EXPÉRIENCE</small><h3>La restauration</h3><p>Rigueur, service, pression, attention aux détails. Quinze années dans un environnement où la qualité et la réactivité comptent chaque jour.</p></div></div><div className="timeline-item"><span>v0.7</span><div><small>MODE EXPLORATOIRE</small><h3>Veille & bidouille</h3><p>L’informatique comme terrain de curiosité permanent et l’autonomie comme méthode.</p></div></div><div className="timeline-item active"><span>v0.9</span><div><small>RELEASE CANDIDATE</small><h3>Vibecoding</h3><p>Des idées transformées en interfaces, des erreurs transformées en apprentissage.</p></div></div><div className="timeline-item future"><span>v1.0</span><div><small>COMING NEXT</small><h3>Formation QA Tester</h3><p>Structurer l’instinct, maîtriser la méthode et faire de la qualité un métier.</p></div></div></div>
        </div>
      </section>

      <section className="contact" id="contact">{!bugCrumbs.includes('contact') && <button type="button" className="bug-crumb crumb-contact" onPointerDown={event => holdBugCrumb(event, 'contact')} aria-label="Maintenir pour prendre une miette"><i /> MIETTE</button>}<div className="contact-orbit orbit-one" /><div className="contact-orbit orbit-two" /><span className="contact-kicker">DISCUTONS DE LA SUITE</span><h2>UNE IDÉE À<br /><span>CONSTRUIRE ENSEMBLE ?</span></h2><p>Opportunité, projet, conseil ou simple bonjour : ma boîte de réception est ouverte.</p><div className="contact-actions"><a href="mailto:jonathan.ragot@gmail.com" className="contact-main"><Mail /> M’ÉCRIRE <ChevronRight /></a><button onClick={copyMail} className="copy-button"><Copy size={17} /> {copied ? 'COPIÉ !' : 'COPIER L’EMAIL'}</button></div><footer><span>© 2026 JONATHAN “POVIK” RAGOT</span><span>MADE WITH CURIOSITY + <Bug size={13} /></span><a href="#top">RETOUR EN HAUT ↑</a></footer></section>
    </main>
  );
}
