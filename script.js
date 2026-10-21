/* ===== PENGATURAN ===== */
const TOTAL = 100; // jumlah kotak video

// Isi video kamu di sini: {judul:"...", src:"link-video.mp4"}
// Kalau kurang dari 100, sisanya diisi video contoh otomatis.
const VIDEO_GRATIS = [];
const VIDEO_VIP = [];

// Kalau punya gambar QRIS sendiri, isi path-nya, misal "qris.png"
const QRIS_GAMBAR = "";

const PAKET = [
  { id: "harian",  nama: "Harian",  harga: 10000,  hari: 1,   ket: "per hari" },
  { id: "bulanan", nama: "Bulanan", harga: 50000,  hari: 30,  ket: "per bulan" },
  { id: "tahunan", nama: "Tahunan", harga: 100000, hari: 365, ket: "per tahun" }
];

const B = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const SAMPLE = ["BigBuckBunny","ElephantsDream","ForBiggerBlazes","ForBiggerEscapes","ForBiggerFun","Sintel","TearsOfSteel"].map(n => B + n + ".mp4");

function buatDaftar(awal, vip, custom) {
  const arr = [];
  for (let i = 0; i < TOTAL; i++) {
    const c = custom[i];
    arr.push({
      id: awal + (i + 1),
      judul: c && c.judul ? c.judul : (vip ? "Video VIP " : "Video ") + (i + 1),
      src: c ? c.src : SAMPLE[i % SAMPLE.length],
      vip: vip
    });
  }
  return arr;
}
const HOME = buatDaftar("h", false, VIDEO_GRATIS);
const VIP = buatDaftar("v", true, VIDEO_VIP);
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
const aktif = () => { const u = userAktif(); return !!(u && u.langganan && u.langganan.sampai > Date.now()); };

async function hash(s) {
  if (!(window.crypto && crypto.subtle)) return btoa(unescape(encodeURIComponent(s)));
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
        }
/* ===== KOTAK VIDEO ===== */
function kartu(v) {
  const f = favs().includes(v.id);
  return `<article class="kotak" data-id="${v.id}">
    <div class="thumb">
      <video muted playsinline preload="none" data-src="${v.src}#t=1"></video>
      <span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>
      ${v.vip ? '<span class="vip">VIP</span>' : ""}
    </div>
    <div class="info"><span class="jdl">${esc(v.judul)}</span>
      <button class="bintang ${f ? "on" : ""}" data-fav="${v.id}">★</button>
    </div>
  </article>`;
}

const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) {
    const v = en.target;
    v.src = v.dataset.src;
    v.preload = "metadata";
    io.unobserve(v);
  }
}), { rootMargin: "300px" });

function renderGrid(list, el, kosong) {
  el.innerHTML = list.length ? list.map(kartu).join("") : `<p class="kosong">${kosong || "Tidak ada video."}</p>`;
  $$("video[data-src]", el).forEach(v => io.observe(v));
}

/* ===== SLIDER ===== */
function renderSlider() {
  const s = $("#slider"), d = $("#dots"), list = HOME.slice(0, 5);
  s.innerHTML = list.map(v => `<div class="slide" data-id="${v.id}">
    <video src="${v.src}" muted loop autoplay playsinline preload="metadata"></video>
    <div class="slide-info"><b>${esc(v.judul)}</b><span class="play-btn">▶ Tonton</span></div></div>`).join("");
  d.innerHTML = list.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("");
  s.addEventListener("scroll", () => {
    const i = Math.round(s.scrollLeft / s.clientWidth);
    $$("i", d).forEach((x, j) => x.classList.toggle("on", i === j));
  });
  setInterval(() => {
    if (halaman !== "home" || player.classList.contains("buka")) return;
    const i = (Math.round(s.scrollLeft / s.clientWidth) + 1) % list.length;
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
  el.innerHTML = `<div class="sec-head"><h2>💎 Pilih Paket</h2></div>
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
    <div id="qr" class="qr"></div><small class="muted">Order: ${order}</small>
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
