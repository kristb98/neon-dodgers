      window._t = function (k, v) {
        return k;
      };
      window.onerror = function (msg, url, line, col, err) {
        console.error(
          "Neon Dodgers error:",
          msg,
          "line",
          line,
          (err && err.stack) || "",
        );
      };
      const canvas = document.getElementById("gameCanvas");
      const ctx = canvas.getContext("2d");
      const scoreDisplay = document.getElementById("scoreDisplay");
      const livesDisplay = document.getElementById("livesDisplay");
      const effectDisplay = document.getElementById("effectDisplay");
      const gameOverScreen = document.getElementById("gameOver");
      const finalScore = document.getElementById("finalScore");
      const restartBtn = document.getElementById("restartBtn");
      const mainMenu = document.getElementById("mainMenu");
      const menuBtn = document.getElementById("menuBtn");
      const songSelect = document.getElementById("songSelect");
      const bgMusic = document.getElementById("bgMusic");
      const muteBtn = document.getElementById("muteBtn");
      const gameMuteBtn = document.getElementById("gameMuteBtn");
      const pauseBtn = document.getElementById("pauseBtn");
      const pauseOverlay = document.getElementById("pauseOverlay");
      const pauseSongSelect = document.getElementById("pauseSongSelect");
      const pauseMuteBtn = document.getElementById("pauseMuteBtn");
      const pauseExitBtn = document.getElementById("pauseExitBtn");
      const pauseResumeBtn = document.getElementById("pauseResumeBtn");
      let isMuted = localStorage.getItem("neonMuted") === "1";
      function updateMute() {
        bgMusic.muted = isMuted;
        var icon = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
        if (muteBtn) muteBtn.textContent = icon;
        if (gameMuteBtn) gameMuteBtn.textContent = icon;
        localStorage.setItem("neonMuted", isMuted ? "1" : "0");
      }
      function toggleMute() {
        isMuted = !isMuted;
        updateMute();
        if (!isMuted && typeof SoundFX !== "undefined") SoundFX.blip();
      }
      document
        .getElementById("mainMenu")
        .addEventListener("click", function (e) {
          if (
            e.target &&
            e.target.closest &&
            e.target.closest("button") &&
            typeof SoundFX !== "undefined"
          )
            SoundFX.select();
        });

      // Fix scrolling on fixed-position overlays: the page body is overflow:hidden,
      // so wheel/touch events landing on non-scrollable areas (like the canvas) would
      // otherwise never scroll the visible menu/modal until the page is clicked once.
      var _scrollOverlays = [
        "mainMenu",
        "raceMenu",
        "skinShop",
        "achievementsModal",
        "gameOver",
        "tutorialModal",
      ];
      document.addEventListener(
        "wheel",
        function (e) {
          for (var i = 0; i < _scrollOverlays.length; i++) {
            var el = document.getElementById(_scrollOverlays[i]);
            if (!el) continue;
            if (getComputedStyle(el).display === "none") continue;
            if (el.scrollHeight <= el.clientHeight + 1) continue;
            var dy = e.deltaY;
            if (e.deltaMode === 1) dy *= 16;
            else if (e.deltaMode === 2) dy *= el.clientHeight;
            var before = el.scrollTop;
            el.scrollTop += dy;
            if (el.scrollTop !== before && e.cancelable) e.preventDefault();
            break;
          }
        },
        { passive: false },
      );
      if (muteBtn) muteBtn.addEventListener("click", toggleMute);
      if (gameMuteBtn) gameMuteBtn.addEventListener("click", toggleMute);
      if (pauseBtn)
        pauseBtn.addEventListener("click", function () {
          if (window.NeonCreator && NeonCreator.isPlaying()) return;
          if (!isGameOver && mainMenu.style.display === "none") togglePause();
        });
      if (pauseResumeBtn)
        pauseResumeBtn.addEventListener("click", function () {
          if (!isGameOver) togglePause();
        });
      document.addEventListener("keydown", function (e) {
        if (
          e.key === "Escape" &&
          !isGameOver &&
          mainMenu.style.display === "none"
        ) {
          if (window.NeonCreator && NeonCreator.isPlaying()) return;
          togglePause();
        }
      });
      if (pauseExitBtn)
        pauseExitBtn.addEventListener("click", function () {
          if (isPaused) togglePause();
          isPaused = false;
          pauseOverlay.style.display = "none";
          bgMusic.pause();
          bgMusic.currentTime = 0;
          cancelAnimationFrame(animationId);
          if (gameMode === "race") NeonRace.cleanup();
          var bhp = document.getElementById("bossHpDisplay");
          if (bhp) bhp.style.display = "none";
          applyCanvasBg();
          lastPulseKey = -1;
          mainMenu.style.display = "flex";
          setTimeout(updateScrollHint, 50);
        });
      if (pauseMuteBtn)
        pauseMuteBtn.addEventListener("click", function () {
          toggleMute();
          pauseMuteBtn.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
        });
      if (pauseSongSelect)
        pauseSongSelect.addEventListener("change", function () {
          songSelect.value = this.value;
          bgMusic.src = this.value;
          if (!isPaused && !isMuted) {
            bgMusic.play().catch(function (e) {});
          }
          localStorage.setItem("neonSong", this.value);
        });
      updateMute();
      var audioCtx = null;
      function getAudioCtx() {
        if (!audioCtx) {
          try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          } catch (e) {
            audioCtx = null;
          }
        }
        if (audioCtx && audioCtx.state === "suspended") {
          audioCtx.resume().catch(function () {});
        }
        return audioCtx;
      }
      var SoundFX = {
        _tone: function (freq, dur, type, vol, when, slide) {
          if (isMuted) return;
          var ac = getAudioCtx();
          if (!ac) return;
          try {
            var t0 = ac.currentTime + (when || 0);
            var osc = ac.createOscillator();
            var g = ac.createGain();
            osc.type = type || "square";
            osc.frequency.setValueAtTime(freq, t0);
            if (slide)
              osc.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
            g.gain.setValueAtTime(vol || 0.1, t0);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
            osc.connect(g);
            g.connect(ac.destination);
            osc.start(t0);
            osc.stop(t0 + dur + 0.02);
          } catch (e) {}
        },
        blip: function () {
          this._tone(660, 0.06, "square", 0.06);
        },
        select: function () {
          this._tone(440, 0.08, "square", 0.07);
          this._tone(660, 0.1, "square", 0.06, 0.05);
        },
        coin: function () {
          this._tone(880, 0.08, "square", 0.08);
          this._tone(1320, 0.12, "square", 0.07, 0.07);
        },
        hit: function () {
          this._tone(180, 0.2, "sawtooth", 0.12, 0, 90);
        },
        explode: function () {
          this._tone(120, 0.4, "sawtooth", 0.14, 0, 40);
          this._tone(90, 0.5, "square", 0.1, 0.03, 30);
        },
        shatter: function () {
          this._tone(1800, 0.12, "triangle", 0.12);
          this._tone(2400, 0.1, "triangle", 0.1, 0.03);
          this._tone(3000, 0.14, "triangle", 0.09, 0.06);
          this._tone(1400, 0.16, "square", 0.07, 0.09, 700);
        },
        powerup: function () {
          this._tone(520, 0.09, "sine", 0.1);
          this._tone(780, 0.09, "sine", 0.1, 0.09);
          this._tone(1040, 0.12, "sine", 0.1, 0.18);
        },
        boss: function () {
          this._tone(70, 0.5, "sawtooth", 0.14, 0, 45);
          this._tone(60, 0.6, "square", 0.1, 0.1, 35);
        },
        achievement: function () {
          this._tone(523, 0.1, "sine", 0.12);
          this._tone(659, 0.1, "sine", 0.12, 0.11);
          this._tone(784, 0.18, "sine", 0.13, 0.22);
        },
      };
      const menuXpDisplay = document.getElementById("menuXpDisplay");
      const btnEndlessMode = document.getElementById("btnEndlessMode");
      const btnLevelMode = document.getElementById("btnLevelMode");
      const endlessMenu = document.getElementById("endlessMenu");
      const levelsMenu = document.getElementById("levelsMenu");
      const levelButtonsContainer = document.getElementById("levelButtons");
      const levelCompleteScreen = document.getElementById("levelComplete");
      const xpEarnedDisplay = document.getElementById("xpEarnedDisplay");
      const levelMenuBtn = document.getElementById("levelMenuBtn");
      bgMusic.volume = 0.5; // Set volume to 50%

      let isGameOver = false;
      let isPaused = false;
      let score = 0;
      let lives = 1;
      let keysCount = 0;
      let highScore = localStorage.getItem("neonHighScore") || 0;
      let animationId;
      let frameCount = 0;

      const difficulties = [
        { name: "Beginner", speedMult: 0.5, spawnBase: 80, maxSimultaneous: 1 },
        { name: "Easy", speedMult: 0.8, spawnBase: 70, maxSimultaneous: 1 },
        { name: "Normal", speedMult: 1.0, spawnBase: 60, maxSimultaneous: 2 },
        { name: "Hard", speedMult: 1.3, spawnBase: 50, maxSimultaneous: 2 },
        { name: "Expert", speedMult: 1.6, spawnBase: 40, maxSimultaneous: 3 },
        { name: "Master", speedMult: 2.0, spawnBase: 30, maxSimultaneous: 3 },
        { name: "Wizard", speedMult: 2.5, spawnBase: 20, maxSimultaneous: 4 },
        { name: "Insane", speedMult: 3.0, spawnBase: 15, maxSimultaneous: 5 },
        { name: "Legend", speedMult: 3.5, spawnBase: 10, maxSimultaneous: 6 },
        { name: "God", speedMult: 4.5, spawnBase: 5, maxSimultaneous: 8 },
      ];
      let currentDifficulty = difficulties[2]; // Normal by default

      let gameMode = "endless";
      let xp = parseInt(localStorage.getItem("neonXp")) || 0;
      let currentLevel = null;
      let levelTimeRemaining = 0;
      let speedRushTime = 0;
      let speedRamp = 1;
      const meteorWarnings = [];
      let controlsInverted = false;
      let invertedFlipT = 0;
      let fadeAnimId = 0;
      let bossWaveTimer = null;

      function isScoreMode() {
        return (
          [
            "endless",
            "race",
            "survival",
            "chaos",
            "speedrush",
            "meteor",
            "reverse",
            "zen",
            "bossrush",
            "sidescroll",
            "inverted",
          ].indexOf(gameMode) !== -1
        );
      }

      // Score display only appears in time-based modes (Level, Speed Rush) and Boss Rush;
      // in all other modes it's hidden.
      function updateScoreDisplayVisibility() {
        var visible =
          gameMode === "level" ||
          gameMode === "speedrush" ||
          gameMode === "bossrush" ||
          gameMode === "survival" ||
          gameMode === "zen";
        scoreDisplay.style.display = visible ? "block" : "none";
      }

      function refreshScoreDisplay() {
        if (gameMode === "level" || gameMode === "speedrush") return;
        scoreDisplay.textContent = _t("scoreDisplay", { score: score });
      }

      // Survival score = frames survived (~60x/sec), so scale it down so
      // spawn rate / count / obstacle speed ramp like other modes' scores.
      function difficultyScore() {
        if (gameMode === "survival") return Math.floor(score / 60);
        return score;
      }

      const levels = [
        {
          id: 1,
          durationFrames: 1800,
          xpReward: 1,
          difficulty: difficulties[0],
        },
        {
          id: 2,
          durationFrames: 1800,
          xpReward: 2,
          difficulty: difficulties[1],
        },
        {
          id: 3,
          durationFrames: 1800,
          xpReward: 3,
          difficulty: difficulties[2],
        },
        {
          id: 4,
          durationFrames: 2100,
          xpReward: 4,
          difficulty: difficulties[3],
        },
        {
          id: 5,
          durationFrames: 2100,
          xpReward: 5,
          difficulty: difficulties[4],
        },
        {
          id: 6,
          durationFrames: 2400,
          xpReward: 6,
          difficulty: difficulties[5],
        },
        {
          id: 7,
          durationFrames: 2400,
          xpReward: 7,
          difficulty: difficulties[6],
        },
        {
          id: 8,
          durationFrames: 2700,
          xpReward: 8,
          difficulty: difficulties[7],
        },
        {
          id: 9,
          durationFrames: 2700,
          xpReward: 9,
          difficulty: difficulties[8],
        },
        {
          id: 10,
          durationFrames: 3000,
          xpReward: 10,
          difficulty: difficulties[9],
        },
      ];

      menuXpDisplay.textContent = _t("xpDisplay", { xp: xp });

      let unlockedLevels = JSON.parse(
        localStorage.getItem("neonUnlockedLevels"),
      ) || [1];

      function _diffKey(name) {
        var map = {
          Beginner: "diffBeginner",
          Easy: "diffEasy",
          Normal: "diffNormal",
          Hard: "diffHard",
          Expert: "diffExpert",
          Master: "diffMaster",
          Wizard: "diffWizard",
          Insane: "diffInsane",
          Legend: "diffLegend",
          God: "diffGod",
        };
        return map[name] || name;
      }
      function renderLevelsMenu() {
        levelButtonsContainer.innerHTML = "";
        levels.forEach((level) => {
          const btn = document.createElement("button");
          btn.className = "diff-btn";

          const isUnlocked = unlockedLevels.includes(level.id);

          if (!isUnlocked) {
            btn.style.opacity = "0.5";
            btn.style.filter = "grayscale(100%)";
            btn.textContent =
              "\uD83D\uDD12 " + _t(_diffKey(level.difficulty.name));
            btn.addEventListener("click", () => {
              if (
                confirm(
                  _t("unlockForXp", {
                    name: _t(_diffKey(level.difficulty.name)),
                    cost: 30,
                  }),
                )
              ) {
                if (xp >= 30) {
                  xp -= 30;
                  localStorage.setItem("neonXp", xp);
                  menuXpDisplay.textContent = _t("xpDisplay", { xp: xp });
                  unlockedLevels.push(level.id);
                  localStorage.setItem(
                    "neonUnlockedLevels",
                    JSON.stringify(unlockedLevels),
                  );
                } else {
                  alert(_t("notEnoughXp"));
                }
              }
            });
          } else {
            if (level.difficulty.name === "Wizard")
              btn.classList.add("wizard-btn");
            if (level.difficulty.name === "Insane")
              btn.classList.add("insane-btn");
            if (level.difficulty.name === "Legend")
              btn.classList.add("legend-btn");
            if (level.difficulty.name === "God") btn.classList.add("god-btn");

            btn.textContent = _t(_diffKey(level.difficulty.name));
            btn.addEventListener("click", () => {
              gameMode = "level";
              currentLevel = level;
              currentDifficulty = level.difficulty;
              mainMenu.style.display = "none";
              resetGame();
            });
          }
          levelButtonsContainer.appendChild(btn);
        });

        // Unlock All button
        if (unlockedLevels.length < levels.length) {
          const unlockAllBtn = document.createElement("button");
          unlockAllBtn.style.cssText =
            "margin-top: 15px; padding: 10px 20px; font-size: 14px; background: rgba(255, 255, 0, 0.1); border: 1px solid #ffff00; color: #ffff00; border-radius: 5px; cursor: pointer; box-shadow: 0 0 5px rgba(255, 255, 0, 0.5); width: 100%;";
          unlockAllBtn.textContent = _t("unlockAll", { cost: 70 });
          unlockAllBtn.addEventListener("click", () => {
            if (confirm(_t("unlockAllConfirm", { cost: 70 }))) {
              if (xp >= 70) {
                xp -= 70;
                localStorage.setItem("neonXp", xp);
                menuXpDisplay.textContent = _t("xpDisplay", { xp: xp });
                levels.forEach((l) => {
                  if (!unlockedLevels.includes(l.id)) unlockedLevels.push(l.id);
                });
                localStorage.setItem(
                  "neonUnlockedLevels",
                  JSON.stringify(unlockedLevels),
                );
                renderLevelsMenu();
              } else {
                alert(_t("notEnoughXp"));
              }
            }
          });
          levelButtonsContainer.appendChild(unlockAllBtn);
        }
      }
      renderLevelsMenu();

      function updateScrollHint() {
        var hint = document.getElementById("scrollHint");
        if (!hint) return;
        var menu = document.getElementById("mainMenu");
        hint.classList.toggle("visible", menu.scrollHeight > menu.clientHeight);
      }

      var scrollObserver = new ResizeObserver(updateScrollHint);
      scrollObserver.observe(document.getElementById("mainMenu"));
      updateScrollHint();

      // ===== SKIN SYSTEM =====
      var forestTexture = new Image();
      forestTexture.src = "forest_texture.png";
      var forestTexLoaded = false;
      forestTexture.onload = function () {
        forestTexLoaded = true;
      };

      var SKINS = [
        {
          id: "default",
          i18n: "skinDefault",
          name: "Default Neon",
          cost: 0,
          colors: {
            player: "#00ffff",
            obstacle: "#ff00ff",
            wall: "#ffffff",
            bg0: "#0d0d1a",
            bg1: "#1a1a3a",
          },
          texture: null,
        },
        {
          id: "forest",
          i18n: "skinForest",
          name: "Forest Nature",
          cost: 30,
          colors: {
            player: "#4ade80",
            obstacle: "#22c55e",
            wall: "#16a34a",
            bg0: "#0a1a0a",
            bg1: "#1a3a1a",
          },
          texture: forestTexture,
        },
        {
          id: "lava",
          i18n: "skinLava",
          name: "Lava",
          cost: 50,
          colors: {
            player: "#ff6b35",
            obstacle: "#ef4444",
            wall: "#dc2626",
            bg0: "#1a0a0a",
            bg1: "#3a1a0a",
          },
          texture: null,
        },
        {
          id: "ocean",
          i18n: "skinOcean",
          name: "Deep Ocean",
          cost: 40,
          colors: {
            player: "#38bdf8",
            obstacle: "#0ea5e9",
            wall: "#0284c7",
            bg0: "#0a0a1a",
            bg1: "#0a1a3a",
          },
          texture: null,
        },
        {
          id: "midnight",
          i18n: "skinMidnight",
          name: "Midnight",
          cost: 45,
          colors: {
            player: "#a78bfa",
            obstacle: "#7c3aed",
            wall: "#6d28d9",
            bg0: "#0a0a1a",
            bg1: "#1a0a2a",
          },
          texture: null,
        },
        {
          id: "gold",
          i18n: "skinGold",
          name: "Royal Gold",
          cost: 60,
          colors: {
            player: "#fbbf24",
            obstacle: "#f59e0b",
            wall: "#d97706",
            bg0: "#1a1a0a",
            bg1: "#2a1a0a",
          },
          texture: null,
        },
        {
          id: "candy",
          i18n: "skinCandy",
          name: "Candy Pop",
          cost: 35,
          colors: {
            player: "#f472b6",
            obstacle: "#ec4899",
            wall: "#db2777",
            bg0: "#1a0a1a",
            bg1: "#2a0a1a",
          },
          texture: null,
        },
      ];
      var ownedSkins = (function () {
        try {
          return (
            JSON.parse(localStorage.getItem("neonOwnedSkins")) || ["default"]
          );
        } catch (e) {
          return ["default"];
        }
      })();
      var equippedSkinId =
        localStorage.getItem("neonEquippedSkin") || "default";
      if (ownedSkins.indexOf(equippedSkinId) === -1) equippedSkinId = "default";
      var activeSkin =
        SKINS.find(function (s) {
          return s.id === equippedSkinId;
        }) || SKINS[0];

      function renderSkinShop() {
        var list = document.getElementById("skinList");
        if (!list) return;
        var xpDisplay = document.getElementById("shopXpDisplay");
        if (xpDisplay) xpDisplay.textContent = _t("xpDisplay", { xp: xp });
        list.innerHTML = "";
        SKINS.forEach(function (skin) {
          var owned = ownedSkins.indexOf(skin.id) !== -1;
          var equipped = equippedSkinId === skin.id;
          var card = document.createElement("div");
          card.className =
            "skin-card" +
            (owned ? " owned" : "") +
            (equipped ? " equipped" : "");

          var swatches = document.createElement("div");
          swatches.className = "swatches";
          var colorKeys = ["player", "obstacle", "wall"];
          colorKeys.forEach(function (k) {
            var sw = document.createElement("div");
            sw.className = "swatch";
            sw.style.background = skin.colors[k];
            swatches.appendChild(sw);
          });

          var info = document.createElement("div");
          info.className = "skin-info";
          var nameEl = document.createElement("div");
          nameEl.className = "skin-name";
          nameEl.textContent =
            skin.i18n && typeof _t === "function" ? _t(skin.i18n) : skin.name;
          var costEl = document.createElement("div");
          costEl.className = "skin-cost";
          if (skin.cost === 0) costEl.textContent = _t("shopFree");
          else costEl.textContent = _t("shopCost", { cost: skin.cost });

          info.appendChild(nameEl);
          info.appendChild(costEl);

          var btn = document.createElement("button");
          btn.className = "skin-btn";
          if (equipped) {
            btn.textContent = _t("shopEquipped");
            btn.className += " equipped";
          } else if (owned) {
            btn.textContent = _t("shopEquip");
            btn.className += " equip";
            btn.addEventListener("click", function () {
              equippedSkinId = skin.id;
              localStorage.setItem("neonEquippedSkin", equippedSkinId);
              activeSkin =
                SKINS.find(function (s) {
                  return s.id === equippedSkinId;
                }) || SKINS[0];
              window._skinPattern = null;
              applyCanvasBg();
              renderSkinShop();
            });
          } else {
            btn.textContent = _t("shopBuy");
            btn.className += " buy";
            btn.addEventListener("click", function () {
              if (xp >= skin.cost) {
                xp -= skin.cost;
                localStorage.setItem("neonXp", xp);
                menuXpDisplay.textContent = _t("xpDisplay", { xp: xp });
                ownedSkins.push(skin.id);
                localStorage.setItem(
                  "neonOwnedSkins",
                  JSON.stringify(ownedSkins),
                );
                equippedSkinId = skin.id;
                localStorage.setItem("neonEquippedSkin", equippedSkinId);
                activeSkin =
                  SKINS.find(function (s) {
                    return s.id === equippedSkinId;
                  }) || SKINS[0];
                window._skinPattern = null;
                applyCanvasBg();
                renderSkinShop();
              } else {
                alert(_t("notEnoughXp"));
              }
            });
          }

          card.appendChild(swatches);
          card.appendChild(info);
          card.appendChild(btn);
          list.appendChild(card);
        });
      }

      function applyCanvasBg() {
        var canvas = document.getElementById("gameCanvas");
        if (activeSkin && activeSkin.colors) {
          canvas.style.background =
            "linear-gradient(180deg, " +
            activeSkin.colors.bg0 +
            " 0%, " +
            activeSkin.colors.bg1 +
            " 100%)";
        }
      }
      applyCanvasBg();

      document
        .getElementById("btnShop")
        ?.addEventListener("click", function () {
          document.getElementById("skinShop").style.display = "block";
          renderSkinShop();
        });
      document
        .getElementById("shopCloseBtn")
        ?.addEventListener("click", function () {
          document.getElementById("skinShop").style.display = "none";
        });
      document
        .getElementById("btnAchievements")
        ?.addEventListener("click", function () {
          document.getElementById("achievementsModal").style.display = "block";
          renderAchievements();
        });
      document
        .getElementById("achCloseBtn")
        ?.addEventListener("click", function () {
          document.getElementById("achievementsModal").style.display = "none";
        });

      document
        .getElementById("btnCreator")
        ?.addEventListener("click", function () {
          if (window.NeonCreator) {
            mainMenu.style.display = "none";
            NeonCreator.open();
          }
        });

      const btnNinjaMode = document.getElementById("btnNinjaMode");
      const ninjaMenu = document.getElementById("ninjaMenu");

      btnEndlessMode.addEventListener("click", () => {
        endlessMenu.style.display = "block";
        levelsMenu.style.display = "none";
        ninjaMenu.style.display = "none";
        document.getElementById("raceMenu").style.display = "none";
        document.getElementById("survivalMenu").style.display = "none";
        document.getElementById("chaosMenu").style.display = "none";
        document.getElementById("speedRushMenu").style.display = "none";
        document.getElementById("meteorMenu").style.display = "none";
        document.getElementById("sideScrollMenu").style.display = "none";
        document.getElementById("invertedMenu").style.display = "none";
        document.getElementById("reverseMenu").style.display = "none";
        document.getElementById("zenMenu").style.display = "none";
        document.getElementById("bossRushMenu").style.display = "none";
        setTimeout(updateScrollHint, 50);
      });

      btnLevelMode.addEventListener("click", () => {
        endlessMenu.style.display = "none";
        levelsMenu.style.display = "block";
        ninjaMenu.style.display = "none";
        document.getElementById("raceMenu").style.display = "none";
        document.getElementById("survivalMenu").style.display = "none";
        document.getElementById("chaosMenu").style.display = "none";
        document.getElementById("speedRushMenu").style.display = "none";
        document.getElementById("meteorMenu").style.display = "none";
        document.getElementById("sideScrollMenu").style.display = "none";
        document.getElementById("invertedMenu").style.display = "none";
        document.getElementById("reverseMenu").style.display = "none";
        document.getElementById("zenMenu").style.display = "none";
        document.getElementById("bossRushMenu").style.display = "none";
        setTimeout(updateScrollHint, 50);
      });

      btnNinjaMode.addEventListener("click", () => {
        endlessMenu.style.display = "none";
        levelsMenu.style.display = "none";
        ninjaMenu.style.display = "block";
        document.getElementById("raceMenu").style.display = "none";
        document.getElementById("survivalMenu").style.display = "none";
        document.getElementById("chaosMenu").style.display = "none";
        document.getElementById("speedRushMenu").style.display = "none";
        document.getElementById("meteorMenu").style.display = "none";
        document.getElementById("sideScrollMenu").style.display = "none";
        document.getElementById("invertedMenu").style.display = "none";
        document.getElementById("reverseMenu").style.display = "none";
        document.getElementById("zenMenu").style.display = "none";
        document.getElementById("bossRushMenu").style.display = "none";
        setTimeout(updateScrollHint, 50);
      });

      const btnSurvivalMode = document.getElementById("btnSurvivalMode");
      const btnChaosMode = document.getElementById("btnChaosMode");
      const btnSpeedRushMode = document.getElementById("btnSpeedRushMode");
      const btnMeteorMode = document.getElementById("btnMeteorMode");
      const btnReverseMode = document.getElementById("btnReverseMode");
      const btnZenMode = document.getElementById("btnZenMode");
      const btnBossMode = document.getElementById("btnBossMode");
      const btnSideScrollMode = document.getElementById("btnSideScrollMode");
      const btnInvertedMode = document.getElementById("btnInvertedMode");

      function hideAllModeMenus() {
        endlessMenu.style.display = "none";
        levelsMenu.style.display = "none";
        ninjaMenu.style.display = "none";
        document.getElementById("raceMenu").style.display = "none";
        document.getElementById("survivalMenu").style.display = "none";
        document.getElementById("chaosMenu").style.display = "none";
        document.getElementById("speedRushMenu").style.display = "none";
        document.getElementById("meteorMenu").style.display = "none";
        document.getElementById("sideScrollMenu").style.display = "none";
        document.getElementById("invertedMenu").style.display = "none";
        document.getElementById("reverseMenu").style.display = "none";
        document.getElementById("zenMenu").style.display = "none";
        document.getElementById("bossRushMenu").style.display = "none";
      }

      btnSurvivalMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("survivalMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnChaosMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("chaosMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnSpeedRushMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("speedRushMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnMeteorMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("meteorMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnSideScrollMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("sideScrollMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnInvertedMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("invertedMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnReverseMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("reverseMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnZenMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("zenMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      btnBossMode.addEventListener("click", () => {
        hideAllModeMenus();
        document.getElementById("bossRushMenu").style.display = "block";
        setTimeout(updateScrollHint, 50);
      });

      document.querySelectorAll(".mode-back-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document.getElementById(btn.dataset.menu).style.display = "none";
          setTimeout(updateScrollHint, 50);
        });
      });

      const player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 30,
        height: 30,
        color: "#00ffff",
        speed: 7,
        dx: 0,
        dy: 0,
        invulnerable: 0,
      };

      const obstacles = [];
      const bladeTrail = [];
      let isSlicing = false;
      const particles = [];
      const glassShards = [];
      const coins = [];
      const powerups = [];
      const projectiles = [];
      const keysArr = [];
      const walls = [];
      const portals = [];
      let activeEffects = {
        slowTime: 0,
        blaster: 0,
        speedPortal: 0,
        isFastPortal: false,
      };

      // Input handling
      document.addEventListener("keydown", (e) => {
        const dir =
          gameMode === "reverse" ||
          (gameMode === "inverted" && controlsInverted)
            ? -1
            : 1;
        if (e.key === "ArrowLeft" || e.key === "a")
          player.dx = -player.speed * dir;
        if (e.key === "ArrowRight" || e.key === "d")
          player.dx = player.speed * dir;
        if (e.key === "ArrowUp" || e.key === "w")
          player.dy = -player.speed * dir;
        if (e.key === "ArrowDown" || e.key === "s")
          player.dy = player.speed * dir;
      });

      document.addEventListener("keyup", (e) => {
        if (
          e.key === "ArrowLeft" ||
          e.key === "a" ||
          e.key === "ArrowRight" ||
          e.key === "d"
        ) {
          player.dx = 0;
        }
        if (
          e.key === "ArrowUp" ||
          e.key === "w" ||
          e.key === "ArrowDown" ||
          e.key === "s"
        ) {
          player.dy = 0;
        }
      });

      function setPlayerFromPointer(mx, my) {
        if (
          gameMode === "reverse" ||
          (gameMode === "inverted" && controlsInverted)
        ) {
          player.x = canvas.width - mx - player.width / 2;
          player.y = canvas.height - my - player.height / 2;
        } else {
          player.x = mx - player.width / 2;
          player.y = my - player.height / 2;
        }
      }

      // Mouse movement for precise control
      canvas.addEventListener("mousedown", (e) => {
        if (isGameOver) return;
        if (gameMode === "ninja") {
          isSlicing = true;
          bladeTrail.length = 0;
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          bladeTrail.push({
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
          });
        }
      });

      window.addEventListener("mouseup", () => {
        isSlicing = false;
        bladeTrail.length = 0;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (isGameOver) return;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;

        if (gameMode === "ninja") {
          if (isSlicing) {
            bladeTrail.push({ x: mx, y: my });
            if (bladeTrail.length > 10) bladeTrail.shift();
          }
        } else {
          setPlayerFromPointer(mx, my);
        }
      });

      // Touch movement for mobile support
      canvas.addEventListener(
        "touchstart",
        (e) => {
          if (isGameOver) return;
          e.preventDefault();
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const touch = e.touches[0];
          const mx = (touch.clientX - rect.left) * scaleX;
          const my = (touch.clientY - rect.top) * scaleY;

          if (gameMode === "ninja") {
            isSlicing = true;
            bladeTrail.length = 0;
            bladeTrail.push({ x: mx, y: my });
          } else {
            setPlayerFromPointer(mx, my);
          }
        },
        { passive: false },
      );

      window.addEventListener("touchend", () => {
        isSlicing = false;
        bladeTrail.length = 0;
      });

      canvas.addEventListener(
        "touchmove",
        (e) => {
          if (isGameOver) return;
          e.preventDefault();
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          const touch = e.touches[0];
          const mx = (touch.clientX - rect.left) * scaleX;
          const my = (touch.clientY - rect.top) * scaleY;

          if (gameMode === "ninja") {
            if (isSlicing) {
              bladeTrail.push({ x: mx, y: my });
              if (bladeTrail.length > 10) bladeTrail.shift();
            }
          } else {
            setPlayerFromPointer(mx, my);
          }
        },
        { passive: false },
      );

      class Obstacle {
        constructor() {
          this.width = Math.random() * 40 + 20;
          this.height = 20;
          this.x = Math.random() * (canvas.width - this.width);
          this.y = -50;
          const baseSpeed = Math.random() * 3 + 3 + difficultyScore() * 0.05;
          this.speed = baseSpeed * currentDifficulty.speedMult;
          this.color = "#ff00ff";
          this.type = "standard";

          if (gameMode === "ninja") {
            if (Math.random() < 0.1) {
              this.type = "bomb";
              this.color = "#ff00ff"; // Pink Bomb
            } else {
              this.color = "#00ffff"; // Cyan Fruit
            }
          }
          this.passed = false;
        }

        draw() {
          var oColor =
            activeSkin && activeSkin.colors && gameMode !== "ninja"
              ? activeSkin.colors.obstacle
              : this.color;
          ctx.fillStyle = oColor;
          ctx.shadowBlur = 15;
          ctx.shadowColor = oColor;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.shadowBlur = 0;
        }

        update() {
          const speedMod =
            (activeEffects.slowTime > 0 ? 0.3 : 1) *
            (activeEffects.speedPortal > 0
              ? activeEffects.isFastPortal
                ? 2.0
                : 0.6
              : 1);
          this.y += this.speed * speedMod * speedRamp;
          this.draw();

          if (!this.passed && this.y > player.y + player.height) {
            if (gameMode !== "zen" && gameMode !== "ninja") {
              score++;
              refreshScoreDisplay();
            }
            if (gameMode === "race") NeonRace.onScoreUpdate(score);
            this.passed = true;
            // Mini explosion when passing an obstacle safely occasionally
            if (score % 5 === 0)
              createExplosion(this.x + this.width / 2, this.y, this.color, 5);
          }
        }
      }

      class HorizontalObstacle {
        constructor() {
          this.height = Math.random() * 40 + 20;
          this.width = 20;
          this.y = Math.random() * (canvas.height - this.height);
          this.x = canvas.width + 50;
          const baseSpeed = Math.random() * 3 + 3 + difficultyScore() * 0.05;
          this.speed = baseSpeed * currentDifficulty.speedMult;
          this.color = "#ff00ff";
          this.type = "standard";
          this.passed = false;
        }

        draw() {
          var oColor =
            activeSkin && activeSkin.colors && gameMode !== "ninja"
              ? activeSkin.colors.obstacle
              : this.color;
          ctx.fillStyle = oColor;
          ctx.shadowBlur = 15;
          ctx.shadowColor = oColor;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.shadowBlur = 0;
        }

        update() {
          const speedMod =
            (activeEffects.slowTime > 0 ? 0.3 : 1) *
            (activeEffects.speedPortal > 0
              ? activeEffects.isFastPortal
                ? 2.0
                : 0.6
              : 1);
          this.x -= this.speed * speedMod * speedRamp;
          this.draw();

          if (!this.passed && this.x + this.width < player.x) {
            if (gameMode !== "zen" && gameMode !== "ninja") {
              score++;
              refreshScoreDisplay();
            }
            if (gameMode === "race") NeonRace.onScoreUpdate(score);
            this.passed = true;
            if (score % 5 === 0)
              createExplosion(this.x, this.y + this.height / 2, this.color, 5);
          }
        }
      }

      class MultiDirectionObstacle {
        constructor(dir) {
          this.width = Math.random() * 40 + 20;
          this.height = Math.random() * 40 + 20;
          const baseSpeed = Math.random() * 3 + 3 + difficultyScore() * 0.05;
          this.speed = baseSpeed * currentDifficulty.speedMult;
          this.color = "#ff00ff";
          this.type = "standard";
          this.passed = false;
          this.dir = dir !== undefined ? dir : Math.floor(Math.random() * 4);
          switch (this.dir) {
            case 0: // top -> bottom
              this.x = Math.random() * (canvas.width - this.width);
              this.y = -this.height;
              this.dx = 0;
              this.dy = 1;
              break;
            case 1: // right -> left
              this.x = canvas.width + this.width;
              this.y = Math.random() * (canvas.height - this.height);
              this.dx = -1;
              this.dy = 0;
              break;
            case 2: // bottom -> top
              this.x = Math.random() * (canvas.width - this.width);
              this.y = canvas.height + this.height;
              this.dx = 0;
              this.dy = -1;
              break;
            default: // left -> right
              this.x = -this.width;
              this.y = Math.random() * (canvas.height - this.height);
              this.dx = 1;
              this.dy = 0;
              break;
          }
        }

        draw() {
          var oColor =
            activeSkin && activeSkin.colors && gameMode !== "ninja"
              ? activeSkin.colors.obstacle
              : this.color;
          ctx.fillStyle = oColor;
          ctx.shadowBlur = 15;
          ctx.shadowColor = oColor;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.shadowBlur = 0;
        }

        update() {
          const speedMod =
            (activeEffects.slowTime > 0 ? 0.3 : 1) *
            (activeEffects.speedPortal > 0
              ? activeEffects.isFastPortal
                ? 2.0
                : 0.6
              : 1);
          this.x += this.dx * this.speed * speedMod * speedRamp;
          this.y += this.dy * this.speed * speedMod * speedRamp;
          this.draw();

          if (!this.passed) {
            let crossed = false;
            if (this.dir === 0 && this.y > player.y + player.height)
              crossed = true;
            else if (this.dir === 1 && this.x + this.width < player.x)
              crossed = true;
            else if (this.dir === 2 && this.y + this.height < player.y)
              crossed = true;
            else if (this.dir === 3 && this.x > player.x + player.width)
              crossed = true;
            if (crossed) {
              this.passed = true;
              if (gameMode !== "zen" && gameMode !== "ninja") {
                score++;
                refreshScoreDisplay();
              }
              if (gameMode === "race") NeonRace.onScoreUpdate(score);
              if (score % 5 === 0)
                createExplosion(
                  this.x + this.width / 2,
                  this.y + this.height / 2,
                  this.color,
                  5,
                );
            }
          }
        }
      }

      class Particle {
        constructor(x, y, color) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 5 + 2;
          this.speedX = Math.random() * 8 - 4;
          this.speedY = Math.random() * 8 - 4;
          this.color = color;
          this.life = 1;
        }
        draw() {
          ctx.globalAlpha = this.life;
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
        update() {
          this.x += this.speedX;
          this.y += this.speedY;
          this.life -= 0.03;
          if (this.life > 0) this.draw();
        }
      }

      function createExplosion(x, y, color, amount = 20) {
        for (let i = 0; i < amount; i++) {
          particles.push(new Particle(x, y, color));
        }
      }

      class GlassShard {
        constructor(x, y, color) {
          this.x = x;
          this.y = y;
          this.size = Math.random() * 12 + 5;
          const ang = Math.random() * Math.PI * 2;
          const spd = Math.random() * 7 + 3;
          this.dx = Math.cos(ang) * spd;
          this.dy = Math.sin(ang) * spd - 2;
          this.gravity = 0.18;
          this.rot = Math.random() * Math.PI * 2;
          this.rotSpeed = (Math.random() - 0.5) * 0.35;
          this.color = color;
          this.life = 1;
        }
        draw() {
          ctx.save();
          ctx.globalAlpha = Math.max(0, this.life);
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rot);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.moveTo(-this.size / 2, -this.size / 2);
          ctx.lineTo(this.size / 2, -this.size / 6);
          ctx.lineTo(this.size / 4, this.size / 2);
          ctx.lineTo(-this.size / 3, this.size / 6);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        update() {
          this.x += this.dx;
          this.y += this.dy;
          this.dy += this.gravity;
          this.dx *= 0.99;
          this.rot += this.rotSpeed;
          this.life -= 0.02;
          if (this.life > 0) this.draw();
        }
      }

      function handleGlassShards() {
        for (let i = 0; i < glassShards.length; i++) {
          glassShards[i].update();
          if (glassShards[i].life <= 0) {
            glassShards.splice(i, 1);
            i--;
          }
        }
      }

      function spawnBossStorm() {
        if (frameCount % 25 === 0) {
          var cnt = Math.random() < 0.3 ? 2 : 1;
          for (var i = 0; i < cnt; i++) {
            if (Math.random() > 0.4) {
              obstacles.push(new Obstacle());
            } else {
              obstacles.push(new HorizontalObstacle());
            }
            obstacles[obstacles.length - 1].speed *= 0.75;
          }
        }
        if (frameCount % 20 === 0) {
          if (bossWave < 10 || Math.random() < 0.12) {
            var cc = bossWave < 10 ? 2 : 1;
            for (var ci = 0; ci < cc; ci++) {
              coins.push(new Coin());
            }
          }
        }
        if (frameCount % 110 === 0 && meteorWarnings.length < 2) {
          meteorWarnings.push({
            x: 0,
            y: 0,
            timer: 55,
            dir: 0,
            stormSlow: 0.8,
            w: Math.random() * 30 + 20,
            h: Math.random() * 30 + 20,
          });
          var w = meteorWarnings[meteorWarnings.length - 1];
          var dir = Math.floor(Math.random() * 4);
          w.dir = dir;
          switch (dir) {
            case 0:
              w.x = Math.random() * (canvas.width - w.w);
              w.y = 6;
              break;
            case 1:
              w.x = canvas.width - w.w - 6;
              w.y = Math.random() * (canvas.height - w.h);
              break;
            case 2:
              w.x = Math.random() * (canvas.width - w.w);
              w.y = canvas.height - w.h - 6;
              break;
            default:
              w.x = 6;
              w.y = Math.random() * (canvas.height - w.h);
              break;
          }
        }
      }

      class PowerUp {
        constructor() {
          this.radius = 10;
          this.x =
            Math.random() * (canvas.width - this.radius * 2) + this.radius;
          this.y = -50;
          this.speed = 2.5;
          // 0 = Slow Time (green), 1 = Blaster (red)
          this.type = Math.random() > 0.5 ? "slowTime" : "blaster";
          this.color = this.type === "slowTime" ? "#00ff00" : "#ff0000";
        }
        draw() {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.radius);
          ctx.lineTo(this.x + this.radius, this.y);
          ctx.lineTo(this.x, this.y + this.radius);
          ctx.lineTo(this.x - this.radius, this.y);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        update() {
          this.y += this.speed;
          this.draw();
        }
      }

      class Projectile {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.width = 4;
          this.height = 15;
          this.speed = 10;
          this.color = "#ff0000";
        }
        draw() {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = this.color;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          ctx.shadowBlur = 0;
        }
        update() {
          this.y -= this.speed;
          this.draw();
        }
      }

      class Coin {
        constructor() {
          this.radius = 12;
          this.x =
            Math.random() * (canvas.width - this.radius * 2) + this.radius;
          this.y = -50;
          this.speed = 3;
          this.color = "#ffff00";
        }
        draw() {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#ccaa00";
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius - 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        update() {
          this.y += this.speed;
          this.draw();
        }
      }

      class Key {
        constructor() {
          this.width = 15;
          this.height = 25;
          this.x = Math.random() * (canvas.width - this.width);
          this.y = -50;
          this.speed = 3.5;
          this.color = "#ffaa00";
        }
        draw() {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
          // Simple key shape: fill the circular head first, then the shaft and teeth
          ctx.beginPath();
          ctx.arc(this.x + this.width / 2, this.y + 8, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(this.x + this.width / 2 - 2, this.y + 16, 4, 15);
          ctx.fillRect(this.x + this.width / 2, this.y + 24, 6, 4);
          ctx.fillRect(this.x + this.width / 2, this.y + 28, 6, 4);
          ctx.shadowBlur = 0;
        }
        update() {
          this.y += this.speed;
          this.draw();
        }
      }

      class Wall {
        constructor() {
          this.width = canvas.width; // spans whole screen
          this.height = 30;
          this.x = 0;
          this.y = -100;
          this.speed = 2 * currentDifficulty.speedMult;
          this.color = "#ffffff";
        }
        draw() {
          var wColor =
            activeSkin && activeSkin.colors
              ? activeSkin.colors.wall
              : this.color;
          ctx.fillStyle = wColor;
          ctx.shadowBlur = 20;
          ctx.shadowColor = wColor;
          ctx.fillRect(this.x, this.y, this.width, this.height);
          // Draw lock icon in middle
          ctx.fillStyle = "#000";
          ctx.fillRect(canvas.width / 2 - 5, this.y + 10, 10, 10);
          ctx.shadowBlur = 0;
        }
        update() {
          const speedMod =
            (activeEffects.slowTime > 0 ? 0.3 : 1) *
            (activeEffects.speedPortal > 0
              ? activeEffects.isFastPortal
                ? 2.0
                : 0.6
              : 1);
          this.y += this.speed * speedMod;
          this.draw();
        }
      }

      class SpeedPortal {
        constructor() {
          this.radius = 20;
          this.x =
            Math.random() * (canvas.width - this.radius * 2) + this.radius;
          this.y = -50;
          this.speed = 2.5;
          this.isFast = Math.random() > 0.5;
          this.color = this.isFast ? "#ff00ff" : "#00ffff";
        }
        draw() {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 4;
          ctx.shadowBlur = 15;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.ellipse(
            this.x,
            this.y,
            this.radius / 2,
            this.radius,
            0,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(
            this.x,
            this.y,
            this.radius / 4,
            this.radius / 2,
            0,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
        update() {
          this.y += this.speed;
          this.draw();
        }
      }

      function drawPlayer() {
        player.x += player.dx;
        player.y += player.dy;

        // Boundary collision
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width)
          player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height)
          player.y = canvas.height - player.height;

        // Flash effect when invulnerable
        if (player.invulnerable > 0) {
          player.invulnerable--;
          if (Math.floor(frameCount / 5) % 2 === 0) return;
        }

        var pc =
          activeSkin && activeSkin.colors
            ? activeSkin.colors.player
            : player.color;
        ctx.fillStyle = pc;
        ctx.shadowBlur = 20;
        ctx.shadowColor = pc;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;
      }

      function lineIntersectsRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        if (x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) return true;
        if (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh) return true;
        function lineIntersectsLine(x1, y1, x2, y2, x3, y3, x4, y4) {
          const den = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
          if (den === 0) return false;
          const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / den;
          const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / den;
          return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
        }
        return (
          lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
          lineIntersectsLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh) ||
          lineIntersectsLine(x1, y1, x2, y2, rx, ry, rx, ry + rh) ||
          lineIntersectsLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh)
        );
      }

      function handleObstacles() {
        if (gameMode === "bossrush") {
          if (bossStormActive) {
            if (bossStormRemaining > 0) bossStormRemaining--;
            if (bossStormRemaining <= 0) {
              bossStormActive = false;
            } else {
              spawnBossStorm();
            }
          }
        } else {
          // Spawn rate gets faster as score increases
          let spawnRate = Math.max(
            5,
            currentDifficulty.spawnBase - Math.floor(difficultyScore()),
          );
          if (gameMode === "survival") {
            spawnRate = Math.max(4, Math.floor(spawnRate * 0.7));
          }
          if (gameMode === "meteor") {
            spawnRate = Math.max(
              10,
              Math.floor(currentDifficulty.spawnBase * 1.4),
            );
          }

          if (frameCount % spawnRate === 0) {
            // Spawn multiple obstacles at once as score goes up
            const count = Math.min(
              currentDifficulty.maxSimultaneous,
              1 + Math.floor(difficultyScore() / 15), // +1 obstacle every 15 points
            );

            for (let i = 0; i < count; i++) {
              if (gameMode === "chaos") {
                obstacles.push(new MultiDirectionObstacle());
              } else if (gameMode === "meteor") {
                if (meteorWarnings.length < 3) {
                  meteorWarnings.push({
                    x: 0,
                    y: 0,
                    timer: 50,
                    dir: 0,
                    w: Math.random() * 30 + 20,
                    h: Math.random() * 30 + 20,
                  });
                  var w = meteorWarnings[meteorWarnings.length - 1];
                  var dir = Math.floor(Math.random() * 4);
                  w.dir = dir;
                  switch (dir) {
                    case 0:
                      w.x = Math.random() * (canvas.width - w.w);
                      w.y = 6;
                      break;
                    case 1:
                      w.x = canvas.width - w.w - 6;
                      w.y = Math.random() * (canvas.height - w.h);
                      break;
                    case 2:
                      w.x = Math.random() * (canvas.width - w.w);
                      w.y = canvas.height - w.h - 6;
                      break;
                    default:
                      w.x = 6;
                      w.y = Math.random() * (canvas.height - w.h);
                      break;
                  }
                }
              } else if (gameMode === "sidescroll") {
                // Runner: mostly tall walls racing in from the right, occasional droppers
                if (Math.random() < 0.75) {
                  const o = new HorizontalObstacle();
                  o.height = Math.random() * 160 + 110;
                  o.y = Math.random() * (canvas.height - o.height);
                  o.speed = o.speed * 1.15;
                  obstacles.push(o);
                } else {
                  const o = new Obstacle();
                  o.x = Math.random() * (canvas.width * 0.5);
                  obstacles.push(o);
                }
              } else if (Math.random() > 0.5) {
                obstacles.push(new Obstacle());
              } else {
                obstacles.push(new HorizontalObstacle());
              }
            }
          }
        }

        // Meteor warnings -> spawn meteors when timer expires
        for (let i = meteorWarnings.length - 1; i >= 0; i--) {
          const warn = meteorWarnings[i];
          warn.timer--;
          if (warn.timer <= 0) {
            const m = new MultiDirectionObstacle(warn.dir);
            m.x = warn.x;
            m.y = warn.y;
            m.width = warn.w;
            m.height = warn.h;
            if (warn.stormSlow) m.speed *= warn.stormSlow;
            obstacles.push(m);
            meteorWarnings.splice(i, 1);
          }
        }

        // Draw meteor warning indicators (flashing red)
        for (let i = 0; i < meteorWarnings.length; i++) {
          const warn = meteorWarnings[i];
          if (Math.floor(warn.timer / 5) % 2 === 0) {
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 3;
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ff0000";
            ctx.strokeRect(warn.x, warn.y, warn.w, warn.h);
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(warn.x, warn.y, warn.w, warn.h);
            ctx.shadowBlur = 0;
          }
        }

        for (let i = 0; i < obstacles.length; i++) {
          obstacles[i].update();

          let sliced = false;
          if (gameMode === "ninja" && bladeTrail.length > 1) {
            for (let t = 0; t < bladeTrail.length - 1; t++) {
              if (
                lineIntersectsRect(
                  bladeTrail[t].x,
                  bladeTrail[t].y,
                  bladeTrail[t + 1].x,
                  bladeTrail[t + 1].y,
                  obstacles[i].x,
                  obstacles[i].y,
                  obstacles[i].width,
                  obstacles[i].height,
                )
              ) {
                sliced = true;
                break;
              }
            }
          }

          if (sliced) {
            if (obstacles[i].type === "bomb") {
              if (lives > 1) {
                lives--;
                livesDisplay.textContent = _t("livesDisplay", { n: lives });
                createExplosion(
                  obstacles[i].x + obstacles[i].width / 2,
                  obstacles[i].y + obstacles[i].height / 2,
                  obstacles[i].color,
                  30,
                );
                SoundFX.hit();
                obstacles.splice(i, 1);
                i--;
                continue;
              } else {
                gameOver();
                return;
              }
            } else {
              score++;
              scoreDisplay.textContent = _t("scoreDisplay", { score: score });
              createExplosion(
                obstacles[i].x + obstacles[i].width / 2,
                obstacles[i].y + obstacles[i].height / 2,
                obstacles[i].color,
                20,
              );
              obstacles.splice(i, 1);
              i--;
              continue;
            }
          }

          // Collision detection with player (non-ninja). Zen mode = no collision death.
          if (
            gameMode !== "ninja" &&
            gameMode !== "zen" &&
            player.invulnerable <= 0 &&
            player.x < obstacles[i].x + obstacles[i].width &&
            player.x + player.width > obstacles[i].x &&
            player.y < obstacles[i].y + obstacles[i].height &&
            player.height + player.y > obstacles[i].y
          ) {
            if (lives > 1) {
              lives--;
              livesDisplay.textContent = _t("livesDisplay", { n: lives });
              createExplosion(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.color,
                15,
              );
              createExplosion(
                obstacles[i].x + obstacles[i].width / 2,
                obstacles[i].y + obstacles[i].height / 2,
                obstacles[i].color,
                15,
              );
              SoundFX.hit();
              obstacles.splice(i, 1);
              i--;
              player.invulnerable = 60; // Approx 1 second of invulnerability
              continue;
            } else {
              gameOver();
              return;
            }
          }

          // Remove off-screen obstacles
          if (
            obstacles[i].y > canvas.height + 150 ||
            obstacles[i].y + obstacles[i].height < -50 ||
            obstacles[i].x + obstacles[i].width < -50 ||
            obstacles[i].x > canvas.width + 150
          ) {
            if (gameMode === "ninja" && obstacles[i].type !== "bomb") {
              if (lives > 1) {
                lives--;
                livesDisplay.textContent = _t("livesDisplay", { n: lives });
                SoundFX.hit();
              } else {
                gameOver();
                return;
              }
            }
            obstacles.splice(i, 1);
            i--;
          }
        }
      }

      function handleCoins() {
        // Spawn coins occasionally (roughly once every 400 frames, 80% chance)
        if (
          gameMode !== "bossrush" &&
          frameCount % 400 === 0 &&
          Math.random() > 0.2
        ) {
          coins.push(new Coin());
        }

        for (let i = 0; i < coins.length; i++) {
          coins[i].update();

          let sliced = false;
          if (gameMode === "ninja" && bladeTrail.length > 1) {
            for (let t = 0; t < bladeTrail.length - 1; t++) {
              // Using a square approx for circle intersection
              if (
                lineIntersectsRect(
                  bladeTrail[t].x,
                  bladeTrail[t].y,
                  bladeTrail[t + 1].x,
                  bladeTrail[t + 1].y,
                  coins[i].x - coins[i].radius,
                  coins[i].y - coins[i].radius,
                  coins[i].radius * 2,
                  coins[i].radius * 2,
                )
              ) {
                sliced = true;
                break;
              }
            }
          }

          const distX = Math.abs(coins[i].x - player.x - player.width / 2);
          const distY = Math.abs(coins[i].y - player.y - player.height / 2);

          if (
            sliced ||
            (gameMode !== "ninja" &&
              distX < player.width / 2 + coins[i].radius &&
              distY < player.height / 2 + coins[i].radius)
          ) {
            if (gameMode === "zen" || gameMode === "survival") {
              score++;
              refreshScoreDisplay();
            } else {
              lives++;
              livesDisplay.textContent = _t("livesDisplay", { n: lives });
              if (gameMode === "speedrush") {
                score++;
                refreshScoreDisplay();
              }
            }
            createExplosion(coins[i].x, coins[i].y, coins[i].color, 15);
            SoundFX.coin();
            gameStats.coins = (gameStats.coins || 0) + 1;
            saveStats();
            if (gameStats.coins === 50 || gameStats.coins === 200)
              checkAchievements();
            coins.splice(i, 1);
            i--;
            continue;
          }

          if (coins[i].y > canvas.height + 20) {
            coins.splice(i, 1);
            i--;
          }
        }
      }

      function handlePowerUps() {
        const powerUpInterval = gameMode === "chaos" ? 250 : 600;
        if (frameCount % powerUpInterval === 0 && Math.random() > 0.2) {
          powerups.push(new PowerUp());
        }
        for (let i = 0; i < powerups.length; i++) {
          powerups[i].update();
          const distX = Math.abs(powerups[i].x - player.x - player.width / 2);
          const distY = Math.abs(powerups[i].y - player.y - player.height / 2);

          if (
            distX < player.width / 2 + powerups[i].radius &&
            distY < player.height / 2 + powerups[i].radius
          ) {
            if (powerups[i].type === "slowTime") {
              activeEffects.slowTime = 300; // 5 seconds
              effectDisplay.textContent = _t("slowMotion");
              effectDisplay.style.color = "#00ff00";
              effectDisplay.style.textShadow = "0 0 10px #00ff00";
            } else {
              activeEffects.blaster = 300; // 5 seconds
              effectDisplay.textContent = _t("blasterActive");
              effectDisplay.style.color = "#ff0000";
              effectDisplay.style.textShadow = "0 0 10px #ff0000";
            }
            createExplosion(
              powerups[i].x,
              powerups[i].y,
              powerups[i].color,
              20,
            );
            SoundFX.powerup();
            powerups.splice(i, 1);
            i--;
            continue;
          }
          if (powerups[i].y > canvas.height + 20) {
            powerups.splice(i, 1);
            i--;
          }
        }
      }

      function handlePortals() {
        if (frameCount % 800 === 0 && Math.random() > 0.4) {
          portals.push(new SpeedPortal());
        }

        for (let i = 0; i < portals.length; i++) {
          portals[i].update();
          const distX = Math.abs(portals[i].x - player.x - player.width / 2);
          const distY = Math.abs(portals[i].y - player.y - player.height / 2);

          if (
            distX < player.width / 2 + portals[i].radius &&
            distY < player.height / 2 + portals[i].radius
          ) {
            activeEffects.speedPortal = 400; // ~6 seconds
            activeEffects.isFastPortal = portals[i].isFast;
            effectDisplay.textContent = portals[i].isFast
              ? _t("speedBoost")
              : _t("speedReduction");
            effectDisplay.style.color = portals[i].color;
            effectDisplay.style.textShadow = `0 0 10px ${portals[i].color}`;

            createExplosion(portals[i].x, portals[i].y, portals[i].color, 30);
            portals.splice(i, 1);
            i--;
            continue;
          }
          if (portals[i].y > canvas.height + 20) {
            portals.splice(i, 1);
            i--;
          }
        }
      }

      function handleProjectiles() {
        for (let i = 0; i < projectiles.length; i++) {
          projectiles[i].update();
          let hit = false;
          for (let j = 0; j < obstacles.length; j++) {
            if (
              projectiles[i].x < obstacles[j].x + obstacles[j].width &&
              projectiles[i].x + projectiles[i].width > obstacles[j].x &&
              projectiles[i].y < obstacles[j].y + obstacles[j].height &&
              projectiles[i].height + projectiles[i].y > obstacles[j].y
            ) {
              createExplosion(
                obstacles[j].x + obstacles[j].width / 2,
                obstacles[j].y + obstacles[j].height / 2,
                obstacles[j].color,
                10,
              );
              score++;
              refreshScoreDisplay();
              if (gameMode === "race") NeonRace.onScoreUpdate(score);
              obstacles.splice(j, 1);
              hit = true;
              break;
            }
          }
          if (hit || projectiles[i].y < -20) {
            projectiles.splice(i, 1);
            i--;
          }
        }
      }

      function handleKeys() {
        if (frameCount % 700 === 0 && Math.random() > 0.3) {
          keysArr.push(new Key());
        }

        for (let i = 0; i < keysArr.length; i++) {
          keysArr[i].update();

          let sliced = false;
          if (gameMode === "ninja" && bladeTrail.length > 1) {
            for (let t = 0; t < bladeTrail.length - 1; t++) {
              if (
                lineIntersectsRect(
                  bladeTrail[t].x,
                  bladeTrail[t].y,
                  bladeTrail[t + 1].x,
                  bladeTrail[t + 1].y,
                  keysArr[i].x,
                  keysArr[i].y,
                  keysArr[i].width,
                  keysArr[i].height,
                )
              ) {
                sliced = true;
                break;
              }
            }
          }

          if (
            sliced ||
            (gameMode !== "ninja" &&
              player.x < keysArr[i].x + keysArr[i].width &&
              player.x + player.width > keysArr[i].x &&
              player.y < keysArr[i].y + keysArr[i].height &&
              player.height + player.y > keysArr[i].y)
          ) {
            keysCount++;
            document.getElementById("keysDisplay").textContent = _t(
              "keysDisplay",
              { n: keysCount },
            );
            createExplosion(keysArr[i].x, keysArr[i].y, keysArr[i].color, 15);
            keysArr.splice(i, 1);
            i--;
            continue;
          }

          if (keysArr[i].y > canvas.height + 20) {
            keysArr.splice(i, 1);
            i--;
          }
        }
      }

      function handleWalls() {
        // Walls spawn much less frequently, and only on harder difficulties or later in the game
        if (
          score > 20 &&
          frameCount % 1200 === 0 &&
          gameMode !== "survival" &&
          gameMode !== "zen"
        ) {
          walls.push(new Wall());
        }

        for (let i = 0; i < walls.length; i++) {
          walls[i].update();

          let sliced = false;
          if (gameMode === "ninja" && bladeTrail.length > 1) {
            for (let t = 0; t < bladeTrail.length - 1; t++) {
              if (
                lineIntersectsRect(
                  bladeTrail[t].x,
                  bladeTrail[t].y,
                  bladeTrail[t + 1].x,
                  bladeTrail[t + 1].y,
                  walls[i].x,
                  walls[i].y,
                  walls[i].width,
                  walls[i].height,
                )
              ) {
                sliced = true;
                break;
              }
            }
          }

          if (sliced) {
            if (keysCount > 0) {
              keysCount--;
              document.getElementById("keysDisplay").textContent = _t(
                "keysDisplay",
                { n: keysCount },
              );
              createExplosion(
                walls[i].x + walls[i].width / 2,
                walls[i].y + walls[i].height / 2,
                "#ffffff",
                40,
              );
              score++;
              refreshScoreDisplay();
              walls.splice(i, 1);
              i--;
              continue;
            } else {
              // Sliced white obstacle without key costs 1 life
              if (lives > 1) {
                lives--;
                livesDisplay.textContent = _t("livesDisplay", { n: lives });
                createExplosion(
                  walls[i].x + walls[i].width / 2,
                  walls[i].y + walls[i].height / 2,
                  "#ffffff",
                  40,
                );
                SoundFX.hit();
                walls.splice(i, 1);
                i--;
                continue;
              } else {
                gameOver();
                return;
              }
            }
          }

          if (
            gameMode !== "ninja" &&
            gameMode !== "zen" &&
            player.invulnerable <= 0 &&
            player.x < walls[i].x + walls[i].width &&
            player.x + player.width > walls[i].x &&
            player.y < walls[i].y + walls[i].height &&
            player.height + player.y > walls[i].y
          ) {
            if (keysCount > 0) {
              keysCount--;
              document.getElementById("keysDisplay").textContent = _t(
                "keysDisplay",
                { n: keysCount },
              );
              createExplosion(
                player.x + player.width / 2,
                walls[i].y + walls[i].height / 2,
                "#ffffff",
                40,
              );
              walls.splice(i, 1);
              i--;
              player.invulnerable = 60;
              continue;
            } else if (lives > 1) {
              lives--;
              livesDisplay.textContent = _t("livesDisplay", { n: lives });
              createExplosion(
                player.x + player.width / 2,
                walls[i].y + walls[i].height / 2,
                "#ffffff",
                40,
              );
              SoundFX.hit();
              walls.splice(i, 1);
              i--;
              player.invulnerable = 60;
              continue;
            } else {
              gameOver();
              return;
            }
          }

          if (walls[i].y > canvas.height + 20) {
            walls.splice(i, 1);
            i--;
          }
        }
      }

      function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          if (particles[i].life <= 0) {
            particles.splice(i, 1);
            i--;
          }
        }
      }

      // ===== ACHIEVEMENTS SYSTEM =====
      var ACHIEVEMENTS = [
        {
          id: "firstRun",
          icon: "\uD83C\uDFAE",
          name: "achFirstRunName",
          desc: "achFirstRunDesc",
        },
        {
          id: "score100",
          icon: "\uD83D\uDCAF",
          name: "achScore100Name",
          desc: "achScore100Desc",
        },
        {
          id: "score500",
          icon: "\uD83D\uDD25",
          name: "achScore500Name",
          desc: "achScore500Desc",
        },
        {
          id: "score1000",
          icon: "\uD83C\uDF1F",
          name: "achScore1000Name",
          desc: "achScore1000Desc",
        },
        {
          id: "coins50",
          icon: "\uD83E\uDE99",
          name: "achCoins50Name",
          desc: "achCoins50Desc",
        },
        {
          id: "coins200",
          icon: "\uD83D\uDCB0",
          name: "achCoins200Name",
          desc: "achCoins200Desc",
        },
        {
          id: "survivor60",
          icon: "\u23F1\uFE0F",
          name: "achSurvivor60Name",
          desc: "achSurvivor60Desc",
        },
        {
          id: "level5",
          icon: "\uD83C\uDFC5",
          name: "achLevel5Name",
          desc: "achLevel5Desc",
        },
        {
          id: "speedy100",
          icon: "\u26A1",
          name: "achSpeedy100Name",
          desc: "achSpeedy100Desc",
        },
        {
          id: "bossSlayer",
          icon: "\uD83D\uDC80",
          name: "achBossSlayerName",
          desc: "achBossSlayerDesc",
        },
        {
          id: "bossMaster",
          icon: "\uD83D\uDC51",
          name: "achBossMasterName",
          desc: "achBossMasterDesc",
        },
        {
          id: "chaos50",
          icon: "\uD83C\uDF0A\uFE0F",
          name: "achChaos50Name",
          desc: "achChaos50Desc",
        },
      ];
      var unlockedAchievements = (function () {
        try {
          return JSON.parse(localStorage.getItem("onNeonAchievements")) || [];
        } catch (e) {
          return [];
        }
      })();
      var gameStats = (function () {
        try {
          return JSON.parse(localStorage.getItem("onNeonStats")) || {};
        } catch (e) {
          return {};
        }
      })();
      function saveStats() {
        try {
          localStorage.setItem("onNeonStats", JSON.stringify(gameStats));
        } catch (e) {}
      }
      function unlockAchievement(id) {
        if (unlockedAchievements.indexOf(id) !== -1) return false;
        var a = ACHIEVEMENTS.find(function (x) {
          return x.id === id;
        });
        if (!a) return false;
        unlockedAchievements.push(id);
        try {
          localStorage.setItem(
            "onNeonAchievements",
            JSON.stringify(unlockedAchievements),
          );
        } catch (e) {}
        showAchievementToast(a);
        SoundFX.achievement();
        return true;
      }
      function showAchievementToast(a) {
        var toast = document.getElementById("achievementToast");
        if (!toast) return;
        toast.innerHTML =
          a.icon +
          " " +
          _t("achievementUnlocked") +
          "<br><b>" +
          _t(a.name) +
          "</b>";
        toast.classList.add("show");
        clearTimeout(toast._t);
        toast._t = setTimeout(function () {
          toast.classList.remove("show");
        }, 3500);
      }
      function renderAchievements() {
        var list = document.getElementById("achievementsList");
        if (!list) return;
        var sub = document.getElementById("achievementsSubText");
        if (sub)
          sub.textContent = _t("achievementsUnlocked", {
            n: unlockedAchievements.length,
            total: ACHIEVEMENTS.length,
          });
        list.innerHTML = "";
        ACHIEVEMENTS.forEach(function (a) {
          var unlocked = unlockedAchievements.indexOf(a.id) !== -1;
          var card = document.createElement("div");
          card.className = "ach-card" + (unlocked ? "" : " locked");
          var icon = document.createElement("div");
          icon.className = "ach-icon";
          icon.textContent = a.icon;
          var info = document.createElement("div");
          info.className = "ach-info";
          var nm = document.createElement("div");
          nm.className = "ach-name";
          nm.textContent = _t(a.name);
          var ds = document.createElement("div");
          ds.className = "ach-desc";
          ds.textContent = unlocked
            ? _t(a.desc)
            : "\uD83D\uDD12 " + _t("achievementsLocked");
          info.appendChild(nm);
          info.appendChild(ds);
          card.appendChild(icon);
          card.appendChild(info);
          list.appendChild(card);
        });
      }
      function checkAchievements() {
        if (score >= 100) unlockAchievement("score100");
        if (score >= 500) unlockAchievement("score500");
        if (score >= 1000) unlockAchievement("score1000");
        if ((gameStats.coins || 0) >= 50) unlockAchievement("coins50");
        if ((gameStats.coins || 0) >= 200) unlockAchievement("coins200");
        if (gameMode === "survival" && score >= 3600)
          unlockAchievement("survivor60");
        if (gameMode === "speedrush" && score >= 100)
          unlockAchievement("speedy100");
        if (gameMode === "chaos" && score >= 50) unlockAchievement("chaos50");
        if ((gameStats.levelsCleared || 0) >= 5) unlockAchievement("level5");
      }

      // ===== BOSS RUSH MODE =====
      // The 10-ship Neon Fleet from the Boss Attack Behaviors design.
      // HP is tuned to the game's DPS (~5 player shots/sec in bossrush).
      var BOSS_FLEET_CONFIG = [
        {
          id: 1,
          name: "Neon Pink",
          color: "#ff2d95",
          maxHp: 25,
          speed: 2.2,
          scale: 1.0,
          move: "strafe",
          attackType: "basic_ring",
        },
        {
          id: 2,
          name: "Neon Orange",
          color: "#ff8c00",
          maxHp: 35,
          speed: 2.6,
          scale: 1.0,
          move: "strafe",
          attackType: "dual_shot",
        },
        {
          id: 3,
          name: "Neon Cyan",
          color: "#00e5ff",
          maxHp: 50,
          speed: 3.0,
          scale: 1.1,
          move: "strafe",
          attackType: "trident_sweep",
        },
        {
          id: 4,
          name: "Neon Yellow",
          color: "#ffe600",
          maxHp: 65,
          speed: 2.3,
          scale: 1.1,
          move: "strafe",
          attackType: "arrow_rush",
        },
        {
          id: 5,
          name: "Neon Purple",
          color: "#b44cff",
          maxHp: 80,
          speed: 1.9,
          scale: 1.2,
          move: "strafe",
          attackType: "orbital_drones",
        },
        {
          id: 6,
          name: "Neon Magenta",
          color: "#ff00aa",
          maxHp: 100,
          speed: 1.5,
          scale: 1.3,
          move: "slow",
          attackType: "heavy_burst",
        },
        {
          id: 7,
          name: "Neon Lime",
          color: "#aaff00",
          maxHp: 125,
          speed: 2.0,
          scale: 1.3,
          move: "sweep",
          attackType: "mega_laser",
        },
        {
          id: 8,
          name: "Scarlet Red",
          color: "#ff1744",
          maxHp: 150,
          speed: 1.2,
          scale: 1.4,
          move: "hover",
          attackType: "meteor_strike",
        },
        {
          id: 9,
          name: "Sapphire Blue",
          color: "#2979ff",
          maxHp: 180,
          speed: 3.5,
          scale: 1.4,
          move: "split",
          attackType: "mirage_split",
        },
        {
          id: 10,
          name: "Multi-Neon",
          color: "#ffffff",
          maxHp: 220,
          speed: 2.5,
          scale: 1.7,
          move: "erratic",
          attackType: "omega_chaos",
        },
      ];
      var boss = null;
      var bossWave = 0;
      var enemyBullets = [];
      var bossPatternTimer = 0;
      var bossState = "intro";
      var bossStateTimer = 0;
      var bossStormActive = false;
      var bossStormRemaining = 0;
      var bossLaser = null;
      var meteorZones = [];

      // Endless waves; from wave 10 onward difficulty only rises every 2 waves.
      function bossDiffWave() {
        var w = bossWave;
        return w < 10 ? w : 10 + Math.floor((w - 10) / 2);
      }

      function bossConfig() {
        return BOSS_FLEET_CONFIG[(bossWave - 1) % BOSS_FLEET_CONFIG.length];
      }

      class EnemyBullet {
        constructor(x, y, vx, vy, r, color) {
          this.x = x;
          this.y = y;
          this.vx = vx;
          this.vy = vy;
          this.r = r || 6;
          this.color = color || "#ff0080";
        }
        draw() {
          ctx.fillStyle = this.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.draw();
        }
      }

      function createBoss(wave) {
        var cfg = BOSS_FLEET_CONFIG[(wave - 1) % BOSS_FLEET_CONFIG.length];
        var dw = wave < 10 ? wave : 10 + Math.floor((wave - 10) / 2);
        var loop = Math.floor((wave - 1) / BOSS_FLEET_CONFIG.length);
        var hp = Math.round(cfg.maxHp * (1 + loop * 0.8));
        var w = 100 * cfg.scale;
        var h = 70 * cfg.scale;
        return {
          x: canvas.width / 2 - w / 2,
          y: -h,
          width: w,
          height: h,
          hp: hp,
          maxHp: hp,
          speed: cfg.speed + loop * 0.2,
          attackType: cfg.attackType,
          move: cfg.move,
          color: cfg.color,
          name: cfg.name,
          dashDir: 1,
          sweepDir: 1,
          flash: 0,
          introX: canvas.width / 2 - w / 2,
          targetY: 60 + cfg.scale * 20,
        };
      }

      function startBossWave() {
        if (
          gameMode !== "bossrush" ||
          isGameOver ||
          mainMenu.style.display !== "none"
        )
          return;
        bossWave++;
        boss = createBoss(bossWave);
        enemyBullets.length = 0;
        meteorZones.length = 0;
        bossLaser = null;
        bossPatternTimer = 90;
        bossState = "intro";
        bossStateTimer = 60;
        var hpEl = document.getElementById("bossHpDisplay");
        if (hpEl) {
          hpEl.style.display = "block";
          hpEl.textContent = _t("bossWave", { n: bossWave });
        }
        SoundFX.boss();
      }

      function bossFire() {
        var cx = boss.x + boss.width / 2;
        var cy = boss.y + boss.height / 2;
        var pvx = player.x + player.width / 2 - cx;
        var pvy = player.y + player.height / 2 - cy;
        var pl = Math.sqrt(pvx * pvx + pvy * pvy) || 1;
        var speed = 4 + bossDiffWave() * 0.4;
        var col = boss.color;
        var cfg = bossConfig();

        switch (cfg.attackType) {
          case "basic_ring": {
            var n = 8 + Math.min(bossDiffWave(), 4);
            for (var i = 0; i < n; i++) {
              var ang = (Math.PI * 2 * i) / n + Math.random() * 0.3;
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy,
                  Math.cos(ang) * speed,
                  Math.sin(ang) * speed,
                  6,
                  col,
                ),
              );
            }
            break;
          }
          case "dual_shot": {
            var offs = [0.18, -0.18];
            for (var o = 0; o < offs.length; o++) {
              var ca = Math.atan2(pvy, pvx) + offs[o];
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy + boss.height / 2,
                  Math.cos(ca) * speed,
                  Math.sin(ca) * speed,
                  6,
                  col,
                ),
              );
            }
            break;
          }
          case "trident_sweep": {
            var offs = [-0.45, 0, 0.45];
            for (var o = 0; o < offs.length; o++) {
              var ca = Math.atan2(pvy, pvx) + offs[o];
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy + boss.height / 2,
                  Math.cos(ca) * speed,
                  Math.sin(ca) * speed,
                  6,
                  col,
                ),
              );
            }
            break;
          }
          case "arrow_rush": {
            var offs = [-0.8, -0.4, 0, 0.4, 0.8];
            for (var o = 0; o < offs.length; o++) {
              var ca = Math.atan2(pvy, pvx) + offs[o];
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy + boss.height / 2,
                  Math.cos(ca) * (speed - 1),
                  Math.sin(ca) * (speed - 1),
                  5,
                  col,
                ),
              );
            }
            break;
          }
          case "orbital_drones": {
            var n = 6 + Math.min(bossDiffWave(), 3);
            for (var i = 0; i < n; i++) {
              var ang = (Math.PI * 2 * i) / n + bossWave;
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy,
                  Math.cos(ang) * 2.2,
                  Math.sin(ang) * 2.2,
                  7,
                  col,
                ),
              );
            }
            break;
          }
          case "heavy_burst": {
            for (var i = 0; i < 3; i++) {
              var ca = Math.atan2(pvy, pvx) + (i - 1) * 0.22;
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy + boss.height / 2,
                  Math.cos(ca) * (speed * 0.7),
                  Math.sin(ca) * (speed * 0.7),
                  11,
                  col,
                ),
              );
            }
            break;
          }
          case "mega_laser": {
            var lw = 16 + bossDiffWave();
            bossLaser = {
              x: cx - lw / 2,
              w: lw,
              warn: 40,
              timer: 80,
              color: "#00ff00",
            };
            break;
          }
          case "meteor_strike": {
            for (var i = 0; i < 3; i++) {
              var mx = Math.random() * (canvas.width - 60) + 10;
              meteorZones.push({
                x: mx,
                w: 50 + Math.random() * 20,
                timer: 45,
                color: col,
              });
            }
            break;
          }
          case "mirage_split": {
            var up = boss.y + 10;
            var down = boss.y + boss.height - 10;
            for (var v = 0; v < 2; v++) {
              var sy = v === 0 ? up : down;
              for (var o = -0.6; o <= 0.6; o += 0.3) {
                var ca = Math.atan2(pvy, pvx) + o;
                enemyBullets.push(
                  new EnemyBullet(
                    cx,
                    sy,
                    Math.cos(ca) * (speed - 0.5),
                    Math.sin(ca) * (speed - 0.5),
                    5,
                    col,
                  ),
                );
              }
            }
            break;
          }
          case "omega_chaos": {
            var n = 10 + Math.min(bossDiffWave(), 6);
            for (var i = 0; i < n; i++) {
              var ang = Math.random() * Math.PI * 2;
              var sp = speed * (0.7 + Math.random() * 0.8);
              enemyBullets.push(
                new EnemyBullet(
                  cx,
                  cy,
                  Math.cos(ang) * sp,
                  Math.sin(ang) * sp,
                  6,
                  Math.random() > 0.5 ? col : "#00ff00",
                ),
              );
            }
            break;
          }
          default:
            enemyBullets.push(
              new EnemyBullet(
                cx,
                cy + boss.height / 2,
                (pvx / pl) * speed,
                (pvy / pl) * speed,
                6,
                col,
              ),
            );
            break;
        }
      }

      function updateBoss() {
        if (!boss) return;
        bossPatternTimer--;
        bossStateTimer--;

        if (bossState === "intro") {
          boss.y += 1.5;
          if (bossStateTimer <= 0 || boss.y >= boss.targetY) {
            boss.y = boss.targetY;
            bossState = "fight";
            bossStateTimer = 0;
          }
        } else if (bossState === "fight") {
          // Per-archetype movement (from the Boss Attack Behaviors design)
          switch (boss.move) {
            case "strafe": {
              boss.x += boss.speed * boss.dashDir;
              if (boss.x <= 10) boss.dashDir = 1;
              if (boss.x + boss.width >= canvas.width - 10) boss.dashDir = -1;
              break;
            }
            case "slow": {
              boss.x += Math.sin(bossStateTimer * 0.03) * boss.speed * 0.8;
              boss.y = boss.targetY + Math.sin(bossStateTimer * 0.02) * 18;
              if (boss.x < 10) boss.x = 10;
              if (boss.x + boss.width > canvas.width - 10)
                boss.x = canvas.width - 10 - boss.width;
              break;
            }
            case "sweep": {
              boss.x += boss.speed * 3.5 * boss.dashDir;
              var sweepMinY = 40;
              var sweepMaxY = boss.targetY + 20;
              if (boss.x <= 5) {
                boss.dashDir = 1;
                boss.sweepDir = boss.y <= sweepMinY ? 1 : -1;
              }
              if (boss.x + boss.width >= canvas.width - 5) {
                boss.dashDir = -1;
                boss.sweepDir = boss.y >= sweepMaxY ? -1 : 1;
              }
              boss.y += 16 * boss.sweepDir;
              if (boss.y < sweepMinY) {
                boss.y = sweepMinY;
                boss.sweepDir = 1;
              }
              if (boss.y > sweepMaxY) {
                boss.y = sweepMaxY;
                boss.sweepDir = -1;
              }
              break;
            }
            case "hover": {
              boss.y = boss.targetY + Math.sin(bossStateTimer * 0.04) * 30;
              boss.x += Math.sin(bossStateTimer * 0.02) * boss.speed;
              if (boss.x < 10) boss.x = 10;
              if (boss.x + boss.width > canvas.width - 10)
                boss.x = canvas.width - 10 - boss.width;
              break;
            }
            case "split": {
              boss.y = boss.targetY + Math.sin(bossStateTimer * 0.05) * 40;
              boss.x += Math.cos(bossStateTimer * 0.04) * boss.speed;
              if (boss.x < 10) boss.x = 10;
              if (boss.x + boss.width > canvas.width - 10)
                boss.x = canvas.width - 10 - boss.width;
              break;
            }
            case "erratic": {
              boss.x += Math.sin(bossStateTimer * 0.06) * boss.speed * 2.4;
              boss.y = boss.targetY + Math.sin(bossStateTimer * 0.09) * 35;
              if (boss.x < 10) boss.x = 10;
              if (boss.x + boss.width > canvas.width - 10)
                boss.x = canvas.width - 10 - boss.width;
              break;
            }
          }

          if (bossPatternTimer <= 0) {
            bossFire();
            bossPatternTimer = boss.attackType === "mega_laser" ? 160 : 110;
          }
        }

        // Laser lifecycle
        if (bossLaser) {
          if (bossLaser.warn > 0) {
            bossLaser.warn--;
          } else if (bossLaser.timer > 0) {
            bossLaser.timer--;
            if (bossLaser.timer <= 0) bossLaser = null;
          }
        }
        // Meteor zones lifecycle
        for (var mz = meteorZones.length - 1; mz >= 0; mz--) {
          meteorZones[mz].timer--;
          if (meteorZones[mz].timer <= 0) {
            var z = meteorZones[mz];
            enemyBullets.push(
              new EnemyBullet(z.x + z.w / 2, -20, 0, 5.5, 8, z.color),
            );
            meteorZones.splice(mz, 1);
          }
        }

        var cx = boss.x + boss.width / 2;
        var cy = boss.y + boss.height / 2;

        // Draw neon fighter plane silhouette
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(
          Math.sin(bossStateTimer * 0.05) * 0.08 +
            boss.speed * boss.dashDir * 0.015,
        );
        var u = Math.min(boss.width, boss.height) / 70;
        ctx.shadowBlur = 25;
        ctx.shadowColor = boss.color;
        ctx.fillStyle = boss.color;
        ctx.beginPath();
        ctx.moveTo(0, -35 * u); // nose
        ctx.lineTo(10 * u, -12 * u);
        ctx.lineTo(28 * u, -6 * u); // right wing
        ctx.lineTo(26 * u, 4 * u);
        ctx.lineTo(12 * u, 8 * u);
        ctx.lineTo(10 * u, 30 * u); // right tail
        ctx.lineTo(4 * u, 26 * u);
        ctx.lineTo(0, 20 * u);
        ctx.lineTo(-4 * u, 26 * u);
        ctx.lineTo(-10 * u, 30 * u); // left tail
        ctx.lineTo(-12 * u, 8 * u);
        ctx.lineTo(-26 * u, 4 * u);
        ctx.lineTo(-28 * u, -6 * u); // left wing
        ctx.lineTo(-10 * u, -12 * u);
        ctx.closePath();
        ctx.fill();
        // cockpit
        ctx.fillStyle = "#0d0d1a";
        ctx.beginPath();
        ctx.ellipse(0, -16 * u, 3.5 * u, 7 * u, 0, 0, Math.PI * 2);
        ctx.fill();
        // engine glow
        ctx.fillStyle = "#ffffff";
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(0, 32 * u, 3 * u, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();

        if (boss.flash > 0) {
          boss.flash--;
          ctx.save();
          ctx.globalAlpha = Math.min(1, boss.flash / 5) * 0.5;
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
          ctx.restore();
        }

        // Draw laser beam
        if (bossLaser) {
          var lw = bossLaser.w;
          var lx = bossLaser.x;
          if (bossLaser.warn > 0) {
            ctx.fillStyle = "rgba(255,0,0,0.25)";
            ctx.fillRect(lx, 0, lw, canvas.height);
            ctx.fillStyle = "rgba(255,0,0,0.5)";
            ctx.fillRect(lx + lw * 0.3, 0, lw * 0.4, canvas.height);
          } else {
            ctx.save();
            ctx.shadowBlur = 30;
            ctx.shadowColor = bossLaser.color;
            ctx.fillStyle = bossLaser.color;
            ctx.fillRect(lx, 0, lw, canvas.height);
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.fillRect(lx + lw * 0.4, 0, lw * 0.2, canvas.height);
            ctx.restore();
          }
        }

        // Draw meteor warning zones as full-height danger columns
        for (var mz2 = 0; mz2 < meteorZones.length; mz2++) {
          var z2 = meteorZones[mz2];
          var blink = Math.floor(z2.timer / 6) % 2 === 0 ? 0.5 : 0.9;
          ctx.save();
          ctx.globalAlpha = blink * 0.2;
          ctx.fillStyle = z2.color;
          ctx.fillRect(z2.x, 0, z2.w, canvas.height);
          ctx.globalAlpha = blink;
          ctx.strokeStyle = z2.color;
          ctx.lineWidth = 2;
          ctx.setLineDash([8, 6]);
          ctx.strokeRect(z2.x, 0, z2.w, canvas.height);
          ctx.setLineDash([]);
          ctx.restore();
        }

        var bw = 180;
        var bx = canvas.width / 2 - bw / 2;
        var by = 14;
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.fillRect(bx, by, bw, 8);
        ctx.fillStyle = boss.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = boss.color;
        ctx.fillRect(bx, by, bw * Math.max(0, boss.hp / boss.maxHp), 8);
        ctx.shadowBlur = 0;
      }

      function handleEnemyBullets() {
        for (var i = enemyBullets.length - 1; i >= 0; i--) {
          var b = enemyBullets[i];
          b.update();
          if (
            player.invulnerable <= 0 &&
            b.x > player.x - b.r &&
            b.x < player.x + player.width + b.r &&
            b.y > player.y - b.r &&
            b.y < player.y + player.height + b.r
          ) {
            enemyBullets.splice(i, 1);
            if (lives > 1) {
              lives--;
              livesDisplay.textContent = _t("livesDisplay", { n: lives });
              createExplosion(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.color,
                15,
              );
              player.invulnerable = 60;
              SoundFX.hit();
            } else {
              gameOver();
              return;
            }
            continue;
          }
          if (
            b.y > canvas.height + 30 ||
            b.x < -30 ||
            b.x > canvas.width + 30 ||
            b.y < -30
          ) {
            enemyBullets.splice(i, 1);
          }
        }
      }

      function handleBoss() {
        if (!boss) return;
        for (var i = projectiles.length - 1; i >= 0; i--) {
          var p = projectiles[i];
          if (
            p.x < boss.x + boss.width &&
            p.x + p.width > boss.x &&
            p.y < boss.y + boss.height &&
            p.y + p.height > boss.y
          ) {
            boss.hp--;
            score++;
            refreshScoreDisplay();
            createExplosion(p.x, p.y, "#ff0080", 6);
            boss.flash = 5;
            projectiles.splice(i, 1);
            SoundFX.blip();
            if (boss.hp <= 0) {
              bossDefeated();
              return;
            }
          }
        }

        // Laser beam collision (only during the active beam, not the warning)
        if (bossLaser && bossLaser.warn <= 0 && bossLaser.timer > 0) {
          if (
            player.invulnerable <= 0 &&
            player.x + player.width > bossLaser.x &&
            player.x < bossLaser.x + bossLaser.w
          ) {
            if (lives > 1) {
              lives--;
              livesDisplay.textContent = _t("livesDisplay", { n: lives });
              createExplosion(
                player.x + player.width / 2,
                player.y + player.height / 2,
                player.color,
                15,
              );
              player.invulnerable = 60;
              SoundFX.hit();
            } else {
              gameOver();
              return;
            }
          }
        }

        if (
          player.invulnerable <= 0 &&
          player.x < boss.x + boss.width &&
          player.x + player.width > boss.x &&
          player.y < boss.y + boss.height &&
          player.y + player.height > boss.y
        ) {
          if (lives > 1) {
            lives--;
            livesDisplay.textContent = _t("livesDisplay", { n: lives });
            createExplosion(
              player.x + player.width / 2,
              player.y + player.height / 2,
              player.color,
              15,
            );
            player.invulnerable = 60;
            SoundFX.hit();
          } else {
            gameOver();
            return;
          }
        }

        updateBoss();
        handleEnemyBullets();
      }

      function bossDefeated() {
        var cx = boss.x + boss.width / 2;
        var cy = boss.y + boss.height / 2;
        var bcol = boss.color;
        createExplosion(cx, cy, bcol, 40);
        createExplosion(cx, cy, "#ff00ff", 30);
        for (var gs = 0; gs < 45; gs++) {
          glassShards.push(
            new GlassShard(
              cx,
              cy,
              gs % 3 === 0 ? "#ffffff" : gs % 2 === 0 ? bcol : "#ffcc00",
            ),
          );
        }
        bossStormActive = true;
        bossStormRemaining = 1200; // 20 seconds of obstacles + meteors, no timer shown
        SoundFX.explode();
        SoundFX.shatter();
        score += 100;
        refreshScoreDisplay();
        gameStats.bossKills = (gameStats.bossKills || 0) + 1;
        saveStats();
        unlockAchievement("bossSlayer");
        if (bossWave >= 10) unlockAchievement("bossMaster");
        boss = null;
        enemyBullets.length = 0;
        meteorZones.length = 0;
        bossLaser = null;
        var hpEl = document.getElementById("bossHpDisplay");
        if (hpEl) hpEl.textContent = _t("bossDefeated");
        if (bossWaveTimer) clearTimeout(bossWaveTimer);
        bossWaveTimer = setTimeout(startBossWave, 900);
      }

      // ===== BEAT-SYNCED PULSING COLORS =====
      var TRACK_BPM = {
        "dimension.mp3": 128,
        "sphere.mp3": 128,
        "exoplanet.mp3": 124,
        "field-of-hopes.mp3": 100,
        "fallen-down.mp3": 80,
        "undertale-shop.mp3": 90,
        "a-cybers-world.mp3": 140,
        "tv-world.mp3": 120,
        "megalovania.mp3": 180,
      };
      var lastPulseKey = -1;
      function _lightenHex(hex, amt) {
        var num = parseInt(hex.slice(1), 16);
        var r = (num >> 16) & 255,
          g = (num >> 8) & 255,
          b = num & 255;
        r = Math.min(255, Math.round(r + (255 - r) * amt));
        g = Math.min(255, Math.round(g + (255 - g) * amt));
        b = Math.min(255, Math.round(b + (255 - b) * amt));
        return "rgb(" + r + "," + g + "," + b + ")";
      }
      function applyBeatPulse() {
        var c = document.getElementById("gameCanvas");
        if (!c || !activeSkin || !activeSkin.colors) return;
        var bpm = TRACK_BPM[songSelect.value] || 120;
        var t;
        if (!isMuted && bgMusic && !bgMusic.paused && bgMusic.readyState >= 2) {
          t = bgMusic.currentTime || 0;
        } else {
          t = performance.now() / 1000;
        }
        var beat = ((t * bpm) / 60) % 1;
        var pulse = Math.pow(Math.max(0, 1 - beat * 3), 2);
        var key = Math.round(pulse * 20);
        if (key === lastPulseKey) return;
        lastPulseKey = key;
        var amt = pulse * 0.28;
        c.style.background =
          "linear-gradient(180deg, " +
          _lightenHex(activeSkin.colors.bg0, amt) +
          " 0%, " +
          _lightenHex(activeSkin.colors.bg1, amt) +
          " 100%)";
      }

      function gameOver() {
        isGameOver = true;
        createExplosion(
          player.x + player.width / 2,
          player.y + player.height / 2,
          player.color,
          40,
        );
        cancelAnimationFrame(animationId);
        bgMusic.pause();
        bgMusic.currentTime = 0;
        SoundFX.explode();
        gameStats.games = (gameStats.games || 0) + 1;
        saveStats();
        unlockAchievement("firstRun");
        var hpEl = document.getElementById("bossHpDisplay");
        if (hpEl) hpEl.style.display = "none";

        if (gameMode === "race" && NeonRace.onPlayerDeath(score)) {
          pauseBtn.style.display = "none";
          pauseOverlay.style.display = "none";
          document.getElementById("raceEliminated").style.display = "flex";
          document.getElementById("raceEliminatedScore").textContent = _t(
            "gameOverScore",
            { score: score },
          );
          function fadeOut() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            handleGlassShards();
            if (particles.length > 0 || glassShards.length > 0)
              fadeAnimId = requestAnimationFrame(fadeOut);
          }
          fadeAnimId = requestAnimationFrame(fadeOut);
          return;
        }

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("neonHighScore", highScore);
        }

        pauseBtn.style.display = "none";
        pauseOverlay.style.display = "none";
        gameOverScreen.style.display = "block";
        finalScore.textContent =
          gameMode === "level"
            ? _t("timeRanOut")
            : _t("gameOverScore", { score: score });

        // Always clear the canvas and drain remaining particles
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        function fadeOut2() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          handleParticles();
          handleGlassShards();
          if (particles.length > 0 || glassShards.length > 0)
            fadeAnimId = requestAnimationFrame(fadeOut2);
        }
        fadeAnimId = requestAnimationFrame(fadeOut2);
      }

      function speedRushComplete() {
        isGameOver = true;
        cancelAnimationFrame(animationId);
        bgMusic.pause();
        bgMusic.currentTime = 0;

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("neonHighScore", highScore);
        }

        pauseBtn.style.display = "none";
        pauseOverlay.style.display = "none";
        gameOverScreen.style.display = "block";
        finalScore.textContent = _t("speedRushDone", { score: score });
        checkAchievements();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        createExplosion(canvas.width / 2, canvas.height / 2, "#0096ff", 50);
        createExplosion(canvas.width / 2, canvas.height / 2, "#ffff00", 40);
        function fadeOut3() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          handleParticles();
          handleGlassShards();
          if (particles.length > 0 || glassShards.length > 0)
            fadeAnimId = requestAnimationFrame(fadeOut3);
        }
        fadeAnimId = requestAnimationFrame(fadeOut3);
      }

      function resetGame() {
        isGameOver = false;
        isPaused = false;
        if (fadeAnimId) {
          cancelAnimationFrame(fadeAnimId);
          fadeAnimId = 0;
        }
        if (bossWaveTimer) {
          clearTimeout(bossWaveTimer);
          bossWaveTimer = null;
        }
        score = 0;
        if (
          gameMode === "ninja" ||
          gameMode === "chaos" ||
          gameMode === "speedrush" ||
          gameMode === "bossrush"
        ) {
          lives = 3;
        } else {
          lives = 1;
        }
        speedRamp = 1;
        speedRushTime = 3600; // 60 seconds
        meteorWarnings.length = 0;
        keysCount = 0;
        frameCount = 0;
        controlsInverted = false;
        invertedFlipT = 420; // delay first flip by ~7 seconds so player has time to react
        scoreDisplay.textContent = _t("scoreDisplay", { score: 0 });
        livesDisplay.textContent = _t("livesDisplay", { n: lives });
        document.getElementById("keysDisplay").textContent = _t("keysDisplay", {
          n: 0,
        });
        obstacles.length = 0;
        particles.length = 0;
        glassShards.length = 0;
        coins.length = 0;
        powerups.length = 0;
        projectiles.length = 0;
        keysArr.length = 0;
        walls.length = 0;
        portals.length = 0;
        bladeTrail.length = 0;
        isSlicing = false;
        activeEffects.slowTime = 0;
        activeEffects.blaster = 0;
        activeEffects.speedPortal = 0;
        effectDisplay.textContent = "";
        player.x = canvas.width / 2;
        player.y = canvas.height - 50;
        player.dx = 0;
        player.dy = 0;
        player.invulnerable = 0;
        gameOverScreen.style.display = "none";
        levelCompleteScreen.style.display = "none";
        document.getElementById("raceEliminated").style.display = "none";
        var hpEl = document.getElementById("bossHpDisplay");
        if (hpEl) hpEl.style.display = "none";

        if (gameMode === "bossrush") {
          boss = null;
          enemyBullets.length = 0;
          bossWave = 0;
          bossPatternTimer = 0;
          bossState = "intro";
          bossStateTimer = 0;
          bossStormActive = false;
          bossStormRemaining = 0;
          startBossWave();
        }

        if (gameMode === "level") {
          levelTimeRemaining = currentLevel.durationFrames;
          scoreDisplay.textContent = _t("timeDisplay", {
            s: Math.ceil(levelTimeRemaining / 60),
          });
        } else if (gameMode === "speedrush") {
          scoreDisplay.textContent = _t("timeDisplay", { s: 60 });
        } else {
          scoreDisplay.textContent = _t("scoreDisplay", { score: 0 });
        }
        updateScoreDisplayVisibility();

        if (bgMusic.src.indexOf(songSelect.value) === -1) {
          bgMusic.src = songSelect.value;
        }
        bgMusic.play().catch((e) => console.log("Audio play failed:", e));
        pauseBtn.style.display = "inline-block";
        animate();
      }

      function levelComplete() {
        isGameOver = true;
        isPaused = false;
        pauseBtn.style.display = "none";
        pauseOverlay.style.display = "none";
        cancelAnimationFrame(animationId);
        bgMusic.pause();
        bgMusic.currentTime = 0;

        xp += currentLevel.xpReward;
        localStorage.setItem("neonXp", xp);
        menuXpDisplay.textContent = _t("xpDisplay", { xp: xp });
        gameStats.levelsCleared = (gameStats.levelsCleared || 0) + 1;
        saveStats();
        checkAchievements();
        SoundFX.powerup();

        // Unlock next level automatically
        const nextLevelId = currentLevel.id + 1;
        if (
          nextLevelId <= levels.length &&
          !unlockedLevels.includes(nextLevelId)
        ) {
          unlockedLevels.push(nextLevelId);
          localStorage.setItem(
            "neonUnlockedLevels",
            JSON.stringify(unlockedLevels),
          );
          renderLevelsMenu();
        }

        levelCompleteScreen.style.display = "flex";
        xpEarnedDisplay.textContent = _t("xpEarned", {
          xp: currentLevel.xpReward,
        });

        createExplosion(canvas.width / 2, canvas.height / 2, "#ff00ff", 50);
        createExplosion(canvas.width / 2, canvas.height / 2, "#00ffff", 50);

        function fadeOut4() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          handleParticles();
          handleGlassShards();
          if (particles.length > 0 || glassShards.length > 0)
            fadeAnimId = requestAnimationFrame(fadeOut4);
        }
        fadeAnimId = requestAnimationFrame(fadeOut4);
      }

      levelMenuBtn.addEventListener("click", () => {
        pauseBtn.style.display = "none";
        pauseOverlay.style.display = "none";
        levelCompleteScreen.style.display = "none";
        applyCanvasBg();
        lastPulseKey = -1;
        mainMenu.style.display = "flex";
        setTimeout(updateScrollHint, 50);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.invulnerable = 0;
        var pc =
          activeSkin && activeSkin.colors
            ? activeSkin.colors.player
            : player.color;
        ctx.fillStyle = pc;
        ctx.shadowBlur = 20;
        ctx.shadowColor = pc;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;
      });

      menuBtn.addEventListener("click", () => {
        pauseBtn.style.display = "none";
        pauseOverlay.style.display = "none";
        gameOverScreen.style.display = "none";
        var bhp = document.getElementById("bossHpDisplay");
        if (bhp) bhp.style.display = "none";
        applyCanvasBg();
        lastPulseKey = -1;
        mainMenu.style.display = "flex";
        setTimeout(updateScrollHint, 50);
        NeonRace.cleanup();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Redraw player
        player.invulnerable = 0;
        var pc =
          activeSkin && activeSkin.colors
            ? activeSkin.colors.player
            : player.color;
        ctx.fillStyle = pc;
        ctx.shadowBlur = 20;
        ctx.shadowColor = pc;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.shadowBlur = 0;
      });

      restartBtn.addEventListener("click", () => {
        gameOverScreen.style.display = "none";
        resetGame();
      });

      document.querySelectorAll("#endlessMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "endless";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.getElementById("btnTutorial").addEventListener("click", () => {
        document.getElementById("tutorialModal").classList.add("open");
      });
      document.getElementById("tutCloseBtn").addEventListener("click", () => {
        document.getElementById("tutorialModal").classList.remove("open");
      });

      document.querySelectorAll("#ninjaMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "ninja";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.querySelectorAll("#chaosMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "chaos";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.querySelectorAll("#speedRushMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "speedrush";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.querySelectorAll("#meteorMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "meteor";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.querySelectorAll("#sideScrollMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "sidescroll";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document.querySelectorAll("#invertedMenu .diff-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          gameMode = "inverted";
          const level = parseInt(e.target.dataset.level);
          currentDifficulty = difficulties[level];
          mainMenu.style.display = "none";
          resetGame();
        });
      });

      document
        .getElementById("btnStartSurvival")
        .addEventListener("click", () => {
          gameMode = "survival";
          currentDifficulty = difficulties[2];
          mainMenu.style.display = "none";
          resetGame();
        });

      document
        .getElementById("btnStartReverse")
        .addEventListener("click", () => {
          gameMode = "reverse";
          currentDifficulty = difficulties[2];
          mainMenu.style.display = "none";
          resetGame();
        });

      document.getElementById("btnStartZen").addEventListener("click", () => {
        gameMode = "zen";
        currentDifficulty = difficulties[2];
        mainMenu.style.display = "none";
        resetGame();
      });

      document
        .getElementById("btnStartBossRush")
        .addEventListener("click", () => {
          gameMode = "bossrush";
          currentDifficulty = difficulties[2];
          mainMenu.style.display = "none";
          resetGame();
        });

      function togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
          pauseOverlay.style.display = "flex";
          pauseSongSelect.value = songSelect.value;
          pauseMuteBtn.textContent = isMuted ? "\uD83D\uDD07" : "\uD83D\uDD0A";
          if (bgMusic && !bgMusic.paused) bgMusic.pause();
        } else {
          pauseOverlay.style.display = "none";
          if (bgMusic && !isMuted) bgMusic.play().catch(function (e) {});
        }
      }

      function animate() {
        if (isGameOver) return;
        if (isPaused) {
          animationId = requestAnimationFrame(animate);
          return;
        }

        if (activeEffects.slowTime > 0) {
          activeEffects.slowTime--;
          if (activeEffects.slowTime === 0 && activeEffects.blaster === 0)
            effectDisplay.textContent = "";
        }
        if (activeEffects.blaster > 0) {
          activeEffects.blaster--;
          if (activeEffects.blaster === 0 && activeEffects.slowTime === 0)
            effectDisplay.textContent = "";
        }

        if (activeEffects.speedPortal > 0) {
          activeEffects.speedPortal--;
          if (
            activeEffects.speedPortal === 0 &&
            activeEffects.slowTime === 0 &&
            activeEffects.blaster === 0
          )
            effectDisplay.textContent = "";
          else if (
            activeEffects.speedPortal > 0 &&
            activeEffects.slowTime === 0 &&
            activeEffects.blaster === 0
          ) {
            // Score increases slightly faster during fast portal
            if (activeEffects.isFastPortal && frameCount % 10 === 0) {
              score++;
              refreshScoreDisplay();
              if (gameMode === "race") NeonRace.onScoreUpdate(score);
            }
          }
        }

        if (gameMode === "level") {
          levelTimeRemaining--;
          if (frameCount % 60 === 0) {
            scoreDisplay.textContent = _t("timeDisplay", {
              s: Math.ceil(levelTimeRemaining / 60),
            });
          }
          if (levelTimeRemaining <= 0) {
            levelComplete();
            return;
          }
        }

        if (gameMode === "speedrush") {
          speedRushTime--;
          if (frameCount % 60 === 0) {
            scoreDisplay.textContent = _t("timeDisplay", {
              s: Math.ceil(speedRushTime / 60),
            });
          }
          if (speedRushTime <= 0) {
            speedRushComplete();
            return;
          }
        }

        if (gameMode === "survival") {
          score++;
          speedRamp = 1 + score / 900;
          if (frameCount % 60 === 0) {
            scoreDisplay.textContent = _t("scoreDisplay", { score: score });
          }
        }

        if (gameMode === "inverted") {
          invertedFlipT--;
          if (invertedFlipT === 60) {
            effectDisplay.textContent = "⚠ CONTROLS FLIPPING!";
          }
          if (invertedFlipT <= 0) {
            controlsInverted = !controlsInverted;
            invertedFlipT = 420;
            effectDisplay.textContent = controlsInverted
              ? "⟲ INVERTED!"
              : "↩ CONTROLS NORMAL";
            if (typeof SoundFX !== "undefined") SoundFX.blip();
          }
        }

        applyBeatPulse();

        if (frameCount % 30 === 0) checkAchievements();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw skin texture overlay
        if (activeSkin && activeSkin.texture && forestTexLoaded) {
          ctx.globalAlpha = 0.08;
          if (!window._skinPattern) {
            window._skinPattern = ctx.createPattern(
              activeSkin.texture,
              "repeat",
            );
          }
          if (window._skinPattern) {
            ctx.fillStyle = window._skinPattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.globalAlpha = 1;
        } else {
          window._skinPattern = null;
        }

        // Side-Scroll: moving vertical pillars + parallax to convey running right
        if (gameMode === "sidescroll") {
          const speed = currentDifficulty.speedMult;
          ctx.lineWidth = 2;
          for (let i = 0; i < 9; i++) {
            const x =
              ((((i * 90 - frameCount * speed) % 450) + 450) % 450) - 25;
            ctx.strokeStyle = "rgba(120,255,180,0.08)";
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            ctx.strokeStyle = "rgba(120,255,180,0.16)";
            ctx.strokeRect(x + 2, 0, 6, canvas.height);
          }
          ctx.strokeStyle = "rgba(120,255,180,0.25)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(10, canvas.height);
          ctx.stroke();
        }

        if (gameMode !== "ninja") {
          drawPlayer();
        }

        if (gameMode === "bossrush") {
          handleBoss();
          handleProjectiles();
          handleObstacles();
          handleCoins();
        } else {
          handleCoins();
          handleKeys();
          handlePowerUps();
          handlePortals();
          handleProjectiles();
          handleWalls();
          handleObstacles();
        }
        handleParticles();
        handleGlassShards();

        if (gameMode === "ninja") {
          if (bladeTrail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(bladeTrail[0].x, bladeTrail[0].y);
            for (let i = 1; i < bladeTrail.length; i++) {
              ctx.lineTo(bladeTrail[i].x, bladeTrail[i].y);
            }
            ctx.strokeStyle = "#00ff00";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00ff00";
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        }

        if (gameMode === "race") NeonRace.tick();

        if (activeEffects.blaster > 0 && frameCount % 10 === 0) {
          projectiles.push(
            new Projectile(player.x + player.width / 2 - 2, player.y),
          );
        }
        if (gameMode === "bossrush" && frameCount % 12 === 0) {
          projectiles.push(
            new Projectile(player.x + player.width / 2 - 2, player.y),
          );
        }

        frameCount++;
        animationId = requestAnimationFrame(animate);
      }

      // Draw player initially before game starts
      var pColor =
        activeSkin && activeSkin.colors
          ? activeSkin.colors.player
          : player.color;
      ctx.fillStyle = pColor;
      ctx.shadowBlur = 20;
      ctx.shadowColor = pColor;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // PWA: optional install — site works normally in any browser
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      }

      let deferredInstallPrompt = null;
      const installAppBtn = document.getElementById("installAppBtn");
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone;

      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        if (!isStandalone) installAppBtn.classList.add("visible");
      });

      installAppBtn.addEventListener("click", async () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          await deferredInstallPrompt.userChoice;
          deferredInstallPrompt = null;
          installAppBtn.classList.remove("visible");
        } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          alert('Tap the Share button, then "Add to Home Screen" to install.');
        }
      });

      window.addEventListener("appinstalled", () => {
        deferredInstallPrompt = null;
        installAppBtn.classList.remove("visible");
      });
      if (
        location.hostname === "neon-dodgers.vercel.app" ||
        location.hostname.endsWith(".vercel.app")
      ) {
        window.ND_WS_URL = "wss://neon-dodgers-race.onrender.com";
      }
      function _t(k, v) {
        return typeof NeonI18n === "object" && NeonI18n.t
          ? NeonI18n.t(k, v)
          : k;
      }
      function applyI18n() {
        try {
          var _x;
          var titleEl = document.querySelector("#mainMenu h1");
          if (titleEl) titleEl.textContent = _t("title");
          var els = document.querySelectorAll(
            "#difficultyButtons .diff-btn, #ninjaDifficultyButtons .diff-btn, #chaosDifficultyButtons .diff-btn, #speedRushDifficultyButtons .diff-btn, #meteorDifficultyButtons .diff-btn, #sideScrollDifficultyButtons .diff-btn, #invertedDifficultyButtons .diff-btn",
          );
          var diffKeys = [
            "diffBeginner",
            "diffEasy",
            "diffNormal",
            "diffHard",
            "diffExpert",
            "diffMaster",
            "diffWizard",
            "diffInsane",
            "diffLegend",
            "diffGod",
          ];
          els.forEach(function (btn) {
            var lv = parseInt(btn.dataset.level);
            if (lv >= 0 && lv < diffKeys.length)
              btn.textContent = _t(diffKeys[lv]);
          });
          var installBtn = document.getElementById("installAppBtn");
          if (installBtn) installBtn.textContent = _t("installApp");
          var tutBtn = document.getElementById("btnTutorial");
          if (tutBtn) tutBtn.innerHTML = "\uD83D\uDCD6 " + _t("howToPlay");
          var shareTip = document.getElementById("shareTip");
          if (shareTip)
            shareTip.innerHTML =
              "\uD83C\uDF10 " +
              _t("visitSite", {
                url: '<a href=\"https://neon-dodgers.vercel.app\" target=\"_blank\">neon-dodgers.vercel.app</a>',
              }) +
              "<br>\uD83D\uDCF1 " +
              _t("iphoneTip");
          var menuXp = document.getElementById("menuXpDisplay");
          if (menuXp) menuXp.textContent = _t("xpDisplay", { xp: xp });
          _x = document.getElementById("btnEndlessMode");
          if (_x) _x.textContent = _t("modeEndless");
          _x = document.getElementById("btnLevelMode");
          if (_x) _x.textContent = _t("modeLevels");
          _x = document.getElementById("btnRaceMode");
          if (_x) _x.textContent = _t("modeRace");
          _x = document.getElementById("btnNinjaMode");
          if (_x) _x.textContent = _t("modeNinja");
          _x = document.getElementById("btnSurvivalMode");
          if (_x) _x.textContent = _t("modeSurvival");
          _x = document.getElementById("btnChaosMode");
          if (_x) _x.textContent = _t("modeChaos");
          _x = document.getElementById("btnSpeedRushMode");
          if (_x) _x.textContent = _t("modeSpeedRush");
          _x = document.getElementById("btnMeteorMode");
          if (_x) _x.textContent = _t("modeMeteor");
          _x = document.getElementById("btnReverseMode");
          if (_x) _x.textContent = _t("modeReverse");
          _x = document.getElementById("btnZenMode");
          if (_x) _x.textContent = _t("modeZen");
          _x = document.getElementById("btnBossMode");
          if (_x) _x.textContent = _t("modeBossRush");
          _x = document.getElementById("btnSideScrollMode");
          if (_x) _x.textContent = _t("modeSideScroll");
          _x = document.getElementById("btnInvertedMode");
          if (_x) _x.textContent = _t("modeInverted");
          _x = document.getElementById("btnStartSurvival");
          if (_x) _x.textContent = _t("startSurvival");
          _x = document.getElementById("btnStartReverse");
          if (_x) _x.textContent = _t("startReverse");
          _x = document.getElementById("btnStartZen");
          if (_x) _x.textContent = _t("startZen");
          _x = document.getElementById("btnStartBossRush");
          if (_x) _x.textContent = _t("startBossRush");
          _x = document.getElementById("btnAchievements");
          if (_x) _x.innerHTML = "\uD83C\uDFC6 " + _t("achievementsBtn");
          _x = document.getElementById("achievementsTitle");
          if (_x) _x.textContent = "\uD83C\uDFC6 " + _t("achievementsTitle");
          _x = document.getElementById("achCloseBtn");
          if (_x) _x.textContent = _t("achievementsClose");
          document.querySelectorAll(".mode-back-btn").forEach(function (b) {
            var m = b.dataset.menu;
            if (m === "survivalMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "chaosMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "speedRushMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "meteorMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "reverseMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "zenMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "bossRushMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "sideScrollMenu") b.textContent = "\u2190 " + _t("back");
            if (m === "invertedMenu") b.textContent = "\u2190 " + _t("back");
          });
          _x = document.querySelector("#survivalMenu .text");
          if (_x) _x.textContent = _t("modeSurvival");
          _x = document.querySelector("#chaosMenu .text");
          if (_x) _x.textContent = _t("modeChaos");
          _x = document.querySelector("#speedRushMenu .text");
          if (_x) _x.textContent = _t("modeSpeedRush");
          _x = document.querySelector("#meteorMenu .text");
          if (_x) _x.textContent = _t("modeMeteor");
          _x = document.querySelector("#reverseMenu .text");
          if (_x) _x.textContent = _t("modeReverse");
          _x = document.querySelector("#zenMenu .text");
          if (_x) _x.textContent = _t("modeZen");
          _x = document.querySelector("#bossRushMenu .text");
          if (_x) _x.textContent = _t("modeBossRush");
          _x = document.querySelector("#sideScrollMenu .text");
          if (_x) _x.textContent = _t("modeSideScroll");
          _x = document.querySelector("#invertedMenu .text");
          if (_x) _x.textContent = _t("modeInverted");
          var modeDescs = {
            survivalMenu: "survivalDesc",
            chaosMenu: "chaosDesc",
            speedRushMenu: "speedRushDesc",
            meteorMenu: "meteorDesc",
            reverseMenu: "reverseDesc",
            zenMenu: "zenDesc",
            bossRushMenu: "bossRushDesc",
            sideScrollMenu: "sideScrollDesc",
            invertedMenu: "invertedDesc",
          };
          Object.keys(modeDescs).forEach(function (id) {
            var p = document.querySelector("#" + id + " p.text");
            if (p) p.textContent = _t(modeDescs[id]);
          });
          _x = document.querySelector("#endlessMenu .text");
          if (_x) _x.textContent = _t("selectDifficulty");
          _x = document.querySelector("#levelsMenu .text");
          if (_x) _x.textContent = _t("selectLevel");
          _x = document.querySelector("#ninjaMenu .text");
          if (_x) _x.textContent = _t("selectNinjaDifficulty");
          _x = document.getElementById("restartBtn");
          if (_x) _x.textContent = _t("retry");
          _x = document.getElementById("menuBtn");
          if (_x) _x.textContent = _t("mainMenu");
          _x = document.getElementById("suggestBtn");
          if (_x) _x.textContent = _t("suggestions");
          _x = document.querySelector("#gameOver h1");
          if (_x) _x.textContent = _t("gameOver");
          _x = document.querySelector("#levelComplete h1");
          if (_x) _x.textContent = _t("levelCleared");
          _x = document.getElementById("levelMenuBtn");
          if (_x) _x.textContent = _t("mainMenu");
          _x = document.querySelector("#raceMenu h1");
          if (_x) _x.textContent = _t("raceModeTitle");
          var raceDesc = document.querySelector("#raceMenu p");
          if (raceDesc) raceDesc.textContent = _t("raceLastStanding");
          _x = document.getElementById("raceTabCpu");
          if (_x) _x.textContent = _t("raceTabCpu");
          var rnLabel = document.querySelector('label[for="racePlayerName"]');
          if (rnLabel) rnLabel.textContent = _t("racePlayerName");
          var rcLabel = document.querySelector('label[for="racePlayerCount"]');
          if (rcLabel) rcLabel.textContent = _t("racePlayerCount");
          var rdLabel = document.querySelector('label[for="raceDifficulty"]');
          if (rdLabel) rdLabel.textContent = _t("raceDifficulty");
          _x = document.getElementById("raceStartCpu");
          if (_x) _x.textContent = _t("raceStartCpu");
          _x = document.getElementById("raceBackBtn");
          if (_x) _x.textContent = _t("raceBack");
          var standingsTitle = document.querySelector("#raceStandings h3");
          if (standingsTitle)
            standingsTitle.textContent = "\uD83C\uDFC1 " + _t("raceStandings");
          _x = document.querySelector("#raceEliminated h2");
          if (_x) _x.textContent = _t("raceEliminated");
          var watchText = document.querySelector("#raceEliminated p");
          if (watchText) watchText.textContent = _t("raceWatchStandings");
          _x = document.getElementById("raceResultsMenu");
          if (_x) _x.textContent = _t("raceMainMenu");
          _x = document.getElementById("raceResultsRetry");
          if (_x) _x.textContent = _t("raceAgain");
          if (typeof renderLevelsMenu === "function") renderLevelsMenu();
          _x = document.getElementById("shopTitle");
          if (_x) _x.textContent = _t("shopTitle");
          _x = document.getElementById("btnShop");
          if (_x) _x.innerHTML = "\uD83D\uDED2 " + _t("shopBtn");
          _x = document.getElementById("btnCreator");
          if (_x) _x.innerHTML = "\uD83C\uDFA8 " + _t("creatorBtn");
          _x = document.getElementById("shopCloseBtn");
          if (_x) _x.textContent = _t("shopClose");
          _x = document.getElementById("shopSubText");
          if (_x) _x.textContent = _t("shopSub");
          var musicLabel = document.querySelector('label[for="songSelect"]');
          if (musicLabel) musicLabel.textContent = _t("musicTrack");
          var pauseMusicLabel = document.querySelector(
            'label[for="pauseSongSelect"]',
          );
          if (pauseMusicLabel) pauseMusicLabel.textContent = _t("musicTrack");
          var langLabel = document.querySelector('label[for="langSelect"]');
          if (langLabel) langLabel.textContent = _t("language");
          var scrollHint = document.getElementById("scrollHint");
          if (scrollHint) scrollHint.textContent = _t("scrollForMore");
          var pauseH1 = document.querySelector("#pauseOverlay h1");
          if (pauseH1) pauseH1.textContent = _t("paused");
          if (pauseResumeBtn) pauseResumeBtn.textContent = _t("resume");
          if (pauseExitBtn) pauseExitBtn.textContent = _t("exitLevel");
          if (pauseMuteBtn)
            pauseMuteBtn.textContent = isMuted
              ? "\uD83D\uDD07"
              : "\uD83D\uDD0A";
          document
            .querySelectorAll("#songSelect option, #pauseSongSelect option")
            .forEach(function (opt) {
              var key = opt.getAttribute("data-i18n");
              if (key) opt.textContent = _t(key);
            });
          document
            .querySelectorAll("#racePlayerCount option, #raceDifficulty option")
            .forEach(function (opt) {
              var key = opt.getAttribute("data-i18n");
              if (!key) return;
              var n = opt.getAttribute("data-n");
              opt.textContent = n ? _t(key, { n: n }) : _t(key);
            });
          var rnInput = document.getElementById("racePlayerName");
          if (rnInput) {
            var phKey = rnInput.getAttribute("data-i18n-placeholder");
            if (phKey) rnInput.placeholder = _t(phKey);
          }
          document
            .querySelectorAll("#tutorialModal [data-i18n]")
            .forEach(function (el) {
              var key = el.getAttribute("data-i18n");
              if (key) el.innerHTML = _t(key);
            });
          if (typeof updateScrollHint === "function") updateScrollHint();
        } catch (e) {
          console.error("applyI18n error:", e);
        }
      }
      var s = document.getElementById("songSelect");
      if (s) {
        s.value = localStorage.getItem("neonSong") || "dimension.mp3";
        if (
          bgMusic.src.indexOf(s.value) === -1 ||
          !bgMusic.src.endsWith(s.value)
        ) {
          bgMusic.src = s.value;
        }
        s.addEventListener("change", function () {
          localStorage.setItem("neonSong", this.value);
          bgMusic.src = this.value;
          if (!bgMusic.paused) {
            bgMusic.play().catch(function (e) {
              console.log("Audio replay failed:", e);
            });
          }
          if (pauseSongSelect) pauseSongSelect.value = this.value;
        });
        if (pauseSongSelect) {
          pauseSongSelect.innerHTML = s.innerHTML;
          pauseSongSelect.value = s.value;
        }
      }
      var _origSetLang = NeonI18n.setLang;
      NeonI18n.setLang = function (code) {
        _origSetLang.call(NeonI18n, code);
        if (typeof applyI18n === "function") applyI18n();
      };
      NeonI18n.init();
      window._t = NeonI18n.t.bind(NeonI18n);
      applyI18n();
      if (typeof updateScoreDisplayVisibility === "function")
        updateScoreDisplayVisibility();
      NeonRace.init({
        onRaceStart({ difficultyIndex }) {
          gameMode = "race";
          currentDifficulty = difficulties[difficultyIndex];
          mainMenu.style.display = "none";
          document.getElementById("raceMenu").style.display = "none";
          resetGame();
        },
        onRaceExit() {
          gameMode = "endless";
          isGameOver = false;
          isPaused = false;
          pauseOverlay.style.display = "none";
          cancelAnimationFrame(animationId);
          bgMusic.pause();
          pauseBtn.style.display = "none";
          mainMenu.style.display = "flex";
          setTimeout(updateScrollHint, 50);
          document.getElementById("raceEliminated").style.display = "none";
        },
        onRaceEnd() {
          cancelAnimationFrame(animationId);
          bgMusic.pause();
          pauseBtn.style.display = "none";
          pauseOverlay.style.display = "none";
          isPaused = false;
        },
      });
