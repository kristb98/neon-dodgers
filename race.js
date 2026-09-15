(() => {
  const CPU_NAMES = function() {
    if (typeof NeonI18n === 'object' && NeonI18n.t) {
      return [
        NeonI18n.t('racer1'), NeonI18n.t('racer2'), NeonI18n.t('racer3'),
        NeonI18n.t('racer4'), NeonI18n.t('racer5'), NeonI18n.t('racer6'), NeonI18n.t('racer7')
      ];
    }
    return ['NeonBot', 'CyberAce', 'PixelRush', 'Glitch', 'Vortex', 'StarDodge', 'Pulse'];
  };
  const CPU_COLORS = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff', '#ff922b', '#20c997'];

  let hooks = {};
  let active = false;
  let mode = null;
  let playerCount = 2;
  let difficultyIndex = 2;
  let opponents = [];
  let eliminated = false;
  let raceFinished = false;
  let syncTimer = null;
  let countdownTimer = null;

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cacheEls() {
    [
      'raceMenu', 'raceStandings', 'raceResults', 'raceCountdown',
      'racePlayerName', 'racePlayerCount', 'raceDifficulty', 'raceCpuPanel',
      'raceStandingsList', 'raceResultsBody', 'raceResultsTitle', 'raceCountdownNum'
    ].forEach((id) => { els[id] = $(id); });
  }

  function isRaceMode() {
    return active && mode === 'cpu';
  }

  function show(el, display = 'block') {
    if (el) el.style.display = display;
  }

  function hide(el) {
    if (el) el.style.display = 'none';
  }

  function getPlayerName() {
    const saved = localStorage.getItem('neonRaceName');
    const val = (els.racePlayerName?.value || saved || 'Player').trim().slice(0, 16);
    localStorage.setItem('neonRaceName', val);
    return val || 'Player';
  }

  function renderStandings() {
    if (!els.raceStandingsList) return;
    const list = [...opponents].sort((a, b) => {
      if (a.alive !== b.alive) return a.alive ? -1 : 1;
      return b.score - a.score;
    });
    var _t = (typeof NeonI18n === 'object' && NeonI18n.t) ? NeonI18n.t.bind(NeonI18n) : function(k, v) { return k; };
    els.raceStandingsList.innerHTML = list.map((p, i) => {
      const status = p.alive ? `${p.score} ${_t('racePts')}` : _t('raceOut');
      const rank = i + 1;
      const you = p.isSelf ? ' ' + _t('raceYou') : '';
      const dot = p.alive ? '🟢' : '🔴';
      return `<div class="race-row${p.isSelf ? ' race-row-self' : ''}${!p.alive ? ' race-row-out' : ''}">
        <span>${rank}. ${dot} ${escapeHtml(p.name)}${you}</span>
        <span>${status}</span>
      </div>`;
    }).join('');
    show(els.raceStandings, 'block');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function createCpuOpponents(count) {
    const cpus = [];
    const used = new Set();
    const names = (typeof CPU_NAMES === 'function') ? CPU_NAMES() : CPU_NAMES;
    const skillBase = 0.25 + (difficultyIndex || 2) * 0.12;
    for (let i = 0; i < count - 1; i++) {
      let name = names[i % names.length];
      let n = 1;
      while (used.has(name)) name = `${names[i % names.length]}${++n}`;
      used.add(name);
      cpus.push({
        id: `cpu-${i}`,
        name,
        color: CPU_COLORS[i % CPU_COLORS.length],
        isSelf: false,
        isCpu: true,
        alive: true,
        score: 0,
        skill: Math.min(0.9, skillBase + Math.random() * 0.35),
        deathAt: 0
      });
    }
    return cpus;
  }

  function planCpuDeaths() {
    opponents.filter((o) => o.isCpu).forEach((cpu) => {
      const base = 25 + cpu.skill * 90;
      cpu.deathAt = Math.floor(base + Math.random() * 40);
    });
  }

  function updateCpus() {
    opponents.filter((o) => o.isCpu && o.alive).forEach((cpu) => {
      if (Math.random() < 0.04 + cpu.skill * 0.03) cpu.score++;
      if (cpu.score >= cpu.deathAt && Math.random() < 0.08) {
        cpu.alive = false;
      }
    });
  }

  function getAliveCount() {
    return opponents.filter((o) => o.alive).length;
  }

  function getPlacement() {
    const self = opponents.find((o) => o.isSelf);
    if (!self) return 0;
    const sorted = [...opponents].sort((a, b) => {
      if (a.alive !== b.alive) return a.alive ? -1 : 1;
      return b.score - a.score;
    });
    const idx = sorted.findIndex((o) => o.id === self.id);
    return idx === -1 ? 0 : idx + 1;
  }

  function checkRaceEnd() {
    if (raceFinished) return;
    const alive = opponents.filter((o) => o.alive);
    if (alive.length <= 1 && opponents.length > 1) {
      finishRace(alive[0] || null);
    }
  }

  function finishRace(winner) {
    if (raceFinished) return;
    raceFinished = true;
    stopSync();
    var _t = (typeof NeonI18n === 'object' && NeonI18n.t) ? NeonI18n.t.bind(NeonI18n) : function(k, v) { return k; };

    const sorted = [...opponents].sort((a, b) => {
      if (a.alive !== b.alive) return a.alive ? -1 : 1;
      return b.score - a.score;
    });

    const self = opponents.find((o) => o.isSelf);
    const won = winner && self && winner.id === self.id;

    if (els.raceResultsTitle) {
      if (won) els.raceResultsTitle.textContent = _t('youWin');
      else if (winner) els.raceResultsTitle.textContent = _t('wins', { name: winner.name });
      else els.raceResultsTitle.textContent = _t('raceOver');
    }

    if (els.raceResultsBody) {
      els.raceResultsBody.innerHTML = sorted.map((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        return `<div class="race-result-row">
          <span>${medal} ${escapeHtml(p.name)}${p.isSelf ? ' ' + _t('raceYou') : ''}</span>
          <span>${p.alive ? _t('raceSurvived') : _t('raceEliminatedStatus')} · ${p.score} ${_t('racePts')}</span>
        </div>`;
      }).join('');
    }

    show(els.raceResults, 'flex');
    hooks.onRaceEnd?.();
  }

  function startRaceGame() {
    if (!active) return;
    eliminated = false;
    raceFinished = false;
    renderStandings();
    hooks.onRaceStart?.({ difficultyIndex, mode });
    startSync();
  }

  function startSync() {
    stopSync();
    syncTimer = setInterval(() => {
      if (!active || raceFinished) return;
      updateCpus();
      renderStandings();
      checkRaceEnd();
    }, 400);
  }

  function stopSync() {
    if (syncTimer) clearInterval(syncTimer);
    syncTimer = null;
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function startCpuRace() {
    mode = 'cpu';
    active = true;
    playerCount = parseInt(els.racePlayerCount?.value || '2', 10);
    difficultyIndex = parseInt(els.raceDifficulty?.value || '2', 10);
    eliminated = false;
    raceFinished = false;

    opponents = [
      {
        id: 'self',
        name: getPlayerName(),
        isSelf: true,
        isCpu: false,
        alive: true,
        score: 0
      },
      ...createCpuOpponents(playerCount)
    ];
    planCpuDeaths();

    hide(els.raceMenu);
    hide(els.raceResults);
    show(els.raceCountdown, 'flex');

    let count = 3;
    if (els.raceCountdownNum) els.raceCountdownNum.textContent = count;
    stopSync();
    countdownTimer = setInterval(() => {
      count--;
      if (count > 0) {
        if (els.raceCountdownNum) els.raceCountdownNum.textContent = count;
      } else {
        if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
        if (els.raceCountdownNum) els.raceCountdownNum.textContent = 'GO!';
        countdownTimer = setTimeout(() => {
          countdownTimer = null;
          hide(els.raceCountdown);
          startRaceGame();
        }, 500);
      }
    }, 1000);
  }

  function bindUi() {
    $('btnRaceMode')?.addEventListener('click', () => {
      hide($('endlessMenu'));
      hide($('levelsMenu'));
      hide($('ninjaMenu'));
      hide($('survivalMenu'));
      hide($('chaosMenu'));
      hide($('speedRushMenu'));
      hide($('meteorMenu'));
      hide($('reverseMenu'));
      hide($('zenMenu'));
      hide($('bossRushMenu'));
      show(els.raceMenu, 'block');
    });

    $('raceStartCpu')?.addEventListener('click', startCpuRace);
    $('raceBackBtn')?.addEventListener('click', () => {
      hide(els.raceMenu);
      hooks.onRaceExit?.();
    });

    $('raceResultsMenu')?.addEventListener('click', () => {
      hide(els.raceResults);
      hide(els.raceStandings);
      show(els.raceMenu, 'block');
      active = false;
      mode = null;
      eliminated = false;
      raceFinished = false;
      opponents = [];
      stopSync();
      hooks.onRaceExit?.();
    });

    $('raceResultsRetry')?.addEventListener('click', () => {
      hide(els.raceResults);
      hide(els.raceStandings);
      startCpuRace();
    });

    const saved = localStorage.getItem('neonRaceName');
    if (saved && els.racePlayerName) els.racePlayerName.value = saved;
  }

  window.NeonRace = {
    init(h) {
      hooks = h || {};
      cacheEls();
      bindUi();
    },
    isActive: () => active,
    isRaceMode,
    onScoreUpdate(score) {
      const self = opponents.find((o) => o.isSelf);
      if (self) self.score = score;
      if (active && !raceFinished) renderStandings();
    },
    onPlayerDeath(score) {
      if (!isRaceMode() || eliminated) return false;

      const self = opponents.find((o) => o.isSelf);
      if (self) {
        self.score = score;
        self.alive = false;
      }
      eliminated = true;
      renderStandings();
      checkRaceEnd();
      return true;
    },
    tick() {
      if (!isRaceMode() || raceFinished) return;
      updateCpus();
      renderStandings();
      checkRaceEnd();
    },
    cleanup() {
      stopSync();
      active = false;
      mode = null;
      hide(els.raceStandings);
      hide(els.raceResults);
      hide(els.raceCountdown);
    }
  };
})();
