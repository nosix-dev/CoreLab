/* CoreLab — documentation automatique des commandes (à mettre sur le site).
 *
 * Utilisation dans ta page docs :
 *   <div id="auto-docs"></div>
 *   <script src="/docs-auto.js"></script>
 *
 * Le script lit https://<ton-bot>/docs : la liste se met à jour toute seule dès que tu ajoutes,
 * modifies ou retires une commande dans le bot (aucune modification du site nécessaire).
 */
(function () {
  // ⚠️ Remplace par l'adresse publique de ton bot (la même que celle utilisée pour /changelog)
  var BOT_URL = 'https://corelab-bot.onrender.com';
  var ACCENT = '#E8510D';

  var root = document.getElementById('auto-docs');
  if (!root) return;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var css = document.createElement('style');
  css.textContent =
    '#auto-docs{font-family:inherit;color:inherit}' +
    '#auto-docs .ad-search{width:100%;padding:10px 14px;margin:0 0 16px;border-radius:10px;border:1px solid #3a3d45;background:transparent;color:inherit;font-size:15px;box-sizing:border-box}' +
    '#auto-docs .ad-cat{margin:24px 0 8px;font-size:18px;font-weight:700}' +
    '#auto-docs .ad-cmd{border:1px solid #3a3d45;border-radius:12px;padding:12px 14px;margin:8px 0}' +
    '#auto-docs .ad-name{font-family:ui-monospace,monospace;font-weight:700;color:' + ACCENT + '}' +
    '#auto-docs .ad-desc{margin:4px 0 0;opacity:.85}' +
    '#auto-docs .ad-sub{margin:8px 0 0 14px;padding-left:12px;border-left:2px solid ' + ACCENT + '}' +
    '#auto-docs .ad-opt{font-size:13px;opacity:.8;margin:2px 0 0 14px}' +
    '#auto-docs .ad-tag{display:inline-block;font-size:11px;padding:1px 8px;border-radius:99px;border:1px solid #3a3d45;margin-left:6px;opacity:.85}' +
    '#auto-docs .ad-meta{font-size:13px;opacity:.7;margin:0 0 12px}';
  document.head.appendChild(css);

  function optionsHtml(opts) {
    return (opts || []).map(function (o) {
      return '<div class="ad-opt"><code>' + esc(o.name) + '</code> (' + esc(o.type) + (o.required ? ', obligatoire' : '') + ') — ' + esc(o.description) + '</div>';
    }).join('');
  }

  function subHtml(subs, prefix) {
    return (subs || []).map(function (s) {
      var full = prefix + ' ' + s.name;
      return '<div class="ad-sub"><span class="ad-name">/' + esc(full) + '</span><p class="ad-desc">' + esc(s.description) + '</p>' +
        optionsHtml(s.options) + subHtml(s.subcommands, full) + '</div>';
    }).join('');
  }

  function cmdHtml(c) {
    var perms = (c.permissions || []).map(function (p) { return '<span class="ad-tag">' + esc(p) + '</span>'; }).join('');
    return '<div class="ad-cmd" data-search="' + esc((c.name + ' ' + c.description).toLowerCase()) + '">' +
      '<span class="ad-name">/' + esc(c.name) + '</span>' + perms +
      '<p class="ad-desc">' + esc(c.description) + '</p>' + optionsHtml(c.options) + subHtml(c.subcommands, c.name) + '</div>';
  }

  function render(d) {
    var html = '<input class="ad-search" type="search" placeholder="Rechercher une commande…">' +
      '<p class="ad-meta">' + esc(d.totalCommands) + ' commandes' + (d.version ? ' • version ' + esc(d.version) : '') + '</p>';
    (d.categories || []).forEach(function (cat) {
      var list = d.commands.filter(function (c) { return c.category.key === cat.key; });
      if (!list.length) return;
      html += '<div class="ad-catblock"><h3 class="ad-cat">' + esc(cat.emoji) + ' ' + esc(cat.label) + ' (' + list.length + ')</h3>' + list.map(cmdHtml).join('') + '</div>';
    });
    root.innerHTML = html;
    var input = root.querySelector('.ad-search');
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      root.querySelectorAll('.ad-cmd').forEach(function (el) {
        el.style.display = !q || el.getAttribute('data-search').indexOf(q) !== -1 ? '' : 'none';
      });
      root.querySelectorAll('.ad-catblock').forEach(function (b) {
        b.style.display = Array.prototype.some.call(b.querySelectorAll('.ad-cmd'), function (el) { return el.style.display !== 'none'; }) ? '' : 'none';
      });
    });
  }

  function load() {
    fetch(BOT_URL.replace(/\/$/, '') + '/docs')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(render)
      .catch(function () {
        if (!root.innerHTML) root.textContent = 'Documentation indisponible pour le moment, réessaie dans un instant.';
      });
  }
  load();
  setInterval(load, 5 * 60 * 1000); // se met à jour toute seule
})();
