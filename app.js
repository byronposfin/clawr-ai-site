/**
 * CLAWR.AI — Full Application Logic
 * Mobile-first AI Dealmaker Platform
 * Version: 1.0.0
 */

'use strict';

// ═══════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════
const STATE = {
  currentScreen: 'home',
  isLoggedIn: false,
  agentStatus: 'LIVE', // LIVE | PAUSED | TRAINING
  signupStep: 1,
  personality: 'professional',
  vertical: 'financial-services',
  draggedCard: null,
  draggedFrom: null,
  signupData: {},
  docFilter: 'all',
  pipelineFilter: 'all',
  feedInterval: null,
  statsInterval: null,
};

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  pipeline: [
    {
      id: 1, company: 'Meridian Property Group', value: 250000, stage: 'lead',
      lastAction: 'AI sent intro email at 08:14', nextAction: 'Follow up call scheduled 14:00',
      contact: 'James Meridian', date: '2026-02-27'
    },
    {
      id: 2, company: 'Kensington Capital', value: 750000, stage: 'qualified',
      lastAction: 'AI qualified borrower criteria', nextAction: 'AI preparing term sheet',
      contact: 'Sarah Chen', date: '2026-02-26'
    },
    {
      id: 3, company: 'Accord Developments Ltd', value: 1200000, stage: 'proposal',
      lastAction: 'Proposal sent via DocuSign', nextAction: 'Awaiting signature (deadline: tomorrow)',
      contact: 'David Accord', date: '2026-02-25'
    },
    {
      id: 4, company: 'Atlas Finance Corp', value: 480000, stage: 'negotiation',
      lastAction: 'Counter-offer reviewed by AI', nextAction: 'AI drafting revised terms',
      contact: 'Priya Sharma', date: '2026-02-24'
    },
    {
      id: 5, company: 'Horizon Legal Partners', value: 95000, stage: 'won',
      lastAction: 'Contract signed', nextAction: 'Onboarding sequence triggered',
      contact: 'Tom Wright', date: '2026-02-20'
    },
    {
      id: 6, company: 'Sterling Recruitment', value: 36000, stage: 'lost',
      lastAction: 'Prospect went with competitor', nextAction: 'Re-engage in 90 days',
      contact: 'Emma Sterling', date: '2026-02-18'
    },
    {
      id: 7, company: 'Novus Property Fund', value: 320000, stage: 'lead',
      lastAction: 'AI completed inbound qualification', nextAction: 'AML checks pending',
      contact: 'Alex Novus', date: '2026-02-27'
    },
    {
      id: 8, company: 'Pinnacle SaaS Group', value: 60000, stage: 'qualified',
      lastAction: 'Demo booked for Monday', nextAction: 'AI will send pre-demo brief',
      contact: 'Claire Pinnacle', date: '2026-02-27'
    },
    {
      id: 9, company: 'Radcliffe & Sons', value: 890000, stage: 'proposal',
      lastAction: 'Commercial proposal generated', nextAction: 'Legal review in progress',
      contact: 'Henry Radcliffe', date: '2026-02-23'
    },
    {
      id: 10, company: 'Brightstone Clinics', value: 44000, stage: 'negotiation',
      lastAction: 'Pricing discussion ongoing', nextAction: 'AI to counter at 10% discount',
      contact: 'Dr. Amy Bright', date: '2026-02-26'
    },
    {
      id: 11, company: 'Vector Capital UK', value: 2100000, stage: 'negotiation',
      lastAction: 'Term sheet v3 issued', nextAction: 'Board sign-off required',
      contact: 'Marcus Vector', date: '2026-02-22'
    },
    {
      id: 12, company: 'Teal Education Group', value: 28000, stage: 'lead',
      lastAction: 'AI responded to inbound inquiry', nextAction: 'Call scheduled tomorrow',
      contact: 'Nina Teal', date: '2026-02-27'
    },
  ],

  agentFeed: [
    { icon: '📧', text: 'Sent qualification email to <strong>James Meridian</strong> at Meridian Property Group', time: '2 min ago', type: 'email' },
    { icon: '✅', text: 'Qualified <strong>Novus Property Fund</strong> (LTV 65%, clean credit, AML pending)', time: '8 min ago', type: 'qualify' },
    { icon: '📄', text: 'Generated commercial proposal for <strong>Radcliffe & Sons</strong> — £890,000 bridging', time: '15 min ago', type: 'doc' },
    { icon: '📞', text: 'Booked discovery call with <strong>Pinnacle SaaS Group</strong> for Monday 10:00', time: '22 min ago', type: 'call' },
    { icon: '🔔', text: 'Escalated <strong>Vector Capital UK</strong> (£2.1m deal) to senior team', time: '31 min ago', type: 'escalate' },
    { icon: '📝', text: 'Updated CRM: <strong>Atlas Finance Corp</strong> moved to Negotiation stage', time: '44 min ago', type: 'crm' },
    { icon: '💬', text: 'Responded to WhatsApp inquiry from <strong>Teal Education Group</strong>', time: '51 min ago', type: 'whatsapp' },
    { icon: '🤝', text: 'Contract countersigned: <strong>Horizon Legal Partners</strong> — deal CLOSED ✅', time: '1h 12min ago', type: 'won' },
    { icon: '📧', text: 'Follow-up sequence triggered: 3 leads inactive > 5 days', time: '1h 28min ago', type: 'email' },
    { icon: '🔍', text: 'Scraped LinkedIn: 14 new leads matching <strong>Financial Services</strong> ICP', time: '2h 5min ago', type: 'research' },
  ],

  documents: [
    { id: 1, name: 'Accord Developments — Bridging Proposal v2.pdf', type: 'Proposal', status: 'sent', date: '26 Feb 2026', size: '2.4 MB', docusign: 'awaiting' },
    { id: 2, name: 'Vector Capital UK — Term Sheet v3.pdf', type: 'Term Sheet', status: 'draft', date: '26 Feb 2026', size: '1.1 MB', docusign: null },
    { id: 3, name: 'Horizon Legal — Service Agreement SIGNED.pdf', type: 'Contract', status: 'signed', date: '20 Feb 2026', size: '3.2 MB', docusign: 'completed' },
    { id: 4, name: 'Atlas Finance — Counter-Proposal Draft.pdf', type: 'Proposal', status: 'draft', date: '25 Feb 2026', size: '890 KB', docusign: null },
    { id: 5, name: 'Radcliffe & Sons — Commercial Proposal.pdf', type: 'Proposal', status: 'sent', date: '23 Feb 2026', size: '1.8 MB', docusign: 'awaiting' },
    { id: 6, name: 'Kensington Capital — DIP Letter.pdf', type: 'DIP', status: 'sent', date: '21 Feb 2026', size: '640 KB', docusign: 'awaiting' },
    { id: 7, name: 'Sterling Recruitment — NDA.pdf', type: 'NDA', status: 'archived', date: '18 Feb 2026', size: '320 KB', docusign: 'declined' },
  ],

  verticals: [
    {
      icon: '💰',
      name: 'Financial Services',
      desc: 'Bridging loans, mortgages, commercial lending. AI qualifies borrowers, generates DIPs, tracks applications, and manages broker relationships end-to-end.',
      roi: 'Avg. 23× ROI · 5-day pipeline acceleration',
    },
    {
      icon: '⚖️',
      name: 'Legal',
      desc: 'Conveyancing, employment law, commercial contracts. AI handles initial client intake, conflict checks, quote generation, and matter updates.',
      roi: 'Avg. 18× ROI · 40% faster client onboarding',
    },
    {
      icon: '🏠',
      name: 'Property',
      desc: 'Estate agents, developers, investors. AI qualifies buyers and tenants, books viewings, follows up post-viewing, and manages vendor chains.',
      roi: 'Avg. 31× ROI · 3× more viewings booked',
    },
    {
      icon: '👤',
      name: 'Recruitment',
      desc: 'Headhunters and staffing agencies. AI screens candidates, sends job specs, arranges interviews, and keeps clients updated on pipeline.',
      roi: 'Avg. 27× ROI · 60% reduction in admin',
    },
    {
      icon: '💻',
      name: 'SaaS Sales',
      desc: 'Replace your entire BDR team. AI prospecting, outreach, demo booking, follow-up sequences, and CRM updates — all automated.',
      roi: 'Avg. 41× ROI · 10× outreach volume',
    },
    {
      icon: '🛒',
      name: 'Retail / eCommerce',
      desc: 'Abandoned cart recovery, upsell sequences, customer support, loyalty reactivation. AI runs the entire post-purchase journey.',
      roi: 'Avg. 19× ROI · 34% cart recovery rate',
    },
    {
      icon: '🏥',
      name: 'Healthcare',
      desc: 'Private clinics, aesthetics, dentistry. AI qualifies patients, books consultations, sends pre-appointment info, and manages rebooking.',
      roi: 'Avg. 22× ROI · 80% no-show reduction',
    },
    {
      icon: '🎓',
      name: 'Education',
      desc: 'Course sales, admissions, student support. AI handles enquiry qualification, enrolment guidance, payment plans, and retention campaigns.',
      roi: 'Avg. 29× ROI · 2× enrolment conversion',
    },
  ],

  pricing: [
    {
      plan: 'Starter',
      price: '£497',
      period: '/month',
      featured: false,
      features: [
        '1 AI agent',
        '500 leads / month',
        'Standard avatar',
        'Email + SMS channels',
        'CRM sync (HubSpot, Salesforce)',
        'WhatsApp integration',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      plan: 'Growth',
      price: '£1,000',
      period: '/month',
      featured: true,
      badge: 'Most Popular',
      features: [
        '3 AI agents',
        'Unlimited leads',
        'Custom cloned avatar',
        'DocuSign integration',
        'All channels incl. LinkedIn',
        'Advanced analytics + ROI',
        'API access',
        'Priority support (4h SLA)',
      ],
    },
    {
      plan: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      featured: false,
      features: [
        'Unlimited AI agents',
        'White-label platform',
        'Full API + webhooks',
        'Custom integrations',
        'Dedicated CSM',
        'SLA: 99.9% uptime',
        'On-premise option',
        '24/7 dedicated support',
      ],
    },
  ],

  revenueByMonth: [
    { month: 'Sep', value: 42 },
    { month: 'Oct', value: 61 },
    { month: 'Nov', value: 58 },
    { month: 'Dec', value: 73 },
    { month: 'Jan', value: 89 },
    { month: 'Feb', value: 127 },
  ],

  conversionFunnel: [
    { label: 'Leads In', count: 847, pct: 100 },
    { label: 'Qualified', count: 412, pct: 49 },
    { label: 'Proposal', count: 187, pct: 22 },
    { label: 'Negotiation', count: 94, pct: 11 },
    { label: 'Closed Won', count: 42, pct: 5 },
  ],
};

// ═══════════════════════════════════════════════════════════════
// MAIN CLAWR CONTROLLER
// ═══════════════════════════════════════════════════════════════
const CLAWR = {

  // ─── Initialise ───────────────────────────────────────────────
  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
    this.setupScrollNav();

    // Load any screen from URL params
    const params = new URLSearchParams(window.location.search);
    const screen = params.get('screen');

    // Boot sequence
    setTimeout(() => {
      const loading = document.getElementById('loading-screen');
      loading.classList.add('loading-exit');
      setTimeout(() => {
        loading.style.display = 'none';
        this.navigate(screen || 'home');
        this.initScreens();
      }, 400);
    }, 1200);
  },

  // ─── Register Service Worker ───────────────────────────────────
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/service-worker.js', { scope: '/' });
        console.log('[CLAWR] Service Worker registered:', reg.scope);
      } catch (err) {
        console.error('[CLAWR] Service Worker registration failed:', err);
      }
    }
  },

  // ─── Install Prompt ────────────────────────────────────────────
  setupInstallPrompt() {
    let deferredPrompt;
    const banner = document.getElementById('install-banner');
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      banner.classList.remove('hidden');
    });

    installBtn?.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        CLAWR.toast('✅ CLAWR.AI installed!', 'success');
      }
      deferredPrompt = null;
      banner.classList.add('hidden');
    });

    window.addEventListener('appinstalled', () => {
      CLAWR.toast('✅ CLAWR.AI added to home screen!', 'success');
      banner.classList.add('hidden');
    });
  },

  // ─── Scroll nav effect ─────────────────────────────────────────
  setupScrollNav() {
    const nav = document.getElementById('top-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }, { passive: true });
  },

  // ─── Navigate ─────────────────────────────────────────────────
  navigate(screen) {
    // Deactivate current
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('[data-screen]').forEach(el => el.classList.remove('active'));

    // Activate new
    const target = document.getElementById(`screen-${screen}`);
    if (!target) {
      console.warn(`[CLAWR] Screen not found: ${screen}`);
      return;
    }
    target.classList.add('active');
    STATE.currentScreen = screen;

    // Update nav state
    const isApp = ['dashboard', 'pipeline', 'documents', 'analytics', 'brain'].includes(screen);
    document.getElementById('public-nav-links').classList.toggle('hidden', isApp);
    document.getElementById('app-nav-links').classList.toggle('hidden', !isApp);
    document.getElementById('sidebar').classList.toggle('hidden', !isApp);
    document.getElementById('nav-status-indicator').classList.toggle('hidden', !isApp);

    // Sidebar active
    document.querySelectorAll('[data-screen]').forEach(el => {
      if (el.dataset.screen === screen) el.classList.add('active');
    });

    // Bottom nav active
    document.querySelectorAll('.bottom-nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.screen === screen);
    });

    // Nav CTA
    const navCta = document.getElementById('nav-cta-btn');
    const navLogin = document.getElementById('nav-login-btn');
    if (isApp) {
      navCta.textContent = '+ New Deal';
      navCta.onclick = () => CLAWR.showAddDealModal();
      navLogin.textContent = 'Account';
    } else {
      navCta.textContent = 'Get Started Free';
      navCta.onclick = () => CLAWR.navigate('signup');
      navLogin.textContent = 'Sign In';
    }

    // Scroll to top
    window.scrollTo(0, 0);

    // Screen-specific inits
    this.onScreenEnter(screen);
  },

  // ─── Screen Enter Hooks ────────────────────────────────────────
  onScreenEnter(screen) {
    switch(screen) {
      case 'dashboard':
        this.renderLiveFeed();
        this.startLiveFeed();
        this.animateStats();
        break;
      case 'pipeline':
        this.renderKanban();
        break;
      case 'documents':
        this.renderDocuments();
        break;
      case 'analytics':
        this.renderAnalytics();
        break;
      case 'verticals':
        this.renderVerticals();
        break;
      case 'pricing':
        this.renderPricing();
        break;
    }
  },

  // ─── Init Screens (first load) ─────────────────────────────────
  initScreens() {
    // Pre-render data
    this.renderVerticals();
    this.renderPricing();
  },

  // ─── Toast ────────────────────────────────────────────────────
  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ️'}</span><span class="toast-msg">${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  // ═══════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════
  renderLiveFeed() {
    const feed = document.getElementById('live-feed');
    if (!feed) return;
    feed.innerHTML = DATA.agentFeed.map(item => `
      <div class="feed-item">
        <div class="feed-icon">${item.icon}</div>
        <div class="feed-content">
          <div class="feed-text">${item.text}</div>
          <div class="feed-time">${item.time}</div>
        </div>
      </div>
    `).join('');
  },

  startLiveFeed() {
    if (STATE.feedInterval) clearInterval(STATE.feedInterval);
    STATE.feedInterval = setInterval(() => {
      this.addFeedItem();
    }, 12000); // New item every 12 seconds
  },

  addFeedItem() {
    const items = [
      { icon: '📧', text: 'Sent follow-up to <strong>3 leads</strong> unresponsive for 48h', type: 'email' },
      { icon: '✅', text: 'New lead qualified: <strong>Crestwood Developments</strong> (£680,000)', type: 'qualify' },
      { icon: '📄', text: 'Draft proposal ready for review: <strong>Meridian Property Group</strong>', type: 'doc' },
      { icon: '💬', text: 'WhatsApp inquiry responded: <strong>Apex Legal Ltd</strong>', type: 'whatsapp' },
      { icon: '🔍', text: 'Background check completed: <strong>Sterling Capital</strong> — clear', type: 'research' },
    ];
    const item = items[Math.floor(Math.random() * items.length)];
    item.time = 'Just now';

    const feed = document.getElementById('live-feed');
    if (!feed) return;

    const el = document.createElement('div');
    el.className = 'feed-item anim-fade-in';
    el.innerHTML = `
      <div class="feed-icon">${item.icon}</div>
      <div class="feed-content">
        <div class="feed-text">${item.text}</div>
        <div class="feed-time">${item.time}</div>
      </div>
    `;

    feed.insertBefore(el, feed.firstChild);
    // Keep only 10 items
    while (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }

    this.toast(`🤖 Agent: ${item.icon} ${item.text.replace(/<[^>]+>/g, '')}`, 'info');
  },

  animateStats() {
    const statEls = {
      'stat-leads': { target: 24, prefix: '', suffix: '' },
      'stat-deals': { target: 7, prefix: '', suffix: '' },
      'stat-docs': { target: 12, prefix: '', suffix: '' },
    };
    Object.entries(statEls).forEach(([id, cfg]) => {
      const el = document.getElementById(id);
      if (!el) return;
      let current = 0;
      const step = cfg.target / 30;
      const interval = setInterval(() => {
        current = Math.min(current + step, cfg.target);
        el.textContent = `${cfg.prefix}${Math.round(current)}${cfg.suffix}`;
        if (current >= cfg.target) clearInterval(interval);
      }, 30);
    });
  },

  toggleAgentStatus() {
    const statuses = ['LIVE', 'PAUSED', 'TRAINING'];
    const current = statuses.indexOf(STATE.agentStatus);
    STATE.agentStatus = statuses[(current + 1) % 3];

    const badge = document.querySelector('.badge-live, .badge-paused, .badge-training');
    const btn = document.querySelector('[onclick="CLAWR.toggleAgentStatus()"]');
    const navStatus = document.getElementById('nav-agent-status');

    if (badge) {
      badge.className = `badge badge-${STATE.agentStatus.toLowerCase()}`;
      badge.innerHTML = `<span class="status-dot" style="width:6px;height:6px;margin-right:0"></span> ${STATE.agentStatus}`;
    }
    if (btn) btn.textContent = STATE.agentStatus === 'LIVE' ? 'Pause Agent' : 'Resume Agent';
    if (navStatus) {
      navStatus.textContent = STATE.agentStatus;
      navStatus.className = `text-sm font-bold text-${STATE.agentStatus === 'LIVE' ? 'success' : STATE.agentStatus === 'PAUSED' ? 'warning' : 'blue'}`;
    }
    this.toast(`Agent status: ${STATE.agentStatus}`, STATE.agentStatus === 'LIVE' ? 'success' : 'warning');
  },

  // ═══════════════════════════════════════════════════════════════
  // PIPELINE / KANBAN
  // ═══════════════════════════════════════════════════════════════
  renderKanban(filter = STATE.pipelineFilter) {
    const board = document.getElementById('kanban-board');
    if (!board) return;

    const columns = [
      { key: 'lead', label: 'Lead', cls: 'col-lead' },
      { key: 'qualified', label: 'Qualified', cls: 'col-qualified' },
      { key: 'proposal', label: 'Proposal', cls: 'col-proposal' },
      { key: 'negotiation', label: 'Negotiation', cls: 'col-negotiation' },
      { key: 'won', label: '🟢 Closed Won', cls: 'col-won' },
      { key: 'lost', label: '🔴 Closed Lost', cls: 'col-lost' },
    ];

    let deals = DATA.pipeline;
    if (filter === 'high') deals = deals.filter(d => d.value >= 100000);
    if (filter === 'ai-active') deals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost');
    if (filter === 'stale') deals = deals.filter(d => d.stage === 'lead');

    board.innerHTML = columns.map(col => {
      const colDeals = deals.filter(d => d.stage === col.key);
      const totalValue = colDeals.reduce((sum, d) => sum + d.value, 0);
      return `
        <div class="kanban-col ${col.cls}" data-stage="${col.key}"
             ondragover="CLAWR.onDragOver(event)" ondrop="CLAWR.onDrop(event, '${col.key}')">
          <div class="kanban-header">
            <span class="kanban-title">${col.label}</span>
            <span class="kanban-count">${colDeals.length}</span>
          </div>
          ${totalValue > 0 ? `<div style="font-size:0.72rem;color:var(--text-muted);margin-bottom:0.5rem">£${(totalValue/1000).toFixed(0)}k total</div>` : ''}
          ${colDeals.map(deal => this.renderKanbanCard(deal)).join('')}
          ${colDeals.length === 0 ? `<div style="text-align:center;padding:2rem 1rem;color:var(--text-muted);font-size:0.8rem">No deals in this stage</div>` : ''}
        </div>
      `;
    }).join('');

    // Update totals
    const total = DATA.pipeline.filter(d => d.stage !== 'lost').reduce((s, d) => s + d.value, 0);
    const activeCount = DATA.pipeline.filter(d => d.stage !== 'won' && d.stage !== 'lost').length;
    const label = document.getElementById('pipeline-total-label');
    if (label) label.textContent = `${activeCount} active deals · £${(total/1000).toFixed(0)}k total`;
    const sidebar = document.getElementById('sidebar-pipeline-total');
    if (sidebar) sidebar.textContent = `Pipeline: £${(total/1000).toFixed(0)}k`;
  },

  renderKanbanCard(deal) {
    return `
      <div class="kanban-card" draggable="true"
           data-deal-id="${deal.id}"
           ondragstart="CLAWR.onDragStart(event, ${deal.id})"
           onclick="CLAWR.showDealModal(${deal.id})">
        <div class="kanban-card-top">
          <div class="kanban-company">${deal.company}</div>
          <div class="kanban-value">£${(deal.value/1000).toFixed(0)}k</div>
        </div>
        <div class="kanban-meta">${deal.contact}</div>
        <div class="kanban-ai-action">🤖 ${deal.lastAction}</div>
      </div>
    `;
  },

  onDragStart(event, dealId) {
    STATE.draggedCard = dealId;
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
  },

  onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    event.currentTarget.style.borderColor = 'var(--blue)';
  },

  onDrop(event, stage) {
    event.preventDefault();
    event.currentTarget.style.borderColor = '';
    if (STATE.draggedCard === null) return;

    const deal = DATA.pipeline.find(d => d.id === STATE.draggedCard);
    if (deal) {
      deal.stage = stage;
      this.toast(`✅ Moved ${deal.company} to ${stage}`, 'success');
      this.renderKanban();
    }
    STATE.draggedCard = null;
  },

  filterPipeline(filter) {
    STATE.pipelineFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.textContent.toLowerCase().includes(filter) || filter === 'all');
    });
    this.renderKanban(filter);
  },

  showDealModal(dealId) {
    const deal = DATA.pipeline.find(d => d.id === dealId);
    if (!deal) return;
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Deal: ${deal.company}</div>
        <button class="modal-close" onclick="CLAWR.closeModal()">✕</button>
      </div>
      <div class="stats-grid" style="margin-bottom:1.5rem">
        <div class="stat-card" style="text-align:center">
          <div class="stat-label">Value</div>
          <div class="stat-value text-orange" style="font-size:1.3rem">£${deal.value.toLocaleString()}</div>
        </div>
        <div class="stat-card" style="text-align:center">
          <div class="stat-label">Stage</div>
          <div class="stat-value" style="font-size:1rem;text-transform:capitalize">${deal.stage}</div>
        </div>
      </div>
      <div class="form-group mb-md">
        <label>Contact</label>
        <div class="text-sm">${deal.contact}</div>
      </div>
      <div class="form-group mb-md">
        <label>Last AI Action</label>
        <div class="text-sm text-secondary">${deal.lastAction}</div>
      </div>
      <div class="form-group mb-lg">
        <label>Next AI Action</label>
        <div class="text-sm text-blue">${deal.nextAction}</div>
      </div>
      <div class="flex gap-sm">
        <button class="btn btn-primary btn-md" style="flex:1" onclick="CLAWR.toast('📄 Generating proposal...','info');CLAWR.closeModal()">Generate Proposal</button>
        <button class="btn btn-secondary btn-md" onclick="CLAWR.closeModal()">Close</button>
      </div>
    `);
  },

  showAddDealModal() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Add New Deal</div>
        <button class="modal-close" onclick="CLAWR.closeModal()">✕</button>
      </div>
      <div class="form-group mb-md">
        <label>Company Name</label>
        <input type="text" id="new-company" placeholder="e.g. Meridian Capital Ltd">
      </div>
      <div class="form-group mb-md">
        <label>Deal Value (£)</label>
        <input type="number" id="new-value" placeholder="500000" min="0">
      </div>
      <div class="form-group mb-md">
        <label>Contact Name</label>
        <input type="text" id="new-contact" placeholder="e.g. John Smith">
      </div>
      <div class="form-group mb-lg">
        <label>Stage</label>
        <select id="new-stage">
          <option value="lead">Lead</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
        </select>
      </div>
      <button class="btn btn-primary btn-full btn-lg" onclick="CLAWR.addDeal()">Add Deal</button>
    `);
  },

  addDeal() {
    const company = document.getElementById('new-company')?.value;
    const value = parseInt(document.getElementById('new-value')?.value || '0');
    const contact = document.getElementById('new-contact')?.value;
    const stage = document.getElementById('new-stage')?.value;

    if (!company) { this.toast('Please enter a company name', 'error'); return; }

    DATA.pipeline.push({
      id: Date.now(),
      company, value, stage,
      contact: contact || 'Unknown',
      lastAction: 'Deal added manually',
      nextAction: 'AI will qualify this lead',
      date: new Date().toISOString().split('T')[0],
    });

    this.closeModal();
    this.renderKanban();
    this.toast(`✅ ${company} added to pipeline`, 'success');
  },

  // ═══════════════════════════════════════════════════════════════
  // DOCUMENTS
  // ═══════════════════════════════════════════════════════════════
  renderDocuments(filter = STATE.docFilter) {
    const list = document.getElementById('doc-list');
    if (!list) return;

    let docs = DATA.documents;
    if (filter !== 'all') docs = docs.filter(d => d.status === filter);

    if (docs.length === 0) {
      list.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted)">No documents found</div>`;
      return;
    }

    list.innerHTML = docs.map(doc => `
      <div class="doc-item">
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <div class="doc-name">${doc.name}</div>
          <div class="doc-meta">${doc.type} · ${doc.date} · ${doc.size}</div>
        </div>
        <div class="doc-actions">
          ${doc.docusign ? `<span class="badge badge-${doc.docusign === 'completed' ? 'signed' : doc.docusign === 'awaiting' ? 'sent' : 'archived'}" style="font-size:0.65rem">DocuSign: ${doc.docusign}</span>` : ''}
          <span class="badge badge-${doc.status}">${doc.status}</span>
          <button class="btn btn-ghost btn-icon-sm" onclick="CLAWR.toast('📥 Downloading ${doc.name}','info')" title="Download">⬇️</button>
        </div>
      </div>
    `).join('');
  },

  filterDocs(filter) {
    STATE.docFilter = filter;
    document.querySelectorAll('#screen-documents .filter-chip').forEach(chip => {
      chip.classList.toggle('active', chip.textContent.toLowerCase() === filter || (filter === 'all' && chip.textContent === 'All'));
    });
    this.renderDocuments(filter);
  },

  generateDocument() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Generate Document</div>
        <button class="modal-close" onclick="CLAWR.closeModal()">✕</button>
      </div>
      <div class="form-group mb-md">
        <label>Document Type</label>
        <select id="gen-doc-type">
          <option>Commercial Proposal</option>
          <option>Term Sheet</option>
          <option>NDA</option>
          <option>DIP Letter</option>
          <option>Service Agreement</option>
          <option>Follow-up Email</option>
        </select>
      </div>
      <div class="form-group mb-lg">
        <label>For Deal</label>
        <select id="gen-doc-deal">
          ${DATA.pipeline.map(d => `<option value="${d.id}">${d.company} — £${(d.value/1000).toFixed(0)}k</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-full btn-lg" onclick="CLAWR.confirmGenerateDoc()">🤖 Generate with AI</button>
    `);
  },

  confirmGenerateDoc() {
    const type = document.getElementById('gen-doc-type')?.value;
    const dealId = document.getElementById('gen-doc-deal')?.value;
    const deal = DATA.pipeline.find(d => d.id === parseInt(dealId));
    this.closeModal();

    // Simulate generation
    this.toast(`🤖 AI generating ${type}...`, 'info');
    setTimeout(() => {
      DATA.documents.unshift({
        id: Date.now(),
        name: `${deal?.company || 'New Deal'} — ${type}.pdf`,
        type, status: 'draft',
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
        docusign: null,
      });
      this.renderDocuments();
      this.toast(`✅ ${type} generated and saved as draft`, 'success');
    }, 2000);
  },

  // ═══════════════════════════════════════════════════════════════
  // ANALYTICS
  // ═══════════════════════════════════════════════════════════════
  renderAnalytics() {
    this.renderConversionFunnel();
    this.renderRevenueChart();
  },

  renderConversionFunnel() {
    const el = document.getElementById('conversion-funnel');
    if (!el) return;
    const max = DATA.conversionFunnel[0].count;
    el.innerHTML = DATA.conversionFunnel.map(step => `
      <div class="funnel-step">
        <div class="funnel-label">${step.label}</div>
        <div class="funnel-bar-wrap">
          <div class="funnel-bar" style="width:0%" data-width="${step.pct}%"></div>
        </div>
        <div class="funnel-pct">${step.pct}%</div>
        <div style="font-size:0.72rem;color:var(--text-muted);width:40px;text-align:right">${step.count}</div>
      </div>
    `).join('');

    // Animate bars
    setTimeout(() => {
      el.querySelectorAll('.funnel-bar').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    }, 100);
  },

  renderRevenueChart() {
    const el = document.getElementById('revenue-chart');
    if (!el) return;
    const max = Math.max(...DATA.revenueByMonth.map(m => m.value));
    el.innerHTML = DATA.revenueByMonth.map(m => `
      <div class="bar-group">
        <div class="bar" style="height:0;max-height:100%" data-height="${(m.value / max * 100)}%" title="£${m.value}k">
          <div style="position:absolute;top:-20px;left:50%;transform:translateX(-50%);font-size:0.65rem;font-weight:700;color:var(--text-secondary);white-space:nowrap">£${m.value}k</div>
        </div>
        <div class="bar-label">${m.month}</div>
      </div>
    `).join('');

    setTimeout(() => {
      el.querySelectorAll('.bar').forEach(bar => {
        bar.style.height = bar.dataset.height;
      });
    }, 100);
  },

  // ═══════════════════════════════════════════════════════════════
  // VERTICALS
  // ═══════════════════════════════════════════════════════════════
  renderVerticals() {
    const grid = document.getElementById('verticals-grid');
    if (!grid || grid.children.length > 0) return; // Already rendered
    grid.innerHTML = DATA.verticals.map(v => `
      <div class="vertical-card" onclick="CLAWR.navigate('signup')">
        <div class="vertical-icon">${v.icon}</div>
        <div class="vertical-name">${v.name}</div>
        <div class="vertical-desc">${v.desc}</div>
        <div class="vertical-roi">${v.roi}</div>
        <button class="btn btn-outline btn-sm btn-full">Deploy in 24 hours →</button>
      </div>
    `).join('');
  },

  // ═══════════════════════════════════════════════════════════════
  // PRICING
  // ═══════════════════════════════════════════════════════════════
  renderPricing() {
    const grid = document.getElementById('pricing-grid');
    if (!grid || grid.children.length > 0) return;
    grid.innerHTML = DATA.pricing.map(plan => `
      <div class="pricing-card ${plan.featured ? 'featured' : ''}">
        ${plan.badge ? `<div class="pricing-badge">${plan.badge}</div>` : ''}
        <div class="pricing-plan">${plan.plan}</div>
        <div class="pricing-price ${plan.featured ? 'gradient-text' : ''}">${plan.price}</div>
        <div class="pricing-period">${plan.period}</div>
        <ul class="pricing-features">
          ${plan.features.map(f => `<li><span class="feature-check">✓</span> ${f}</li>`).join('')}
        </ul>
        <button class="btn ${plan.featured ? 'btn-primary' : 'btn-outline'} btn-full btn-lg" onclick="CLAWR.selectPlan('${plan.plan}')">
          ${plan.price === 'Custom' ? 'Talk to Sales' : 'Start Free Trial'}
        </button>
      </div>
    `).join('');
  },

  selectPlan(plan) {
    STATE.signupData.plan = plan;
    this.toast(`✅ ${plan} plan selected!`, 'success');
    setTimeout(() => this.navigate('signup'), 500);
  },

  // ═══════════════════════════════════════════════════════════════
  // AGENT BRAIN
  // ═══════════════════════════════════════════════════════════════
  setPersonality(btn) {
    document.querySelectorAll('.personality-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    STATE.personality = btn.dataset.personality;
    this.toast(`✅ Personality set to ${btn.dataset.personality}`, 'success');
  },

  setVertical(value) {
    STATE.vertical = value;
  },

  handleDocUpload(event) {
    const files = Array.from(event.target.files);
    const container = document.getElementById('uploaded-docs');
    if (!container) return;
    files.forEach(file => {
      const el = document.createElement('div');
      el.className = 'doc-item';
      el.innerHTML = `
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <div class="doc-name">${file.name}</div>
          <div class="doc-meta">${(file.size / 1024 / 1024).toFixed(2)} MB · Added just now</div>
        </div>
        <span class="badge badge-training">Processing</span>
      `;
      container.appendChild(el);
    });
    this.toast(`📚 ${files.length} document(s) uploaded for training`, 'success');
  },

  handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const preview = document.getElementById('video-preview');
    if (preview) {
      preview.innerHTML = `
        <div class="card" style="padding:1rem;text-align:center">
          <div style="font-size:2rem;margin-bottom:0.5rem">🎬</div>
          <div class="text-sm font-bold">${file.name}</div>
          <div class="text-xs text-muted">${(file.size/1024/1024).toFixed(1)} MB</div>
          <div class="badge badge-training" style="margin-top:0.5rem;display:inline-flex">Queued for cloning</div>
        </div>
      `;
    }
    this.toast('🎬 Video uploaded! Your agent will be cloned within 24 hours.', 'success');
  },

  recordVideo() {
    this.toast('🎙️ Opening camera... (requires camera permission)', 'info');
    // In production, this would open getUserMedia and record
  },

  saveAgentConfig() {
    this.toast('💾 Agent configuration saved! Training will update in the next sync.', 'success');
  },

  // ═══════════════════════════════════════════════════════════════
  // SIGNUP FLOW
  // ═══════════════════════════════════════════════════════════════
  signupNext(step) {
    // Validate
    if (step === 1) {
      const name = document.getElementById('biz-name')?.value;
      const email = document.getElementById('biz-email')?.value;
      if (!name) { this.toast('Please enter your business name', 'error'); return; }
      if (!email || !email.includes('@')) { this.toast('Please enter a valid email', 'error'); return; }
      STATE.signupData.businessName = name;
      STATE.signupData.email = email;
    }

    const nextStep = step + 1;
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`signup-step-${nextStep}`)?.classList.add('active');

    // Update dots
    const dot = document.getElementById(`step-dot-${step}`);
    if (dot) { dot.classList.remove('active'); dot.classList.add('done'); dot.textContent = '✓'; }
    const line = document.getElementById(`step-line-${step}`);
    if (line) line.classList.add('done');
    const nextDot = document.getElementById(`step-dot-${nextStep}`);
    if (nextDot) nextDot.classList.add('active');

    STATE.signupStep = nextStep;
    window.scrollTo(0, 0);
  },

  signupBack(step) {
    const prevStep = step - 1;
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`signup-step-${prevStep}`)?.classList.add('active');

    const dot = document.getElementById(`step-dot-${step}`);
    if (dot) { dot.classList.remove('active'); }
    const line = document.getElementById(`step-line-${prevStep}`);
    if (line) line.classList.remove('done');
    const prevDot = document.getElementById(`step-dot-${prevStep}`);
    if (prevDot) { prevDot.classList.remove('done'); prevDot.classList.add('active'); prevDot.textContent = prevStep; }

    STATE.signupStep = prevStep;
  },

  handleSignupDoc(event) {
    const file = event.target.files[0];
    if (!file) return;
    const preview = document.getElementById('signup-doc-preview');
    if (preview) {
      preview.innerHTML = `
        <div class="flex items-center gap-md" style="padding:0.75rem;background:rgba(0,200,150,0.08);border:1px solid rgba(0,200,150,0.3);border-radius:var(--radius-md)">
          <span style="font-size:1.5rem">📄</span>
          <div>
            <div class="text-sm font-bold">${file.name}</div>
            <div class="text-xs text-success">✓ Ready to upload</div>
          </div>
        </div>
      `;
    }
    STATE.signupData.document = file.name;
    this.toast('📄 Document ready', 'success');
  },

  handleSignupVideo(event) {
    const file = event.target.files[0];
    if (!file) return;
    const preview = document.getElementById('signup-video-preview');
    if (preview) {
      preview.innerHTML = `
        <div class="flex items-center gap-md" style="padding:0.75rem;background:rgba(67,97,238,0.08);border:1px solid var(--border-accent);border-radius:var(--radius-md)">
          <span style="font-size:1.5rem">🎬</span>
          <div>
            <div class="text-sm font-bold">${file.name}</div>
            <div class="text-xs text-blue">✓ Ready to clone</div>
          </div>
        </div>
      `;
    }
    STATE.signupData.video = file.name;
    this.toast('🎬 Video ready for cloning', 'success');
  },

  recordSignupVideo() {
    this.toast('🎙️ Opening camera... (requires camera permission)', 'info');
  },

  signupComplete() {
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('signup-complete')?.classList.add('active');

    // Complete all dots
    [1, 2, 3].forEach(n => {
      const dot = document.getElementById(`step-dot-${n}`);
      if (dot) { dot.classList.remove('active'); dot.classList.add('done'); dot.textContent = '✓'; }
      const line = document.getElementById(`step-line-${n}`);
      if (line) line.classList.add('done');
    });

    STATE.isLoggedIn = true;
    window.scrollTo(0, 0);
    this.toast('🚀 Welcome to CLAWR.AI! Your agent is being built.', 'success');
  },

  // ═══════════════════════════════════════════════════════════════
  // MODAL
  // ═══════════════════════════════════════════════════════════════
  showModal(content) {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay" onclick="CLAWR.closeModal()">
        <div class="modal" onclick="event.stopPropagation()">
          ${content}
        </div>
      </div>
    `;
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    const container = document.getElementById('modal-container');
    container.innerHTML = '';
    document.body.style.overflow = '';
  },

  // ═══════════════════════════════════════════════════════════════
  // INVITE TEAM
  // ═══════════════════════════════════════════════════════════════
  showInviteModal() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">Invite Team Member</div>
        <button class="modal-close" onclick="CLAWR.closeModal()">✕</button>
      </div>
      <p class="text-secondary text-sm mb-lg">Add team members to monitor your AI agent, review deals, and collaborate on proposals.</p>
      <div class="form-group mb-md">
        <label>Email Address</label>
        <input type="email" id="invite-email" placeholder="colleague@company.com">
      </div>
      <div class="form-group mb-lg">
        <label>Role</label>
        <select id="invite-role">
          <option value="viewer">Viewer (read-only)</option>
          <option value="manager">Manager (can edit)</option>
          <option value="admin">Admin (full access)</option>
        </select>
      </div>
      <button class="btn btn-primary btn-full btn-lg" onclick="CLAWR.sendInvite()">Send Invite</button>
    `);
  },

  sendInvite() {
    const email = document.getElementById('invite-email')?.value;
    if (!email || !email.includes('@')) { this.toast('Please enter a valid email', 'error'); return; }
    this.closeModal();
    this.toast(`📧 Invite sent to ${email}`, 'success');
  },

  // ═══════════════════════════════════════════════════════════════
  // DEMO
  // ═══════════════════════════════════════════════════════════════
  showDemo() {
    this.showModal(`
      <div class="modal-header">
        <div class="modal-title">CLAWR.AI Demo</div>
        <button class="modal-close" onclick="CLAWR.closeModal()">✕</button>
      </div>
      <div style="background:var(--bg-secondary);border-radius:var(--radius-md);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;margin-bottom:1.5rem;border:1px solid var(--border)">
        <div style="text-align:center">
          <div style="font-size:3rem;margin-bottom:1rem;animation:float 3s ease-in-out infinite">🤖</div>
          <div class="text-secondary text-sm">Demo video coming soon</div>
          <div class="text-xs text-muted mt-sm">See your AI dealmaker in action</div>
        </div>
      </div>
      <button class="btn btn-primary btn-full btn-lg" onclick="CLAWR.closeModal();CLAWR.navigate('signup')">🚀 Get Started Free →</button>
    `);
  },

  // ═══════════════════════════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════════════════════════
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
      // G + key shortcuts (like Gmail)
      if (e.altKey) {
        const shortcuts = { '1': 'home', '2': 'dashboard', '3': 'pipeline', '4': 'documents', '5': 'analytics', '6': 'brain' };
        if (shortcuts[e.key]) { e.preventDefault(); this.navigate(shortcuts[e.key]); }
      }
    });
  },
};

// ═══════════════════════════════════════════════════════════════
// BOOT
// ═══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  CLAWR.init();
  CLAWR.setupKeyboardShortcuts();
});

// Drag and drop cleanup
document.addEventListener('dragend', () => {
  document.querySelectorAll('.kanban-col').forEach(col => {
    col.style.borderColor = '';
  });
  document.querySelectorAll('.kanban-card').forEach(card => {
    card.classList.remove('dragging');
  });
});

// Handle URL params for deep linking
window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  if (screen) CLAWR.navigate(screen);
});

// Prevent double-tap zoom on mobile
document.addEventListener('touchstart', () => {}, { passive: true });

// Log version
console.log('%cCLAWR.AI v1.0.0', 'background:#4361EE;color:white;padding:4px 12px;border-radius:4px;font-weight:bold;font-size:14px');
console.log('%cAI Dealmaker Platform — Posfin Capital', 'color:#E79039;font-size:12px');
