/* ===== PENGATURAN IKLAN ===== */
const SMARTLINK = "https://asiafilm.org/4/1b597d65e3fa566d005f9a1ec5e6d385";
const KLIK_IKLAN = 1;
const PER_VIDEO = true;
const TAMPIL_UNTUK_PELANGGAN = false;
const POPUNDER_SCRIPT = "https://abscloud.org/1/7dc0f51577c92b0e7166a7adf63b7a86";

/* ===== SMARTLINK DI TOMBOL PLAY ===== */
const KUNCI_HITUNG = "se_iklan_hitung";
const bacaHitung = () => { try { return JSON.parse(localStorage.getItem(KUNCI_HITUNG)) || {}; } catch (e) { return {}; } };
const simpanHitung = h => { try { localStorage.setItem(KUNCI_HITUNG, JSON.stringify(h)); } catch (e) {} };

document.addEventListener("click", e => {
  if (!SMARTLINK || SMARTLINK.startsWith("ISI-")) return;
  if (e.target.closest("[data-fav]")) return;

  const k = e.target.closest("[data-id]");
  if (!k) return;
  const v = PETA[k.dataset.id];
  if (!v) return;

  if (v.vip && !aktif()) return;
  if (aktif() && !TAMPIL_UNTUK_PELANGGAN) return;

  const h = bacaHitung();
  const key = PER_VIDEO ? v.id : "semua";
  const n = h[key] || 0;

  if (n < KLIK_IKLAN) {
    h[key] = n + 1;
    simpanHitung(h);
    e.stopPropagation();
    e.preventDefault();
    window.open(SMARTLINK, "_blank", "noopener");
    toast("Iklan dibuka, tekan play lagi (" + (n + 1) + "/" + KLIK_IKLAN + ")");
  } else {
    h[key] = 0;
    simpanHitung(h);
  }
}, true);

/* ===== POPUNDER: HANYA UNTUK YANG BELUM BERLANGGANAN ===== */
let popunderDimuat = false;

function muatPopunder() {
  if (popunderDimuat || TAMPIL_UNTUK_PELANGGAN === null) return;
  try { if (aktif() && !TAMPIL_UNTUK_PELANGGAN) return; } catch (e) {}
  popunderDimuat = true;
  const s = document.createElement("script");
  s.src = POPUNDER_SCRIPT;
  s.async = true;
  s.setAttribute("data-cfasync", "false");
  document.body.appendChild(s);
}

(async () => {
  try {
    if (typeof cekBayarServer === "function") await cekBayarServer();
    else if (typeof segarkanUser === "function") await segarkanUser();
  } catch (e) {}
  muatPopunder();
})();
