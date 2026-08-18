(function () {
  var DATA = window.SITE_SEARCH_INDEX || [];
  var CURRENT_PAGE = (location.pathname.split('/').pop() || 'index.html');

  var FILTERS = [
    { key: 'all', label: 'Todos' },
    { key: 'p0', label: 'Crítico' },
    { key: 'p1', label: 'Importante' },
    { key: 'p2', label: 'Leve' },
    { key: 'texto', label: 'Textos' }
  ];

  var activeFilter = 'all';
  var activeIndex = -1;
  var visibleResults = [];

  var STOPWORDS = ['de', 'da', 'do', 'das', 'dos', 'e', 'ou', 'a', 'o', 'as', 'os', 'um', 'uma',
    'uns', 'umas', 'em', 'no', 'na', 'nos', 'nas', 'para', 'por', 'com', 'sem', 'que', 'se',
    'ao', 'aos', 'à', 'às', 'é', 'foi', 'ser', 'está', 'não', 'já'];

  // ---------- build modal markup once ----------
  var overlay = document.createElement('div');
  overlay.className = 'search-modal-overlay';
  overlay.id = 'search-overlay';
  overlay.hidden = true;
  overlay.innerHTML =
    '<div class="search-modal" role="dialog" aria-modal="true" aria-label="Buscar achados da auditoria">' +
      '<div class="search-modal-head">' +
        '<svg class="search-modal-icon" width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="7" cy="7" r="5.25" stroke="currentColor" stroke-width="1.5"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>' +
        '<input type="text" id="search-input" class="search-input" placeholder="Buscar por palavra-chave, tela ou tipo de erro…" autocomplete="off" spellcheck="false">' +
        '<button type="button" class="search-close" id="search-close">Esc</button>' +
      '</div>' +
      '<div class="search-filters" id="search-filters"></div>' +
      '<div class="search-results" id="search-results"></div>' +
      '<div class="search-modal-foot">' +
        '<span><kbd>&uarr;</kbd><kbd>&darr;</kbd> navegar</span>' +
        '<span><kbd>Enter</kbd> abrir</span>' +
        '<span><kbd>Esc</kbd> fechar</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);

  var input = overlay.querySelector('#search-input');
  var resultsEl = overlay.querySelector('#search-results');
  var filtersEl = overlay.querySelector('#search-filters');
  var closeBtn = overlay.querySelector('#search-close');

  function countFor(key) {
    if (key === 'all') return DATA.length;
    return DATA.filter(function (e) { return e.type === key; }).length;
  }

  FILTERS.forEach(function (f) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'search-filter' + (f.key === activeFilter ? ' active' : '');
    btn.dataset.filter = f.key;
    btn.innerHTML = f.label + '<span class="search-filter-count">' + countFor(f.key) + '</span>';
    btn.addEventListener('click', function () {
      activeFilter = f.key;
      Array.prototype.forEach.call(filtersEl.children, function (c) {
        c.classList.toggle('active', c.dataset.filter === activeFilter);
      });
      render();
    });
    filtersEl.appendChild(btn);
  });

  function escapeHtml(s) {
    return (s || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function score(entry, terms) {
    var hay = {
      title: (entry.title || '').toLowerCase(),
      excerpt: (entry.full || entry.excerpt || '').toLowerCase(),
      section: (entry.section || '').toLowerCase(),
      page: (entry.pageLabel || '').toLowerCase()
    };
    var total = 0;
    var matchedTerms = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      if (!t) continue;
      var hit = false;
      if (hay.title.indexOf(t) !== -1) { total += 3; hit = true; }
      if (hay.section.indexOf(t) !== -1) { total += 2; hit = true; }
      if (hay.page.indexOf(t) !== -1) { total += 2; hit = true; }
      if (hay.excerpt.indexOf(t) !== -1) { total += 1; hit = true; }
      if (hit) matchedTerms++;
    }
    if (matchedTerms === 0) return -1; // nenhum termo bateu em campo nenhum -> descarta
    // bônus por cobrir mais termos distintos da busca, não só repetir o mesmo
    total += matchedTerms * 1.5;
    return total;
  }

  function meaningfulTerms(rawTerms) {
    var filtered = rawTerms.filter(function (t) { return t && STOPWORDS.indexOf(t) === -1; });
    return filtered.length ? filtered : rawTerms;
  }

  function currentResults() {
    var q = input.value.trim().toLowerCase();
    var pool = activeFilter === 'all' ? DATA : DATA.filter(function (e) { return e.type === activeFilter; });
    if (!q) return pool.slice(0, 40);
    var terms = meaningfulTerms(q.split(/\s+/).filter(Boolean));
    var scored = pool
      .map(function (e) { return { e: e, s: score(e, terms) }; })
      .filter(function (r) { return r.s >= 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 60)
      .map(function (r) { return r.e; });
    return scored;
  }

  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    var terms = q.trim().split(/\s+/).filter(Boolean).map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    if (!terms.length) return escapeHtml(text);
    var re = new RegExp('(' + terms.join('|') + ')', 'ig');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }

  function render() {
    var q = input.value.trim();
    visibleResults = currentResults();
    activeIndex = visibleResults.length ? 0 : -1;

    if (!visibleResults.length) {
      resultsEl.innerHTML = '<div class="search-empty"><strong>Nada encontrado</strong>Tenta outra palavra-chave, ou muda o filtro de severidade acima.</div>';
      return;
    }

    resultsEl.innerHTML = visibleResults.map(function (e, i) {
      var url = e.page + '#' + e.id;
      return (
        '<a class="search-result' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" href="' + url + '" data-page="' + e.page + '" data-id="' + e.id + '">' +
          '<span class="search-result-sev ' + e.type + '"></span>' +
          '<span class="search-result-body">' +
            '<span class="search-result-title">' + highlight(e.title, q) + '</span>' +
            '<span class="search-result-meta">' + escapeHtml(e.pageLabel) + (e.section ? ' · ' + escapeHtml(e.section) : '') + '</span>' +
            '<span class="search-result-excerpt">' + highlight(e.excerpt, q) + '</span>' +
          '</span>' +
          '<span class="badge ' + e.type + ' search-result-badge">' + escapeHtml(e.sevLabel) + '</span>' +
        '</a>'
      );
    }).join('');
  }

  function setActive(i) {
    var items = resultsEl.querySelectorAll('.search-result');
    if (!items.length) return;
    activeIndex = Math.max(0, Math.min(i, items.length - 1));
    Array.prototype.forEach.call(items, function (el, idx) {
      el.classList.toggle('is-active', idx === activeIndex);
    });
    items[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function go(url) {
    var page = url.split('#')[0];
    var id = url.split('#')[1];
    close();
    if (page && page !== CURRENT_PAGE && page !== '') {
      window.location.href = url;
      return;
    }
    var target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'smooth' });
      target.classList.remove('search-target-flash');
      // force reflow so the animation can restart if triggered twice
      void target.offsetWidth;
      target.classList.add('search-target-flash');
      setTimeout(function () { target.classList.remove('search-target-flash'); }, 1900);
    }
  }

  resultsEl.addEventListener('click', function (ev) {
    var a = ev.target.closest('.search-result');
    if (!a) return;
    ev.preventDefault();
    go(a.getAttribute('href'));
  });

  input.addEventListener('input', render);

  overlay.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { close(); return; }
    if (ev.key === 'ArrowDown') { ev.preventDefault(); setActive(activeIndex + 1); return; }
    if (ev.key === 'ArrowUp') { ev.preventDefault(); setActive(activeIndex - 1); return; }
    if (ev.key === 'Enter') {
      ev.preventDefault();
      var items = resultsEl.querySelectorAll('.search-result');
      if (items[activeIndex]) go(items[activeIndex].getAttribute('href'));
    }
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('mousedown', function (ev) {
    if (ev.target === overlay) close();
  });

  function open() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    input.value = '';
    render();
    setTimeout(function () { input.focus(); }, 0);
  }

  function close() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    var trigger = document.querySelector('.search-trigger');
    if (trigger) trigger.focus();
  }

  document.addEventListener('click', function (ev) {
    var trigger = ev.target.closest('.search-trigger');
    if (trigger) open();
  });

  document.addEventListener('keydown', function (ev) {
    var tag = (ev.target && ev.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || (ev.target && ev.target.isContentEditable);
    if ((ev.key === 'k' || ev.key === 'K') && (ev.metaKey || ev.ctrlKey)) {
      ev.preventDefault();
      overlay.hidden ? open() : close();
      return;
    }
    if (ev.key === '/' && !typing && overlay.hidden) {
      ev.preventDefault();
      open();
    }
  });

  // Chegada por navegação entre páginas (resultado de outra página): o
  // próprio navegador já rolou até a âncora, então só falta o destaque.
  function flashFromHash() {
    if (!location.hash) return;
    var target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    // o salto nativo do navegador para a âncora pode ter acontecido antes de
    // fontes/estilos assentarem (posição errada) — refaz a rolagem aqui.
    target.scrollIntoView({ block: 'start' });
    target.classList.remove('search-target-flash');
    void target.offsetWidth;
    target.classList.add('search-target-flash');
    setTimeout(function () { target.classList.remove('search-target-flash'); }, 1900);
  }
  // Roda depois do evento "load" (não só DOMContentLoaded) e com uma folga
  // extra, para vencer qualquer tentativa tardia do próprio navegador de
  // rolar até o hash da URL — a nossa chamada precisa ser a última a mexer
  // na posição de rolagem, senão o navegador pode sobrescrever com uma
  // posição calculada antes do layout (fontes, imagens) assentar de vez.
  function afterLoad(cb) {
    if (document.readyState === 'complete') {
      setTimeout(cb, 220);
    } else {
      window.addEventListener('load', function () { setTimeout(cb, 220); });
    }
  }
  afterLoad(flashFromHash);
})();
