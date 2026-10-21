const SMARTLINK = "https://asiafilm.org/4/1b597d65e3fa566d005f9a1ec5e6d385";
const KLIK_IKLAN = 2;
const PER_VIDEO = true;
const TAMPIL_UNTUK_PELANGGAN = false;

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
