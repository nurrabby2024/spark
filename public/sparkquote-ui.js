
(function () {
  const STORAGE_KEY = "sparkquote-v1";

  const QUOTES = [{"text": "Start tiny, but start today.", "author": "", "tag": "action"}, {"text": "Done quietly beats perfect postponed.", "author": "", "tag": "action"}, {"text": "Your future self is watching the next 10 minutes closely.", "author": "", "tag": "reflection"}, {"text": "If it takes under two minutes, do it now.", "author": "", "tag": "action"}, {"text": "You don’t need more time, you need a smaller first step.", "author": "", "tag": "productivity"}, {"text": "Rest is not a reward, it’s part of the work.", "author": "", "tag": "rest"}, {"text": "Be curious for 30 more seconds before you quit.", "author": "", "tag": "grit"}, {"text": "You are allowed to try again without hating your last attempt.", "author": "", "tag": "kindness"}, {"text": "Small daily improvements are harder to notice and impossible to beat.", "author": "", "tag": "growth"}, {"text": "If you can’t do it for an hour, do it for five minutes.", "author": "", "tag": "action"}, {"text": "Even a tiny win is still a real win.", "author": "", "tag": "mindset"}, {"text": "You’ve survived 100% of your bad days so far.", "author": "", "tag": "resilience"}, {"text": "You don’t have to fix everything today.", "author": "", "tag": "kindness"}, {"text": "Move like someone you care about lives in your body.", "author": "", "tag": "health"}, {"text": "When in doubt, clean one small corner of your world.", "author": "", "tag": "clarity"}, {"text": "Your pace is still progress.", "author": "", "tag": "mindset"}, {"text": "You can be a beginner without being a failure.", "author": "", "tag": "growth"}, {"text": "Silence one notification and you just created more focus.", "author": "", "tag": "focus"}, {"text": "Let yourself be 1% wrong so you can be 99% done.", "author": "", "tag": "perfectionism"}, {"text": "It’s okay if all you did today was keep going.", "author": "", "tag": "resilience"}, {"text": "Your standards can be high while your first draft is terrible.", "author": "", "tag": "creativity"}, {"text": "Ask for help before you hit the wall, not after.", "author": "", "tag": "connection"}, {"text": "The plan can be small if the direction is right.", "author": "", "tag": "direction"}, {"text": "Energy beats hours. Protect what gives you energy.", "author": "", "tag": "energy"}, {"text": "You don’t owe anyone a 24/7 highlight reel.", "author": "", "tag": "authenticity"}, {"text": "Sometimes the bravest thing is a gentle answer.", "author": "", "tag": "kindness"}, {"text": "It’s fine if your best today looks different from your best last week.", "author": "", "tag": "self-compassion"}, {"text": "Your attention is your most expensive currency.", "author": "", "tag": "focus"}, {"text": "You can start over at any hour of the day.", "author": "", "tag": "fresh-start"}, {"text": "A short walk can reset more than another scroll.", "author": "", "tag": "health"}, {"text": "You’re allowed to outgrow old versions of yourself.", "author": "", "tag": "growth"}, {"text": "One honest sentence can move a whole conversation.", "author": "", "tag": "communication"}, {"text": "If it’s not a clear yes, it can be a gentle no.", "author": "", "tag": "boundaries"}, {"text": "You don’t have to earn your right to rest.", "author": "", "tag": "rest"}, {"text": "Showing up bored still counts as showing up.", "author": "", "tag": "discipline"}, {"text": "Make it easier to start than to avoid.", "author": "", "tag": "habits"}, {"text": "Your timeline is not late, it’s yours.", "author": "", "tag": "mindset"}, {"text": "You’re learning even when it feels slow.", "author": "", "tag": "growth"}, {"text": "Let today be lighter than yesterday.", "author": "", "tag": "kindness"}, {"text": "Stop asking if it’s too small and start asking if it’s true.", "author": "", "tag": "clarity"}, {"text": "You are allowed to change your mind with new information.", "author": "", "tag": "wisdom"}, {"text": "Momentum loves small promises that you actually keep.", "author": "", "tag": "habits"}, {"text": "Make the next choice a tiny bit kinder to yourself.", "author": "", "tag": "self-compassion"}];

  const quoteTextEl = document.getElementById("quote-text");
  const quoteAuthorEl = document.getElementById("quote-author");
  const quoteTagEl = document.getElementById("quote-tag");
  const favoriteLabelEl = document.getElementById("favorite-label");
  const seenLabelEl = document.getElementById("seen-label");
  const modeLabelEl = document.getElementById("mode-label");

  const nextBtn = document.getElementById("next-btn");
  const favoriteBtn = document.getElementById("favorite-btn");
  const copyBtn = document.getElementById("copy-btn");

  let state = {
    seenToday: 0,
    favorites: [],
    lastSeenId: null,
    mode: "all", // all or favorites
    lastDate: null
  };

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[SparkQuote] failed to load state", e);
      return null;
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("[SparkQuote] failed to save state", e);
    }
  }

  function resetDayIfNeeded() {
    const today = todayKey();
    if (!state.lastDate) {
      state.lastDate = today;
      return;
    }
    if (state.lastDate !== today) {
      state.seenToday = 0;
      state.lastDate = today;
    }
  }

  function getCurrentList() {
    if (state.mode === "favorites" && state.favorites.length) {
      return QUOTES.filter((_, idx) => state.favorites.includes(idx));
    }
    return QUOTES;
  }

  function pickRandomIndex(listLength) {
    if (listLength <= 1) return 0;
    let idx = Math.floor(Math.random() * listLength);
    return idx;
  }

  function renderQuoteByIndex(idx, sourceList, sourceIndices) {
    const item = sourceList[idx];
    const globalIndex = sourceIndices[idx];

    state.lastSeenId = globalIndex;
    state.seenToday += 1;
    state.lastDate = todayKey();

    if (quoteTextEl) quoteTextEl.textContent = item.text;
    if (quoteAuthorEl) quoteAuthorEl.textContent = item.author ? "— " + item.author : "";
    if (quoteTagEl) quoteTagEl.textContent = item.tag || "general";

    const isFav = state.favorites.includes(globalIndex);
    if (favoriteBtn) favoriteBtn.textContent = isFav ? "★ Favorited" : "★ Favorite";

    renderStats();
    saveState();
  }

  function renderStats() {
    const favCount = state.favorites.length || 0;
    if (favoriteLabelEl) favoriteLabelEl.textContent = favCount + (favCount === 1 ? " favorite" : " favorites");

    if (seenLabelEl) seenLabelEl.textContent = state.seenToday + " seen today";

    if (modeLabelEl) {
      modeLabelEl.textContent = "Mode: " + (state.mode === "favorites" ? "Favorites" : "All quotes");
    }
  }

  function showRandomQuote() {
    const todayList = getCurrentList();
    if (!todayList.length) {
      if (quoteTextEl) quoteTextEl.textContent = "No favorites yet. Add some stars in All quotes mode.";
      if (quoteAuthorEl) quoteAuthorEl.textContent = "";
      if (quoteTagEl) quoteTagEl.textContent = "info";
      return;
    }
    // Map list items back to global indices
    const sourceIndices = state.mode === "favorites"
      ? QUOTES.map((_, idx) => idx).filter((idx) => state.favorites.includes(idx))
      : QUOTES.map((_, idx) => idx);

    const idx = pickRandomIndex(todayList.length);
    renderQuoteByIndex(idx, todayList, sourceIndices);
  }

  function toggleFavoriteCurrent() {
    if (state.lastSeenId == null) return;
    const id = state.lastSeenId;
    const i = state.favorites.indexOf(id);
    if (i === -1) {
      state.favorites.push(id);
    } else {
      state.favorites.splice(i, 1);
    }
    saveState();
    renderStats();

    const isFavNow = state.favorites.includes(id);
    if (favoriteBtn) favoriteBtn.textContent = isFavNow ? "★ Favorited" : "★ Favorite";
  }

  async function copyCurrentQuote() {
    if (!quoteTextEl) return;
    const text = quoteTextEl.textContent || "";
    const author = quoteAuthorEl ? quoteAuthorEl.textContent : "";
    const full = author ? text + "\n" + author : text;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(full);
      }
      if (copyBtn) {
        const original = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(() => {
          copyBtn.textContent = original;
        }, 900);
      }
    } catch (e) {
      console.warn("[SparkQuote] copy failed", e);
    }
  }

  function init() {
    const saved = loadState();
    if (saved) {
      state = Object.assign(state, saved);
    }
    resetDayIfNeeded();
    renderStats();

    if (nextBtn) nextBtn.addEventListener("click", showRandomQuote);
    if (favoriteBtn) favoriteBtn.addEventListener("click", toggleFavoriteCurrent);
    if (copyBtn) copyBtn.addEventListener("click", copyCurrentQuote);

    // Draw first quote immediately
    showRandomQuote();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
