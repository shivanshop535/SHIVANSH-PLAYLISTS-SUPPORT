(() => {
  const POLL_MS = 15000;
  const STORAGE_KEY = "sp_username";
  const RING_CIRCUMFERENCE = 2 * Math.PI * 123; // matches r=123 in the SVG

  const els = {
    todayCount: document.getElementById("today-count"),
    goalCount: document.getElementById("goal-count"),
    goalLabel: document.getElementById("goal-label"),
    ringProgress: document.getElementById("ring-progress"),
    ringLabel: document.getElementById("ring-label"),
    lockBadge: document.getElementById("lock-badge"),
    gradientEnd: document.getElementById("gradient-end"),
    pulseRings: document.getElementById("pulse-rings"),
    form: document.getElementById("support-form"),
    usernameInput: document.getElementById("username"),
    formError: document.getElementById("form-error"),
    supportBtn: document.getElementById("support-btn"),
    btnIcon: document.getElementById("btn-icon"),
    btnText: document.getElementById("btn-text"),
    leaderboardList: document.getElementById("leaderboard-list"),
    toast: document.getElementById("toast"),
    toastIcon: document.getElementById("toast-icon"),
    toastMessage: document.getElementById("toast-message"),
    toastClose: document.getElementById("toast-close"),
  };

  let prevGoalHit = false;
  let statsErrorShown = false;

  const ICONS = {
    unlock:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2 9.5 8.5 3 11l6.5 2.5L12 20l2.5-6.5L21 11l-6.5-2.5L12 2Z" fill="currentColor"/></svg>',
    spinner:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 1 1-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    lockOpen:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 10V7a5 5 0 0 1 9.9-1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><rect x="4" y="10" width="16" height="10" rx="2" fill="currentColor"/></svg>',
    lockClosed:
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm-3 8V7a3 3 0 0 1 6 0v3H9Z" fill="currentColor"/></svg>',
    success:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm4.7-11.7-5.3 5.3-2.1-2.1" stroke="#FBBF24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    error:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm3-13-6 6m0-6 6 6" stroke="#E879F9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    crown:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="m3 8 4 3 5-6 5 6 4-3-2 11H5L3 8Z" fill="currentColor"/></svg>',
    trophy:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" fill="currentColor"/><path d="M8 4H4v2a4 4 0 0 0 4 3.5M16 4h4v2a4 4 0 0 1-4 3.5" stroke="currentColor" stroke-width="1.6"/><path d="M10 14h4v3h-4z" fill="currentColor"/><path d="M7 20h10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    medal:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="15" r="6" fill="currentColor"/><path d="m8 3 2 6h4l2-6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    flame:
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2s5 4.5 5 9.5a5 5 0 1 1-10 0C7 8 9 6 9 6s.5 2 2 2c1 0 1-2 1-3 0-1.5-1-2.5-1-2.5S12 2 12 2Z" fill="currentColor"/></svg>',
  };

  // ---------- helpers ----------

  /**
   * Fetch + parse JSON safely. If the server ever returns something that
   * isn't JSON (an HTML error page from a failed deploy, a 404, etc.) this
   * throws a clean, readable error instead of the raw
   * "Unexpected token '<'... is not valid JSON" message.
   */
  async function safeFetchJson(url, options) {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      throw new Error(
        `Server returned an unexpected response (status ${res.status}). The API may not be deployed correctly.`
      );
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (status ${res.status}).`);
    return data;
  }

  function animateCount(el, from, to, duration = 700) {
    if (from === to) {
      el.textContent = to;
      return;
    }
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.round(from + (to - from) * eased);
      el.textContent = value;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function fireConfetti() {
    if (typeof confetti !== "function") return;
    const colors = ["#7C3AED", "#C084FC", "#E879F9", "#FBBF24"];
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors });
    confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
  }

  function showToast(type, message) {
    els.toast.classList.remove("hidden", "success", "error");
    els.toast.classList.add(type);
    els.toastIcon.innerHTML = type === "success" ? ICONS.success : ICONS.error;
    els.toastMessage.textContent = message;
  }

  els.toastClose.addEventListener("click", () => els.toast.classList.add("hidden"));

  // ---------- vault ring + stats ----------

  let lastKnownCount = null;

  async function fetchStats() {
    try {
      const data = await safeFetchJson("/api/stats", { cache: "no-store" });

      const from = lastKnownCount === null ? data.todayCount : lastKnownCount;
      animateCount(els.todayCount, from, data.todayCount);
      lastKnownCount = data.todayCount;

      els.goalCount.textContent = data.goal;
      els.goalLabel.textContent = data.goal;

      const offset = RING_CIRCUMFERENCE - (data.percent / 100) * RING_CIRCUMFERENCE;
      els.ringProgress.style.strokeDashoffset = offset;

      if (data.goalHit) {
        els.lockBadge.classList.add("unlocked");
        els.lockBadge.innerHTML = ICONS.lockOpen;
        els.ringLabel.textContent = "Vault unlocked today";
        els.gradientEnd.setAttribute("stop-color", "#FBBF24");
        els.pulseRings.classList.remove("hidden");
        if (!prevGoalHit) fireConfetti();
      } else {
        els.lockBadge.classList.remove("unlocked");
        els.lockBadge.innerHTML = ICONS.lockClosed;
        els.ringLabel.textContent = "Supporters today";
        els.gradientEnd.setAttribute("stop-color", "#E879F9");
        els.pulseRings.classList.add("hidden");
      }
      prevGoalHit = Boolean(data.goalHit);
    } catch (err) {
      if (!statsErrorShown) {
        statsErrorShown = true;
        showToast("error", err.message || "Could not load today's stats.");
      }
    }
  }

  // ---------- leaderboard ----------

  function renderSkeleton() {
    els.leaderboardList.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const li = document.createElement("li");
      li.className = "skeleton-row";
      els.leaderboardList.appendChild(li);
    }
  }

  function rankMeta(index) {
    if (index === 0) return { cls: "gold", icon: ICONS.crown };
    if (index === 1) return { cls: "silver", icon: ICONS.trophy };
    if (index === 2) return { cls: "bronze", icon: ICONS.medal };
    return null;
  }

  function renderLeaderboard(entries) {
    els.leaderboardList.innerHTML = "";

    if (!entries.length) {
      const li = document.createElement("li");
      li.className = "lb-empty";
      li.innerHTML = `<p>No supporters yet today</p><p>Be the first to unlock and claim the top spot.</p>`;
      els.leaderboardList.appendChild(li);
      return;
    }

    entries.forEach((entry, index) => {
      const meta = rankMeta(index);
      const li = document.createElement("li");
      li.className = `lb-item${index === 0 ? " rank-1" : ""}`;
      li.style.animationDelay = `${Math.min(index * 0.03, 0.3)}s`;

      li.innerHTML = `
        <div class="lb-left">
          <div class="lb-rank${meta ? " " + meta.cls : ""}">
            ${meta ? meta.icon : index + 1}
          </div>
          <div>
            <p class="lb-name">${escapeHtml(entry.username)}</p>
            <p class="lb-sub">${entry.total} unlock${entry.total === 1 ? "" : "s"} total</p>
          </div>
        </div>
        <div class="lb-streak${entry.streak > 0 ? " active" : ""}">
          ${ICONS.flame} ${entry.streak}
        </div>
      `;
      els.leaderboardList.appendChild(li);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function fetchLeaderboard() {
    try {
      const data = await safeFetchJson("/api/leaderboard", { cache: "no-store" });
      renderLeaderboard(data.leaderboard || []);
    } catch (err) {
      renderLeaderboardError(err.message);
    }
  }

  function renderLeaderboardError(message) {
    els.leaderboardList.innerHTML = "";
    const li = document.createElement("li");
    li.className = "lb-empty";
    li.innerHTML = `<p>Couldn't load the leaderboard</p><p>${escapeHtml(
      message || "Check your connection and try again."
    )}</p>`;
    els.leaderboardList.appendChild(li);
  }

  // ---------- support form ----------

  const savedName = window.localStorage.getItem(STORAGE_KEY);
  if (savedName) els.usernameInput.value = savedName;

  function setLoading(isLoading) {
    els.supportBtn.disabled = isLoading;
    els.btnIcon.classList.toggle("spin", isLoading);
    els.btnIcon.innerHTML = isLoading ? ICONS.spinner : ICONS.unlock;
    els.btnText.textContent = isLoading ? "Opening the link…" : "Unlock & Support";
  }

  els.form.addEventListener("submit", async (e) => {
    e.preventDefault();
    els.formError.classList.add("hidden");

    const username = els.usernameInput.value.trim();
    if (username.length < 2) {
      els.formError.textContent = "Enter a name with at least 2 characters.";
      els.formError.classList.remove("hidden");
      return;
    }

    setLoading(true);
    window.localStorage.setItem(STORAGE_KEY, username);

    try {
      const data = await safeFetchJson("/api/support-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      window.location.href = data.redirectUrl;
    } catch (err) {
      els.formError.textContent = err.message || "Something went wrong. Try again.";
      els.formError.classList.remove("hidden");
      setLoading(false);
    }
  });

  // ---------- handle ?supported=1/0 from the GPLinks redirect ----------

  function handleSupportedParam() {
    const params = new URLSearchParams(window.location.search);
    const supported = params.get("supported");

    if (supported === "1") {
      showToast("success", "You're verified! Thanks for the support — check your rank below.");
      fireConfetti();
      fetchStats();
      fetchLeaderboard();
    } else if (supported === "0") {
      showToast("error", "That link couldn't be verified. Try unlocking again.");
    }

    if (supported) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }

  // ---------- init ----------

  handleSupportedParam();
  fetchStats();
  fetchLeaderboard();
  renderSkeleton();
  setInterval(() => {
    fetchStats();
    fetchLeaderboard();
  }, POLL_MS);
})();
