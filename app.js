const TOTAL_GRATIS = 93;
const TOTAL_VIP = 30;

const VIDEO_GRATIS = [
  { judul: "Video 1", src: "https://cdn2.videy.co/hQMEQSFA1.mp4" },
  { judul: "Video 2", src: "https://cdn2.videy.co/la89kXyy1.mp4" },
  { judul: "Video 3", src: "https://cdn2.videy.co/DeDYR0201.mp4" },
  { judul: "Video 4", src: "https://cdn2.videy.co/RWG0UAgb1.mp4" },
  { judul: "Video 5", src: "https://cdn2.videy.co/uefAp7kq1.mp4" },
  { judul: "Video 6", src: "https://cdn.videy.co/ng7fprEa1.mp4" },
  { judul: "Video 7", src: "https://cdn.videy.co/nGtfCO2T1.mp4" },
  { judul: "Video 8", src: "https://cdn.videy.co/8c4ERpRT1.mp4" },
  { judul: "Video 9", src: "https://cdn.videy.co/6RSUDzRF1.mp4" },
  { judul: "Video 10", src: "https://cdn.videy.co/vkWDbqQx1.mp4" },
  { judul: "Video 11", src: "https://cdn2.videy.co/3RWgGtda1.mp4" },
  { judul: "Video 12", src: "https://cdn2.videy.co/5Ln0fkF91.mp4" },
  { judul: "Video 13", src: "https://cdn2.videy.co/P6ZGN8hN1.mp4" },
  { judul: "Video 14", src: "https://cdn2.videy.co/Tm4jcOLe1.mp4" },
  { judul: "Video 15", src: "https://cdn2.videy.co/VXauy5nr1.mp4" },
  { judul: "Video 16", src: "https://cdn2.videy.co/IDQ0vDHG1.mp4" },
  { judul: "Video 17", src: "https://cdn2.videy.co/PpdjONcx1.mp4" },
  { judul: "Video 18", src: "https://cdn2.videy.co/oQHsDTGl1.mp4" },
  { judul: "Video 19", src: "https://cdn2.videy.co/NVbzUHoV1.mp4" },
  { judul: "Video 20", src: "https://cdn2.videy.co/n2yQ46g91.mp4" },
  { judul: "Video 21", src: "https://cdn2.videy.co/G7La6ONC1.mp4" },
  { judul: "Video 22", src: "https://cdn2.videy.co/H6JSxTQv1.mp4" },
  { judul: "Video 23", src: "https://cdn2.videy.co/0jalroHL1.mp4" },
  { judul: "Video 24", src: "https://cdn2.videy.co/FyplVPtM1.mp4" },
  { judul: "Video 25", src: "https://cdn2.videy.co/5QagHpnk1.mp4" },
  { judul: "Video 26", src: "https://cdn2.videy.co/Irz9KrnM1.mp4" },
  { judul: "Video 27", src: "https://cdn2.videy.co/amoUSQDW1.mp4" },
  { judul: "Video 28", src: "https://cdn2.videy.co/RPxYRASg1.mp4" },
  { judul: "Video 29", src: "https://cdn2.videy.co/JXTVMHX41.mp4" },
  { judul: "Video 30", src: "https://cdn2.videy.co/odnzf8v41.mp4" },
  { judul: "Video 31", src: "https://cdn2.videy.co/fMzySq4C1.mp4" },
  { judul: "Video 32", src: "https://cdn2.videy.co/W6hNlgN31.mp4" },
  { judul: "Video 33", src: "https://cdn2.videy.co/xhTZhqMI1.mp4" },
  { judul: "Video 34", src: "https://cdn2.videy.co/a3AUVuwO1.mp4" },
  { judul: "Video 35", src: "https://cdn2.videy.co/CN7UiafM1.mp4" },
  { judul: "Video 36", src: "https://cdn2.videy.co/6Tkrq1Uy1.mp4" },
  { judul: "Video 37", src: "https://cdn2.videy.co/FGSUt0mG1.mp4" },
  { judul: "Video 38", src: "https://cdn2.videy.co/WiHHbFGp1.mp4" },
  { judul: "Video 39", src: "https://cdn2.videy.co/5CpoxzAy1.mp4" },
  { judul: "Video 40", src: "https://cdn2.videy.co/NgfjpsIZ1.mp4" },
  { judul: "Video 41", src: "https://cdn2.videy.co/SAGh4TqF1.mp4" },
  { judul: "Video 42", src: "https://cdn2.videy.co/yb8c22fs1.mp4" },
  { judul: "Video 43", src: "https://cdn2.videy.co/vFhZk1Se1.mp4" },
  { judul: "Video 44", src: "https://cdn2.videy.co/aRinPp4E1.mp4" },
  { judul: "Video 45", src: "https://cdn2.videy.co/yrhjAMlH1.mp4" },
  { judul: "Video 46", src: "https://cdn2.videy.co/e3PFjjHj1.mp4" },
  { judul: "Video 47", src: "https://cdn2.videy.co/zYuJslVZ1.mp4" },
  { judul: "Video 48", src: "https://cdn2.videy.co/fAWdKmkH1.mp4" },
  { judul: "Video 49", src: "https://cdn2.videy.co/hWIZUCFX1.mp4" },
  { judul: "Video 50", src: "https://cdn2.videy.co/UdF6mXfo1.mp4" },
  { judul: "Video 51", src: "https://cdn2.videy.co/UdF6mXfo1.mp4" },
  { judul: "Video 52", src: "https://cdn2.videy.co/yvnRKnoV1.mp4" },
  { judul: "Video 53", src: "https://cdn2.videy.co/MyhyXbQG1.mp4" },
  { judul: "Video 54", src: "https://cdn2.videy.co/935MXSwd1.mp4" },
  { judul: "Video 55", src: "https://cdn2.videy.co/Qp7SNJlZ1.mp4" },
  { judul: "Video 56", src: "https://cdn2.videy.co/cX7TCNTM1.mp4" },
  { judul: "Video 57", src: "https://cdn2.videy.co/YxPWooRB1.mp4" },
  { judul: "Video 58", src: "https://cdn2.videy.co/okepGXdP1.mp4" },
  { judul: "Video 59", src: "https://cdn2.videy.co/aTPSKV5h1.mp4" },
  { judul: "Video 60", src: "https://cdn2.videy.co/jCZCoCR71.mp4" },
  { judul: "Video 61", src: "https://cdn2.videy.co/OVLVPrbz1.mp4" },
  { judul: "Video 62", src: "https://cdn2.videy.co/XKpZWWoH1.mp4" },
  { judul: "Video 63", src: "https://cdn2.videy.co/6JOn1BAS1.mp4" },
  { judul: "Video 64", src: "https://cdn2.videy.co/7ZLmmg7s1.mp4" },
  { judul: "Video 65", src: "https://cdn2.videy.co/qwwfWwh21.mp4" },
  { judul: "Video 66", src: "https://cdn2.videy.co/8T0meRU31.mp4" },
  { judul: "Video 67", src: "https://cdn2.videy.co/Q1bezuTV1.mp4" },
  { judul: "Video 68", src: "https://cdn2.videy.co/8RAfANWu1.mp4" },
  { judul: "Video 69", src: "https://cdn2.videy.co/qXEN38iW1.mp4" },
  { judul: "Video 70", src: "https://cdn2.videy.co/Qqpjrpje1.mp4" },
  { judul: "Video 71", src: "https://cdn2.videy.co/kZYGapx01.mp4" },
  { judul: "Video 72", src: "https://cdn2.videy.co/QdDzPMYq1.mp4" },
  { judul: "Video 73", src: "https://cdn2.videy.co/gaCsnGFd1.mp4" },
  { judul: "Video 74", src: "https://cdn2.videy.co/jvgNmLiS1.mp4" },
  { judul: "Video 75", src: "https://cdn2.videy.co/qX597iT61.mp4" },
  { judul: "Video 76", src: "https://cdn2.videy.co/UYvrJPyT1.mp4" },
  { judul: "Video 77", src: "https://cdn2.videy.co/UOHQRDKV1.mp4" },
  { judul: "Video 78", src: "https://cdn2.videy.co/FT4TYM0b1.mp4" },
  { judul: "Video 79", src: "https://cdn2.videy.co/Nr8D1nky1.mp4" },
  { judul: "Video 80", src: "https://cdn2.videy.co/o9u0p2Bl1.mp4" },
  { judul: "Video 81", src: "https://cdn2.videy.co/CMFbSpp01.mp4" },
  { judul: "Video 82", src: "https://cdn2.videy.co/HUxTGXfj1.mp4" },
  { judul: "Video 83", src: "https://cdn2.videy.co/6d5qTLZJ1.mp4" },
  { judul: "Video 84", src: "https://cdn2.videy.co/XA3rhe0X1.mp4" },
  { judul: "Video 85", src: "https://cdn2.videy.co/Rw70lOUN1.mp4" },
  { judul: "Video 86", src: "https://cdn2.videy.co/AAovM0bj1.mp4" },
  { judul: "Video 87", src: "https://cdn2.videy.co/S2z7A71N1.mp4" },
  { judul: "Video 88", src: "https://cdn2.videy.co/pcJBfrRs1.mp4" },
  { judul: "Video 89", src: "https://cdn2.videy.co/eWqw9R4d1.mp4" },
  { judul: "Video 90", src: "https://cdn.videy.co/M1NcBiQF1.mp4" },
  { judul: "Video 91", src: "https://cdn2.videy.co/lIWiiz8i1.mp4" },
  { judul: "Video 92", src: "https://cdn2.videy.co/LwBwU3jy1.mp4" },
  { judul: "Video 93", src: "https://cdn2.videy.co/4C1pGxvE1.mp4" }

];

const VIDEO_VIP = [
  { judul: "VIP 1", src: "https://cdn2.videy.co/W6hNlgN31.mp4" },
  { judul: "VIP 2", src: "https://cdn2.videy.co/SQrqGBzs1.mp4" },
  { judul: "VIP 3", src: "https://cdn2.videy.co/uE4dHtoo1.mp4" },
  { judul: "VIP 4", src: "https://cdn2.videy.co/V1qGFXXg1.mp4" },
  { judul: "VIP 5", src: "https://cdn2.videy.co/l3VVHd7a1.mp4" },
  { judul: "VIP 6", src: "https://cdn2.videy.co/xhTZhqMI1.mp4" },
  { judul: "VIP 7", src: "https://cdn2.videy.co/CN7UiafM1.mp4" },
  { judul: "VIP 8", src: "https://cdn2.videy.co/0saqBLol1.mp4" },
  { judul: "VIP 9", src: "https://cdn.videy.co/Z7xWzYQY1.mp4" },
  { judul: "VIP 10", src: "https://cdn2.videy.co/h0t4HV5w1.mp4" },
  { judul: "VIP 11", src: "https://cdn2.videy.co/YAe2eUfg1.mp4" },
  { judul: "VIP 12", src: "https://cdn2.videy.co/dcNX5HvY1.mp4" },
  { judul: "VIP 13", src: "https://cdn2.videy.co/Pw8ZIL1m1.mp4" },
  { judul: "VIP 14", src: "https://cdn2.videy.co/aElqOmoy1.mp4" },
  { judul: "VIP 15", src: "https://cdn2.videy.co/2n0oxpz21.mp4" },
  { judul: "VIP 16", src: "https://cdn2.videy.co/UkrN1N8v1.mp4" },
  { judul: "VIP 17", src: "https://cdn2.videy.co/GDbd0m6l1.mp4" },
  { judul: "VIP 18", src: "https://cdn2.videy.co/BojycdB31.mp4" },
  { judul: "VIP 19", src: "https://cdn2.videy.co/lEGkspeP1.mp4" },
  { judul: "VIP 20", src: "https://cdn2.videy.co/BFQfkbSh1.mp4" },
  { judul: "VIP 21", src: "https://cdn2.videy.co/Rf3O22Ah1.mp4" },
  { judul: "VIP 22", src: "https://cdn2.videy.co/cibxsxRU1.mp4" },
  { judul: "VIP 23", src: "https://cdn2.videy.co/GnCUfB0u1.mp4" },
  { judul: "VIP 24", src: "https://cdn2.videy.co/zAts3Vab1.mp4" },
  { judul: "VIP 25", src: "https://cdn2.videy.co/X7ljc0vu1.mp4" },
  { judul: "VIP 26", src: "https://cdn2.videy.co/d2ZhqQTN1.mp4" },
  { judul: "VIP 27", src: "https://cdn2.videy.co/6WhMzSa71.mp4" },
  { judul: "VIP 28", src: "https://cdn2.videy.co/drZpWEio1.mp4" },
  { judul: "VIP 29", src: "https://cdn2.videy.co/RA2SAdGR1.mp4" },
  { judul: "VIP 30", src: "https://cdn2.videy.co/BojycdB31.mp4" },
  

  
];

const QRIS_GAMBAR = "";

const PAKET = [
  { id: "harian",  nama: "Harian",  harga: 10000,  hari: 1,   ket: "per hari" },
  { id: "bulanan", nama: "Bulanan", harga: 250000,  hari: 30,  ket: "per bulan" },
  { id: "tahunan", nama: "Tahunan", harga: 550000, hari: 365, ket: "per tahun" }
];

const B = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const SAMPLE = ["BigBuckBunny","ElephantsDream","ForBiggerBlazes","ForBiggerEscapes","ForBiggerFun","Sintel","TearsOfSteel"].map(n => B + n + ".mp4");

function buatDaftar(awal, vip, custom, total) {
  const arr = [];
  const n = custom.length || total;
  for (let i = 0; i < n; i++) {
    const c = custom[i];
    arr.push({
      id: awal + (i + 1),
      judul: c && c.judul ? c.judul : (vip ? "Video VIP " : "Video ") + (i + 1),
      src: c ? c.src : SAMPLE[i % SAMPLE.length],
      vip: vip,
      thumb: c && c.thumb ? c.thumb : ""
    });
  }
  return arr;
}
const HOME = buatDaftar("h", false, VIDEO_GRATIS, TOTAL_GRATIS);
const VIP = buatDaftar("v", true, VIDEO_VIP, TOTAL_VIP);
const PETA = {};
[...HOME, ...VIP].forEach(v => PETA[v.id] = v);

/* ===== PENYIMPANAN & UTILITAS ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const rupiah = n => "Rp" + n.toLocaleString("id-ID");
const tgl = t => new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("show"), 2500);
}

const baca = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const simpan = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

const users = () => baca("se_users", {});
const emailAktif = () => baca("se_sesi", null);
const userAktif = () => users()[emailAktif()] || null;
const simpanUser = u => { const a = users(); a[u.email] = u; simpan("se_users", a); };
const kunci = k => k + ":" + (emailAktif() || "tamu");
const favs = () => baca(kunci("se_fav"), []);
const riwayat = () => baca(kunci("se_riwayat"), []);
const aktif = () => !!(SESI.user && SESI.user.aktif);

async function hash(s) {
  if (!(window.crypto && crypto.subtle)) return btoa(unescape(encodeURIComponent(s)));
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
        }
/* ===== KOTAK VIDEO ===== */
function kartu(v) {
  const f = favs().includes(v.id);
  const gambar = v.thumb ? `<img src="${v.thumb}" loading="lazy" decoding="async" alt="">` : "";
  return `<article class="kotak" data-id="${v.id}">
    <div class="thumb">
      ${gambar}
      <span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      ${v.vip ? '<span class="vip">VIP</span>' : ""}
    </div>
    <div class="info"><span class="jdl">${esc(v.judul)}</span>
      <button class="bintang ${f ? "on" : ""}" data-fav="${v.id}">★</button>
    </div>
  </article>`;
}

const PER_HALAMAN = 18;

const sentinelIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) {
    const el = en.target.parentElement;
    sentinelIO.unobserve(en.target);
    en.target.remove();
    muatLagi(el);
  }
}), { rootMargin: "500px" });

function muatLagi(el) {
  const next = el._list.slice(el._n, el._n + PER_HALAMAN);
  el._n += next.length;
  el.insertAdjacentHTML("beforeend", next.map(kartu).join(""));
  if (el._n < el._list.length) {
    const s = document.createElement("div");
    s.style.cssText = "grid-column:1/-1;height:1px";
    el.appendChild(s);
    sentinelIO.observe(s);
  }
}

function renderGrid(list, el, kosong) {
  el._list = list;
  el._n = 0;
  el.innerHTML = "";
  if (!list.length) {
    el.innerHTML = `<p class="kosong">${kosong || "Tidak ada video."}</p>`;
    return;
  }
  muatLagi(el);
             }

/* ===== SLIDER ===== */
function renderSlider() {
  const s = $("#slider"), d = $("#dots"), list = HOME.slice(0, 5);
  s.innerHTML = list.map(v => `<div class="slide" data-id="${v.id}">
    <video muted loop playsinline preload="none" data-src="${v.src}" ${v.thumb ? `poster="${v.thumb}"` : ""}></video>
    <div class="slide-info"><b>${esc(v.judul)}</b><span class="play-btn">▶ Tonton</span></div></div>`).join("");
  d.innerHTML = list.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");

  const vids = $$("video", s);
  let cur = 0;

  function putar(i) {
    vids.forEach((v, j) => {
      if (j === i) {
        if (!v.getAttribute("src")) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else {
        v.pause();
        if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); }
      }
    });
  }

  s.addEventListener("scroll", () => {
    const i = Math.round(s.scrollLeft / s.clientWidth);
    $$("i", d).forEach((x, j) => x.classList.toggle("on", i === j));
    if (i !== cur) { cur = i; putar(i); }
  });

  putar(0);

  setInterval(() => {
    const modal = player.classList.contains("buka");
    if (halaman !== "home" || modal) { vids[cur].pause(); return; }
    if (vids[cur].paused) vids[cur].play().catch(() => {});
    const i = (cur + 1) % list.length;
    s.scrollTo({ left: i * s.clientWidth, behavior: "smooth" });
  }, 5000);
    }
/* ===== PLAYER ===== */
const player = $("#player"), pv = $("#pv");
let sedang = null;

function updateFavBtn() {
  if (sedang) $("#pfav").classList.toggle("on", favs().includes(sedang.id));
}

function bukaVideo(id) {
  const v = PETA[id];
  if (!v) return;
  if (v.vip && !aktif()) { toast("Video VIP, langganan dulu ya"); pindah("langganan"); return; }
  sedang = v;
  pv.src = v.src;
  $("#pjudul").textContent = v.judul;
  player.classList.add("buka");
  pv.play().catch(() => {});
  const r = riwayat().filter(x => x !== id);
  r.unshift(id);
  simpan(kunci("se_riwayat"), r.slice(0, 50));
  updateFavBtn();
}

function tutupVideo() {
  pv.pause();
  pv.removeAttribute("src");
  pv.load();
  player.classList.remove("buka");
  sedang = null;
  if (halaman === "aktivitas") renderAktivitas();
}

function toggleFav(id) {
  const f = favs(), i = f.indexOf(id);
  if (i > -1) f.splice(i, 1); else f.push(id);
  simpan(kunci("se_fav"), f);
  $$(`[data-fav="${id}"]`).forEach(b => b.classList.toggle("on", i === -1));
  updateFavBtn();
  if (halaman === "aktivitas") renderAktivitas();
}

document.addEventListener("click", e => {
  const fb = e.target.closest("[data-fav]");
  if (fb) { e.stopPropagation(); toggleFav(fb.dataset.fav); return; }
  const k = e.target.closest("[data-id]");
  if (k) bukaVideo(k.dataset.id);
});
$("#ptutup").onclick = tutupVideo;
$("#pfav").onclick = () => sedang && toggleFav(sedang.id);
player.addEventListener("click", e => { if (e.target === player) tutupVideo(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") tutupVideo(); });
/* ===== NAVIGASI ===== */
let halaman = "home";
function pindah(n) {
  if (player.classList.contains("buka")) tutupVideo();
  halaman = n;
  $$(".page").forEach(p => p.classList.toggle("aktif", p.id === "page-" + n));
  $$(".bottom button").forEach(b => b.classList.toggle("on", b.dataset.page === n));
  if (n === "langganan") renderLangganan();
  if (n === "aktivitas") renderAktivitas();
  if (n === "akun") renderAkun();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$(".bottom button").forEach(b => b.onclick = () => {
  if (b.dataset.page === "home" && $("#cari").value) {
    $("#cari").value = "";
    renderGrid(HOME, $("#grid-home"));
    $("#jumlah").textContent = HOME.length + " video";
  }
  pindah(b.dataset.page);
});
$("#cari").addEventListener("input", e => {
  if (halaman !== "home") pindah("home");
  const q = e.target.value.toLowerCase().trim();
  const h = HOME.filter(v => v.judul.toLowerCase().includes(q));
  renderGrid(h, $("#grid-home"));
  $("#jumlah").textContent = h.length + " video";
});

/* ===== LANGGANAN ===== */
let paketPilih = null, modePaket = false;

function renderLangganan() {
  const el = $("#page-langganan"), u = userAktif();
  if (!u) {
    el.innerHTML = `<div class="kartu-info"><h2>💎 Langganan</h2>
      <p class="muted" style="margin-top:8px">Masuk atau daftar dulu untuk berlangganan.</p>
      <button class="btn" onclick="pindah('akun')">Masuk / Daftar</button></div>`;
    return;
  }
  if (aktif() && !modePaket) {
    el.innerHTML = `<div class="status-aktif">✅ Paket <b>${esc(u.langganan.nama)}</b> aktif sampai ${tgl(u.langganan.sampai)}</div>
      <div class="sec-head"><h2>💎 Video Langganan</h2><span class="muted">${VIP.length} video</span></div>
      <div id="grid-vip" class="grid"></div>
      <button class="btn ghost" id="perpanjang">Perpanjang Langganan</button>`;
    renderGrid(VIP, $("#grid-vip"));
    $("#perpanjang").onclick = () => { modePaket = true; renderLangganan(); };
    return;
  }
  el.innerHTML = `<div class="sec-head"><h2>💎 Pilih Paket Video Eksklusif</h2></div>
    <div class="paket-list">${PAKET.map(p => `<button class="paket ${paketPilih === p.id ? "on" : ""}" data-paket="${p.id}">
      <span class="p-nama">${p.nama}</span><span class="p-harga">${rupiah(p.harga)}</span><small>${p.ket}</small></button>`).join("")}</div>
    <div id="bayar-box"></div>`;
  $$(".paket", el).forEach(b => b.onclick = () => {
    paketPilih = b.dataset.paket;
    $$(".paket", el).forEach(x => x.classList.toggle("on", x === b));
    renderBayar();
  });
  if (paketPilih) renderBayar();
}

// GANTI fungsi ini dengan pengecekan ke server/payment gateway (Midtrans, Xendit, dll).
// Sekarang masih DEMO: otomatis dianggap sudah bayar.
const cekPembayaran = (order, p) => new Promise(r => setTimeout(() => r(true), 1500));

function renderBayar() {
  const p = PAKET.find(x => x.id === paketPilih), box = $("#bayar-box");
  if (!p) { box.innerHTML = ""; return; }
  const order = "SE" + Date.now();
  box.innerHTML = `<div class="qr-card"><p>Scan QR untuk bayar <b>${rupiah(p.harga)}</b> (${p.nama})</p>
    <div id="qr" class="qr ${QRIS_GAMBAR ? "gambar" : ""}"></div><small class="muted">Order: ${order}</small>
    <button class="btn" id="sudah">Saya Sudah Bayar</button></div>`;
  if (QRIS_GAMBAR) $("#qr").innerHTML = `<img src="${QRIS_GAMBAR}" alt="QRIS">`;
  else if (window.QRCode) new QRCode($("#qr"), { text: `SPESIAL-EDITION|${order}|${p.id}|${p.harga}`, width: 200, height: 200 });
  else $("#qr").textContent = "QR gagal dimuat";
  $("#sudah").onclick = async () => {
    const b = $("#sudah");
    b.disabled = true; b.textContent = "Mengecek pembayaran...";
    const ok = await cekPembayaran(order, p);
    if (ok) aktifkan(p, order);
    else { toast("Pembayaran belum terdeteksi"); b.disabled = false; b.textContent = "Saya Sudah Bayar"; }
  };
  box.scrollIntoView({ behavior: "smooth" });

}

function aktifkan(p, order) {
  const u = userAktif();
  const mulai = Math.max(Date.now(), (u.langganan && u.langganan.sampai) || 0);
  u.langganan = { id: p.id, nama: p.nama, sampai: mulai + p.hari * 864e5 };
  u.bayar = u.bayar || [];
  u.bayar.unshift({ order, paket: p.nama, harga: p.harga, waktu: Date.now() });
  simpanUser(u);
  modePaket = false; paketPilih = null;
  toast("Pembayaran berhasil! 🎉");
  renderLangganan(); // langsung masuk ke video langganan
  window.scrollTo({ top: 0 });
}

/* ===== AKTIVITAS ===== */
function renderAktivitas() {
  const el = $("#page-aktivitas"), u = userAktif();
  const rw = riwayat().map(i => PETA[i]).filter(Boolean);
  const fv = favs().map(i => PETA[i]).filter(Boolean);
  const bayar = u && u.bayar && u.bayar.length
    ? u.bayar.map(b => `<div class="baris"><span>${esc(b.paket)} · ${tgl(b.waktu)}</span><b>${rupiah(b.harga)}</b></div>`).join("")
    : '<p class="kosong">Belum ada pembayaran.</p>';
  el.innerHTML = `<div class="sec-head"><h2>🕘 Terakhir Ditonton</h2></div><div id="g-rw" class="grid"></div>
    <div class="sec-head"><h2>⭐ Favorit</h2></div><div id="g-fv" class="grid"></div>
    <div class="sec-head"><h2>🧾 Pembayaran</h2></div><div class="daftar">${bayar}</div>`;
  renderGrid(rw, $("#g-rw"), "Belum ada video yang ditonton.");
  renderGrid(fv, $("#g-fv"), "Belum ada favorit.");
}

/* ===== AKUN ===== */
let modeAuth = "masuk";
function renderAkun() {
  const el = $("#page-akun"), u = userAktif();
  if (!u) {
    const d = modeAuth === "daftar";
    el.innerHTML = `<div class="auth"><div class="tabs">
      <button data-m="masuk" class="${d ? "" : "on"}">Masuk</button>
      <button data-m="daftar" class="${d ? "on" : ""}">Daftar</button></div>
      <form id="form-auth">
        ${d ? '<input id="a-nama" placeholder="Nama" required>' : ""}
        <input id="a-email" type="email" placeholder="Email" required>
        <input id="a-pass" type="password" placeholder="Password (min 6 karakter)" minlength="6" required>
        <button class="btn" type="submit">${d ? "Buat Akun" : "Masuk"}</button></form></div>`;
    $$(".tabs button", el).forEach(b => b.onclick = () => { modeAuth = b.dataset.m; renderAkun(); });
    $("#form-auth").onsubmit = async e => {
      e.preventDefault();
      const email = $("#a-email").value.trim().toLowerCase();
      const h = await hash($("#a-pass").value);
      const all = users();
      if (d) {
        if (all[email]) return toast("Email sudah terdaftar");
        simpanUser({ nama: $("#a-nama").value.trim(), email, pass: h, dibuat: Date.now() });
        toast("Akun dibuat, selamat datang!");
      } else {
        if (!all[email] || all[email].pass !== h) return toast("Email atau password salah");
        toast("Berhasil masuk");
      }
      simpan("se_sesi", email);
      renderAkun();
    };
    return;
  }
  const vip = aktif();
  el.innerHTML = `<div class="profil"><div class="avatar">${esc(u.nama[0] || "?").toUpperCase()}</div>
    <h2>${esc(u.nama)}</h2><p class="muted">${esc(u.email)}</p>
    <span class="badge ${vip ? "ok" : ""}">${vip ? "VIP sampai " + tgl(u.langganan.sampai) : "Belum berlangganan"}</span></div>
    <div class="auth"><h3>Ubah Nama</h3>
      <form id="f-nama"><input id="n-baru" value="${esc(u.nama)}" required><button class="btn">Simpan</button></form></div>
    <div class="menu-akun">
      <button class="btn ghost" id="b-lang">Kelola Langganan</button>
      <button class="btn ghost" id="b-hapus">Hapus Riwayat Tonton</button>
      <button class="btn danger" id="b-keluar">Keluar</button></div>`;
  $("#f-nama").onsubmit = e => {
    e.preventDefault();
    u.nama = $("#n-baru").value.trim() || u.nama;
    simpanUser(u); toast("Nama diperbarui"); renderAkun();
  };
  $("#b-lang").onclick = () => pindah("langganan");
  $("#b-hapus").onclick = () => { simpan(kunci("se_riwayat"), []); toast("Riwayat dihapus"); };
  $("#b-keluar").onclick = () => {
    localStorage.removeItem("se_sesi");
    modePaket = false; paketPilih = null;
    toast("Kamu sudah keluar"); renderAkun();
  };
}

/* ===== MULAI ===== */
renderSlider();
renderGrid(HOME, $("#grid-home"));
$("#jumlah").textContent = HOME.length + " video";

/*kanjut*/
function renderSlider() {
  const s = $("#slider"), d = $("#dots"), list = HOME.slice(0, 5);
  s.innerHTML = list.map(v => `<div class="slide" data-id="${v.id}">
    <video muted loop playsinline preload="none" data-src="${v.src}" ${v.thumb ? `poster="${v.thumb}"` : ""}></video>
    <div class="slide-info"><b>${esc(v.judul)}</b><span class="play-btn">▶ Tonton</span></div></div>`).join("");
  d.innerHTML = list.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");

  const vids = $$("video", s);
  let cur = 0;

  function putar(i) {
    vids.forEach((v, j) => {
      if (j === i) {
        if (!v.getAttribute("src")) v.src = v.dataset.src;
        v.play().catch(() => {});
      } else {
        v.pause();
        if (v.getAttribute("src")) { v.removeAttribute("src"); v.load(); }
      }
    });
  }

  s.addEventListener("scroll", () => {
    const i = Math.round(s.scrollLeft / s.clientWidth);
    $$("i", d).forEach((x, j) => x.classList.toggle("on", i === j));
    if (i !== cur) { cur = i; putar(i); }
  });

  putar(0);

  setInterval(() => {
    const modal = player.classList.contains("buka");
    if (halaman !== "home" || modal) { vids[cur].pause(); return; }
    if (vids[cur].paused) vids[cur].play().catch(() => {});
    const i = (cur + 1) % list.length;
    s.scrollTo({ left: i * s.clientWidth, behavior: "smooth" });
  }, 5000);
}

/* ===== THUMBNAIL OTOMATIS ===== */
const antrianThumb = [];
let sedangThumb = 0;
const MAKS_THUMB = 10;

function jalankanThumb() {
  while (sedangThumb < MAKS_THUMB && antrianThumb.length) {
    const box = antrianThumb.shift();
    if (!box.isConnected) continue;
    sedangThumb++;
    ambilFrame(box).then(() => { sedangThumb--; jalankanThumb(); });
  }
}

function ambilFrame(box) {
  return new Promise(res => {
    const art = box.closest("[data-id]");
    const v = art && PETA[art.dataset.id];
    if (!v) return res();
    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "metadata";
    let selesai = false;
    const akhir = () => {
      if (selesai) return;
      selesai = true;
      vid.removeAttribute("src");
      vid.load();
      res();
    };
    const t = setTimeout(akhir, 80000);
    vid.addEventListener("loadedmetadata", () => {
      vid.currentTime = Math.min(1, (vid.duration || 2) / 2);
    });
    vid.addEventListener("seeked", () => {
      try {
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = Math.round(320 * vid.videoHeight / vid.videoWidth) || 240;
        c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
        c.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
        box.insertBefore(c, box.firstChild);
      } catch (e) {}
      clearTimeout(t);
      akhir();
    });
    vid.addEventListener("error", () => { clearTimeout(t); akhir(); });
    vid.src = v.src;
  });
  }
const thumbIO = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) {
    thumbIO.unobserve(en.target);
    antrianThumb.push(en.target);
    jalankanThumb();
  }
}), { rootMargin: "200px" });

function pasangThumb(el) {
  $$(".thumb", el).forEach(b => {
    if (!b.querySelector("img") && !b.dataset.pasang) {
      b.dataset.pasang = "1";
      thumbIO.observe(b);
    }
  });
}

const muatLagiAsli = muatLagi;
muatLagi = function (el) {
  muatLagiAsli(el);
  pasangThumb(el);
};

pasangThumb($("#grid-home"));

/* ===== THUMBNAIL: VERSI PERBAIKAN ===== */
  function jalankanThumb() {
  while (sedangThumb < MAKS_THUMB && antrianThumb.length) {
    const box = antrianThumb.shift();
    if (!box.isConnected || box.querySelector("canvas")) continue;
    sedangThumb++;
    ambilFrame(box).then(ok => {
      sedangThumb--;
      if (!ok) {
        const n = (Number(box.dataset.coba) || 0) + 1;
        box.dataset.coba = n;
        if (n < 10 && box.isConnected) {
          setTimeout(() => { antrianThumb.push(box); jalankanThumb(); }, 2000 * n);
        }
      }
      jalankanThumb();
    });
  }
}

function ambilFrame(box) {
  return new Promise(res => {
    const art = box.closest("[data-id]");
    const v = art && PETA[art.dataset.id];
    if (!v) return res(true);

    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "auto";

    let selesai = false;
    let t = null;
    const akhir = ok => {
      if (selesai) return;
      selesai = true;
      clearTimeout(t);
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
      res(ok);
    };
    t = setTimeout(() => akhir(false), 20000);

    const gambar = () => {
      try {
        if (!vid.videoWidth) return akhir(false);
        const c = document.createElement("canvas");
        c.width = 320;
        c.height = Math.round(320 * vid.videoHeight / vid.videoWidth) || 240;
        c.getContext("2d").drawImage(vid, 0, 0, c.width, c.height);
        c.style.cssText = "width:100%;height:100%;object-fit:cover;display:block";
        box.insertBefore(c, box.firstChild);
        akhir(true);
      } catch (e) { akhir(false); }
    };

    vid.addEventListener("loadeddata", () => {
      const d = vid.duration;
      try { vid.currentTime = isFinite(d) && d > 2 ? Math.min(1.5, d / 2) : 0.1; } catch (e) {}
    });
    vid.addEventListener("seeked", () => {
      requestAnimationFrame(() => requestAnimationFrame(gambar));
    });
    vid.addEventListener("error", () => akhir(false));
    vid.src = v.src;
  });
  }
/* ===== SERVER AKUN ===== */
const API = "https://orange-bush-3c50.anjaniputrirahma1299.workers.dev";
var SESI = { token: baca("se_token", ""), user: baca("se_user", null) };

async function panggil(path, body) {
  const opsi = { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" } };
  if (SESI.token) opsi.headers.Authorization = "Bearer " + SESI.token;
  if (body) opsi.body = JSON.stringify(body);
  const r = await fetch(API + path, opsi);
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Gagal terhubung ke server");
  return j;
}

function setSesi(token, user) {
  SESI.token = token || "";
  SESI.user = user || null;
  simpan("se_token", SESI.token);
  simpan("se_user", SESI.user);
  if (user) simpan("se_sesi", user.email);
  else { try { localStorage.removeItem("se_sesi"); } catch (e) {} }
}

async function segarkanUser() {
  if (!SESI.token) return;
  try {
    const j = await panggil("/api/saya");
    setSesi(SESI.token, j.user);
  } catch (e) {
    if (/login/i.test(e.message)) setSesi("", null);
  }
}
/* ===== AKUN (SERVER) ===== */
function renderAkun() {
  const el = $("#page-akun"), u = SESI.user;
  if (!u) {
    const d = modeAuth === "daftar";
    el.innerHTML = `<div class="auth"><div class="tabs">
      <button data-m="masuk" class="${d ? "" : "on"}">Masuk</button>
      <button data-m="daftar" class="${d ? "on" : ""}">Daftar</button></div>
      <form id="form-auth">
        ${d ? '<input id="a-nama" placeholder="Nama" required>' : ""}
        <input id="a-email" type="email" placeholder="Email" required>
        <input id="a-pass" type="password" placeholder="Password (min 6 karakter)" minlength="6" required>
        ${d ? '<p class="muted" style="margin-top:8px">Buat password khusus situs ini, jangan pakai password Gmail.</p>' : ""}
        <button class="btn" type="submit">${d ? "Buat Akun" : "Masuk"}</button></form></div>`;
    $$(".tabs button", el).forEach(b => b.onclick = () => { modeAuth = b.dataset.m; renderAkun(); });
    $("#form-auth").onsubmit = async e => {
      e.preventDefault();
      const tombol = $("#form-auth button[type=submit]");
      tombol.disabled = true;
      try {
        const body = { email: $("#a-email").value, pass: $("#a-pass").value };
        if (d) body.nama = $("#a-nama").value;
        const j = await panggil(d ? "/api/daftar" : "/api/masuk", body);
        setSesi(j.token, j.user);
        toast(d ? "Akun dibuat, selamat datang!" : "Berhasil masuk");
        renderAkun();
      } catch (err) {
        toast(err.message);
        tombol.disabled = false;
      }
    };
    return;
  }
  const vip = aktif();
  el.innerHTML = `<div class="profil"><div class="avatar">${esc((u.nama || "?")[0]).toUpperCase()}</div>
    <h2>${esc(u.nama)}</h2><p class="muted">${esc(u.email)}</p>
    <span class="badge ${vip ? "ok" : ""}">${vip ? "VIP sampai " + tgl(u.vip_sampai) : "Belum berlangganan"}</span></div>
    <div class="auth"><h3>Ubah Nama</h3>
      <form id="f-nama"><input id="n-baru" value="${esc(u.nama)}" required><button class="btn">Simpan</button></form></div>
    <div class="menu-akun">
      <button class="btn ghost" id="b-lang">Kelola Langganan</button>
      <button class="btn ghost" id="b-hapus">Hapus Riwayat Tonton</button>
      <button class="btn danger" id="b-keluar">Keluar</button></div>`;
  $("#f-nama").onsubmit = async e => {
    e.preventDefault();
    try {
      const j = await panggil("/api/nama", { nama: $("#n-baru").value });
      setSesi(SESI.token, j.user);
      toast("Nama diperbarui");
      renderAkun();
    } catch (err) { toast(err.message); }
  };
  $("#b-lang").onclick = () => pindah("langganan");
  $("#b-hapus").onclick = () => { simpan(kunci("se_riwayat"), []); toast("Riwayat dihapus"); };
  $("#b-keluar").onclick = async () => {
    try { await panggil("/api/keluar", {}); } catch (e) {}
    setSesi("", null);
    modePaket = false; paketPilih = null;
    toast("Kamu sudah keluar");
    renderAkun();
  };
}
/* ===== LANGGANAN (SERVER) ===== */
function renderLangganan() {
  const el = $("#page-langganan"), u = SESI.user;
  if (!u) {
    el.innerHTML = `<div class="kartu-info"><h2>💎 Langganan</h2>
      <p class="muted" style="margin-top:8px">Masuk atau daftar dulu untuk berlangganan.</p>
      <button class="btn" onclick="pindah('akun')">Masuk / Daftar</button></div>`;
    return;
  }
  if (aktif() && !modePaket) {
    el.innerHTML = `<div class="status-aktif">✅ Paket <b>${esc(u.paket || "VIP")}</b> aktif sampai ${tgl(u.vip_sampai)}</div>
      <div class="sec-head"><h2>💎 Video Langganan</h2><span class="muted">${VIP.length} video</span></div>
      <div id="grid-vip" class="grid"></div>
      <button class="btn ghost" id="perpanjang">Perpanjang Langganan</button>`;
    renderGrid(VIP, $("#grid-vip"));
    $("#perpanjang").onclick = () => { modePaket = true; renderLangganan(); };
    return;
  }
  el.innerHTML = `<div class="sec-head"><h2>💎 Pilih Paket Video Eksklusif</h2></div>
    <div class="paket-list">${PAKET.map(p => `<button class="paket ${paketPilih === p.id ? "on" : ""}" data-paket="${p.id}">
      <span class="p-nama">${p.nama}</span><span class="p-harga">${rupiah(p.harga)}</span><small>${p.ket}</small></button>`).join("")}</div>
    <div id="bayar-box"></div>`;
  $$(".paket", el).forEach(b => b.onclick = () => {
    paketPilih = b.dataset.paket;
    $$(".paket", el).forEach(x => x.classList.toggle("on", x === b));
    renderBayar();
  });
  if (paketPilih) renderBayar();
}

function aktifkan(p, order) {
  toast("Terima kasih! Langganan aktif setelah pembayaran dicek admin.");
  modePaket = false; paketPilih = null;
  renderLangganan();
      }
/* ===== AKTIVITAS (SERVER) ===== */
function renderAktivitas() {
  const el = $("#page-aktivitas");
  const rw = riwayat().map(i => PETA[i]).filter(Boolean);
  const fv = favs().map(i => PETA[i]).filter(Boolean);
  const awal = SESI.user ? "Memuat..." : "Masuk untuk melihat pembayaran.";
  el.innerHTML = `<div class="sec-head"><h2>🕘 Terakhir Ditonton</h2></div><div id="g-rw" class="grid"></div>
    <div class="sec-head"><h2>⭐ Favorit</h2></div><div id="g-fv" class="grid"></div>
    <div class="sec-head"><h2>🧾 Pembayaran</h2></div><div class="daftar" id="d-bayar"><p class="kosong">${awal}</p></div>`;
  renderGrid(rw, $("#g-rw"), "Belum ada video yang ditonton.");
  renderGrid(fv, $("#g-fv"), "Belum ada favorit.");
  if (!SESI.user) return;
  panggil("/api/pembayaran").then(j => {
    const box = $("#d-bayar");
    if (!box) return;
    box.innerHTML = j.pembayaran.length
      ? j.pembayaran.map(b => `<div class="baris"><span>${esc(b.paket)} · ${tgl(b.dibuat)} · ${esc(b.status)}</span><b>${rupiah(b.harga)}</b></div>`).join("")
      : '<p class="kosong">Belum ada pembayaran.</p>';
  }).catch(() => {});
}

segarkanUser().then(() => {
  if (halaman === "langganan") renderLangganan();
  if (halaman === "akun") renderAkun();
});
/* ===== BAYAR DOKU ===== */
function renderBayar() {
  const p = PAKET.find(x => x.id === paketPilih), box = $("#bayar-box");
  if (!p) { box.innerHTML = ""; return; }
  box.innerHTML = `<div class="qr-card"><p>Paket <b>${p.nama}</b> · <b>${rupiah(p.harga)}</b></p>
    <p class="muted" style="margin-top:6px">Kamu akan diarahkan ke halaman pembayaran DOKU. Bayar dengan QRIS, lalu kembali ke situs ini. Langganan aktif otomatis.</p>
    <button class="btn" id="btn-bayar">Bayar dengan QRIS</button></div>`;
  $("#btn-bayar").onclick = async () => {
    const b = $("#btn-bayar");
    b.disabled = true; b.textContent = "Menyiapkan pembayaran...";
    try {
      const j = await panggil("/api/bayar", { paket: p.id });
      location.href = j.url;
    } catch (err) {
      toast(err.message);
      b.disabled = false; b.textContent = "Bayar dengan QRIS";
    }
  };
  box.scrollIntoView({ behavior: "smooth" });
}

function cekKembaliBayar() {
  const q = new URLSearchParams(location.search);
  if (!q.has("bayar")) return;
  history.replaceState(null, "", location.pathname);
  pindah("langganan");
  if (!SESI.token) return;
  toast("Mengecek pembayaran...");
  let n = 0;
  const t = setInterval(async () => {
    n++;
    await segarkanUser();
    if (aktif()) {
      clearInterval(t);
      modePaket = false; paketPilih = null;
      toast("Pembayaran berhasil! 🎉");
      renderLangganan();
    } else if (n >= 40) {
      clearInterval(t);
      toast("Pembayaran belum terdeteksi. Kalau sudah bayar, buka menu ini lagi sebentar lagi.");
    }
  }, 3000);
}

cekKembaliBayar();
