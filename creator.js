(() => {
  'use strict';

  // ===================== LEVEL DATA MODEL =====================
  // Level v1 format
  // {
  //   id, name, scroll: 'vertical'|'side', cols, rows, cell, speed,
  //   song: filename|null (null = player chooses), songLocked: bool,
  //   objects: [{ t:'block'|'spike'|'coin'|'key'|'portal'|'gate'|'powerup'|'speed'|'invert', x, y, w, h, move, type, fast }],
  //   author
  // }

  const OBJ_DEFS = {
    block:   { label: 'Block',   color: '#ff00ff', size: [1, 1], moveable: true },
    spike:   { label: 'Spike',   color: '#ff4444', size: [1, 1], moveable: true },
    coin:    { label: 'Coin',    color: '#ffff00', size: [1, 1], moveable: true },
    key:     { label: 'Key',     color: '#ffaa00', size: [1, 1], moveable: true },
    portal:  { label: 'Portal',  color: '#00ffff', size: [1, 2], moveable: true },
    gate:    { label: 'Gate',    color: '#ffffff', size: [2, 1], moveable: true },
    powerup: { label: 'Power',   color: '#00ff66', size: [1, 1], moveable: true },
    speed:   { label: 'Speed',   color: '#ff66ff', size: [1, 1], moveable: true },
    invert:  { label: 'Invert',  color: '#aa66ff', size: [1, 1], moveable: true }
  };

  function defaultLevel() {
    return {
      id: 'lv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: 'My Level',
      scroll: 'vertical',
      cols: 20,
      rows: 60,
      cell: 20,
      speed: 3,
      song: null,
      songLocked: false,
      objects: [
        { t: 'portal', x: 9, y: 56, w: 1, h: 2 },
        { t: 'key', x: 4, y: 20, w: 1, h: 1 },
        { t: 'gate', x: 8, y: 30, w: 2, h: 1 },
        { t: 'block', x: 3, y: 12, w: 2, h: 1 },
        { t: 'block', x: 14, y: 18, w: 2, h: 1 },
        { t: 'coin', x: 5, y: 15, w: 1, h: 1 },
        { t: 'coin', x: 10, y: 22, w: 1, h: 1 }
      ]
    };
  }

  function normalizeLevel(lv) {
    if (!lv) return null;
    const d = defaultLevel();
    const scroll = lv.scroll === 'side' ? 'side' : 'vertical';
    const out = {
      id: lv.id || d.id,
      name: lv.name || 'My Level',
      scroll,
      cols: Math.min(40, Math.max(10, lv.cols || 20)),
      rows: Math.min(500, Math.max(20, lv.rows || 60)),
      cell: Math.min(40, Math.max(10, lv.cell || 20)),
      speed: Math.min(8, Math.max(1, lv.speed || 3)),
      song: lv.song || null,
      songLocked: !!lv.songLocked,
      objects: (lv.objects || []).map(o => ({
        t: o.t, x: o.x, y: o.y, w: o.w || 1, h: o.h || 1,
        move: o.move || 'none', type: o.type || 'slowTime', fast: !!o.fast
      })),
      author: lv.author || 'Player'
    };
    // Ensure the level is at least one screen long on its scroll axis,
    // so playtest scroll range is never negative (which would auto-finish level 1).
    if (scroll === 'vertical') {
      out.rows = Math.max(out.rows, Math.ceil(600 / out.cell));
    } else {
      out.cols = Math.max(out.cols, Math.ceil(400 / out.cell));
    }
    return out;
  }

  function cloneLevel(lv) { return JSON.parse(JSON.stringify(lv)); }

  // ===================== STORAGE =====================
  const STORE_KEY = 'neonCreatorLevels';

  function loadAllLevels() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveAllLevels(list) {
    localStorage.setItem(STORE_KEY, JSON.stringify(list));
  }
  function saveLevel(lv) {
    const list = loadAllLevels().filter(x => x.id !== lv.id);
    list.unshift(cloneLevel(lv));
    saveAllLevels(list);
  }
  function deleteLevel(id) {
    saveAllLevels(loadAllLevels().filter(x => x.id !== id));
  }

  // ===================== STATE =====================
  let editor = {
    level: null,
    tool: 'place',       // place | erase | move
    selected: 'block',
    cell: 20,
    zoom: 1,
    viewX: 0, viewY: 0,  // world px offset of canvas top-left
    dragMode: null,
    dragStart: null,
    hoverCell: null,
    editing: false
  };

  let playState = null; // active custom-level play session
  let origSetPlayerOverride = null; // saved main-game pointer handler during playtest

  let els = {};
  let editorCtx = null;

  const $ = (id) => document.getElementById(id);

  function _t(k, v) {
    if (typeof NeonI18n === 'object' && NeonI18n.t) return NeonI18n.t(k, v);
    return k;
  }

  // ===================== EDITOR DOM =====================
  function injectStyles() {
    if ($('creatorStyle')) return;
    const st = document.createElement('style');
    st.id = 'creatorStyle';
    st.textContent = `
      #creatorOverlay {
        position: fixed; inset: 0; background: rgba(5,5,12,0.97); z-index: 90;
        display: none; flex-direction: column; color: #eee;
        font-family: 'Courier New', Courier, monospace;
      }
      #creatorOverlay.open { display: flex; }
      #creatorTopBar { display: flex; align-items: center; gap: 8px; padding: 8px 12px; background: #0d0d1a; border-bottom: 1px solid #222; flex-wrap: wrap; }
      #creatorTopBar input, #creatorTopBar select {
        background: #0d0d1a; color: #00ffff; border: 1px solid #00ffff66; padding: 4px 8px; border-radius: 5px; font-size: 13px; outline: none;
      }
      #creatorTopBar button, #creatorPalette button, #creatorBottom button {
        background: rgba(0,255,255,0.08); color: #00ffff; border: 1px solid #00ffff88; border-radius: 6px;
        padding: 5px 10px; cursor: pointer; font-size: 13px; font-family: inherit;
      }
      #creatorTopBar button:hover, #creatorPalette button:hover, #creatorBottom button:hover { background: rgba(0,255,255,0.2); }
      #creatorTopBar .danger { border-color:#ff4444; color:#ff6b6b; background:rgba(255,68,68,0.08); }
      #creatorTopBar .primary { border-color:#00ff96; color:#00ff96; background:rgba(0,255,150,0.1); }
      #creatorBody { display: flex; flex: 1; min-height: 0; }
      #creatorPalette { width: 160px; padding: 10px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; border-right: 1px solid #222; background:#0a0a16; }
      #creatorPalette h4 { margin: 2px 0 4px; color:#888; font-size:12px; text-transform:uppercase; letter-spacing:1px; }
      #creatorPalette button { text-align: left; display:flex; align-items:center; gap:8px; }
      #creatorPalette button .swatch { width: 14px; height: 14px; border-radius: 3px; display:inline-block; box-shadow: 0 0 6px currentColor; }
      #creatorPalette button.active { background: rgba(0,255,255,0.28); border-color:#00ffff; box-shadow: 0 0 12px rgba(0,255,255,0.4); }
      #creatorPalette button.tool-active { border-color:#00ff96; color:#00ff96; background:rgba(0,255,150,0.15); }
      #creatorCanvasWrap { flex: 1; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; background: #07070f; }
      #creatorCanvas { background: #0d0d1a; border: 1px solid #00ffff44; box-shadow: 0 0 30px rgba(0,255,255,0.15); image-rendering: pixelated; }
      #creatorBottom { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #0d0d1a; border-top: 1px solid #222; font-size: 12px; color: #888; }
      #creatorBottom span.cellinfo { margin-left: auto; }
      #creatorPlayStatus { position: absolute; top: 8px; left: 8px; color: #00ff96; font-size: 13px; display:none; text-shadow: 0 0 8px #00ff96; }
      #creatorCollab { position: absolute; bottom: 8px; right: 8px; font-size: 12px; color: #ffaa00; display:none; text-shadow: 0 0 8px #ffaa00; }
      #creatorResult { position: fixed; inset: 0; background: rgba(5,5,12,0.92); z-index: 95; display: none; align-items: center; justify-content: center; font-family: 'Courier New', Courier, monospace; color: #eee; }
      #creatorResultBox { text-align: center; background: #0d0d1a; border: 2px solid #00ff9688; border-radius: 16px; padding: 28px 40px; box-shadow: 0 0 40px rgba(0,255,150,0.2); }
    `;
    document.head.appendChild(st);
  }

  function injectDom() {
    if ($('creatorOverlay')) return;
    const wrap = document.createElement('div');
    wrap.id = 'creatorOverlay';
    wrap.innerHTML = `
      <div id="creatorTopBar">
        <strong style="color:#00ffff; text-shadow:0 0 8px #00ffff;">🎨 ${'CREATOR'}</strong>
        <input id="creatorName" type="text" value="My Level" maxlength="30" style="width:140px;">
        <label style="font-size:12px; color:#888;">Song:
          <select id="creatorSong">
            <option value="">${'Player chooses'}</option>
            <option value="dimension.mp3">Dimension</option>
            <option value="sphere.mp3">Sphere</option>
            <option value="exoplanet.mp3">Exoplanet</option>
            <option value="field-of-hopes.mp3">Field of Hopes</option>
            <option value="fallen-down.mp3">Fallen Down</option>
            <option value="undertale-shop.mp3">Shop</option>
            <option value="a-cybers-world.mp3">A CYBER'S WORLD?</option>
            <option value="tv-world.mp3">TV World</option>
            <option value="megalovania.mp3">Megalovania</option>
          </select>
        </label>
        <label style="font-size:12px; color:#888;"><input type="checkbox" id="creatorSongLock"> Lock</label>
        <label style="font-size:12px; color:#888;">Scroll:
          <select id="creatorScroll">
            <option value="vertical">Vertical</option>
            <option value="side">Side</option>
          </select>
        </label>
        <label style="font-size:12px; color:#888;">Speed: <input id="creatorSpeed" type="number" min="1" max="8" value="3" style="width:50px;"></label>
        <label style="font-size:12px; color:#888;">Rows: <input id="creatorRows" type="number" min="20" max="500" value="60" style="width:60px;"></label>
        <span style="flex:1"></span>
        <button id="creatorPlay">▶ ${'Playtest'}</button>
        <button id="creatorSave" class="primary">💾 ${'Save'}</button>
        <button id="creatorUpload">⬆ ${'Upload'}</button>
        <button id="creatorLoad">📂 ${'My Levels'}</button>
        <button id="creatorCollabBtn">👥 ${'Collab'}</button>
        <button id="creatorExit" class="danger">✕ ${'Exit'}</button>
      </div>
      <div id="creatorBody">
        <div id="creatorPalette">
          <h4>Tools</h4>
          <button data-tool="place" class="tool-active">🖊 Place</button>
          <button data-tool="erase">🧽 Erase</button>
          <button data-tool="move">✋ Move</button>
          <h4>Objects</h4>
          <button data-obj="block"><span class="swatch" style="background:#ff00ff"></span>Block</button>
          <button data-obj="spike"><span class="swatch" style="background:#ff4444"></span>Spike</button>
          <button data-obj="coin"><span class="swatch" style="background:#ffff00"></span>Coin</button>
          <button data-obj="key"><span class="swatch" style="background:#ffaa00"></span>Key</button>
          <button data-obj="portal"><span class="swatch" style="background:#00ffff"></span>Portal</button>
          <button data-obj="gate"><span class="swatch" style="background:#ffffff"></span>Gate</button>
          <button data-obj="powerup"><span class="swatch" style="background:#00ff66"></span>Power</button>
          <button data-obj="speed"><span class="swatch" style="background:#ff66ff"></span>Speed</button>
          <button data-obj="invert"><span class="swatch" style="background:#aa66ff"></span>Invert</button>
          <h4>Level</h4>
          <button id="creatorNew">➕ New Level</button>
          <button id="creatorClear">🗑 Clear All</button>
        </div>
        <div id="creatorCanvasWrap">
          <div id="creatorPlayStatus">▶ PLAYTESTING — Esc to stop</div>
          <div id="creatorCollab">👥</div>
          <canvas id="creatorCanvas" width="400" height="600"></canvas>
        </div>
      </div>
      <div id="creatorBottom">
        <span>🖱 Place: click/drag · 🧽 Erase: erase tool or right-drag · 🖐 Move: click object then click target · Scroll wheel: zoom</span>
        <span class="cellinfo" id="creatorCellInfo"></span>
      </div>
    `;
    document.body.appendChild(wrap);

    const result = document.createElement('div');
    result.id = 'creatorResult';
    result.innerHTML = `
      <div id="creatorResultBox">
        <h2 id="creatorResultTitle" style="color:#00ff96; text-shadow:0 0 12px #00ff96; margin:0 0 8px;">LEVEL CLEARED!</h2>
        <div id="creatorResultScore" style="color:#ccc; font-size:16px; margin-bottom:18px;">Score: 0</div>
        <button id="creatorRetry" style="background:rgba(0,255,150,0.1);border:1px solid #00ff96;color:#00ff96;border-radius:6px;padding:8px 18px;margin:0 6px;cursor:pointer;">↻ Retry</button>
        <button id="creatorResultExit" style="background:rgba(255,68,68,0.1);border:1px solid #ff4444;color:#ff6b6b;border-radius:6px;padding:8px 18px;margin:0 6px;cursor:pointer;">✕ Exit to Editor</button>
      </div>
    `;
    document.body.appendChild(result);
    result.addEventListener('click', (e) => {
      const id = e.target.id;
      if (id === 'creatorRetry') {
        if (lastPlayedLevel) playLevel(lastPlayedLevel);
      } else if (id === 'creatorResultExit') {
        result.style.display = 'none';
        playState = null;
        openEditor(lastPlayedLevel);
      }
    });
  }

  // ===================== EDITOR HELPERS =====================
  function cellPx() { return editor.cell * editor.zoom; }
  function worldToCanvas(wx, wy) {
    return { x: (wx - editor.viewX) * editor.zoom, y: (wy - editor.viewY) * editor.zoom };
  }
  function canvasToWorld(cx, cy) {
    return { x: cx / editor.zoom + editor.viewX, y: cy / editor.zoom + editor.viewY };
  }

  function resizeCanvas(preserveZoom) {
    const c = els.creatorCanvas;
    const wrap = els.creatorCanvasWrap;
    if (!c || !wrap) return;
    const w = wrap.clientWidth - 24, h = wrap.clientHeight - 24;
    if (w <= 0 || h <= 0) return;
    const levelW = editor.level.cols * editor.cell;
    const levelH = editor.level.rows * editor.cell;
    // fit level height within wrap
    let zoom = Math.min(w / levelW, h / levelH, 1.5);
    zoom = Math.max(0.3, zoom);
    if (!preserveZoom) editor.zoom = zoom;
    c.width = Math.round(levelW * editor.zoom);
    c.height = Math.round(levelH * editor.zoom);
    editor.cell = editor.level.cell;
    editorCtx = c.getContext('2d');
  }

  function snap(wx, wy) {
    const c = editor.cell;
    return { x: Math.floor(wx / c) * c, y: Math.floor(wy / c) * c };
  }

  function objAtCell(gx, gy) {
    const lv = editor.level;
    for (let i = lv.objects.length - 1; i >= 0; i--) {
      const o = lv.objects[i];
      if (gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h) return i;
    }
    return -1;
  }

  function objCountAtCell(gx, gy) {
    let n = 0;
    editor.level.objects.forEach(o => {
      if (gx >= o.x && gx < o.x + o.w && gy >= o.y && gy < o.y + o.h) n++;
    });
    return n;
  }

  function placeObj(gx, gy, t, opts) {
    const lv = editor.level;
    if (gx < 0 || gy < 0 || gx >= lv.cols || gy >= lv.rows) return;
    const def = OBJ_DEFS[t];
    if (!def) return;
    const w = def.size[0], h = def.size[1];
    // portal should not be duplicated
    if (t === 'portal' && lv.objects.some(o => o.t === 'portal')) return;
    const o = { t, x: gx, y: gy, w, h, move: 'none', type: 'slowTime', fast: false };
    if (t === 'powerup') o.type = 'slowTime';
    if (t === 'speed') o.fast = true;
    if (opts && opts.move) o.move = opts.move;
    lv.objects.push(o);
    editor.dirty = true;
    renderEditor();
  }

  function eraseObjAt(gx, gy) {
    const i = objAtCell(gx, gy);
    if (i >= 0) { editor.level.objects.splice(i, 1); editor.dirty = true; renderEditor(); }
  }

  // ===================== EDITOR RENDER =====================
  function renderEditor() {
    if (!editorCtx || !editor.level) return;
    const c = els.creatorCanvas;
    const cx = editorCtx;
    const lv = editor.level;
    cx.clearRect(0, 0, c.width, c.height);
    const cell = editor.cell * editor.zoom;

    // background grid
    cx.fillStyle = '#0d0d1a';
    cx.fillRect(0, 0, c.width, c.height);
    cx.strokeStyle = 'rgba(0,255,255,0.08)';
    cx.lineWidth = 1;
    for (let gx = 0; gx <= lv.cols; gx++) {
      cx.beginPath(); cx.moveTo(gx * cell, 0); cx.lineTo(gx * cell, c.height); cx.stroke();
    }
    for (let gy = 0; gy <= lv.rows; gy++) {
      cx.beginPath(); cx.moveTo(0, gy * cell); cx.lineTo(c.width, gy * cell); cx.stroke();
    }

    // level bounds
    cx.strokeStyle = '#00ffff66';
    cx.lineWidth = 2;
    cx.strokeRect(0, 0, lv.cols * cell, lv.rows * cell);

    // objects
    lv.objects.forEach(o => {
      const px = o.x * cell, py = o.y * cell, pw = o.w * cell, ph = o.h * cell;
      const def = OBJ_DEFS[o.t] || OBJ_DEFS.block;
      cx.fillStyle = def.color;
      cx.shadowBlur = 12; cx.shadowColor = def.color;
      if (o.t === 'coin') {
        cx.beginPath(); cx.arc(px + pw / 2, py + ph / 2, Math.max(1, pw / 2 - 2), 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#9a7b00'; cx.beginPath(); cx.arc(px + pw / 2, py + ph / 2, Math.max(1, pw / 2 - 5), 0, Math.PI * 2); cx.fill();
      } else if (o.t === 'key') {
        cx.fillRect(px + 4, py + 2, pw - 8, ph - 4);
        cx.beginPath(); cx.arc(px + pw / 2, py + 4, 4, 0, Math.PI * 2); cx.fill();
      } else if (o.t === 'portal') {
        cx.strokeStyle = def.color; cx.lineWidth = 3;
        cx.beginPath(); cx.ellipse(px + pw / 2, py + ph / 2, pw / 3, ph / 2, 0, 0, Math.PI * 2); cx.stroke();
        cx.beginPath(); cx.ellipse(px + pw / 2, py + ph / 2, pw / 6, ph / 4, 0, 0, Math.PI * 2); cx.stroke();
      } else if (o.t === 'gate') {
        cx.fillStyle = '#cccccc'; cx.fillRect(px, py, pw, ph);
        cx.fillStyle = '#111'; cx.fillRect(px + pw / 2 - 4, py + 4, 8, 10);
      } else if (o.t === 'powerup') {
        cx.beginPath();
        cx.moveTo(px + pw / 2, py + 2); cx.lineTo(px + pw - 2, py + ph / 2); cx.lineTo(px + pw / 2, py + ph - 2); cx.lineTo(px + 2, py + ph / 2);
        cx.closePath(); cx.fill();
      } else if (o.t === 'speed') {
        cx.strokeStyle = def.color; cx.lineWidth = 2;
        cx.beginPath(); cx.ellipse(px + pw / 2, py + ph / 2, pw / 3, ph / 2, 0, 0, Math.PI * 2); cx.stroke();
      } else if (o.t === 'invert') {
        cx.fillStyle = 'rgba(170,102,255,0.35)'; cx.fillRect(px, py, pw, ph);
        cx.strokeStyle = def.color; cx.lineWidth = 2; cx.strokeRect(px, py, pw, ph);
        cx.fillStyle = '#fff'; cx.font = 'bold 10px monospace'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
        cx.fillText('⟲', px + pw / 2, py + ph / 2);
      } else {
        cx.fillRect(px, py, pw, ph);
      }
      cx.shadowBlur = 0;
      if (o.move && o.move !== 'none') {
        cx.fillStyle = '#fff'; cx.font = '9px monospace'; cx.textAlign = 'left'; cx.textBaseline = 'top';
        cx.fillText('→', px + 1, py + 1);
      }
    });

    // hover cell highlight
    if (editor.hoverCell && editor.tool !== 'move') {
      const { x, y } = editor.hoverCell;
      cx.strokeStyle = '#ffffff88'; cx.lineWidth = 1; cx.setLineDash([4, 3]);
      cx.strokeRect(x * cell, y * cell, cell, cell);
      cx.setLineDash([]);
    }
    renderPaletteActive();
  }

  function renderPaletteActive() {
    els.paletteEls.forEach(b => b.classList.remove('active'));
    els.paletteEls.forEach(b => {
      if (b.dataset.obj && b.dataset.obj === editor.selected) b.classList.add('active');
    });
    els.toolEls.forEach(b => b.classList.remove('tool-active'));
    els.toolEls.forEach(b => {
      if (b.dataset.tool && b.dataset.tool === editor.tool) b.classList.add('tool-active');
    });
  }

  // ===================== EDITOR INPUT =====================
  function bindEditorInput() {
    const c = els.creatorCanvas;

    function getCell(e) {
      const rect = c.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (c.width / rect.width);
      const py = (e.clientY - rect.top) * (c.height / rect.height);
      const w = canvasToWorld(px, py);
      const cell = editor.cell;
      return { gx: Math.floor(w.x / cell), gy: Math.floor(w.y / cell) };
    }

    c.addEventListener('mousemove', (e) => {
      if (editor.dragMode === 'pan') {
        const dx = e.movementX / editor.zoom, dy = e.movementY / editor.zoom;
        editor.viewX -= dx; editor.viewY -= dy;
        renderEditor();
        return;
      }
      if (editor.dragMode === 'place') {
        const { gx, gy } = getCell(e);
        placeObj(gx, gy, editor.selected);
        return;
      }
      if (editor.dragMode === 'erase') {
        const { gx, gy } = getCell(e);
        eraseObjAt(gx, gy);
        return;
      }
      if (editor.dragMode === 'move' && editor.dragObj !== undefined) {
        const { gx, gy } = getCell(e);
        const o = editor.level.objects[editor.dragObj];
        if (o) {
          const lv = editor.level;
          o.x = Math.max(0, Math.min(lv.cols - o.w, gx - editor.dragOffset.gx));
          o.y = Math.max(0, Math.min(lv.rows - o.h, gy - editor.dragOffset.gy));
          editor.dirty = true;
          renderEditor();
        }
        return;
      }
      const { gx, gy } = getCell(e);
      editor.hoverCell = { x: gx, y: gy };
      els.creatorCellInfo.textContent = `Cell: (${gx}, ${gy}) · Objects: ${objCountAtCell(gx, gy)}`;
      renderEditor();
    });

    c.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.button === 2) { editor.dragMode = 'erase'; return; }
      if (editor.tool === 'move') {
        const { gx, gy } = getCell(e);
        const idx = objAtCell(gx, gy);
        if (idx >= 0) {
          editor.dragMode = 'move';
          editor.dragObj = idx;
          editor.dragOffset = { gx: gx - editor.level.objects[idx].x, gy: gy - editor.level.objects[idx].y };
        }
        return;
      }
      if (editor.tool === 'erase') { editor.dragMode = 'erase'; eraseObjAt(getCell(e).gx, getCell(e).gy); return; }
      editor.dragMode = 'place';
      const { gx, gy } = getCell(e);
      placeObj(gx, gy, editor.selected);
    });

    // move-drag is handled in the single mousemove listener above

    window.addEventListener('mouseup', () => {
      editor.dragMode = null;
      editor.dragObj = undefined;
    });

    c.addEventListener('contextmenu', (e) => e.preventDefault());

    // zoom
    c.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = c.getBoundingClientRect();
      const px = (e.clientX - rect.left) * (c.width / rect.width);
      const py = (e.clientY - rect.top) * (c.height / rect.height);
      const w = canvasToWorld(px, py);
      editor.zoom = Math.min(2, Math.max(0.3, editor.zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
      editor.viewX = w.x - px / editor.zoom;
      editor.viewY = w.y - py / editor.zoom;
      resizeCanvas(true);
      renderEditor();
    });

    // pan with space or middle mouse
    window.addEventListener('mousedown', (e) => {
      if (e.button === 1) { editor.dragMode = 'pan'; e.preventDefault(); }
    });
  }

  // ===================== PLAY ENGINE =====================
  function playLevel(lv) {
    const level = normalizeLevel(lv);
    if (!level) return;
    // cancel any running play
    if (playState) stopPlay();
    // hide editor overlay, show game
    closeEditor();
    mainMenu.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    isPaused = false;
    isGameOver = false;
    bgMusic.volume = 0.5;
    if (level.song && level.songLocked) {
      bgMusic.src = level.song;
      bgMusic.play().catch(() => {});
    } else if (bgMusic.src.indexOf(songSelect.value) === -1) {
      bgMusic.src = songSelect.value;
      bgMusic.play().catch(() => {});
    }

    const cell = level.cell;
    playState = {
      level,
      cam: 0,                // world px scrolled
      player: {
        x: level.scroll === 'side' ? 40 : 200 - 10,
        y: level.scroll === 'side' ? 300 - 10 : 540,
        w: 20, h: 20,
        invuln: 0
      },
      score: 0, lives: 3, keys: 0,
      collected: {},         // object index -> collected
      finishReached: false,
      invertT: 0,
      slowT: 0,
      over: false,
      won: false,
      statusTime: 0
    };

    scoreDisplay.textContent = _t('scoreDisplay', { score: 0 });
    livesDisplay.textContent = _t('livesDisplay', { n: 3 });
    document.getElementById('keysDisplay').textContent = _t('keysDisplay', { n: 0 });

    // route input: pointer moves the player
    // (existing canvas mousemove calls setPlayerFromPointer -> uses player.x/y)
    // so we piggyback by setting the main `player` to our playState.player is wrong;
    // instead we use our own loop that reads pointer directly.
    // To reuse main input, we temporarily override setPlayerFromPointer.
    playState._origSetPlayer = window.setPlayerFromPointer;
    origSetPlayerOverride = window.setPlayerFromPointer;
    window.setPlayerFromPointer = (mx, my) => {
      if (playState) {
        playState.player.x = mx - playState.player.w / 2;
        playState.player.y = my - playState.player.h / 2;
      }
    };

    animationId = requestAnimationFrame(playTick);
  }

  function playTick() {
    if (!playState) return;
    if (isPaused) { animationId = requestAnimationFrame(playTick); return; }
    const ps = playState;
    const level = ps.level;
    const cell = level.cell;

    // scroll
    ps.cam += level.speed;
    if (level.scroll === 'vertical') {
      if (ps.cam >= level.rows * cell - 600) ps.cam = level.rows * cell - 600;
    } else {
      if (ps.cam >= level.cols * cell - 400) ps.cam = level.cols * cell - 400;
    }
    const endReached = level.scroll === 'vertical'
      ? ps.cam >= level.rows * cell - 600
      : ps.cam >= level.cols * cell - 400;

    // player update via keyboard (dx/dy already set)
    if (ps.invertT > 0) {
      ps.invertT--;
      ps.player.x += player.dx * -1;
      ps.player.y += player.dy * -1;
    } else {
      ps.player.x += player.dx;
      ps.player.y += player.dy;
    }
    const maxX = 400 - ps.player.w;
    const maxY = 600 - ps.player.h;
    ps.player.x = Math.max(0, Math.min(maxX, ps.player.x));
    ps.player.y = Math.max(0, Math.min(maxY, ps.player.y));
    if (ps.player.invuln > 0) ps.player.invuln--;

    // world-to-screen: for vertical, objects above cam; screen y = objY - cam
    const worldOf = (o) => ({
      x: level.scroll === 'side' ? o.x * cell - ps.cam : o.x * cell,
      y: level.scroll === 'side' ? o.y * cell : o.y * cell - ps.cam
    });

    // collisions
    for (let i = 0; i < level.objects.length; i++) {
      const o = level.objects[i];
      if (ps.collected[i]) continue;
      const w = worldOf(o);
      if (w.x + o.w * cell < -cell || w.x > 400 + cell) continue;
      if (w.y + o.h * cell < -cell || w.y > 600 + cell) continue;
      // visible: test player overlap (shrunk hitbox for fairness)
      const pw = ps.player.w, ph = ps.player.h;
      const ox = w.x + o.w * cell, oy = w.y + o.h * cell;
      const hit = ps.player.x + pw > w.x + 2 && ps.player.x < ox - 2 &&
                  ps.player.y + ph > w.y + 2 && ps.player.y < oy - 2;

      if (!hit) continue;
      switch (o.t) {
        case 'coin':
          ps.collected[i] = true;
          ps.score++;
          scoreDisplay.textContent = _t('scoreDisplay', { score: ps.score });
          createExplosion(ps.player.x + 10, ps.player.y + 10, '#ffff00', 8);
          SoundFX.coin();
          break;
        case 'key':
          ps.collected[i] = true;
          ps.keys++;
          document.getElementById('keysDisplay').textContent = _t('keysDisplay', { n: ps.keys });
          createExplosion(ps.player.x + 10, ps.player.y + 10, '#ffaa00', 12);
          SoundFX.powerup();
          break;
        case 'gate':
          if (ps.keys > 0) {
            ps.keys--;
            document.getElementById('keysDisplay').textContent = _t('keysDisplay', { n: ps.keys });
            ps.collected[i] = true;
            createExplosion(w.x + o.w * cell / 2, w.y + o.h * cell / 2, '#ffffff', 20);
            SoundFX.shatter();
          } else {
            hurtPlayer();
          }
          break;
        case 'portal':
          ps.collected[i] = true;
          finishLevel(true);
          break;
        case 'powerup':
          ps.collected[i] = true;
          if (o.type === 'slowTime') { ps.slowT = 240; effectDisplay.textContent = '🐌 Slow'; }
          else { /* blaster unused in creator for now */ }
          SoundFX.powerup();
          break;
        case 'speed':
          ps.collected[i] = true;
          ps.cam += cell * 2;
          createExplosion(w.x + o.w * cell / 2, w.y + o.h * cell / 2, '#ff66ff', 12);
          SoundFX.blip();
          break;
        case 'invert':
          ps.invertT = 180;
          ps.collected[i] = true;
          effectDisplay.textContent = '⟲ Inverted';
          SoundFX.blip();
          break;
        default: // block / spike
          hurtPlayer();
      }
      if (ps.over) break;
    }

    if (!ps.over && endReached) {
      finishLevel(true);
    }

    if (ps.over) { animationId = requestAnimationFrame(playTick); return; }

    // slow effect
    if (ps.slowT > 0) { ps.slowT--; if (ps.slowT === 0 && ps.invertT === 0) effectDisplay.textContent = ''; }

    // draw
    ctx.clearRect(0, 0, 400, 600);
    ctx.fillStyle = '#0d0d1a';
    ctx.fillRect(0, 0, 400, 600);

    // grid background
    ctx.strokeStyle = 'rgba(0,255,255,0.05)';
    for (let gx = 0; gx <= level.cols; gx++) {
      const sx = gx * cell - (level.scroll === 'side' ? ps.cam : 0);
      if (sx < -cell || sx > 400 + cell) continue;
      ctx.beginPath(); ctx.moveTo(sx, 0); ctx.lineTo(sx, 600); ctx.stroke();
    }
    for (let gy = 0; gy <= level.rows; gy++) {
      const sy = gy * cell - (level.scroll === 'vertical' ? ps.cam : 0);
      if (sy < -cell || sy > 600 + cell) continue;
      ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(400, sy); ctx.stroke();
    }

    // draw objects
    level.objects.forEach((o, i) => {
      if (ps.collected[i]) return;
      const w = worldOf(o);
      const px = w.x, py = w.y, pw = o.w * cell, ph = o.h * cell;
      if (px + pw < 0 || px > 400 || py + ph < 0 || py > 600) return;
      const def = OBJ_DEFS[o.t];
      ctx.fillStyle = def.color;
      ctx.shadowBlur = 12; ctx.shadowColor = def.color;
      if (o.t === 'coin') {
        ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, Math.max(1, pw / 2 - 2), 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#9a7b00'; ctx.beginPath(); ctx.arc(px + pw / 2, py + ph / 2, Math.max(1, pw / 2 - 5), 0, Math.PI * 2); ctx.fill();
      } else if (o.t === 'key') {
        ctx.fillRect(px + 4, py + 2, pw - 8, ph - 4);
        ctx.beginPath(); ctx.arc(px + pw / 2, py + 4, 4, 0, Math.PI * 2); ctx.fill();
      } else if (o.t === 'portal') {
        ctx.strokeStyle = def.color; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(px + pw / 2, py + ph / 2, pw / 3, ph / 2, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(px + pw / 2, py + ph / 2, pw / 6, ph / 4, 0, 0, Math.PI * 2); ctx.stroke();
      } else if (o.t === 'gate') {
        ctx.fillStyle = '#cccccc'; ctx.fillRect(px, py, pw, ph);
        ctx.fillStyle = '#111'; ctx.fillRect(px + pw / 2 - 4, py + 4, 8, 10);
      } else if (o.t === 'powerup') {
        ctx.beginPath();
        ctx.moveTo(px + pw / 2, py + 2); ctx.lineTo(px + pw - 2, py + ph / 2); ctx.lineTo(px + pw / 2, py + ph - 2); ctx.lineTo(px + 2, py + ph / 2);
        ctx.closePath(); ctx.fill();
      } else if (o.t === 'speed') {
        ctx.strokeStyle = def.color; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(px + pw / 2, py + ph / 2, pw / 3, ph / 2, 0, 0, Math.PI * 2); ctx.stroke();
      } else if (o.t === 'invert') {
        ctx.fillStyle = 'rgba(170,102,255,0.35)'; ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = def.color; ctx.lineWidth = 2; ctx.strokeRect(px, py, pw, ph);
      } else {
        ctx.fillRect(px, py, pw, ph);
      }
      ctx.shadowBlur = 0;
    });

    // player
    if (ps.invertT > 0 && Math.floor(frameCount / 8) % 2 === 0) {
      // flash when inverted
    }
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 20; ctx.shadowColor = '#00ffff';
    ctx.fillRect(ps.player.x, ps.player.y, ps.player.w, ps.player.h);
    ctx.shadowBlur = 0;

    // progress bar
    const total = level.scroll === 'vertical' ? level.rows * cell - 600 : level.cols * cell - 400;
    const pct = Math.min(1, ps.cam / total);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(0, 590, 400, 10);
    ctx.fillStyle = '#00ff96';
    ctx.fillRect(0, 590, 400 * pct, 10);

    handleParticles();
    handleGlassShards();
    applyBeatPulse();

    animationId = requestAnimationFrame(playTick);
  }

  function hurtPlayer() {
    const ps = playState;
    if (!ps || ps.over) return;
    if (ps.player.invuln > 0) return;
    if (ps.lives > 1) {
      ps.lives--;
      livesDisplay.textContent = _t('livesDisplay', { n: ps.lives });
      createExplosion(ps.player.x + 10, ps.player.y + 10, '#ff0080', 20);
      ps.player.invuln = 60;
      SoundFX.hit();
    } else {
      finishLevel(false);
    }
  }

  function finishLevel(won) {
    const ps = playState;
    if (!ps || ps.over) return;
    ps.over = true;
    ps.won = won;
    cancelAnimationFrame(animationId);
    animationId = null;
    bgMusic.pause();
    bgMusic.currentTime = 0;
    effectDisplay.textContent = '';
    SoundFX.explode();

    const resultBox = $('creatorResultBox');
    const resultTitle = $('creatorResultTitle');
    if (resultTitle) {
      resultTitle.textContent = won ? 'LEVEL CLEARED!' : 'LEVEL FAILED';
      resultTitle.style.color = won ? '#00ff96' : '#ff6b6b';
      resultTitle.style.textShadow = won ? '0 0 12px #00ff96' : '0 0 12px #ff4444';
    }
    const resultScore = $('creatorResultScore');
    if (resultScore) resultScore.textContent = _t('scoreDisplay', { score: ps.score });
    const resultEl = $('creatorResult');
    if (resultEl) resultEl.style.display = 'flex';

    if (won) {
      xp = xp + 5;
      localStorage.setItem('neonXp', xp);
      menuXpDisplay.textContent = _t('xpDisplay', { xp: xp });
      gameStats.levelsCleared = (gameStats.levelsCleared || 0) + 1;
      saveStats();
      unlockAchievement('firstRun');
    }

    if (window.setPlayerFromPointer) window.setPlayerFromPointer = ps._origSetPlayer || window.setPlayerFromPointer;
    lastPlayedLevel = cloneLevel(ps.level);
    playState = null;
    pauseBtn.style.display = 'none';
  }

  let lastPlayedLevel = null;

  function stopPlay() {
    if (playState) {
      cancelAnimationFrame(animationId);
      animationId = null;
      playState = null;
    }
    if (origSetPlayerOverride !== null) {
      window.setPlayerFromPointer = origSetPlayerOverride;
      origSetPlayerOverride = null;
    }
    bgMusic.pause();
    bgMusic.currentTime = 0;
    effectDisplay.textContent = '';
  }

  // ===================== EDITOR OPEN/CLOSE =====================
  function openEditor(lv) {
    injectStyles();
    injectDom();
    const res = $('creatorResult');
    if (res) res.style.display = 'none';
    editor.level = lv ? normalizeLevel(lv) : defaultLevel();
    editor.tool = 'place';
    editor.selected = 'block';
    editor.dragMode = null;
    editor.dirty = false;
    editor.editing = true;
    els = {
      overlay: $('creatorOverlay'),
      creatorCanvas: $('creatorCanvas'),
      creatorCanvasWrap: $('creatorCanvasWrap'),
      creatorCellInfo: $('creatorCellInfo'),
      creatorName: $('creatorName'),
      creatorSong: $('creatorSong'),
      creatorSongLock: $('creatorSongLock'),
      creatorScroll: $('creatorScroll'),
      creatorSpeed: $('creatorSpeed'),
      creatorRows: $('creatorRows'),
      paletteEls: Array.from(document.querySelectorAll('#creatorPalette [data-obj]')),
      toolEls: Array.from(document.querySelectorAll('#creatorPalette [data-tool]'))
    };
    editorCtx = els.creatorCanvas.getContext('2d');
    els.overlay.classList.add('open');
    syncSettingsToUi();
    // populate palette object buttons with colors
    document.querySelectorAll('#creatorPalette [data-obj]').forEach(b => {
      const sw = b.querySelector('.swatch');
      if (sw && OBJ_DEFS[b.dataset.obj]) sw.style.background = OBJ_DEFS[b.dataset.obj].color;
    });
    resizeCanvas();
    renderEditor();
    if (!editor._uiBound) {
      bindEditorUi();
      bindEditorInput();
      editor._uiBound = true;
    }
    mainMenu.style.display = 'none';
  }

  function closeEditor() {
    stopPlay();
    stopCollabRoom();
    if (els.overlay) els.overlay.classList.remove('open');
    editor.editing = false;
    mainMenu.style.display = 'flex';
  }

  function syncSettingsToUi() {
    const lv = editor.level;
    els.creatorName.value = lv.name;
    els.creatorSong.value = lv.song || '';
    els.creatorSongLock.checked = !!lv.songLocked;
    els.creatorScroll.value = lv.scroll;
    els.creatorSpeed.value = lv.speed;
    els.creatorRows.value = lv.rows;
  }

  function syncUiToLevel() {
    const lv = editor.level;
    const prev = JSON.stringify(lv);
    lv.name = els.creatorName.value || 'My Level';
    lv.song = els.creatorSong.value || null;
    lv.songLocked = els.creatorSongLock.checked;
    lv.scroll = els.creatorScroll.value;
    lv.speed = Math.min(8, Math.max(1, parseInt(els.creatorSpeed.value) || 3));
    lv.rows = Math.min(500, Math.max(20, parseInt(els.creatorRows.value) || 60));
    if (JSON.stringify(lv) !== prev) editor.dirty = true;
  }

  function bindEditorUi() {
    $('creatorExit').addEventListener('click', closeEditor);
    $('creatorSave').addEventListener('click', () => {
      syncUiToLevel();
      saveLevel(editor.level);
      editor.dirty = false;
      flashStatus('💾 Saved!', '#00ff96');
    });
    $('creatorUpload').addEventListener('click', async () => {
      syncUiToLevel();
      flashStatus('⬆ Uploading…', '#aa66ff');
      try {
        const res = await fetch('/api/levels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', level: editor.level })
        });
        const data = await res.json();
        if (data.code) {
          flashStatus('⬆ Shared! Code: ' + data.code, '#aa66ff');
        } else {
          flashStatus('Upload failed: ' + (data.error || 'unknown'), '#ff4444');
        }
      } catch (err) {
        flashStatus('Upload unavailable offline', '#ff4444');
      }
    });
    $('creatorPlay').addEventListener('click', () => {
      syncUiToLevel();
      playLevel(editor.level);
    });
    $('creatorNew').addEventListener('click', () => {
      editor.level = defaultLevel();
      editor.dirty = true;
      syncSettingsToUi();
      resizeCanvas();
      renderEditor();
    });
    $('creatorClear').addEventListener('click', () => {
      editor.level.objects = [];
      editor.dirty = true;
      renderEditor();
    });
    $('creatorLoad').addEventListener('click', openLoadDialog);
    $('creatorCollabBtn').addEventListener('click', openCollabDialog);

    document.querySelectorAll('#creatorPalette [data-tool]').forEach(b => {
      b.addEventListener('click', () => { editor.tool = b.dataset.tool; renderPaletteActive(); });
    });
    document.querySelectorAll('#creatorPalette [data-obj]').forEach(b => {
      b.addEventListener('click', () => {
        editor.selected = b.dataset.obj;
        editor.tool = 'place';
        renderPaletteActive();
      });
    });

    ['creatorName', 'creatorSong', 'creatorSongLock', 'creatorScroll', 'creatorSpeed', 'creatorRows'].forEach(id => {
      const el = $(id);
      el.addEventListener('change', () => { syncUiToLevel(); });
    });
  }

  let statusTimer = null;
  function flashStatus(msg, color) {
    const el = $('creatorPlayStatus');
    if (!el) return;
    el.textContent = msg;
    el.style.color = color || '#00ff96';
    el.style.display = 'block';
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { el.style.display = 'none'; }, 1800);
  }

  // ===================== LOAD DIALOG =====================
  function openLoadDialog() {
    const list = loadAllLevels();
    const existing = document.getElementById('creatorLoadDialog');
    if (existing) existing.remove();
    const dlg = document.createElement('div');
    dlg.id = 'creatorLoadDialog';
    dlg.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99; display:flex; align-items:center; justify-content:center;';
    let rowsHtml = list.length === 0
      ? '<div style="padding:20px;color:#888;">No saved levels yet.</div>'
      : list.map(lv => `
        <div style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-bottom:1px solid #222;">
          <span style="flex:1; color:#eee;">${lv.name}</span>
          <span style="color:#888; font-size:11px;">${lv.scroll} · ${lv.rows}r</span>
          <button data-act="open" data-id="${lv.id}" style="background:rgba(0,255,150,0.1);border:1px solid #00ff96;color:#00ff96;border-radius:5px;padding:3px 8px;cursor:pointer;">Open</button>
          <button data-act="play" data-id="${lv.id}" style="background:rgba(0,255,255,0.1);border:1px solid #00ffff;color:#00ffff;border-radius:5px;padding:3px 8px;cursor:pointer;">Play</button>
          <button data-act="del" data-id="${lv.id}" style="background:rgba(255,68,68,0.1);border:1px solid #ff4444;color:#ff6b6b;border-radius:5px;padding:3px 8px;cursor:pointer;">Del</button>
        </div>`).join('');
    dlg.innerHTML = `
      <div style="background:#0d0d1a; border:1px solid #00ffff55; border-radius:12px; width:min(440px,92vw); max-height:80vh; overflow-y:auto; padding:16px; box-shadow:0 0 40px rgba(0,255,255,0.2);">
        <h3 style="margin:0 0 12px; color:#00ffff;">📂 My Levels</h3>
        ${rowsHtml}
        <div style="margin-top:12px; display:flex; gap:6px;">
          <input id="creatorImportCode" placeholder="Import share code" maxlength="5" style="flex:1; background:#0d0d1a; border:1px solid #aa66ff88; color:#aa66ff; padding:6px 10px; border-radius:6px; font-family:inherit;">
          <button id="creatorImportBtn" style="background:rgba(170,102,255,0.1);border:1px solid #aa66ff;color:#aa66ff;border-radius:6px;padding:6px 12px;cursor:pointer;">Import</button>
        </div>
        <div id="creatorImportStatus" style="margin-top:6px; font-size:12px; color:#888;"></div>
        <div style="margin-top:12px; text-align:right;">
          <button id="creatorLoadClose" style="background:rgba(255,255,255,0.1);border:1px solid #888;color:#aaa;border-radius:6px;padding:5px 14px;cursor:pointer;">Close</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const lv = list.find(x => x.id === btn.dataset.id);
      if (!lv) return;
      if (btn.dataset.act === 'open') { editor.level = normalizeLevel(lv); syncSettingsToUi(); resizeCanvas(); renderEditor(); dlg.remove(); }
      if (btn.dataset.act === 'play') { dlg.remove(); playLevel(lv); }
      if (btn.dataset.act === 'del') { deleteLevel(lv.id); openLoadDialog(); }
    });
    $('creatorLoadClose').addEventListener('click', () => dlg.remove());
    $('creatorImportBtn').addEventListener('click', async () => {
      const code = ($('creatorImportCode').value || '').trim().toUpperCase();
      const status = $('creatorImportStatus');
      if (!code) { status.textContent = 'Enter a share code.'; return; }
      status.textContent = 'Importing…';
      try {
        const res = await fetch('/api/levels?code=' + encodeURIComponent(code));
        const data = await res.json();
        if (data.level) {
          editor.level = normalizeLevel(data.level);
          syncSettingsToUi();
          resizeCanvas();
          renderEditor();
          dlg.remove();
          flashStatus('⬇ Imported ' + code, '#aa66ff');
        } else {
          status.textContent = 'Level not found: ' + (data.error || '');
        }
      } catch (err) {
        status.textContent = 'Import unavailable offline';
      }
    });
  }

  // ===================== COLLAB =====================
  function openCollabDialog() {
    const existing = document.getElementById('creatorCollabDialog');
    if (existing) existing.remove();
    const dlg = document.createElement('div');
    dlg.id = 'creatorCollabDialog';
    dlg.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99; display:flex; align-items:center; justify-content:center;';
    dlg.innerHTML = `
      <div style="background:#0d0d1a; border:1px solid #ffaa0088; border-radius:12px; width:min(400px,92vw); padding:16px; box-shadow:0 0 40px rgba(255,170,0,0.2);">
        <h3 style="margin:0 0 12px; color:#ffaa00;">👥 Collab Editor</h3>
        <div style="display:flex; gap:8px; margin-bottom:10px;">
          <input id="collabCodeInput" placeholder="Room code" style="flex:1; background:#0d0d1a; border:1px solid #ffaa0088; color:#ffaa00; padding:6px 10px; border-radius:6px; font-family:inherit;" maxlength="6">
          <button id="collabJoin" style="background:rgba(255,170,0,0.1);border:1px solid #ffaa00;color:#ffaa00;border-radius:6px;padding:6px 12px;cursor:pointer;">Join</button>
        </div>
        <button id="collabCreate" style="width:100%; background:rgba(255,170,0,0.1);border:1px solid #ffaa00;color:#ffaa00;border-radius:6px;padding:8px;cursor:pointer;">＋ Create collab room</button>
        <div id="collabStatus" style="margin-top:10px; font-size:12px; color:#888;"></div>
        <div style="margin-top:12px; text-align:right;">
          <button id="collabClose" style="background:rgba(255,255,255,0.1);border:1px solid #888;color:#aaa;border-radius:6px;padding:5px 14px;cursor:pointer;">Close</button>
        </div>
      </div>`;
    document.body.appendChild(dlg);
    $('collabClose').addEventListener('click', () => dlg.remove());
    $('collabCreate').addEventListener('click', async () => {
      const status = $('collabStatus');
      status.textContent = 'Creating…';
      try {
        syncUiToLevel();
        const res = await fetch('/api/collab', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'create', level: editor.level })
        });
        const data = await res.json();
        if (data.code) {
          status.textContent = 'Room created: ' + data.code;
          startCollabRoom(data.code);
        } else {
          status.textContent = 'Error: ' + (data.error || 'unknown');
        }
      } catch (err) {
        status.textContent = 'Collab unavailable offline: ' + err.message;
      }
    });
    $('collabJoin').addEventListener('click', async () => {
      const code = ($('collabCodeInput').value || '').trim().toUpperCase();
      const status = $('collabStatus');
      if (!code) { status.textContent = 'Enter a room code.'; return; }
      status.textContent = 'Joining…';
      try {
        const res = await fetch('/api/collab?code=' + encodeURIComponent(code));
        const data = await res.json();
        if (data.level) {
          editor.level = normalizeLevel(data.level);
          syncSettingsToUi();
          resizeCanvas();
          renderEditor();
          dlg.remove();
          startCollabRoom(code);
        } else {
          status.textContent = 'Room not found: ' + (data.error || '');
        }
      } catch (err) {
        status.textContent = 'Collab unavailable offline: ' + err.message;
      }
    });
  }

  let collabTimer = null;
  let collabTs = 0; // last server timestamp we applied/pushed
  function startCollabRoom(code) {
    stopCollabRoom();
    const el = $('creatorCollab');
    if (el) { el.textContent = '👥 Collab: ' + code; el.style.display = 'block'; }
    collabTs = 0;
    collabPush(code); // seed the room with the current level
    collabTimer = setInterval(async () => {
      if (!editor.editing) { stopCollabRoom(); return; }
      // First fetch the remote snapshot, then push only if our version is newer
      try {
        const res = await fetch('/api/collab?code=' + encodeURIComponent(code));
        const data = await res.json();
        if (data.level && data.ts > collabTs) {
          // Remote is newer — adopt it (don't overwrite with our stale state)
          collabTs = data.ts;
          editor.level = normalizeLevel(data.level);
          editor.dirty = false;
          syncSettingsToUi();
          renderEditor();
          flashStatus('↻ Synced collab level', '#ffaa00');
        } else if (editor.dirty) {
          // Our version is newer — push it
          await collabPush(code);
        }
      } catch (e) {}
    }, 2000);
  }

  async function collabPush(code) {
    if (!editor.editing || !editor.level || !editor.dirty) return;
    try {
      const res = await fetch('/api/collab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', code: code, level: editor.level })
      });
      const data = await res.json();
      if (data.ts) {
        collabTs = data.ts;
        editor.dirty = false;
      }
    } catch (e) {}
  }

  function stopCollabRoom() {
    if (collabTimer) { clearInterval(collabTimer); collabTimer = null; }
    const el = $('creatorCollab');
    if (el) el.style.display = 'none';
  }

  // ===================== PUBLIC API =====================
  window.NeonCreator = {
    open: openEditor,
    close: closeEditor,
    play: playLevel,
    isEditing: () => editor.editing,
    isPlaying: () => !!playState,
    defaultLevel,
    normalizeLevel,
    saveLevel,
    loadAllLevels,
    stopPlay
  };

  // one-time: Esc while editing closes the editor back to the menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && editor.editing && !playState && els.overlay && els.overlay.classList.contains('open')) {
      closeEditor();
    }
  });

  // auto-hook Esc during playtest to return to the editor
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && playState && !editor.editing) {
      const lv = playState.level;
      stopPlay();
      const res = $('creatorResult');
      if (res) res.style.display = 'none';
      gameOverScreen.style.display = 'none';
      levelCompleteScreen.style.display = 'none';
      pauseBtn.style.display = 'none';
      openEditor(lv);
    }
  });
})();
