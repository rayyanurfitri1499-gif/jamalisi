/* ===== IKLAN SPESIAL EDITION (HANYA UNTUK YANG BELUM LANGGANAN) ===== */
(function () {
  /* ---------- PENGATURAN ---------- */
  const LINK_SMARTLINK = "https://asiafilm.org/4/1b597d65e3fa566d005f9a1ec5e6d385";
  const SMARTLINK_SETIAP_DETIK = 60;
  const LINK_POPUNDER = "https://abscloud.org/1/7dc0f51577c92b0e7166a7adf63b7a86";
  const POPUNDER_TUNDA_DETIK = 3;

  const KUNCI = "se_iklan_detik";
  const bacaAngka = () => { try { return Number(localStorage.getItem(KUNCI)) || 0; } catch (e) { return 0; } };
  const tulisAngka = n => { try { localStorage.setItem(KUNCI, String(n)); } catch (e) {} };

  let statusSiap = false;
  const pelanggan = () => { try { return aktif(); } catch (e) { return false; } };
  const bolehIklan = () => statusSiap && !pelanggan();

  /* ---------- SMARTLINK: SETIAP 1 MENIT MENONTON ---------- */
  const layar = document.createElement("div");
  layar.style.cssText = "position:fixed;inset:0;z-index:150;display:none;align-items:center;justify-content:center;" +
    "padding:24px;background:rgba(5,3,10,.82);font-family:inherit";
  layar.innerHTML =
    '<div style="width:100%;max-width:340px;background:var(--card,#1a1330);border:1px solid var(--gold,#f5c04a);' +
    'border-radius:20px;padding:22px 18px;text-align:center;color:var(--teks,#f3eefc)">' +
    '<div style="font-size:34px;line-height:1">🎬</div>' +
    '<div style="font-weight:800;font-size:17px;margin-top:10px">Iklan sebentar</div>' +
    '<div style="font-size:13px;color:var(--redup,#9d93b8);margin-top:6px;line-height:1.5">' +
    "Iklan membantu kami tetap menyediakan video gratis. Ketuk tombol di bawah, lalu kembali ke sini untuk lanjut nonton.</div>" +
    '<button id="ikl-lanjut" style="display:block;width:100%;margin-top:16px;padding:13px;border:0;border-radius:999px;' +
    'font:inherit;font-weight:800;font-size:15px;background:linear-gradient(90deg,var(--gold,#f5c04a),var(--gold2,#ff9d2f));color:#2a1700">' +
    "Buka iklan &amp; lanjut nonton</button>" +
    '<button id="ikl-vip" style="display:block;width:100%;margin-top:10px;padding:11px;border-radius:999px;font:inherit;' +
    'font-size:13px;background:transparent;border:1px solid var(--line,#2b2149);color:var(--teks,#f3eefc)">' +
    "👑 Langganan VIP, nonton tanpa iklan</button></div>";
  document.body.appendChild(layar);

  let diputarSebelum = [];
  function tampilIklan() {
    diputarSebelum = Array.from(document.querySelectorAll("video")).filter(v => !v.paused);
    diputarSebelum.forEach(v => v.pause());
    layar.style.display = "flex";
  }
  function tutupIklan() {
    layar.style.display = "none";
    tulisAngka(0);
    diputarSebelum.forEach(v => { if (v.isConnected && v.getAttribute("src")) v.play().catch(() => {}); });
    diputarSebelum = [];
  }
  layar.querySelector("#ikl-lanjut").onclick = () => {
    window.open(LINK_SMARTLINK, "_blank", "noopener");
    tutupIklan();
  };
  layar.querySelector("#ikl-vip").onclick = () => {
    layar.style.display = "none";
    tulisAngka(0);
    diputarSebelum = [];
    try { pindah("langganan"); } catch (e) {}
  };

  setInterval(() => {
    if (!bolehIklan() || document.hidden || layar.style.display === "flex") return;
    const main = Array.from(document.querySelectorAll("video")).some(v => !v.paused && !v.ended && v.readyState > 2);
    if (!main) return;
    const n = bacaAngka() + 1;
    tulisAngka(n);
    if (n >= SMARTLINK_SETIAP_DETIK) tampilIklan();
  }, 1000);
    /* ---------- POPUNDER: SEKALI PER KUNJUNGAN ---------- */
  let popunderDimuat = false;
  function muatPopunder() {
    if (popunderDimuat || !bolehIklan() || !LINK_POPUNDER) return;
    popunderDimuat = true;
    const s = document.createElement("script");
    s.src = LINK_POPUNDER;
    s.async = true;
    s.setAttribute("data-cfasync", "false");
    document.body.appendChild(s);
  }
  function siapPopunder() {
    const mulai = () => {
      document.removeEventListener("pointerdown", mulai, true);
      setTimeout(muatPopunder, POPUNDER_TUNDA_DETIK * 1000);
    };
    document.addEventListener("pointerdown", mulai, true);
  }

  /* ---------- CEK STATUS LANGGANAN DULU ---------- */
  (async () => {
    try {
      if (typeof cekBayarServer === "function") await cekBayarServer();
      else if (typeof segarkanUser === "function") await segarkanUser();
    } catch (e) {}
    statusSiap = true;
    if (!pelanggan()) siapPopunder();
  })();
})();
