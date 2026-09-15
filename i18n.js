(function () {
  const LANG_KEY = 'neonLang';

  const TR = {};

  window.NeonI18n = {
    _TR: TR,

    addLang(code, data) {
      TR[code] = data;
    },

    current: localStorage.getItem(LANG_KEY) || 'en-US',
    _els: [],

    reg(el, key, isAttr) {
      this._els.push({ el, key, isAttr });
    },

    t(key, vals) {
      const lang = TR[this.current];
      if (!lang) return key;
      let str = lang.s[key];
      if (str === undefined) {
        const fallback = TR['en-US'];
        str = fallback && fallback.s[key];
        if (str === undefined) return key;
      }
      if (vals) {
        for (const k in vals) {
          str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), vals[k]);
        }
      }
      return str;
    },

    dir() {
      const lang = TR[this.current];
      return lang ? lang.dir : 'ltr';
    },

    setLang(code) {
      if (!TR[code]) return;
      this.current = code;
      localStorage.setItem(LANG_KEY, code);
      document.documentElement.lang = code;
      document.documentElement.dir = this.dir();
      this._els.forEach(function (item) {
        const v = NeonI18n.t(item.key);
        if (item.el) {
          if (item.isAttr) item.el.setAttribute(item.attr || 'placeholder', v);
          else item.el.textContent = v;
        }
      });
    },

    populateSelect(sel) {
      sel.innerHTML = '';
      var codes = Object.keys(TR).sort(function (a, b) {
        return TR[a].nativeName.localeCompare(TR[b].nativeName, 'en');
      });
      codes.forEach(function (code) {
        var lang = TR[code];
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = lang.nativeName;
        if (code === NeonI18n.current) opt.selected = true;
        sel.appendChild(opt);
      });
    },

    init() {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && TR[saved]) this.current = saved;
      document.documentElement.lang = this.current;
      document.documentElement.dir = this.dir();
      var sel = document.getElementById('langSelect');
      if (sel) {
        this.populateSelect(sel);
        var self = this;
        sel.addEventListener('change', function () {
          self.setLang(this.value);
        });
        this.setLang(this.current);
      }
    }
  };
})();
