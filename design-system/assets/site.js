/* So+ma Design System · interações da documentação (padrão Material 3). */
(function () {
  var doc = document, html = doc.documentElement, ROOT = html.dataset.root || '';
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || doc).querySelectorAll(s)); };
  var norm = function (s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Tema (claro, escuro) */
  var themeBtn = $('#theme');
  function isDark() { return html.dataset.theme ? html.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  function paintTheme() {
    if (!themeBtn) return;
    var d = isDark();
    themeBtn.setAttribute('aria-pressed', d);
    themeBtn.setAttribute('aria-label', d ? 'Usar tema claro' : 'Usar tema escuro');
    themeBtn.dataset.mode = d ? 'dark' : 'light';
  }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    html.dataset.theme = next;
    try { localStorage.setItem('soma-theme', next); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  /* ---- Ripple (camada de estado pressionado do M3) */
  doc.addEventListener('pointerdown', function (e) {
    if (reduce) return;
    var el = e.target.closest && e.target.closest('.sl');
    if (!el) return;
    var r = el.getBoundingClientRect(), size = Math.max(r.width, r.height) * 2.2, s = doc.createElement('span');
    s.className = 'rp';
    s.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - r.left - size / 2) + 'px;top:' + (e.clientY - r.top - size / 2) + 'px';
    el.appendChild(s);
    s.addEventListener('animationend', function () { s.remove(); });
  });

  /* ---- Snackbar */
  var snack = $('.snack'), snackT;
  function say(msg) {
    if (!snack) return;
    snack.textContent = msg; snack.classList.add('on');
    clearTimeout(snackT); snackT = setTimeout(function () { snack.classList.remove('on'); }, 2600);
  }
  function copy(text, label) {
    var done = function () { say('Copiado: ' + (label || text)); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { say('Não deu para copiar. Selecione o texto e copie.'); });
    else say('Não deu para copiar. Selecione o texto e copie.');
  }
  doc.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('[data-copy]');
    if (c) copy(c.dataset.copy);
  });
  $$('.codeblock').forEach(function (b) {
    var btn = $('.ib', b), pre = $('pre', b);
    if (btn && pre) btn.addEventListener('click', function () { copy(pre.textContent.replace(/\n$/, ''), 'código'); });
  });

  /* ---- Top app bar: muda de superfície ao rolar */
  var bar = $('.topbar');
  function onScroll() { if (bar) bar.classList.toggle('scrolled', scrollY > 8); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---- Navigation drawer modal (janelas compacta e média) */
  var drawer = $('#drawer'), scrim = $('.scrim'), menu = $('#menu');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open); scrim.classList.toggle('on', open);
    menu.setAttribute('aria-expanded', open);
    if (open) { var a = $('a[aria-current]', drawer) || $('a,summary', drawer); if (a) a.focus({ preventScroll: true }); }
    else if (doc.activeElement && drawer.contains(doc.activeElement)) menu.focus();
  }
  if (menu) menu.addEventListener('click', function () { setDrawer(!drawer.classList.contains('open')); });
  if (scrim) scrim.addEventListener('click', function () { setDrawer(false); });
  var current = drawer && $('a[aria-current]', drawer);
  if (current) { var nav = $('nav', drawer); nav.scrollTop = Math.max(0, current.offsetTop - nav.clientHeight / 2); }

  /* ---- Busca */
  var input = $('#q'), list = $('#results'), IDX = window.SOMA_INDEX || [], sel = -1, shown = [];
  function render() {
    var v = norm(input.value.trim());
    if (!v) { list.hidden = true; input.setAttribute('aria-expanded', false); return; }
    var hits = [];
    for (var i = 0; i < IDX.length && hits.length < 40; i++) {
      var it = IDX[i], t = norm(it[0]), pos = t.indexOf(v);
      if (pos > -1) hits.push([pos === 0 ? 0 : 1, i]);
      else if (norm(it[3]).indexOf(v) > -1) hits.push([2, i]);
    }
    hits.sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    shown = hits.slice(0, 9).map(function (h) { return IDX[h[1]]; });
    sel = shown.length ? 0 : -1;
    list.innerHTML = shown.length ? shown.map(function (it, i) {
      return '<li role="option" id="r' + i + '" aria-selected="' + (i === sel) + '"><a class="sl" tabindex="-1" href="' + ROOT + it[2] + '">' + esc(it[0]) + '<small>' + esc(it[3] || '') + '</small><em>' + esc(it[1]) + '</em></a></li>';
    }).join('') : '<li class="none">Nada encontrado para “' + esc(input.value) + '”.</li>';
    list.hidden = false; input.setAttribute('aria-expanded', true);
    input.setAttribute('aria-activedescendant', sel > -1 ? 'r0' : '');
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function move(d) {
    if (!shown.length) return;
    sel = (sel + d + shown.length) % shown.length;
    $$('li', list).forEach(function (li, i) { li.setAttribute('aria-selected', i === sel); if (i === sel) li.scrollIntoView({ block: 'nearest' }); });
    input.setAttribute('aria-activedescendant', 'r' + sel);
  }
  if (input) {
    input.addEventListener('input', render);
    input.addEventListener('focus', render);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter' && sel > -1) { e.preventDefault(); location.href = ROOT + shown[sel][2]; }
      else if (e.key === 'Escape') { list.hidden = true; input.setAttribute('aria-expanded', false); }
    });
    doc.addEventListener('click', function (e) { if (!e.target.closest('.search')) { list.hidden = true; input.setAttribute('aria-expanded', false); } });
  }
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setDrawer(false);
    if (e.key === '/' && input && !/^(INPUT|TEXTAREA|SELECT)$/.test(doc.activeElement.tagName)) { e.preventDefault(); input.focus(); }
  });

  /* ---- Filtros de página (tokens, ícones) */
  $$('[data-filter]').forEach(function (f) {
    var scope = $(f.dataset.filter), empty = $('.empty', scope);
    function run() {
      var v = norm(f.value.trim()), layer = (($('.chip[aria-pressed=true][data-layer]', scope) || {}).dataset || {}).layer || '', any = false;
      $$('[data-group]', scope).forEach(function (g) {
        var okLayer = !layer || g.dataset.group === layer, n = 0;
        $$('[data-q]', g).forEach(function (it) { var ok = okLayer && (!v || it.dataset.q.indexOf(v) > -1); it.style.display = ok ? '' : 'none'; if (ok) n++; });
        g.style.display = n ? '' : 'none'; if (n) any = true;
      });
      if (empty) empty.style.display = any ? 'none' : 'block';
    }
    f.addEventListener('input', run);
    $$('.chip[data-layer]', scope).forEach(function (c) {
      c.addEventListener('click', function () { $$('.chip[data-layer]', scope).forEach(function (x) { x.setAttribute('aria-pressed', x === c); }); run(); });
    });
    var q = new URLSearchParams(location.search).get('q'); if (q) { f.value = q; run(); }
  });

  /* ---- Palco do componente: altura real do exemplo e largura de celular */
  addEventListener('message', function (e) {
    var d = e.data; if (!d || d.soma !== 'h') return;
    var f = $('iframe[data-n="' + d.n + '"]'); if (f && d.h > 40) f.style.height = Math.min(d.h, 2600) + 'px';
  });
  $$('.seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      var st = b.closest('.stage');
      $$('.seg button', st).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      st.classList.toggle('phone', b.dataset.w === 'phone');
    });
  });

  /* ---- Nesta página: destaque da seção visível */
  var tocLinks = {}; $$('.toc a').forEach(function (a) { tocLinks[decodeURIComponent(a.hash.slice(1))] = a; });
  if (Object.keys(tocLinks).length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var a = tocLinks[en.target.id]; if (!a) return;
        $$('.toc a.on').forEach(function (x) { x.classList.remove('on'); }); a.classList.add('on');
      });
    }, { rootMargin: '-15% 0px -75% 0px' });
    Object.keys(tocLinks).forEach(function (id) { var el = doc.getElementById(id); if (el) io.observe(el); });
  }
})();
