//  lazy + cache + prefetch 


(function () {

  const defaultLang = "es";
  const supportedLangs = ["es", "en", "pt", "fr"];

  // 🔍 URL
  function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    return supportedLangs.includes(lang) ? lang : null;
  }

  // 🌍 navegador
  function detectBrowserLang() {
    const langs = navigator.languages || [navigator.language];

    for (let lang of langs) {
      const short = lang.split("-")[0];
      if (supportedLangs.includes(short)) return short;
    }

    return null;
  }

  // 🔥 prioridad: localStorage > URL > navegador > default
  let currentLang =
    localStorage.getItem("lang") ||
    getLangFromURL() ||
    detectBrowserLang() ||
    defaultLang;

  const cache = {};
  let sections = [];

  const CONFIG = {
    ENABLE_ANIMATION: true,
    LOADING_DURATION: 2000,
    SUCCESS_DURATION: 1500
  };

  let isChangingLang = false;

  const systemMessages = {
    loading: {
      es: "Cambiando el idioma en todo el sitio web, espere por favor...",
      en: "Changing the language across the entire website, please wait...",
      pt: "Alterando o idioma em todo o site, por favor aguarde...",
      fr: "Changement de la langue sur tout le site, veuillez patienter..."
    },
    success: {
      es: "Idioma cargado con gran éxito en todo el sitio web",
      en: "Language successfully loaded across the entire website",
      pt: "Idioma carregado com grande sucesso em todo o site",
      fr: "Langue chargée avec grand succès sur tout le site"
    }
  };

  async function loadSection(lang, section) {

    if (lang === "es") return {};

    const key = `${lang}_${section}`;
    if (cache[key]) return cache[key];

    try {
      const res = await fetch(`/lang/${lang}/${section}.json`, {
        cache: "force-cache"
      });

      const data = await res.json();
      cache[key] = data;
      return data;

    } catch (e) {
      console.warn("i18n error:", section);
      cache[key] = {};
      return {};
    }
  }

  // 🔥 traducción principal
  function applyDict(sectionEl, dict) {

    // texto
    sectionEl.querySelectorAll("[data-i18n]").forEach(el => {

      const key = el.dataset.i18n;

      if (!el.dataset.original) {
        el.dataset.original = getTextContent(el);
      }

      const base = el.dataset.original;

      const translation =
        currentLang === "es"
          ? base
          : (dict[key] || base);

      replaceTextContent(el, translation);
    });

    // 🔥 atributos

    translateAttr(sectionEl, dict, "placeholder", "i18nPlaceholder");
    translateAttr(sectionEl, dict, "title", "i18nTitle");
    translateAttr(sectionEl, dict, "alt", "i18nAlt");
    translateAttr(sectionEl, dict, "value", "i18nValue");
    translateAttr(sectionEl, dict, "aria-label", "i18nAria");
  }

  function translateAttr(sectionEl, dict, attr, dataKey) {

    sectionEl.querySelectorAll(`[data-${toKebab(dataKey)}]`).forEach(el => {

      const key = el.dataset[dataKey];

      const originalKey = "original" + capitalize(dataKey);

      if (!el.dataset[originalKey]) {
        el.dataset[originalKey] = el.getAttribute(attr) || el.value || "";
      }

      const base = el.dataset[originalKey];

      const translation =
        currentLang === "es"
          ? base
          : (dict[key] || base);

      if (attr === "value") {
        el.value = translation;
      } else {
        el.setAttribute(attr, translation);
      }
    });
  }

  function toKebab(str) {
    return str.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getTextContent(el) {
    let text = "";

    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.nodeValue.replace(/\u00A0/g, " ").trim() + " ";
      }
    });

    return text.trim();
  }

  function replaceTextContent(el, newText) {

    let replaced = false;

    el.childNodes.forEach(node => {

      if (node.nodeType === Node.TEXT_NODE) {

        const clean = node.nodeValue.replace(/\u00A0/g, " ").trim();

        if (clean.length > 0 && !replaced) {
          node.nodeValue = " " + newText + " ";
          replaced = true;
        }
      }
    });

    if (!replaced) el.textContent = newText;
  }

  async function translateAllNow() {

    const promises = sections.map(async (section) => {

      const name = section.dataset.i18nSection;
      const dict = await loadSection(currentLang, name);

      applyDict(section, dict);

    });

    await Promise.all(promises);
  }

  function showLanguageFlow(lang) {

    return new Promise((resolve) => {

      const getMsg = (type) =>
        systemMessages[type][lang] ?? systemMessages[type][defaultLang];

      const toast = document.createElement("div");

      toast.style.position = "fixed";
      toast.style.top = "90px";
      toast.style.right = "20px";
      toast.style.background = "linear-gradient(145deg, #198754, #146c43)";
      toast.style.color = "#d1ffe0";
      toast.style.padding = "14px 20px";
      toast.style.borderRadius = "14px";
      toast.style.border = "1px solid #4cff9a";
      toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.35)";
      toast.style.display = "flex";
      toast.style.gap = "10px";
      toast.style.zIndex = "9999";

      const icon = document.createElement("span");
      const text = document.createElement("span");
      const spinner = document.createElement("div");

      spinner.style.width = "18px";
      spinner.style.height = "18px";
      spinner.style.border = "2px solid #d1ffe0";
      spinner.style.borderTop = "2px solid transparent";
      spinner.style.borderRadius = "50%";
      spinner.style.animation = "spin 1s linear infinite";

      const style = document.createElement("style");
      style.innerHTML = `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);

      toast.append(icon, text, spinner);
      document.body.appendChild(toast);

      icon.textContent = "⏳";
      text.textContent = getMsg("loading");

      setTimeout(() => {

        spinner.remove();
        icon.textContent = "✔️";
        text.textContent = getMsg("success");

        setTimeout(() => {
          toast.remove();
          resolve();
        }, CONFIG.SUCCESS_DURATION);

      }, CONFIG.LOADING_DURATION);
    });
  }

  function setupLazy() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(async entry => {
        if (entry.isIntersecting) {
          const section = entry.target;
          const dict = await loadSection(currentLang, section.dataset.i18nSection);
          applyDict(section, dict);
        }
      });
    }, { rootMargin: "200px" });

    sections.forEach(sec => observer.observe(sec));
  }

  function initSections() {
    sections = Array.from(document.querySelectorAll("[data-i18n-section]"));
  }

  async function applyLang(lang) {

    if (isChangingLang) return;
    isChangingLang = true;

    const select = document.getElementById("idioma");
    if (select) select.disabled = true;

    await showLanguageFlow(lang);

    currentLang = lang;

    await translateAllNow();

    localStorage.setItem("lang", lang);

    // 🔗 actualizar URL
    const url = new URL(window.location);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", url);

    if (select) select.disabled = false;
    isChangingLang = false;
  }

  document.addEventListener("DOMContentLoaded", async () => {

    initSections();

    await translateAllNow();
    setupLazy();

    const select = document.getElementById("idioma");

    if (select) {
      select.value = currentLang;
      select.addEventListener("change", function () {
        applyLang(this.value);
      });
    }

  });

})();
//testear carga del archivo console.log("i18n.js");