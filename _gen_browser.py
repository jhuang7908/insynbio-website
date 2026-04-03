"""Generate component-browser.html with card grid layout grouped by category."""
import json, pathlib

data = json.loads(pathlib.Path('component_library_public.json').read_text(encoding='utf-8'))
data_js = json.dumps(data, ensure_ascii=False, separators=(',',':'))

html = (
r"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="InSynBio ACTES Component Library — 237 curated CAR engineering components across 12 categories.">
  <meta name="robots" content="noindex">
  <title>Component Library | InSynBio</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">
  <style>
    :root{--primary:#0d9488;--primary-dark:#0f766e;--text:#111827;--text-muted:#4b5563;--border:#e5e7eb;--bg:#fff;--bg-alt:#f9fafb;}
    *{box-sizing:border-box;}
    body{margin:0;font-family:'Inter',-apple-system,sans-serif;font-size:15px;line-height:1.6;color:var(--text);background:var(--bg-alt);-webkit-font-smoothing:antialiased;}

    .top-header{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;background:rgba(255,255,255,0.93);backdrop-filter:blur(12px);border-bottom:1px solid rgba(0,0,0,0.05);flex-wrap:wrap;gap:12px;position:sticky;top:0;z-index:1000;}
    .brand a{text-decoration:none;color:inherit;display:flex;align-items:center;gap:10px;}
    .slogan{font-size:13px;color:var(--text-muted);padding-left:14px;border-left:1px solid var(--border);white-space:nowrap;font-weight:500;letter-spacing:.02em;}
    .top-header-nav{display:flex;align-items:center;gap:6px;}
    .top-header-nav a{padding:8px 16px;font-size:14px;color:var(--text-muted);text-decoration:none;border-radius:20px;transition:all .2s;font-weight:500;}
    .top-header-nav a:hover{color:var(--primary);background:rgba(13,148,136,.06);}
    .nav-dropdown{position:relative;}
    .nav-dropdown>a::after{content:' ▾';font-size:10px;opacity:.6;margin-left:4px;}
    .nav-dropdown .dropdown-menu{position:absolute;top:100%;left:50%;transform:translateX(-50%) translateY(10px);min-width:220px;padding:8px;background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;box-shadow:0 10px 40px -10px rgba(0,0,0,.12);opacity:0;visibility:hidden;transition:all .2s cubic-bezier(.16,1,.3,1);z-index:100;margin-top:8px;}
    .nav-dropdown:hover .dropdown-menu,.nav-dropdown:focus-within .dropdown-menu{opacity:1;visibility:visible;transform:translateX(-50%) translateY(0);}
    .nav-dropdown .dropdown-menu a{display:block;padding:12px 16px;color:var(--text);text-decoration:none;line-height:1.4;border-radius:8px;text-align:left;}
    .nav-dropdown .dropdown-menu a:hover{background:rgba(13,148,136,.06);}
    .menu-title{display:block;font-weight:600;font-size:14px;}
    .menu-desc{display:block;font-size:12px;color:var(--text-muted);margin-top:2px;}

    .page-header{background:linear-gradient(135deg,#f0fdfa 0%,#fff 80%);border-bottom:1px solid rgba(13,148,136,.1);padding:48px 40px 36px;}
    .page-header h1{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:700;margin:0 0 10px;letter-spacing:-.02em;color:#111827;}
    .page-header p{color:var(--text-muted);font-size:17px;margin:0 0 20px;max-width:680px;line-height:1.65;}
    .back-link{font-size:14px;color:var(--primary);text-decoration:none;font-weight:500;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;}
    .back-link:hover{color:var(--primary-dark);}
    .tier-legend{display:flex;gap:24px;flex-wrap:wrap;margin-top:4px;}
    .tier-legend-item{font-size:13px;color:var(--text-muted);display:flex;align-items:center;gap:8px;}

    .controls{background:#fff;border-bottom:1px solid var(--border);padding:18px 40px;display:flex;gap:12px;align-items:center;flex-wrap:wrap;position:sticky;top:65px;z-index:500;}
    .search-wrap{position:relative;flex:1;min-width:200px;max-width:360px;}
    .search-wrap input{width:100%;padding:10px 16px 10px 38px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;transition:border-color .2s,box-shadow .2s;background:var(--bg-alt);}
    .search-wrap input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px rgba(13,148,136,.12);background:#fff;}
    .search-wrap .si{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none;}
    .ac-list{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:500;max-height:280px;overflow-y:auto;display:none;}
    .ac-list.open{display:block;}
    .ac-item{padding:9px 14px;font-size:13.5px;cursor:pointer;color:var(--text);border-bottom:1px solid #f3f4f6;display:flex;align-items:baseline;gap:8px;}
    .ac-item:last-child{border-bottom:none;}
    .ac-item:hover,.ac-item.active{background:#f0fdfa;color:var(--primary-dark);}
    .ac-item .ac-sub{font-size:11px;color:#9ca3af;font-weight:400;flex-shrink:0;}
    .filter-sel{padding:10px 14px;border:1px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;background:var(--bg-alt);cursor:pointer;color:var(--text);transition:border-color .2s;}
    .filter-sel:focus{outline:none;border-color:var(--primary);}
    .stats-chip{margin-left:auto;font-size:13px;color:var(--text-muted);font-weight:600;white-space:nowrap;padding:6px 14px;background:var(--bg-alt);border-radius:20px;border:1px solid var(--border);}
    .clear-btn{padding:10px 16px;font-size:13px;font-weight:500;color:var(--primary);background:none;border:1px solid rgba(13,148,136,.3);border-radius:8px;cursor:pointer;transition:all .2s;display:none;}
    .clear-btn:hover{background:rgba(13,148,136,.06);}
    .clear-btn.visible{display:block;}

    .grid-container{max-width:1280px;margin:0 auto;padding:32px 40px 80px;}
    .cat-section{margin-bottom:40px;}
    .cat-header{display:flex;align-items:center;gap:12px;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid var(--border);}
    .cat-header h2{font-family:'Cormorant Garamond',serif;font-size:26px;font-weight:700;margin:0;color:#111827;letter-spacing:-.01em;}
    .cat-header .cat-count{font-size:12px;font-weight:700;color:var(--primary);background:rgba(13,148,136,.08);padding:2px 10px;border-radius:20px;}

    .card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px;}
    .comp-card{background:#fff;border:1px solid var(--border);border-radius:10px;padding:16px;cursor:pointer;transition:all .2s;position:relative;}
    .comp-card:hover{border-color:rgba(13,148,136,.4);box-shadow:0 4px 16px rgba(13,148,136,.08);transform:translateY(-1px);}
    .comp-card.expanded{border-color:var(--primary);box-shadow:0 4px 20px rgba(13,148,136,.12);}
    .comp-card .cc-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
    .comp-card .cc-name{font-size:14px;font-weight:600;color:#111827;line-height:1.35;flex:1;}
    .comp-card .cc-gene{font-size:11px;color:#9ca3af;font-weight:400;}
    .comp-card .cc-meta{display:flex;gap:6px;align-items:center;margin-top:8px;flex-wrap:wrap;}
    .comp-card .cc-role{font-size:12.5px;color:var(--text-muted);margin-top:6px;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
    .comp-card .cc-prods{font-size:11.5px;margin-top:6px;line-height:1.4;}
    .comp-card .cc-prods .prod-approved{color:#0f766e;font-weight:600;}
    .comp-card .cc-prods .prod-trial{color:#1d4ed8;}

    .comp-card .cc-detail{display:none;margin-top:14px;padding-top:12px;border-top:1px solid var(--border);}
    .comp-card.expanded .cc-detail{display:block;}
    .cc-detail .collapse-bar{height:3px;background:#e5f7f5;border-radius:2px;margin-bottom:12px;overflow:hidden;}
    .cc-detail .collapse-progress{height:100%;width:100%;background:var(--primary);border-radius:2px;transition:none;}
    .cc-detail .detail-grid{display:grid;grid-template-columns:1fr;gap:10px;}
    .cc-detail .dl{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--primary);margin-bottom:3px;}
    .cc-detail .dv{font-size:13px;color:#374151;line-height:1.55;}
    .cc-detail .dv a{color:var(--primary);font-weight:500;text-decoration:none;}
    .cc-detail .dv a:hover{text-decoration:underline;}

    .tier{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.06em;padding:2px 8px;border-radius:12px;}
    .tier-T1{background:rgba(13,148,136,.12);color:#0f766e;}
    .tier-T2{background:rgba(59,130,246,.12);color:#1d4ed8;}
    .tier-T3{background:rgba(107,114,128,.1);color:#4b5563;}
    .chip{display:inline-block;font-size:10px;font-weight:600;padding:1px 7px;border-radius:8px;}
    .chip-cart{background:#e0f2fe;color:#075985;}
    .chip-carnk{background:#fce7f3;color:#9d174d;}
    .chip-carm{background:#fef3c7;color:#92400e;}
    mark{background:rgba(13,148,136,.18);color:#065f46;border-radius:2px;padding:0 1px;}
    .empty-state{text-align:center;padding:80px 20px;color:var(--text-muted);}
    .empty-state p{margin:0;font-size:16px;}
    .site-footer{padding:28px 40px;border-top:1px solid var(--border);font-size:13px;color:#9ca3af;text-align:center;background:#fff;}
    .site-footer a{color:#6b7280;text-decoration:none;}
    .site-footer a:hover{color:var(--primary);}

    @media(max-width:768px){
      .top-header{padding:12px 16px;}
      .page-header{padding:28px 16px 24px;}
      .page-header h1{font-size:28px;}
      .controls{padding:14px 16px;top:52px;}
      .grid-container{padding:20px 16px 60px;}
      .card-grid{grid-template-columns:1fr 1fr;gap:10px;}
      .top-header-nav{display:none;}
    }
    @media(max-width:480px){
      .card-grid{grid-template-columns:1fr;}
    }
  </style>
</head>
<body>
<header class="top-header">
  <div class="brand">
    <a href="index.html">
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#0d9488"/><stop offset="1" stop-color="#2dd4bf"/></linearGradient></defs><path d="M7 6L16 18V28" stroke="url(#lg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 6L16 18" stroke="url(#lg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="6" r="2" fill="#0f766e"/><circle cx="25" cy="6" r="2" fill="#0f766e"/><circle cx="16" cy="18" r="2" fill="white" stroke="#0d9488" stroke-width="1.5"/></svg>
      <span style="font-family:'Cormorant Garamond',serif;font-weight:700;font-size:24px;color:#1f2937;letter-spacing:-.02em;">In<span style="color:#0d9488;">Syn</span>Bio</span>
    </a>
    <span class="slogan">AI for Life Sciences</span>
  </div>
  <nav class="top-header-nav">
    <a href="index.html">Home</a>
    <a href="index.html#about">About Us</a>
    <div class="nav-dropdown" tabindex="0">
      <a href="index.html#services">Services</a>
      <div class="dropdown-menu">
        <a href="InSynBio_Antibody_Developability_Assessment_Page.html">
          <span class="menu-title">Antibody</span>
          <span class="menu-desc">Structure-based Development</span>
        </a>
        <a href="InSynBio_CART_Design_Page.html">
          <span class="menu-title">CAR-T</span>
          <span class="menu-desc">Smart CAR-T Design</span>
        </a>
        <a href="InSynBio_Bispecific_Antibody_Design_Page.html">
          <span class="menu-title">Bispecific</span>
          <span class="menu-desc">Multispecific Engineering</span>
        </a>
      </div>
    </div>
    <a href="index.html#case-studies">Case Studies</a>
    <a href="InSynBio_OurTech.html">Our Tech</a>
    <a href="index.html#workflow">Workflow</a>
    <a href="index.html#faq">FAQ</a>
    <a href="index.html#contact">Contact Us</a>
  </nav>
</header>

<div class="page-header">
  <a href="InSynBio_CART_Design_Page.html" class="back-link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
    Smart CAR-T Design
  </a>
  <h1>ACTES Component Library</h1>
  <p>Browse <strong id="total-count">237</strong> curated CAR engineering components across 12 categories. Each component is assigned a regulatory evidence tier based on published clinical data.</p>
  <div class="tier-legend">
    <div class="tier-legend-item"><span class="tier tier-T1">T1</span> FDA-approved products</div>
    <div class="tier-legend-item"><span class="tier tier-T2">T2</span> Active clinical trials</div>
    <div class="tier-legend-item"><span class="tier tier-T3">T3</span> Preclinical / frontier</div>
  </div>
</div>

<div class="controls">
  <div class="search-wrap">
    <svg class="si" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" id="search-input" placeholder="Search component, product, indication&#x2026;" autocomplete="off" spellcheck="false">
    <div class="ac-list" id="ac-list"></div>
  </div>
  <select class="filter-sel" id="cat-filter"><option value="">All Categories</option></select>
  <select class="filter-sel" id="tier-filter">
    <option value="">All Tiers</option>
    <option value="T1">T1 &#x2014; Approved</option>
    <option value="T2">T2 &#x2014; Clinical</option>
    <option value="T3">T3 &#x2014; Preclinical</option>
  </select>
  <select class="filter-sel" id="cell-filter">
    <option value="">All Cell Types</option>
    <option value="CAR-T">CAR-T</option>
    <option value="CAR-NK">CAR-NK</option>
    <option value="CAR-M">CAR-M</option>
    <option value="CAR-Treg">CAR-Treg</option>
    <option value="γδ T">γδ T</option>
    <option value="iPSC-CAR">iPSC-CAR</option>
    <option value="In Vivo CAR">In Vivo CAR</option>
    <option value="Universal">Universal</option>
  </select>
  <button class="clear-btn" id="clear-btn">&#x2715; Clear</button>
  <span class="stats-chip" id="stats-chip"></span>
</div>

<div class="grid-container" id="grid-container"></div>

<div class="empty-state" id="empty-state" style="display:none;">
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom:12px;opacity:.3;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  <p>No components match your filters.</p>
  <p style="margin-top:8px;font-size:14px;"><button id="clear-btn2" style="background:none;border:none;color:var(--primary);font-weight:600;cursor:pointer;font-size:14px;">Clear filters</button></p>
</div>

<footer class="site-footer">
  <p>&copy; 2026 InSynBio Limited. ACTES Component Library.</p>
  <p style="margin-top:4px;"><a href="index.html">Home</a> &middot; <a href="InSynBio_CART_Design_Page.html">Smart CAR-T</a> &middot; <a href="InSynBio_CART_Design_Page.html#submit">Contact</a></p>
</footer>

<script>
(function(){
var DATA="""
    + "INLINEDATA"
    + r""";

var expandedId=null;
var collapseTimer=null;
var searchInput=document.getElementById('search-input');
var acList=document.getElementById('ac-list');
var acIdx=-1;

var CAT_ORDER=['Binder','Hinge','Transmembrane','Costimulatory','Primary Signaling',
  'Armored Payload','Safety Switch','Logic Gate','Regulatory Element',
  'Signal Peptide & Linker','Engineering Module','Delivery Vector'];

function scheduleCollapse(){
  clearTimeout(collapseTimer);
  collapseTimer=setTimeout(function(){
    if(expandedId!==null){expandedId=null;render();}
  },3000);
}
function cancelCollapse(){clearTimeout(collapseTimer);}

var cats=Array.from(new Set(DATA.elements.map(function(e){return e.category;}))).sort();
var catSel=document.getElementById('cat-filter');
cats.forEach(function(c){var o=document.createElement('option');o.value=c;o.textContent=c;catSel.appendChild(o);});
document.getElementById('total-count').textContent=DATA.metadata.total_elements;

/* autocomplete */
function showAc(q){
  acList.innerHTML='';acIdx=-1;
  if(!q){acList.classList.remove('open');return;}
  var ql=q.toLowerCase();
  var hits=DATA.elements.filter(function(e){return e.name.toLowerCase().includes(ql)||e.category.toLowerCase().includes(ql)||(e.gene_symbol||'').toLowerCase().includes(ql)||(e.id||'').toLowerCase().includes(ql);}).slice(0,10);
  if(!hits.length){acList.classList.remove('open');return;}
  var re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
  hits.forEach(function(h){
    var div=document.createElement('div');
    div.className='ac-item';
    var hi=esc(h.name).replace(re,'<mark>$1</mark>');
    div.innerHTML='<span>'+hi+'</span><span class="ac-sub">'+esc(h.category)+'</span>';
    div.addEventListener('mousedown',function(e){e.preventDefault();searchInput.value=h.name;acList.classList.remove('open');render();});
    acList.appendChild(div);
  });
  acList.classList.add('open');
}
searchInput.addEventListener('input',function(){showAc(this.value.trim());render();});
searchInput.addEventListener('keydown',function(e){
  var items=acList.querySelectorAll('.ac-item');
  if(!items.length)return;
  if(e.key==='ArrowDown'){e.preventDefault();acIdx=Math.min(acIdx+1,items.length-1);items.forEach(function(it,i){it.classList.toggle('active',i===acIdx);});}
  else if(e.key==='ArrowUp'){e.preventDefault();acIdx=Math.max(acIdx-1,0);items.forEach(function(it,i){it.classList.toggle('active',i===acIdx);});}
  else if(e.key==='Enter'&&acIdx>=0){var ch=items[acIdx];if(ch){searchInput.value=ch.querySelector('span').textContent;acList.classList.remove('open');render();}}
  else if(e.key==='Escape'){acList.classList.remove('open');}
});
document.addEventListener('click',function(e){if(!e.target.closest('.search-wrap'))acList.classList.remove('open');});

function getF(){return{search:searchInput.value.trim().toLowerCase(),cat:document.getElementById('cat-filter').value,tier:document.getElementById('tier-filter').value,cell:document.getElementById('cell-filter').value};}
function filterEls(els,f){
  return els.filter(function(e){
    if(f.cat&&e.category!==f.cat)return false;
    if(f.tier&&e.regulatory_tier!==f.tier)return false;
    if(f.cell&&!(e.cell_types||[]).includes(f.cell))return false;
    if(f.search){
      var hay=[e.name,e.category,e.subcategory,e.role,e.design_notes,e.source,(e.approval_products||[]).join(' '),(e.clinical_trials||[]).join(' '),(e.indications||[]).join(' '),e.gene_symbol,e.uniprot_id,e.id].join(' ').toLowerCase();
      if(!hay.includes(f.search))return false;
    }
    return true;
  });
}

function render(){
  clearTimeout(collapseTimer);
  var f=getF();
  var filtered=filterEls(DATA.elements,f);
  var chip=document.getElementById('stats-chip');
  chip.textContent=filtered.length+' / '+DATA.elements.length+' elements';
  chip.style.color=filtered.length<DATA.elements.length?'var(--primary-dark)':'var(--text-muted)';
  var anyF=f.search||f.cat||f.tier||f.cell;
  document.getElementById('clear-btn').classList.toggle('visible',!!anyF);

  var container=document.getElementById('grid-container');
  container.innerHTML='';

  if(!filtered.length){document.getElementById('empty-state').style.display='';return;}
  document.getElementById('empty-state').style.display='none';

  /* group by category */
  var groups={};
  filtered.forEach(function(e){
    if(!groups[e.category])groups[e.category]=[];
    groups[e.category].push(e);
  });

  /* sort groups by CAT_ORDER, then alphabetical fallback */
  var catKeys=Object.keys(groups).sort(function(a,b){
    var ia=CAT_ORDER.indexOf(a),ib=CAT_ORDER.indexOf(b);
    if(ia===-1)ia=999;if(ib===-1)ib=999;
    return ia-ib||(a<b?-1:a>b?1:0);
  });

  catKeys.forEach(function(cat){
    var sec=document.createElement('div');sec.className='cat-section';
    var hdr=document.createElement('div');hdr.className='cat-header';
    hdr.innerHTML='<h2>'+esc(cat)+'</h2><span class="cat-count">'+groups[cat].length+'</span>';
    sec.appendChild(hdr);

    var grid=document.createElement('div');grid.className='card-grid';

    /* sort within group: T1 first, then T2, T3, then by name */
    groups[cat].sort(function(a,b){
      var ta={'T1':0,'T2':1,'T3':2};
      var d=(ta[a.regulatory_tier]||3)-(ta[b.regulatory_tier]||3);
      if(d)return d;
      return(a.name||'').localeCompare(b.name||'');
    });

    groups[cat].forEach(function(e){
      var card=document.createElement('div');card.className='comp-card';
      if(expandedId===e.id)card.classList.add('expanded');
      var prodsHtml=buildProds(e);
      card.innerHTML=
        '<div class="cc-top"><div class="cc-name">'+esc(e.name)+(e.gene_symbol?'<br><span class="cc-gene">'+esc(e.gene_symbol)+'</span>':'')+'</div></div>'
        +'<div class="cc-meta"><span class="tier tier-'+esc(e.regulatory_tier)+'">'+esc(e.regulatory_tier)+'</span>'+buildChips(e.cell_types)+'</div>'
        +(e.role?'<div class="cc-role">'+esc(e.role)+'</div>':'')
        +(prodsHtml?'<div class="cc-prods">'+prodsHtml+'</div>':'')
        +'<div class="cc-detail"><div class="collapse-bar"><div class="collapse-progress" id="cb-'+esc(e.id)+'"></div></div><div class="detail-grid">'+buildDetail(e)+'</div></div>';

      card.addEventListener('click',function(){
        cancelCollapse();
        expandedId=(expandedId===e.id)?null:e.id;
        render();
      });

      if(expandedId===e.id){
        card.addEventListener('mouseleave',function(){scheduleCollapse();var bar=document.getElementById('cb-'+e.id);if(bar){bar.style.transition='width 3s linear';bar.style.width='0%';}});
        card.addEventListener('mouseenter',function(){cancelCollapse();var bar=document.getElementById('cb-'+e.id);if(bar){bar.style.transition='none';bar.style.width='100%';}});
      }

      grid.appendChild(card);
    });
    sec.appendChild(grid);
    container.appendChild(sec);
  });
}

function buildDetail(e){
  var b=[];
  if(e.sequence_origin)b.push(dblock('Sequence Origin',linkifySource(esc(e.sequence_origin))));
  var dbLinks=[];
  if(e.uniprot_id)dbLinks.push('<a href="https://www.uniprot.org/uniprot/'+esc(e.uniprot_id)+'" target="_blank" rel="noopener">UniProt:'+esc(e.uniprot_id)+'</a>');
  if(e.target_uniprot)dbLinks.push('<a href="https://www.uniprot.org/uniprot/'+esc(e.target_uniprot)+'" target="_blank" rel="noopener">Target:'+esc(e.target_uniprot)+'</a>');
  if(e.ncbi_gene_id)dbLinks.push('<a href="https://www.ncbi.nlm.nih.gov/gene/'+esc(String(e.ncbi_gene_id))+'" target="_blank" rel="noopener">NCBI Gene:'+esc(String(e.ncbi_gene_id))+'</a>');
  if(dbLinks.length)b.push(dblock('Database',dbLinks.join(' &nbsp;|&nbsp; ')));
  if(e.clinical_refs&&e.clinical_refs.length){var clinks=e.clinical_refs.map(function(n){return'<a href="https://clinicaltrials.gov/ct2/show/'+esc(n)+'" target="_blank" rel="noopener">'+esc(n)+'</a>';});b.push(dblock('Clinical Trials',clinks.join(', ')));}
  if(e.length_aa)b.push(dblock('Length',esc(String(e.length_aa))+' aa'));
  if(e.design_notes)b.push(dblock('Design Notes',esc(e.design_notes)));
  if(e.tier_justification)b.push(dblock('Evidence',esc(e.tier_justification)));
  if(e.mutation_note)b.push(dblock('Variant Note',esc(e.mutation_note)));
  var inds=(e.indications||[]).join(', ');if(inds)b.push(dblock('Indications',esc(inds)));
  return b.join('');
}
function linkifySource(s){
  s=s.replace(/\bPDB\s+([0-9A-Z]{4})\b/g,'PDB <a href="https://www.rcsb.org/structure/$1" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/\b([PQOA][0-9][A-Z0-9]{3}[0-9])\b/g,'<a href="https://www.uniprot.org/uniprot/$1" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/\b(US\d{7,}[AB]\d?)\b/g,'<a href="https://patents.google.com/patent/$1" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/\b(WO\d{4}[\d\/]+[A-Z]\d?)\b/g,'<a href="https://patents.google.com/patent/$1" target="_blank" rel="noopener">$1</a>');
  s=s.replace(/\bNCT(\d{8})\b/g,'<a href="https://clinicaltrials.gov/ct2/show/NCT$1" target="_blank" rel="noopener">NCT$1</a>');
  return s;
}
function dblock(l,v){return'<div><div class="dl">'+l+'</div><div class="dv">'+v+'</div></div>';}
function buildChips(ct){if(!ct||!ct.length)return'';return ct.map(function(c){var cl=c==='CAR-T'?'chip-cart':c==='CAR-NK'?'chip-carnk':'chip-carm';return'<span class="chip '+cl+'">'+esc(c)+'</span>';}).join('');}
function buildProds(e){var p=[];(e.approval_products||[]).forEach(function(x){p.push('<span class="prod-approved">'+esc(x)+'</span>');});(e.clinical_trials||[]).forEach(function(x){p.push('<span class="prod-trial">'+esc(x)+'</span>');});return p.join(' &middot; ');}
function esc(s){if(s==null)return'';return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

['cat-filter','tier-filter','cell-filter'].forEach(function(id){document.getElementById(id).addEventListener('change',render);});
function clearAll(){searchInput.value='';document.getElementById('cat-filter').value='';document.getElementById('tier-filter').value='';document.getElementById('cell-filter').value='';acList.classList.remove('open');expandedId=null;render();}
document.getElementById('clear-btn').addEventListener('click',clearAll);
document.getElementById('clear-btn2').addEventListener('click',clearAll);
render();
})();
</script>
</body>
</html>"""
)

html = html.replace("INLINEDATA", data_js)

out = pathlib.Path('component-browser.html')
out.write_text(html, encoding='utf-8')
print('Written', out, round(out.stat().st_size/1024), 'KB')
