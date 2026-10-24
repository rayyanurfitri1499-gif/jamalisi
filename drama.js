/* ===== SPESIAL EDITION: FITUR DRAMA ===== */
(function () {
  const IKLAN_TIAP = 3;
  const PER_HAL = 20;
  const SITUS = location.origin + location.pathname;

  const IK = {
    mata: '<svg viewBox="0 0 24 24"><path d="M12 5C5 5 1 12 1 12s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>',
    bintang: '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    bagi: '<svg viewBox="0 0 24 24"><path d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>',
    cari: '<svg class="ik" viewBox="0 0 24 24"><path d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>',
    gembok: '<svg viewBox="0 0 24 24"><path d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h8V8a4 4 0 1 0-8 0v2z"/></svg>',
    daftar: '<svg viewBox="0 0 24 24"><path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>'
  };

  let DRAMA = [];
  let TAB = "untuk";
  let suara = false;
  let tapIklan = 0;
  const sudahHitung = {};
  const EPS = {};

  const sk = (k, d) => baca(k, d);
  const progres = () => sk("se_progres", {});
  const favDrama = () => sk("se_fav_drama", []);
  const dilihat = () => sk("se_dilihat", []);
  const bolehVip = () => { try { return aktif(); } catch (e) { return false; } };
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1).replace(".", ",") + "jt" : n >= 1e3 ? (n / 1e3).toFixed(1).replace(".", ",") + "rb" : String(n || 0);
  const cariDrama = id => DRAMA.find(d => d.id === Number(id));
  const srcEp = epId => API + "/e/" + epId + "?t=" + encodeURIComponent(SESI.token || "");
  const bolehEp = (d, no) => no <= (d.gratis || 0) || bolehVip();

  /* ---------- matikan home lama (slider & thumbnail) supaya tidak berat ---------- */
  try {
    $$("#slider video").forEach(v => { v.pause(); v.removeAttribute("src"); v.load(); v.play = () => Promise.resolve(); });
    $("#slider").innerHTML = "";
    $("#grid-home").innerHTML = "";
    if (typeof thumbIO !== "undefined") thumbIO.disconnect();
    if (typeof antrianThumb !== "undefined") antrianThumb.length = 0;
  } catch (e) {}

  /* ---------- iklan smartlink (hanya non-pelanggan) ---------- */
  function iklanMungkin() {
    try {
      if (typeof SMARTLINK !== "string" || !SMARTLINK || SMARTLINK.startsWith("ISI-")) return;
      if (bolehVip() && !(typeof TAMPIL_UNTUK_PELANGGAN !== "undefined" && TAMPIL_UNTUK_PELANGGAN)) return;
      tapIklan++;
      if (tapIklan % IKLAN_TIAP === 0) window.open(SMARTLINK, "_blank", "noopener");
    } catch (e) {}
  }

  function hitungTonton(d) {
    if (sudahHitung[d.id]) return;
    sudahHitung[d.id] = 1;
    fetch(API + "/api/drama/tonton", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: d.id }) }).catch(() => {});
    const lihat = dilihat().filter(x => x !== d.id);
    lihat.unshift(d.id);
    simpan("se_dilihat", lihat.slice(0, 300));
  }

  function sampulHTML(d) {
    return d.sampul
      ? '<img src="' + esc(d.sampul) + '" alt="" loading="lazy" decoding="async">'
      : '<div class="tanpa">' + esc(d.judul) + "</div>";
  }

  function bagikan(d) {
    const url = SITUS + "?drama=" + d.id;
    const teks = 'Nonton "' + d.judul + '" di Spesial Edition';
    if (navigator.share) {
      navigator.share({ title: d.judul, text: teks, url }).catch(() => {});
    } else {
      const salin = teks + " " + url;
      (navigator.clipboard ? navigator.clipboard.writeText(salin) : Promise.reject())
        .then(() => toast("Link disalin"))
        .catch(() => prompt("Salin link ini:", url));
    }
  }

  function toggleFav(d) {
    const f = favDrama(), i = f.indexOf(d.id);
    if (i > -1) f.splice(i, 1); else f.unshift(d.id);
    simpan("se_fav_drama", f);
    toast(i > -1 ? "Dihapus dari favorit" : "Ditambahkan ke favorit");
    $$('[data-fav-drama="' + d.id + '"]').forEach(b => b.classList.toggle("on", i === -1));
  }

  /* ======================= FEED ======================= */
  const feed = document.createElement("div");
  feed.id = "feed";
  feed.innerHTML =
    '<div id="fd-head"><span class="crown">👑</span>' +
    '<div class="fd-tab"><button data-tab="baru">Terbaru</button><button data-tab="untuk" class="on">Untuk kamu</button><button data-tab="populer">Populer</button></div>' +
    '<button id="fd-cari" aria-label="Cari">' + IK.cari + "</button></div>" +
    '<div id="fd-list"><div class="fd-kosong">Memuat drama...</div></div>';
  document.body.appendChild(feed);
  const list = $("#fd-list"), head = $("#fd-head");

  function urutkan() {
    const d = DRAMA.filter(x => x.gratis > 0 && x.ep1);
    if (TAB === "baru") return d.sort((a, b) => b.dibuat - a.dibuat);
    if (TAB === "populer") return d.sort((a, b) => b.ditonton - a.ditonton);
    const lihat = dilihat();
    const acak = d.map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.x);
    const belum = acak.filter(x => !lihat.includes(x.id));
    const sudah = acak.filter(x => lihat.includes(x.id)).sort((a, b) => lihat.indexOf(b.id) - lihat.indexOf(a.id));
    const semua = belum.concat(sudah);
    return semua.filter(x => x.sematkan).concat(semua.filter(x => !x.sematkan));
  }

  let slides = [], aktifIdx = -1;
  const slideIO = new IntersectionObserver(es => {
    es.forEach(en => { if (en.isIntersecting && en.intersectionRatio >= 0.6) aktifkanSlide(Number(en.target.dataset.i)); });
  }, { root: list, threshold: [0.6] });

  function renderFeed() {
    slideIO.disconnect();
    slides.forEach(s => lepasVideo(s.querySelector("video")));
    const urut = urutkan();
    aktifIdx = -1;
    if (!urut.length) {
      list.innerHTML = '<div class="fd-kosong"><b>Belum ada drama</b><span>Drama yang ditambahkan admin akan muncul di sini.</span></div>';
      slides = [];
      return;
    }
    const fav = favDrama();
    list.innerHTML = urut.map((d, i) =>
      '<div class="fd-slide" data-i="' + i + '"' + (d.sampul ? ' style="background-image:url(\'' + esc(d.sampul) + '\')"' : "") + ">" +
      '<video playsinline muted preload="none"' + (d.sampul ? ' poster="' + esc(d.sampul) + '"' : "") + "></video>" +
      '<div class="fd-jeda">' + IK.play + "</div>" +
      (suara ? "" : '<div class="fd-suara">🔇 Ketuk untuk suara</div>') +
      '<div class="fd-sisi">' +
      '<button tabindex="-1">' + IK.mata + fmt(d.ditonton) + "</button>" +
      '<button data-fav-drama="' + d.id + '" class="' + (fav.includes(d.id) ? "on" : "") + '">' + IK.bintang + "Favorit</button>" +
      '<button data-bagi="' + d.id + '">' + IK.bagi + "Bagikan</button></div>" +
      '<div class="fd-bawah"><div class="fd-judul">' + esc(d.judul) + "</div>" +
      '<div class="fd-ket">Ep 1' + (d.sinopsis ? " · " + esc(d.sinopsis) : "") + "</div>" +
      '<button class="fd-semua" data-semua="' + d.id + '">Tonton semua (' + d.jml_ep + " episode)</button></div>" +
      '<div class="fd-muat"><i></i></div></div>'
    ).join("");
    slides = $$(".fd-slide", list);
    slides.forEach((s, i) => {
      s._d = urut[i];
      const v = s.querySelector("video");
      v.addEventListener("loadedmetadata", () => v.classList.toggle("lebar", v.videoWidth > v.videoHeight));
      v.addEventListener("timeupdate", () => {
        if (v.duration) s.querySelector(".fd-muat i").style.width = (v.currentTime / v.duration * 100) + "%";
        if (v.currentTime > 3) hitungTonton(s._d);
      });
      v.addEventListener("ended", () => selesaiCuplikan(s._d));
      slideIO.observe(s);
    });
    list.scrollTop = 0;
  }

  function lepasVideo(v) {
    if (v && v.getAttribute("src")) { v.pause(); v.removeAttribute("src"); v.load(); }
  }

  function aktifkanSlide(i) {
    if (i === aktifIdx) return;
    aktifIdx = i;
    slides.forEach((s, j) => {
      const v = s.querySelector("video"), d = s._d;
      if (j === i) {
        if (!v.getAttribute("src")) { v.preload = "auto"; v.src = srcEp(d.ep1); }
        s.classList.remove("jeda");
        if (bolehPutarFeed()) { v.muted = !suara; v.play().catch(() => {}); }
      } else if (j === i + 1) {
        if (!v.getAttribute("src")) { v.preload = "metadata"; v.src = srcEp(d.ep1); }
        v.pause();
      } else {
        lepasVideo(v);
      }
    });
  }

  const bolehPutarFeed = () => halaman === "home" && !document.hidden &&
    !$("#ep-player").classList.contains("buka") && !$("#sheet").classList.contains("buka") &&
    !$("#cari-drama").classList.contains("buka");

  function jedaFeed() { slides.forEach(s => s.querySelector("video").pause()); }
  function lanjutFeed() {
    const s = slides[aktifIdx];
    if (s && bolehPutarFeed() && !s.classList.contains("jeda")) {
      const v = s.querySelector("video");
      if (!v.getAttribute("src")) v.src = srcEp(s._d.ep1);
      v.muted = !suara;
      v.play().catch(() => {});
    }
  }

  function selesaiCuplikan(d) {
    if (bolehEp(d, 2) && d.jml_ep > 1) bukaEpisode(d, 2);
    else if (d.jml_ep > 1) bukaSheet(d, 1);
  }

  list.addEventListener("click", e => {
    const semua = e.target.closest("[data-semua]");
    if (semua) {
      const d = cariDrama(semua.dataset.semua);
      const tuju = Math.min(progres()[d.id] || 2, d.jml_ep);
      if (bolehEp(d, tuju)) bukaEpisode(d, tuju);
      else bukaSheet(d, tuju - 1, tuju);
      return;
    }
    const fav = e.target.closest("[data-fav-drama]");
    if (fav) { toggleFav(cariDrama(fav.dataset.favDrama)); return; }
    const bg = e.target.closest("[data-bagi]");
    if (bg) { bagikan(cariDrama(bg.dataset.bagi)); return; }
    const s = e.target.closest(".fd-slide");
    if (!s || e.target.closest(".fd-sisi")) return;
    const v = s.querySelector("video");
    iklanMungkin();
    if (!suara) {
      suara = true;
      $$(".fd-suara").forEach(x => x.remove());
      v.muted = false;
      v.play().catch(() => {});
      return;
    }
    if (v.paused) { s.classList.remove("jeda"); v.play().catch(() => {}); }
    else { s.classList.add("jeda"); v.pause(); }
  });

  let tGerak;
  list.addEventListener("scroll", () => {
    head.classList.add("redup");
    clearTimeout(tGerak);
    tGerak = setTimeout(() => head.classList.remove("redup"), 350);
  }, { passive: true });

  $$(".fd-tab button", feed).forEach(b => b.onclick = () => {
    TAB = b.dataset.tab;
    $$(".fd-tab button", feed).forEach(x => x.classList.toggle("on", x === b));
    renderFeed();
  });
  $(".crown", feed).onclick = () => { renderFeed(); };
  $("#fd-cari").onclick = () => bukaCari();

  /* ======================= LEMBAR LANGGANAN ======================= */
  const sheet = document.createElement("div");
  sheet.id = "sheet";
  sheet.className = "sheet";
  document.body.appendChild(sheet);
  let paketSheet = "bulanan", konteks = null;

  function bukaSheet(d, epSelesai, epTuju) {
    konteks = d ? { d, epSelesai, epTuju: epTuju || (epSelesai ? epSelesai + 1 : 1) } : null;
    if (d) simpan("se_lanjut", { id: d.id, ep: konteks.epTuju, waktu: Date.now() });
    renderSheet();
    jedaFeed();
    sheet.classList.add("buka");
  }
  function tutupSheet() {
    sheet.classList.remove("buka");
    lanjutFeed();
  }

  function renderSheet() {
    const d = konteks && konteks.d;
    const p = PAKET.find(x => x.id === paketSheet) || PAKET[0];
    const sisa = d ? d.jml_ep - (konteks.epSelesai || 0) : 0;
    sheet.innerHTML =
      (d ? '<div class="sh-konteks"><b>' + esc(d.judul) + "</b><div>" +
        (konteks.epSelesai ? "Ep " + konteks.epSelesai + " selesai · " + sisa + " episode lagi" : d.jml_ep + " episode") + "</div></div>" : "") +
      '<div class="sheet-isi"><div class="sh-head"><h3>🔒 ' + (d ? "Buka semua episode" : "Langganan VIP") + '</h3><button class="sh-x" aria-label="Tutup">✕</button></div>' +
      (bolehVip() ? '<p class="muted" style="margin-top:6px">VIP kamu aktif sampai ' + tgl(SESI.user.vip_sampai) + ". Pilih paket untuk memperpanjang.</p>" : "") +
      '<div class="sh-paket">' + PAKET.map(x =>
        '<button class="sh-pk ' + (x.id === paketSheet ? "on" : "") + '" data-pk="' + x.id + '">' +
        (x.id === "bulanan" ? "<i>Populer</i>" : "") + "<small>" + esc(x.nama) + "</small><b>" + rupiah(x.harga) + "</b></button>").join("") + "</div>" +
      '<div class="sh-untung"><div><span>✓</span>Semua drama VIP terbuka</div><div><span>✓</span>Tanpa iklan</div><div><span>✓</span>Episode baru tiap hari</div></div>' +
      (SESI.user
        ? '<button class="btn" id="sh-bayar">Lanjut nonton ' + rupiah(p.harga) + "</button>" +
          '<div class="sh-cara">QRIS, e-wallet, VA bank · aktif otomatis setelah bayar</div>'
        : '<div class="sh-login"><p class="muted" style="margin-bottom:10px">Masuk dulu untuk berlangganan</p><div id="sh-gbtn"></div>' +
          '<a href="#" id="sh-email">Masuk atau daftar pakai email</a></div>') +
      "</div>";
    $(".sh-x", sheet).onclick = tutupSheet;
    $$(".sh-pk", sheet).forEach(b => b.onclick = () => { paketSheet = b.dataset.pk; renderSheet(); });
    const bayar = $("#sh-bayar");
    if (bayar) bayar.onclick = async () => {
      bayar.disabled = true; bayar.textContent = "Menyiapkan pembayaran...";
      try {
        const j = await panggil("/api/bayar", { paket: paketSheet });
        location.href = j.url;
      } catch (err) {
        toast(err.message);
        bayar.disabled = false; bayar.textContent = "Lanjut nonton " + rupiah(p.harga);
      }
    };
    const email = $("#sh-email");
    if (email) email.onclick = e => { e.preventDefault(); sheet.classList.remove("buka"); pindah("akun"); };
    const g = $("#sh-gbtn");
    if (g && typeof muatGoogle === "function") {
      muatGoogle().then(() => {
        if (!g.isConnected) return;
        google.accounts.id.renderButton(g, { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: Math.min(320, (g.clientWidth || 300)) });
      }).catch(() => {});
    }
  }
  sheet.addEventListener("click", e => { if (e.target === sheet) tutupSheet(); });

  const kunciSesi = () => (SESI.user ? SESI.user.id : 0) + ":" + bolehVip();
  if (typeof setSesi === "function") {
    const setSesiAsli = setSesi;
    setSesi = function (t, u) {
      const lama = kunciSesi();
      setSesiAsli(t, u);
      if (lama === kunciSesi()) return;
      if (sheet.classList.contains("buka")) renderSheet();
      if (halaman === "langganan") renderLangganan();
    };
  }

      /* ======================= PEMUTAR EPISODE ======================= */
  const pemutar = document.createElement("div");
  pemutar.id = "ep-player";
  pemutar.innerHTML =
    '<video id="ep-video" playsinline></video><div class="fd-jeda">' + IK.play + "</div>" +
    '<div class="ep-atas"><button id="ep-tutup" aria-label="Kembali">←</button><div><b id="ep-judul"></b><small id="ep-no"></small></div></div>' +
    '<div class="ep-bawah"><button id="ep-prev">‹ Sebelumnya</button><button id="ep-list">Daftar episode</button><button class="utama" id="ep-next">Berikutnya ›</button></div>' +
    '<div class="ep-bar"><i></i></div>';
  document.body.appendChild(pemutar);
  const ev = $("#ep-video");
  let putarD = null, putarNo = 1;

  async function ambilEps(d) {
    if (EPS[d.id]) return EPS[d.id];
    const r = await fetch(API + "/api/drama/eps?id=" + d.id);
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Gagal memuat episode");
    EPS[d.id] = j.eps;
    Object.assign(d, j.drama);
    return j.eps;
  }

  async function bukaEpisode(d, no) {
    if (!bolehEp(d, no)) {
      if (pemutar.classList.contains("buka")) tutupPemutar();
      bukaSheet(d, 0, no);
      return;
    }
    let eps;
    try { eps = await ambilEps(d); } catch (e) { toast(e.message); return; }
    const ep = eps.find(x => x.no === no);
    if (!ep) { toast("Episode belum tersedia"); return; }
    if (!bolehVip()) iklanMungkin();
    putarD = d; putarNo = no;
    jedaFeed();
    $("#ep-judul").textContent = d.judul;
    $("#ep-no").textContent = "Ep " + no + " dari " + d.jml_ep;
    $("#ep-prev").disabled = no <= 1;
    $("#ep-next").textContent = no >= d.jml_ep ? "Selesai" : "Berikutnya ›";
    pemutar.classList.remove("jeda");
    pemutar.classList.add("buka");
    ev.src = srcEp(ep.id);
    ev.muted = false;
    suara = true;
    ev.play().catch(() => {});
    const pr = progres();
    pr[d.id] = no;
    simpan("se_progres", pr);
    simpan("se_progres_waktu", Object.assign(sk("se_progres_waktu", {}), { [d.id]: Date.now() }));
    hitungTonton(d);
  }

  function tutupPemutar() {
    ev.pause(); ev.removeAttribute("src"); ev.load();
    pemutar.classList.remove("buka");
    if (halaman === "langganan" && putarD) renderLangganan();
    if (halaman === "aktivitas") renderAktivitas();
    lanjutFeed();
  }

  ev.addEventListener("timeupdate", () => {
    if (ev.duration) $(".ep-bar i", pemutar).style.width = (ev.currentTime / ev.duration * 100) + "%";
  });
  ev.addEventListener("ended", () => {
    if (!putarD || putarNo >= putarD.jml_ep) return;
    const d = putarD, no = putarNo;
    if (bolehEp(d, no + 1)) bukaEpisode(d, no + 1);
    else { tutupPemutar(); bukaSheet(d, no, no + 1); }
  });
  ev.addEventListener("error", () => {
    if (!pemutar.classList.contains("buka") || !ev.getAttribute("src")) return;
    if (putarD && !bolehEp(putarD, putarNo)) { const d = putarD, no = putarNo; tutupPemutar(); bukaSheet(d, 0, no); }
    else toast("Video gagal diputar. Coba lagi sebentar.");
  });
  ev.addEventListener("click", () => {
    if (ev.paused) { pemutar.classList.remove("jeda"); ev.play().catch(() => {}); }
    else { pemutar.classList.add("jeda"); ev.pause(); }
  });
  $("#ep-tutup").onclick = tutupPemutar;
  $("#ep-prev").onclick = () => putarD && putarNo > 1 && bukaEpisode(putarD, putarNo - 1);
  $("#ep-next").onclick = () => {
    if (!putarD) return;
    if (putarNo >= putarD.jml_ep) { tutupPemutar(); return; }
    bukaEpisode(putarD, putarNo + 1);
  };
  $("#ep-list").onclick = () => {
    const d = putarD;
    tutupPemutar();
    bukaDetail(d.id);
  };

  /* ======================= KATALOG VIP & DETAIL ======================= */
  let detailId = 0, kategoriPilih = "Semua", halEp = 0;

  function bukaDetail(id) {
    detailId = Number(id);
    halEp = -1;
    if (halaman !== "langganan") pindah("langganan");
    else renderLangganan();
  }

  renderLangganan = function () {
    const el = $("#page-langganan");
    if (!el) return;
    const lanjut = sk("se_lanjut", null);
    if (lanjut && bolehVip() && DRAMA.length && Date.now() - (lanjut.waktu || 0) < 3 * 3600e3) {
      const d = cariDrama(lanjut.id);
      try { localStorage.removeItem("se_lanjut"); } catch (e) {}
      if (d) { detailId = d.id; setTimeout(() => bukaEpisode(d, lanjut.ep || 1), 50); }
    }
    if (detailId) return renderDetail(el);
    renderKatalog(el);
  };

  function bannerHTML() {
    const u = SESI.user;
    if (bolehVip()) return '<div class="vp-banner ok"><div><b>✓ VIP ' + esc(u.paket || "") + " aktif</b><small>Sampai " + tgl(u.vip_sampai) + '</small></div><button data-perpanjang>Perpanjang</button></div>';
    return '<div class="vp-banner"><div><b>Buka semua drama</b><small>Mulai ' + rupiah(Math.min(...PAKET.map(p => p.harga))) + " · tanpa iklan</small></div><button data-perpanjang>Langganan</button></div>";
  }

  function kartuDrama(d) {
    return '<div class="dr-kartu" data-drama="' + d.id + '"><div class="dr-pst">' + sampulHTML(d) +
      (bolehVip() || d.gratis >= d.jml_ep ? "" : '<span class="dr-gembok">' + IK.gembok + "</span>") +
      '<span class="dr-jml">' + d.jml_ep + " ep</span></div>" +
      '<div class="dr-nama">' + esc(d.judul) + "</div></div>";
  }

  function renderKatalog(el) {
    const kat = ["Semua", "Terbaru", "Populer"];
    DRAMA.forEach(d => String(d.kategori || "").split(",").map(x => x.trim()).filter(Boolean).forEach(k => { if (!kat.includes(k)) kat.push(k); }));
    if (!kat.includes(kategoriPilih)) kategoriPilih = "Semua";
    let isi = DRAMA.slice();
    if (kategoriPilih === "Terbaru") isi.sort((a, b) => b.dibuat - a.dibuat);
    else if (kategoriPilih === "Populer") isi.sort((a, b) => b.ditonton - a.ditonton);
    else if (kategoriPilih !== "Semua") isi = isi.filter(d => String(d.kategori || "").split(",").map(x => x.trim()).includes(kategoriPilih));
    else isi.sort((a, b) => (b.sematkan - a.sematkan) || (b.dibuat - a.dibuat));
    el.innerHTML =
      '<div class="vp-head"><h2>👑 VIP Premium</h2></div>' +
      bannerHTML() +
      '<div class="chips">' + kat.map(k => '<button class="' + (k === kategoriPilih ? "on" : "") + '" data-kat="' + esc(k) + '">' + esc(k) + "</button>").join("") + "</div>" +
      (isi.length ? '<div class="dr-grid">' + isi.map(kartuDrama).join("") + "</div>" : '<p class="kosong">Belum ada drama.</p>');
    $$("[data-kat]", el).forEach(b => b.onclick = () => { kategoriPilih = b.dataset.kat; renderKatalog(el); });
  }

  async function renderDetail(el) {
    let d = cariDrama(detailId);
    if (!d) {
      el.innerHTML = '<p class="kosong">Memuat...</p>';
      if (DRAMA.length) { detailId = 0; renderKatalog(el); }
      return;
    }
    let eps = EPS[d.id];
    if (!eps) {
      el.innerHTML = '<div class="dt-kembali">← Kembali</div><p class="kosong">Memuat episode...</p>';
      try { eps = await ambilEps(d); } catch (e) { toast(e.message); detailId = 0; return renderKatalog(el); }
      if (detailId !== d.id || halaman !== "langganan") return;
    }
    const terakhir = progres()[d.id] || 0;
    const jmlHal = Math.ceil(eps.length / PER_HAL);
    if (halEp < 0) halEp = terakhir ? Math.floor((terakhir - 1) / PER_HAL) : 0;
    halEp = Math.min(halEp, Math.max(0, jmlHal - 1));
    const vip = bolehVip();
    const terkunci = !vip && d.gratis < d.jml_ep;
    const lanjutNo = Math.min(terakhir || 1, d.jml_ep);
    const label = terkunci && !bolehEp(d, lanjutNo) ? "Buka semua " + d.jml_ep + " episode" : (terakhir ? "Lanjut tonton Ep " + lanjutNo : "Tonton Ep 1");
    const fav = favDrama().includes(d.id);
    el.innerHTML =
      '<button class="dt-kembali" id="dt-kembali">← Kembali</button>' +
      '<div class="dt-atas"><div class="dr-pst">' + sampulHTML(d) + "</div><div>" +
      "<h2>" + esc(d.judul) + "</h2>" +
      '<div class="dt-meta">' + d.jml_ep + " episode" + (d.kategori ? " · " + esc(d.kategori) : "") + " · " + fmt(d.ditonton) + "x ditonton</div>" +
      (d.sinopsis ? '<div class="dt-sinop">' + esc(d.sinopsis) + "</div>" : "") + "</div></div>" +
      '<div class="dt-aksi"><button class="btn" id="dt-main">' + label + "</button>" +
      '<button class="kecil ' + (fav ? "on" : "") + '" data-fav-drama="' + d.id + '" aria-label="Favorit">' + IK.bintang + "</button>" +
      '<button class="kecil" id="dt-bagi" aria-label="Bagikan">' + IK.bagi + "</button></div>" +
      (jmlHal > 1 ? '<div class="chips">' + Array.from({ length: jmlHal }, (_, i) =>
        '<button class="' + (i === halEp ? "on" : "") + '" data-hal="' + i + '">' + (i * PER_HAL + 1) + "-" + Math.min((i + 1) * PER_HAL, eps.length) + "</button>").join("") + "</div>"
        : '<div style="height:4px"></div>') +
      '<div class="ep-grid">' + eps.slice(halEp * PER_HAL, (halEp + 1) * PER_HAL).map(e => {
        const gratis = e.no <= d.gratis;
        const kunci = !gratis && !vip;
        const kelas = e.no === terakhir ? "terakhir" : gratis ? "gratis" : kunci ? "kunci" : "";
        return '<button class="ep-btn ' + kelas + '" data-ep="' + e.no + '">' + e.no + (kunci ? IK.gembok : "") + "</button>";
      }).join("") + "</div>";
    $("#dt-kembali").onclick = () => { detailId = 0; renderKatalog(el); window.scrollTo({ top: 0 }); };
    $("#dt-main").onclick = () => bukaEpisode(d, lanjutNo);
    $("#dt-bagi").onclick = () => bagikan(d);
    $$("[data-hal]", el).forEach(b => b.onclick = () => { halEp = Number(b.dataset.hal); renderDetail(el); });
    $$("[data-ep]", el).forEach(b => b.onclick = () => bukaEpisode(d, Number(b.dataset.ep)));
  }

  document.addEventListener("click", e => {
    const kd = e.target.closest("[data-drama]");
    if (kd && !e.target.closest("#feed")) { bukaDetail(kd.dataset.drama); window.scrollTo({ top: 0 }); return; }
    const fv = e.target.closest("[data-fav-drama]");
    if (fv && !e.target.closest("#feed")) { toggleFav(cariDrama(fv.dataset.favDrama)); return; }
    if (e.target.closest("[data-perpanjang]")) bukaSheet(null);
  });

  /* ======================= CARI ======================= */
  const cari = document.createElement("div");
  cari.id = "cari-drama";
  cari.innerHTML = '<div class="cr-atas"><input id="cr-input" type="search" placeholder="Cari judul drama..."><button id="cr-tutup">Batal</button></div><div id="cr-hasil"></div>';
  document.body.appendChild(cari);
  function bukaCari() {
    jedaFeed();
    cari.classList.add("buka");
    $("#cr-input").value = "";
    tampilCari("");
    setTimeout(() => $("#cr-input").focus(), 50);
  }
  function tampilCari(q) {
    q = q.toLowerCase().trim();
    const hasil = DRAMA.filter(d => !q || d.judul.toLowerCase().includes(q) || String(d.kategori || "").toLowerCase().includes(q));
    $("#cr-hasil").innerHTML = hasil.length ? hasil.map(d =>
      '<button class="cr-baris" data-cari="' + d.id + '"><div class="dr-pst">' + sampulHTML(d) + "</div><div><b>" + esc(d.judul) + "</b><small>" +
      d.jml_ep + " episode" + (d.kategori ? " · " + esc(d.kategori) : "") + "</small></div></button>").join("")
      : '<p class="kosong">Drama tidak ditemukan.</p>';
  }
  $("#cr-input").addEventListener("input", e => tampilCari(e.target.value));
  $("#cr-tutup").onclick = () => { cari.classList.remove("buka"); lanjutFeed(); };
  $("#cr-hasil").addEventListener("click", e => {
    const b = e.target.closest("[data-cari]");
    if (!b) return;
    cari.classList.remove("buka");
    bukaDetail(b.dataset.cari);
  });

  /* ======================= AKTIVITAS ======================= */
  const renderAktivitasAsli = renderAktivitas;
  renderAktivitas = function () {
    renderAktivitasAsli();
    [$("#g-rw"), $("#g-fv")].forEach(g => { if (g) { if (g.previousElementSibling) g.previousElementSibling.remove(); g.remove(); } });
    const el = $("#page-aktivitas");
    if (!el || !DRAMA.length) return;
    const waktu = sk("se_progres_waktu", {});
    const pr = progres();
    const lanjut = Object.keys(pr).map(Number).map(cariDrama).filter(Boolean).sort((a, b) => (waktu[b.id] || 0) - (waktu[a.id] || 0));
    const fav = favDrama().map(cariDrama).filter(Boolean);
    const blok = document.createElement("div");
    blok.innerHTML =
      '<div class="sec-head" style="margin-top:4px"><h2>▶️ Lanjut Nonton</h2></div>' +
      (lanjut.length ? '<div class="lanjut-list">' + lanjut.map(d => kartuDrama(d).replace('<div class="dr-nama">', '<div class="dr-nama">Ep ' + pr[d.id] + " · ")).join("") + "</div>" : '<p class="kosong">Belum ada drama yang ditonton.</p>') +
      '<div class="sec-head"><h2>⭐ Drama Favorit</h2></div>' +
      (fav.length ? '<div class="lanjut-list">' + fav.map(kartuDrama).join("") + "</div>" : '<p class="kosong">Belum ada drama favorit.</p>');
    el.insertBefore(blok, el.firstChild);
  };

  /* ======================= NAVIGASI ======================= */
  function aturMode() {
    const home = halaman === "home";
    document.body.classList.toggle("mode-feed", home);
    if (home) lanjutFeed(); else jedaFeed();
  }
  const pindahAsli = pindah;
  pindah = function (n) {
    if (pemutar.classList.contains("buka")) { ev.pause(); ev.removeAttribute("src"); ev.load(); pemutar.classList.remove("buka"); }
    sheet.classList.remove("buka");
    cari.classList.remove("buka");
    pindahAsli(n);
    aturMode();
  };
  const navVip = $('.bottom button[data-page="langganan"]');
  if (navVip) navVip.addEventListener("click", () => { detailId = 0; }, true);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { jedaFeed(); ev.pause(); } else lanjutFeed(); });

  const cariLama = $("#cari");
  if (cariLama) {
    cariLama.placeholder = "Cari drama...";
    cariLama.addEventListener("focus", e => { e.target.blur(); bukaCari(); });
  }

  /* ======================= MULAI ======================= */
  async function muatDrama() {
    try {
      const r = await fetch(API + "/api/drama");
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Gagal memuat drama");
      DRAMA = j.drama || [];
      if (j.urut === "baru") {
        TAB = "baru";
        $$(".fd-tab button", feed).forEach(x => x.classList.toggle("on", x.dataset.tab === "baru"));
      }
    } catch (e) {
      list.innerHTML = '<div class="fd-kosong"><b>Drama gagal dimuat</b><span>Periksa koneksi lalu buka ulang situs.</span></div>';
      return;
    }
    renderFeed();
    const q = new URLSearchParams(location.search);
    const idBagi = Number(q.get("drama"));
    if (idBagi && cariDrama(idBagi)) {
      history.replaceState(null, "", location.pathname);
      bukaDetail(idBagi);
    } else if (halaman === "langganan") renderLangganan();
    if (halaman === "aktivitas") renderAktivitas();
  }

  aturMode();
  muatDrama();
})();

/* ===== NOTIF INSTALL APLIKASI (VERSI BARU) ===== */
(function () {
  const ua = navigator.userAgent;
  const hp = /android|iphone|ipad|ipod/i.test(ua);
  const iOS = /iphone|ipad|ipod/i.test(ua);
  const inApp = /FBAN|FBAV|Instagram|Line\/|TikTok|musical_ly|WhatsApp|Telegram/i.test(ua);
  const terpasang = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  const KUNCI = "se_pasang_tutup";
  let ajakan = null;

  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); ajakan = e; });
  window.addEventListener("appinstalled", () => { sembunyi(); toast("Aplikasi berhasil di-install 🎉"); });

  const bar = document.createElement("div");
  bar.id = "pasang-app";
  bar.innerHTML = '<img src="icon-192.png" alt="">' +
    '<div class="pa-teks"><b>Install Spesial Edition</b><span>Nonton lebih cepat langsung dari layar HP</span></div>' +
    '<button class="pa-btn" type="button">Install</button>' +
    '<button class="pa-x" type="button" aria-label="Tutup">✕</button>';
  document.body.appendChild(bar);

  function tampil() { if (!terpasang()) bar.classList.add("buka"); }
  function sembunyi() { bar.classList.remove("buka"); }

  async function pasang() {
    if (ajakan) {
      ajakan.prompt();
      const hasil = await ajakan.userChoice.catch(() => ({}));
      ajakan = null;
      if (hasil.outcome === "accepted") sembunyi();
      return;
    }
    if (inApp) toast("Buka situs ini di Chrome dulu: tekan ⋮ lalu 'Buka di browser'");
    else if (iOS) toast("Tekan tombol Bagikan ⬆️ di Safari, lalu 'Tambahkan ke Layar Utama'");
    else toast("Tekan menu ⋮ di kanan atas Chrome, lalu 'Instal aplikasi' atau 'Tambahkan ke layar utama'");
  }
  window.pasangAplikasi = pasang;

  bar.querySelector(".pa-btn").onclick = pasang;
  bar.querySelector(".pa-x").onclick = () => { simpan(KUNCI, Date.now()); sembunyi(); };

  const ditutup = baca(KUNCI, 0);
  if (hp && !terpasang() && Date.now() - ditutup > 864e5) setTimeout(tampil, 4000);

  if (typeof renderAkun === "function") {
    const renderAkunSblm = renderAkun;
    renderAkun = function () {
      renderAkunSblm();
      if (terpasang()) return;
      const el = $("#page-akun");
      if (!el || $("#akun-pasang")) return;
      const b = document.createElement("button");
      b.id = "akun-pasang";
      b.className = "btn ghost";
      b.textContent = "📲 Install aplikasi";
      b.onclick = pasang;
      el.appendChild(b);
    };
    if (halaman === "akun") renderAkun();
  }
})();
/* ===== FEED TANPA GAMBAR SAMPUL ===== */
(function () {
  const list = document.getElementById("fd-list");
  if (!list) return;
  const hapus = () => list.querySelectorAll("video[poster]").forEach(v => v.removeAttribute("poster"));
  new MutationObserver(hapus).observe(list, { childList: true });
  hapus();
})();
        
