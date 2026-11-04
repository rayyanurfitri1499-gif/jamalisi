(function () {
  const IKLAN_TIAP = 3;
  const PER_HAL = 20;
  const SITUS = location.origin + location.pathname;

  const IK = {
    mata: '<svg viewBox="0 0 24 24"><path d="M12 5C5 5 1 12 1 12s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/></svg>',
    bintang: '<svg viewBox="0 0 24 24"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>',
    bagi: '<svg viewBox="0 0 24 24"><path d="M13.5 3.6a.9.9 0 0 1 1.5-.7l7.4 7.1a1 1 0 0 1 0 1.4l-7.4 7.1a.9.9 0 0 1-1.5-.7v-3.6C8.4 14 4.9 15.8 2.4 20.3c-.3.5-1 .3-1-.3C2 13.2 6.3 8.3 13.5 7.4z"/></svg>',
    cari: '<svg class="ik" viewBox="0 0 24 24"><path d="M10 2a8 8 0 0 1 6.3 12.9l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/></svg>',
    gembok: '<svg viewBox="0 0 24 24"><path d="M6 10V8a6 6 0 1 1 12 0v2h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1zm2 0h8V8a4 4 0 1 0-8 0v2z"/></svg>',
    daftar: '<svg viewBox="0 0 24 24"><path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    suka: '<svg viewBox="0 0 24 24"><path d="M12 21.2 10.6 20C5.4 15.4 2 12.3 2 8.5 2 5.4 4.4 3 7.5 3c1.7 0 3.4.8 4.5 2.1C13.1 3.8 14.8 3 16.5 3 19.6 3 22 5.4 22 8.5c0 3.8-3.4 6.9-8.6 11.5z"/></svg>',
    komen: '<svg viewBox="0 0 24 24"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.4 1.2 4.6 3.1 6.1L4 22l4.6-2.5c1.1.3 2.2.5 3.4.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3zM7.5 13a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4.5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>'
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
  const sukaku = id => !!(window.SE_SUKA && window.SE_SUKA.has(Number(id)));
  const tombolSuka = d => '<button data-suka="' + d.id + '" class="' + (sukaku(d.id) ? "on" : "") + '">' + IK.suka +
    '<span data-jsuka="' + d.id + '">' + fmt(d.jml_suka || 0) + "</span></button>";
  window.SE_aturSuka = (id, n) => { const d = cariDrama(id); if (d) d.jml_suka = n; };
  /* kunci putar: kode khusus video dari server, berlaku 6 jam, tidak bisa dipakai untuk login */
  let KUNCI = { t: "", exp: 0 };
  async function siapkanKunci(paksa) {
    if (!SESI.token) { KUNCI = { t: "", exp: 0 }; return; }
    if (!paksa && KUNCI.t && KUNCI.exp - Date.now() > 3600000) return;
    try {
      const r = await fetch(API + "/api/kunci-putar", { headers: { Authorization: "Bearer " + SESI.token } });
      const j = await r.json();
      KUNCI = r.ok && j.t ? j : { t: "", exp: 0 };
    } catch (e) {}
  }
  setInterval(() => siapkanKunci(), 20 * 60000);
  const srcEp = epId => API + "/e/" + epId + (KUNCI.t ? "?t=" + encodeURIComponent(KUNCI.t) : "");
  const bolehEp = (d, no) => no <= (d.gratis || 0) || bolehVip();
  try {
    $$("#slider video").forEach(v => { v.pause(); v.removeAttribute("src"); v.load(); v.play = () => Promise.resolve(); });
    $("#slider").innerHTML = "";
    $("#grid-home").innerHTML = "";
    if (typeof thumbIO !== "undefined") thumbIO.disconnect();
    if (typeof antrianThumb !== "undefined") antrianThumb.length = 0;
  } catch (e) {}
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

  function slideHTML(d, i, fav) {
    return '<div class="fd-slide" data-i="' + i + '"' + (d.sampul ? ' style="background-image:url(\'' + esc(d.sampul) + '\')"' : "") + ">" +
      '<video playsinline muted preload="none"' + (d.sampul ? ' poster="' + esc(d.sampul) + '"' : "") + "></video>" +
      '<div class="fd-jeda">' + IK.play + "</div>" +
      (suara ? "" : '<div class="fd-suara">🔇 Ketuk untuk suara</div>') +
      '<div class="fd-sisi">' +
      '<button tabindex="-1">' + IK.mata + fmt(d.ditonton) + "</button>" + tombolSuka(d) +
      '<button data-komen="' + d.id + '">' + IK.komen + '<span data-jkom="' + d.id + '">' + fmt(d.jml_komentar || 0) + "</span></button>" +
      '<button data-fav-drama="' + d.id + '" class="' + (fav.includes(d.id) ? "on" : "") + '">' + IK.bintang + "Favorit</button>" +
      '<button data-bagi="' + d.id + '">' + IK.bagi + "Bagikan</button></div>" +
      '<div class="fd-bawah"><div class="fd-judul">' + esc(d.judul) + "</div>" +
      '<div class="fd-ket">Ep 1' + (d.sinopsis ? " · " + esc(d.sinopsis) : "") + "</div>" +
      '<button class="fd-semua" data-semua="' + d.id + '">Tonton semua (' + d.jml_ep + " episode)</button></div>" +
      '<div class="fd-muat"><i></i></div></div>';
  }

  function pasangSlide(s, d) {
    s._d = d;
    const v = s.querySelector("video");
    v.addEventListener("loadedmetadata", () => v.classList.toggle("lebar", v.videoWidth > v.videoHeight));
    v.addEventListener("timeupdate", () => {
      if (v.duration) s.querySelector(".fd-muat i").style.width = (v.currentTime / v.duration * 100) + "%";
      if (v.currentTime > 3) hitungTonton(s._d);
    });
    v.addEventListener("ended", () => selesaiCuplikan(s._d));
    slideIO.observe(s);
  }
  function renderFeed(ganti) {
    slideIO.disconnect();
    slides.forEach(s => lepasVideo(s.querySelector("video")));
    let urut = urutkan();
    aktifIdx = -1;
    if (!urut.length) {
      list.innerHTML = '<div class="fd-kosong"><b>Belum ada drama</b><span>Drama yang ditambahkan admin akan muncul di sini.</span></div>';
      slides = [];
      return;
    }
    if (ganti && urut.length > 1) {
      const idx = urut.findIndex(x => x.id === sk("se_feed_awal", 0));
      if (idx > -1) { const mulai = (idx + 1) % urut.length; urut = urut.slice(mulai).concat(urut.slice(0, mulai)); }
    }
    simpan("se_feed_awal", urut[0].id);
    const fav = favDrama();
    list.innerHTML = urut.map((d, i) => slideHTML(d, i, fav)).join("");
    slides = $$(".fd-slide", list);
    slides.forEach((s, i) => pasangSlide(s, urut[i]));
    list.scrollTop = 0;
  }
  function tambahFeed() {
    const calon = DRAMA.filter(x => x.gratis > 0 && x.ep1);
    if (!calon.length || !slides.length) return;
    const acak = calon.map(x => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map(o => o.x);
    const akhir = slides[slides.length - 1]._d;
    if (acak.length > 1 && akhir && acak[0].id === akhir.id) acak.push(acak.shift());
    const fav = favDrama(), awal = slides.length;
    list.insertAdjacentHTML("beforeend", acak.map((d, k) => slideHTML(d, awal + k, fav)).join(""));
    slides = $$(".fd-slide", list);
    for (let k = awal; k < slides.length; k++) pasangSlide(slides[k], acak[k - awal]);
  }

  function lepasVideo(v) {
    if (v && v.getAttribute("src")) { v.pause(); v.removeAttribute("src"); v.load(); }
  }

  function aktifkanSlide(i) {
    if (i === aktifIdx) return;
    aktifIdx = i;
    if (i >= slides.length - 2) tambahFeed();
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
      const tuju = 1;
      if (bolehEp(d, tuju)) bukaEpisode(d, tuju);
      else bukaSheet(d, tuju - 1, tuju);
      return;
    }
    const km = e.target.closest("[data-komen]");
    if (km) { bukaKomentar(cariDrama(km.dataset.komen)); return; }
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
  $(".crown", feed).onclick = () => { renderFeed(true); };

  /* tarik ke bawah di video paling atas = refresh & ganti video */
  const tarik = document.createElement("div");
  tarik.id = "fd-tarik";
  tarik.innerHTML = "<i></i>";
  feed.appendChild(tarik);
  let yAwal = null, jarak = 0, sedangMuat = false;
  list.addEventListener("touchstart", e => {
    yAwal = (list.scrollTop <= 0 && !sedangMuat) ? e.touches[0].clientY : null;
    jarak = 0;
  }, { passive: true });
  list.addEventListener("touchmove", e => {
    if (yAwal === null) return;
    jarak = Math.max(0, e.touches[0].clientY - yAwal);
    if (list.scrollTop > 0) { jarak = 0; }
    const t = Math.min(jarak * 0.5, 90);
    tarik.style.transition = "none";
    tarik.style.opacity = t > 8 ? 1 : 0;
    tarik.style.transform = "translate(-50%," + t + "px) rotate(" + (t * 4) + "deg)";
    tarik.classList.toggle("siap", t >= 60);
  }, { passive: true });
  list.addEventListener("touchend", () => {
    if (yAwal === null) return;
    yAwal = null;
    tarik.style.transition = "";
    if (jarak * 0.5 >= 60) {
      sedangMuat = true;
      tarik.classList.add("muat");
      tarik.style.transform = "translate(-50%,60px)";
      Promise.resolve(muatDrama()).finally(() => {
        sedangMuat = false;
        tarik.classList.remove("muat", "siap");
        tarik.style.opacity = 0;
        tarik.style.transform = "translate(-50%,0)";
      });
    } else {
      tarik.classList.remove("siap");
      tarik.style.opacity = 0;
      tarik.style.transform = "translate(-50%,0)";
    }
  }, { passive: true });
  const navHome = $('.bottom button[data-page="home"]');
  if (navHome) navHome.addEventListener("click", () => { if (DRAMA.length) renderFeed(true); });
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

  const SH_G = d => '<svg class="tm-ik" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  const SH_IK = {
    gem: SH_G('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>'),
    cek: SH_G('<path d="m5 12 5 5 9-10"/>'),
    film: SH_G('<rect x="3" y="4" width="18" height="16" rx="3"/><path d="m10 9 5 3-5 3z"/>'),
    tanpa: SH_G('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4"/>'),
    bintang: SH_G('<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.3 9.2l6.1-.6z"/>')
  };
  function renderSheet() {
    const d = konteks && konteks.d;
    const p = PAKET.find(x => x.id === paketSheet) || PAKET[0];
    const sisa = d ? d.jml_ep - (konteks.epSelesai || 0) : 0;
    sheet.innerHTML =
      (d ? '<div class="sh-konteks"><b>' + esc(d.judul) + "</b><div>" +
        (konteks.epSelesai ? "Ep " + konteks.epSelesai + " selesai · " + sisa + " episode lagi" : d.jml_ep + " episode") + "</div></div>" : "") +
      '<div class="sheet-isi"><div class="sh-head"><span class="sh-tile">' + SH_IK.gem + '</span><div class="sh-judul"><h3>' + (d ? "Buka semua episode" : "Langganan VIP") + "</h3>" +
      (bolehVip() ? '<div class="sh-aktif">' + SH_IK.cek + "Aktif sampai " + tgl(SESI.user.vip_sampai) + " · pilih paket buat perpanjang</div>" : "") +
      '</div><button class="sh-x" aria-label="Tutup">✕</button></div>' +
      '<div class="sh-paket">' + PAKET.map(x => {
        const perHari = Math.round(x.harga / (x.hari || 1));
        const hemat = Math.round((1 - perHari / PAKET[0].harga) * 100);
        const pita = x.id === "bulanan" ? "Populer" : x.id === "tahunan" ? "Paling hemat" : "";
        return '<button class="sh-pk ' + (x.id === paketSheet ? "on" : "") + '" data-pk="' + x.id + '">' +
          (pita ? "<i>" + pita + "</i>" : "") + '<span class="sh-atas"><small>' + esc(x.nama) + '</small><span class="sh-rd"></span></span>' +
          "<b>" + rupiah(x.harga) + '</b><span class="sh-lama">' + (x.hari || 1) + " hari</span>" +
          '<span class="sh-kaki"><span>' + rupiah(perHari) + "/hari</span>" + (hemat > 0 ? "<em>Hemat " + hemat + "%</em>" : "") + "</span></button>";
      }).join("") + "</div>" +
      '<div class="sh-untung"><div><span>' + SH_IK.film + '</span>Semua drama VIP terbuka</div><div><span>' + SH_IK.tanpa + '</span>Tanpa iklan</div><div><span>' + SH_IK.bintang + "</span>Episode baru tiap hari</div></div>" +
      (SESI.user
        ? '<button class="btn" id="sh-bayar">Lanjut nonton ' + rupiah(p.harga) + "<small>Paket " + esc(p.nama) + " · " + (p.hari || 1) + " hari</small></button>" +
          '<div class="sh-cara"><span>QRIS</span><span>e-wallet</span><span>VA bank</span><span class="ok">aktif otomatis setelah bayar</span></div>'
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
        bayar.disabled = false; bayar.innerHTML = "Lanjut nonton " + rupiah(p.harga) + "<small>Paket " + esc(p.nama) + " · " + (p.hari || 1) + " hari</small>";
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
      siapkanKunci(true);
      if (typeof isiTanda === "function") isiTanda();
      if (lama === kunciSesi()) return;
      if (komen.classList.contains("buka")) renderBawahKomentar();
      if (sheet.classList.contains("buka")) renderSheet();
      if (halaman === "langganan") renderLangganan();
    };
  }
  const pemutar = document.createElement("div");
  pemutar.id = "ep-player";
  pemutar.innerHTML =
    '<div class="ep-atas"><button id="ep-tutup" aria-label="Kembali">←</button><div><b id="ep-judul"></b><small id="ep-no"></small></div></div>' +
    '<div id="ep-list"></div>';
  document.body.appendChild(pemutar);
  let epList = $("#ep-list");
  let putarD = null, putarNo = 1, epSlides = [], epAktif = -1, lanjutOtomatis = false;
  const videoPemutar = () => epSlides.map(s => s.querySelector("video")).filter(Boolean);
  function jedaPemutar() { videoPemutar().forEach(v => v.pause()); }

  async function ambilEps(d) {
    if (EPS[d.id]) return EPS[d.id];
    const r = await fetch(API + "/api/drama/eps?id=" + d.id);
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || "Gagal memuat episode");
    EPS[d.id] = j.eps;
    Object.assign(d, j.drama);
    return j.eps;
  }

  const epIOcb = es => {
    es.forEach(en => {
      if (!en.isIntersecting || en.intersectionRatio < 0.6) return;
      if (en.target.dataset.lanjut || en.target.dataset.balik) return; 
      if (Date.now() < kunciGeser) return;
      aktifkanEp(Number(en.target.dataset.no));
    });
  };
  let epIO = new IntersectionObserver(epIOcb, { root: epList, threshold: [0.6] });
  function pilihBerikut(d) {
    const dilewati = rantai.map(x => x.id);
    let calon = DRAMA.filter(x => x.id !== d.id && !dilewati.includes(x.id) && x.gratis > 0 && x.ep1);
    if (!calon.length) {
      const sbl = rantai[posRantai - 1];
      calon = DRAMA.filter(x => x.id !== d.id && (!sbl || x.id !== sbl.id) && x.gratis > 0 && x.ep1);
    }
    if (!calon.length) return null;
    const lihat = dilihat();
    const belum = calon.filter(x => !lihat.includes(x.id));
    const kumpulan = belum.length ? belum : calon;
    return kumpulan[Math.floor(Math.random() * kumpulan.length)];
  }
  let pindahDrama = false, rantai = [], posRantai = 0, kunciGeser = 0;
  function kartuPindah(teks) {
    const s = epSlides.find(x => x.dataset.lanjut || x.dataset.balik ? Math.abs(x.offsetTop - epList.scrollTop) < 5 : false);
    const sp = s && s.querySelector(".ep-lanjut-isi span");
    if (sp) sp.textContent = teks;
  }
  async function pindahKe(n, no, simpanRantai, posBaru) {
    const lamaRantai = rantai.map(x => ({ ...x })), lamaPos = posRantai;
    pindahDrama = true;
    videoPemutar().forEach(v => v.pause());
    rantai = simpanRantai;
    posRantai = posBaru;
    try { await bukaEpisode(n, no, true); } catch (e) {}
    pindahDrama = false;
    if (putarD !== n) {
      rantai = lamaRantai;
      posRantai = lamaPos;
      kartuPindah("Gagal memuat. Ketuk untuk coba lagi.");
    }
  }
  function keDramaBerikut(id) {
    const n = cariDrama(id);
    if (!n || pindahDrama) return;
    kartuPindah("Memuat Ep...");
    const epAkhir = epSlides.filter(x => x.dataset.no).map(x => Number(x.dataset.no)).pop() || putarNo;
    let r = rantai.map(x => ({ ...x }));
    if (r[posRantai]) r[posRantai].no = epAkhir;
    if (!r[posRantai + 1] || r[posRantai + 1].id !== n.id) {
      r = r.slice(0, posRantai + 1);
      r.push({ id: n.id, no: 1 });
    }
    pindahKe(n, r[posRantai + 1].no, r, posRantai + 1);
  }
  function keDramaSebelum() {
    const sbl = rantai[posRantai - 1], n = sbl && cariDrama(sbl.id);
    if (!n || pindahDrama) return;
    kartuPindah("Memuat...");
    const r = rantai.map(x => ({ ...x }));
    if (r[posRantai]) r[posRantai].no = putarNo;
    pindahKe(n, sbl.no, r, posRantai - 1);
        }
    /* cek ulang posisi setelah scroll berhenti, supaya kartu pindah drama tidak pernah macet */
  let jariTurun = false;
  function cekKartuPindah() {
    if (!pemutar.classList.contains("buka") || pindahDrama || jariTurun) return;
    if (Date.now() < kunciGeser) { setTimeout(cekKartuPindah, kunciGeser - Date.now() + 60); return; }
    const h = epList.clientHeight || 1;
    const s = epSlides[Math.round(epList.scrollTop / h)];
    if (!s || Math.abs(s.offsetTop - epList.scrollTop) > h * 0.4) return;
    if (s.dataset.lanjut) keDramaBerikut(Number(s.dataset.lanjut));
    else if (s.dataset.balik) keDramaSebelum();
  }
  let tCekPindah;
  const jadwalCek = () => { clearTimeout(tCekPindah); tCekPindah = setTimeout(cekKartuPindah, 300); };
  pemutar.addEventListener("scroll", jadwalCek, { passive: true, capture: true });
  pemutar.addEventListener("touchstart", () => { jariTurun = true; clearTimeout(tCekPindah); }, { passive: true });
  document.addEventListener("touchend", () => { jariTurun = false; jadwalCek(); }, { passive: true });
  document.addEventListener("touchcancel", () => { jariTurun = false; jadwalCek(); }, { passive: true });
    /* tanda air kecil di bawah tombol Bagikan: email + ID penonton */
  function isiTanda() {
    const u = SESI.user;
    const teks = u ? esc(u.email || "") + "<br>ID " + esc(String(u.id || "")) : "";
    $$(".ep-tanda").forEach(el => { el.innerHTML = teks; });
  }

  function bangunEpisode(d, eps) {
    epIO.disconnect();
    /* wadah episode selalu baru, supaya posisi gulir/geseran lama tidak terbawa ke drama berikutnya */
    const wadahBaru = document.createElement("div");
    wadahBaru.id = "ep-list";
    epList.replaceWith(wadahBaru);
    epList = wadahBaru;
    epIO = new IntersectionObserver(epIOcb, { root: epList, threshold: [0.6] });
    jariTurun = false;
    videoPemutar().forEach(lepasVideo);
    epAktif = -1;
    const fav = favDrama().includes(d.id);
    const sbl = posRantai > 0 && rantai[posRantai - 1] ? cariDrama(rantai[posRantai - 1].id) : null;
    epList.innerHTML = (sbl
      ? '<div class="ep-slide ep-lanjut ep-balik" data-balik="' + sbl.id + '">' +
        '<div class="ep-lanjut-isi"><small>Drama sebelumnya</small><b>' + esc(sbl.judul) + '</b><span>Kembali ke Ep ' + rantai[posRantai - 1].no + '...</span></div></div>'
      : "") + eps.map(e => {
      const kunci = !bolehEp(d, e.no);
      return '<div class="ep-slide' + (kunci ? " terkunci" : "") + '" data-no="' + e.no + '" data-ep="' + e.id + '">' +
        (kunci
          ? '<div class="ep-kunci"' + (d.sampul ? ' style="background-image:url(\'' + esc(d.sampul) + '\')"' : "") + '></div>' +
            '<div class="ep-kunci-isi"><div class="ep-gembok">' + IK.gembok + '</div><b>Episode ' + e.no + ' khusus VIP</b>' +
            '<span>Langganan untuk lanjut nonton semua episode</span><button class="btn" data-buka="' + e.no + '">Buka semua episode</button></div>'
          : '<video playsinline preload="none"></video><div class="fd-jeda">' + IK.play + "</div>") +
        '<div class="fd-sisi">' + tombolSuka(d) +
        '<button data-komen="' + d.id + '">' + IK.komen + '<span data-jkom="' + d.id + '">' + fmt(d.jml_komentar || 0) + "</span></button>" +
        '<button data-fav-drama="' + d.id + '" class="' + (fav ? "on" : "") + '">' + IK.bintang + "Favorit</button>" +
        '<button data-bagi="' + d.id + '">' + IK.bagi + "Bagikan</button><div class=\"ep-tanda\"></div></div>" +
        '<div class="fd-bawah ep-bawah2"><div class="fd-judul">Ep.' + e.no + ' <span class="ep-garis">|</span> ' + esc(d.judul) + "</div>" +
        (d.sinopsis ? '<div class="fd-ket ep-sinop" data-sinop>' + esc(d.sinopsis) + "</div>" : "") +
        '<div class="fd-muat"><i></i></div>' +
        '<button class="ep-total" data-eplist="' + d.id + '">' + IK.daftar + "<span>Total " + d.jml_ep + " episode</span><b>›</b></button></div></div>";
    }).join("") + (function () {
      const brk = rantai[posRantai + 1];
      const n = (brk && cariDrama(brk.id)) || pilihBerikut(d);
      if (!n) return "";
      return '<div class="ep-slide ep-lanjut" data-lanjut="' + n.id + '">' +
        '<div class="ep-lanjut-isi"><small>Drama berikutnya</small><b>' + esc(n.judul) + '</b><span>Memuat Ep ' + (brk && brk.id === n.id ? brk.no : 1) + '...</span></div></div>';
    })();
    epSlides = $$(".ep-slide", epList);
    isiTanda();
    epSlides.forEach(s => {
      const v = s.querySelector("video");
      if (v) {
        v.addEventListener("loadedmetadata", () => v.classList.toggle("lebar", v.videoWidth > v.videoHeight));
        v.addEventListener("timeupdate", () => { if (v.duration) s.querySelector(".fd-muat i").style.width = (v.currentTime / v.duration * 100) + "%"; });
        v.addEventListener("ended", () => mundurLanjut(s, Number(s.dataset.no) + 1));
        v.addEventListener("play", batalMundur);
        v.addEventListener("error", () => { if (v.getAttribute("src") && pemutar.classList.contains("buka")) toast("Video gagal diputar. Coba lagi sebentar."); });
      }
      epIO.observe(s);
    });
  }

  function keEpisode(no, otomatis) {
    const s = epSlides.find(x => Number(x.dataset.no) === no) || (otomatis ? epSlides.find(x => x.dataset.lanjut) : null);
    if (!s) return;
    lanjutOtomatis = !!otomatis;
    epList.scrollTo({ top: s.offsetTop, behavior: otomatis ? "smooth" : "auto" });
  }

  /* hitung mundur ke episode berikutnya */
  let mundurT = null;
  function batalMundur() {
    if (mundurT) { clearInterval(mundurT); mundurT = null; }
    $$(".ep-mundur").forEach(x => x.remove());
  }
  function mundurLanjut(s, no) {
    batalMundur();
    const brk = epSlides.find(x => Number(x.dataset.no) === no);
    if (!brk || brk.classList.contains("terkunci") || !putarD) return keEpisode(no, true);
    const d = putarD;
    let n = 5;
    const el = document.createElement("div");
    el.className = "ep-mundur";
    el.innerHTML = '<button class="ep-mundur-batal" type="button">Batal</button>' +
      '<div class="ep-mundur-kartu"><div class="ep-mundur-sampul"' + (d.sampul ? ' style="background-image:url(\'' + esc(d.sampul) + '\')"' : "") + "><span>Ep " + no + "</span></div>" +
      '<div class="ep-mundur-teks"><small>BERIKUTNYA</small><b>Episode ' + no + "</b><span>Ketuk buat langsung putar</span></div>" +
      '<div class="ep-mundur-cincin"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="jalan" cx="22" cy="22" r="19"/></svg><b>5</b></div></div>';
    s.appendChild(el);
    const lanjut = () => { batalMundur(); keEpisode(no, true); };
    el.querySelector(".ep-mundur-kartu").onclick = e => { e.stopPropagation(); lanjut(); };
    el.querySelector(".ep-mundur-batal").onclick = e => { e.stopPropagation(); batalMundur(); };
    el.addEventListener("touchstart", e => e.stopPropagation(), { passive: true });
    mundurT = setInterval(() => {
      n--;
      const b = el.querySelector(".ep-mundur-cincin b");
      if (b) b.textContent = Math.max(n, 0);
      if (n <= 0) lanjut();
    }, 1000);
  }

  /* kontrol di layar kunci & notifikasi pemutar */
  function aturLayarKunci(d, no, v) {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: "Ep " + no + " · " + d.judul, artist: "Spesial Edition",
        artwork: [{ src: d.sampul || "ikon-512.png", sizes: "512x512" }]
      });
      const ms = navigator.mediaSession;
      ms.setActionHandler("play", () => v.play().catch(() => {}));
      ms.setActionHandler("pause", () => v.pause());
      ms.setActionHandler("nexttrack", () => keEpisode(epAktif + 1, true));
      ms.setActionHandler("previoustrack", epAktif > 1 ? () => keEpisode(epAktif - 1) : null);
    } catch (e) {}
  }

  function aktifkanEp(no) {
    if (no === epAktif || !putarD) return;
    batalMundur();
    epAktif = no;
    putarNo = no;
    const d = putarD;
    $("#ep-no").textContent = "Ep " + no + " dari " + d.jml_ep;
    epSlides.forEach(s => {
      const n = Number(s.dataset.no), v = s.querySelector("video");
      if (!v) return;
      if (n === no) {
        if (!v.getAttribute("src")) { v.preload = "auto"; v.src = srcEp(s.dataset.ep); }
        s.classList.remove("jeda");
        v.muted = false;
        if (pemutar.classList.contains("buka") && !document.hidden) v.play().catch(() => {});
        if (!s.classList.contains("terkunci")) aturLayarKunci(d, no, v);
      } else if (n === no + 1) {
        if (!v.getAttribute("src")) { v.preload = "metadata"; v.src = srcEp(s.dataset.ep); }
        v.pause();
      } else lepasVideo(v);
    });
    const s = epSlides.find(x => Number(x.dataset.no) === no);
    if (s && s.classList.contains("terkunci")) {
      if (lanjutOtomatis) bukaSheet(d, no - 1, no);
    } else {
      const pr = progres();
      pr[d.id] = no;
      simpan("se_progres", pr);
      simpan("se_progres_waktu", Object.assign(sk("se_progres_waktu", {}), { [d.id]: Date.now() }));
      hitungTonton(d);
    }
    lanjutOtomatis = false;
  }

  async function bukaEpisode(d, no, lewatRantai) {
    await siapkanKunci();
    let eps;
    try { eps = await ambilEps(d); } catch (e) { toast(e.message); return; }
    if (!eps.find(x => x.no === no)) { toast("Episode belum tersedia"); return; }
    if (!bolehEp(d, no) && !pemutar.classList.contains("buka")) { bukaSheet(d, 0, no); return; }
    if (!bolehVip()) iklanMungkin();
    jedaFeed();
    suara = true;
    $("#ep-judul").textContent = d.judul;
    if (!lewatRantai) { rantai = [{ id: d.id, no }]; posRantai = 0; }
    const kunciRantai = posRantai + ":" + rantai.map(x => x.id).join(",");
    if (lewatRantai || putarD !== d || pemutar.dataset.rantai !== kunciRantai || epSlides.filter(x => !x.dataset.lanjut).length !== eps.length || pemutar.dataset.vip !== String(bolehVip())) {
      pemutar.dataset.rantai = kunciRantai;
      putarD = d;
      pemutar.dataset.vip = String(bolehVip());
      bangunEpisode(d, eps);
    }
    pemutar.classList.add("buka");
    epAktif = -1;
    kunciGeser = Date.now() + 900;
    epList.style.overflowY = "hidden";
    epList.style.scrollSnapType = "none";
    const lompat = () => {
      const s = epSlides.find(x => Number(x.dataset.no) === no);
      if (s) epList.scrollTop = s.offsetTop;
    };
    lompat();
    requestAnimationFrame(() => {
      lompat();
      aktifkanEp(no);
      setTimeout(() => {
        lompat();
        epList.style.overflowY = "";
        epList.style.scrollSnapType = "";
        lompat();
      }, 450);
    });
  }

  function tutupPemutar() {
    videoPemutar().forEach(lepasVideo);
    epAktif = -1;
    pemutar.classList.remove("buka");
    if (halaman === "langganan" && putarD) renderLangganan();
    if (halaman === "aktivitas") renderAktivitas();
    lanjutFeed();
  }

  pemutar.addEventListener("click", e => {
    if (!e.target.closest("#ep-list")) return;
    const lj = e.target.closest("[data-lanjut]");
    if (lj) { keDramaBerikut(Number(lj.dataset.lanjut)); return; }
    if (e.target.closest("[data-balik]")) { keDramaSebelum(); return; }
    const buka = e.target.closest("[data-buka]");
    if (buka) { const no = Number(buka.dataset.buka); bukaSheet(putarD, no - 1, no); return; }
    const km = e.target.closest("[data-komen]");
    if (km) { bukaKomentar(cariDrama(km.dataset.komen) || putarD); return; }
    const fav = e.target.closest("[data-fav-drama]");
    if (fav) { toggleFav(putarD); return; }
    const bg = e.target.closest("[data-bagi]");
    if (bg) { bagikan(putarD); return; }
    if (e.target.closest("[data-eplist]")) { bukaDaftarEp(putarD); return; }
    const sp = e.target.closest("[data-sinop]");
    if (sp) { sp.classList.toggle("buka"); return; }
    const s = e.target.closest(".ep-slide");
    if (!s || e.target.closest(".fd-sisi")) return;
    const v = s.querySelector("video");
    if (!v) return;
    if (v.paused) { s.classList.remove("jeda"); v.play().catch(() => {}); }
    else { s.classList.add("jeda"); v.pause(); }
  });
  $("#ep-tutup").onclick = tutupPemutar;
  const daftarEp = document.createElement("div");
  daftarEp.id = "eplist-sheet";
  daftarEp.className = "sheet";
  document.body.appendChild(daftarEp);
  let dlD = null, dlHal = 0;
  const DL_PER = 30;
  async function bukaDaftarEp(d) {
    if (!d) return;
    let eps;
    try { eps = await ambilEps(d); } catch (e) { toast(e.message); return; }
    dlD = d;
    const kini = pemutar.classList.contains("buka") && putarD === d ? epAktif : (progres()[d.id] || 0);
    dlHal = kini ? Math.floor((kini - 1) / DL_PER) : 0;
    renderDaftarEp(eps, kini);
    daftarEp.classList.add("buka");
  }
  function renderDaftarEp(eps, kini) {
    const d = dlD, vip = bolehVip(), jmlHal = Math.ceil(eps.length / DL_PER);
    daftarEp.innerHTML = '<div class="sheet-isi"><div class="sh-head"><div><h3>' + esc(d.judul) + '</h3><small class="muted">Total ' + eps.length +
      " episode" + (vip ? "" : " · " + Math.min(d.gratis, eps.length) + " gratis") + '</small></div><button class="sh-x" aria-label="Tutup">✕</button></div>' +
      (jmlHal > 1 ? '<div class="chips">' + Array.from({ length: jmlHal }, (_, i) => '<button class="' + (i === dlHal ? "on" : "") + '" data-dlhal="' + i + '">' +
        (i * DL_PER + 1) + "-" + Math.min((i + 1) * DL_PER, eps.length) + "</button>").join("") + "</div>" : '<div style="height:12px"></div>') +
      '<div class="ep-grid dl-grid">' + eps.slice(dlHal * DL_PER, (dlHal + 1) * DL_PER).map(e => {
        const gratis = e.no <= d.gratis, kunci = !gratis && !vip;
        const kelas = e.no === kini ? "terakhir" : gratis ? "gratis" : kunci ? "kunci" : "";
        return '<button class="ep-btn ' + kelas + '" data-dlep="' + e.no + '">' + e.no + (kunci ? IK.gembok : "") + "</button>";
      }).join("") + "</div></div>";
    $(".sh-x", daftarEp).onclick = () => daftarEp.classList.remove("buka");
    $$("[data-dlhal]", daftarEp).forEach(b => b.onclick = () => { dlHal = Number(b.dataset.dlhal); renderDaftarEp(eps, kini); });
    $$("[data-dlep]", daftarEp).forEach(b => b.onclick = () => {
      const no = Number(b.dataset.dlep);
      daftarEp.classList.remove("buka");
      if (pemutar.classList.contains("buka") && putarD === d) keEpisode(no, false);
      else bukaEpisode(d, no);
    });
  }
  daftarEp.addEventListener("click", e => { if (e.target === daftarEp) daftarEp.classList.remove("buka"); });
    /* ======================= KOMENTAR ======================= */
  const komen = document.createElement("div");
  komen.id = "komen-sheet";
  komen.className = "sheet";
  komen.innerHTML =
    '<div class="sheet-isi km-isi"><div class="sh-head"><h3 id="km-judul">Komentar</h3><button class="sh-x" id="km-x" aria-label="Tutup">✕</button></div>' +
    '<div id="km-list"></div><div id="km-bawah"></div></div>';
  document.body.appendChild(komen);
  let komenD = null;
    const waktuLalu = t => {
    const s = (Date.now() - t) / 1000;
    if (s < 60) return "baru saja";
    if (s < 3600) return Math.floor(s / 60) + " menit lalu";
    if (s < 86400) return Math.floor(s / 3600) + " jam lalu";
    if (s < 604800) return Math.floor(s / 86400) + " hari lalu";
    return tgl(t);
  };
  function avatarHTML(nama, foto, kelas) {
    if (foto) return '<img class="' + kelas + '" src="' + esc(foto) + '" alt="" referrerpolicy="no-referrer" loading="lazy">';
    const h = String(nama || "?").split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
    return '<span class="' + kelas + ' km-inisial" style="background:hsl(' + h + ',55%,42%)">' + esc(String(nama || "?").trim().charAt(0).toUpperCase() || "?") + "</span>";
  }
  function barisKomentar(k) {
    return '<div class="km-baris" data-kid="' + k.id + '">' + avatarHTML(k.nama, k.foto, "km-av") +
      '<div class="km-teks"><div class="km-nama">' + esc(k.nama) + (k.vip ? ' <span class="km-vip">👑 VIP</span>' : "") +
      (k.sematkan ? ' <span class="km-semat">📌 Disematkan</span>' : "") + "</div>" +
      '<div class="km-isi-teks">' + esc(k.isi) + "</div>" +
      '<div class="km-info">' + waktuLalu(k.dibuat) + (k.milik ? ' · <button data-hapus-km="' + k.id + '">Hapus</button>' : "") + "</div></div></div>";
  }
  function setJumlah(d, n) {
    d.jml_komentar = n;
    $$('[data-jkom="' + d.id + '"]').forEach(x => x.textContent = fmt(n));
    $("#km-judul").textContent = fmt(n) + " komentar";
  }
  function renderBawahKomentar() {
    const b = $("#km-bawah");
    if (!SESI.user) {
      b.innerHTML = '<div class="km-login"><span>Masuk untuk ikut berkomentar</span><div id="km-gbtn"></div><a href="#" id="km-email">Masuk atau daftar pakai email</a></div>';
      $("#km-email").onclick = e => { e.preventDefault(); komen.classList.remove("buka"); pindah("akun"); };
      if (typeof muatGoogle === "function") muatGoogle().then(() => {
        const g = $("#km-gbtn");
        if (g && g.isConnected) google.accounts.id.renderButton(g, { theme: "filled_black", size: "large", shape: "pill", text: "continue_with", width: 280 });
      }).catch(() => {});
      return;
    }
    b.innerHTML = '<form id="km-form" class="km-form">' + avatarHTML(SESI.user.nama, SESI.user.foto, "km-av") +
      '<input id="km-input" maxlength="300" placeholder="Tambahkan komentar..." autocomplete="off"><button class="km-kirim" type="submit">Kirim</button></form>';
    $("#km-form").onsubmit = async e => {
      e.preventDefault();
      const inp = $("#km-input"), isi = inp.value.trim();
      if (!isi || !komenD) return;
      const tb = $(".km-kirim"); tb.disabled = true;
      try {
        const j = await panggil("/api/komentar", { drama: komenD.id, isi });
        inp.value = "";
        const lst = $("#km-list");
        const kosong = $(".km-kosong", lst); if (kosong) kosong.remove();
        lst.insertAdjacentHTML("afterbegin", barisKomentar(j.komentar));
        setJumlah(komenD, (komenD.jml_komentar || 0) + 1);
      } catch (err) { toast(err.message); }
      tb.disabled = false;
    };
  }
  async function bukaKomentar(d) {
    if (!d) return;
    komenD = d;
    $("#km-judul").textContent = fmt(d.jml_komentar || 0) + " komentar";
    $("#km-list").innerHTML = '<p class="km-kosong">Memuat komentar...</p>';
    renderBawahKomentar();
    komen.classList.add("buka");
    try {
      const j = await panggil("/api/komentar?drama=" + d.id);
      if (komenD !== d) return;
      $("#km-list").innerHTML = j.komentar.length ? j.komentar.map(barisKomentar).join("") : '<p class="km-kosong">Belum ada komentar. Jadi yang pertama!</p>';
      setJumlah(d, j.total);
    } catch (e) { $("#km-list").innerHTML = '<p class="km-kosong">' + esc(e.message) + "</p>"; }
  }
  $("#km-x").onclick = () => komen.classList.remove("buka");
  komen.addEventListener("click", async e => {
    if (e.target === komen) { komen.classList.remove("buka"); return; }
    const h = e.target.closest("[data-hapus-km]");
    if (!h || !confirm("Hapus komentar ini?")) return;
    try {
      await panggil("/api/komentar/hapus", { id: Number(h.dataset.hapusKm) });
      const row = h.closest(".km-baris"); if (row) row.remove();
      setJumlah(komenD, Math.max(0, (komenD.jml_komentar || 1) - 1));
    } catch (err) { toast(err.message); }
  });

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
    const pr = Math.min(progres()[d.id] || 0, d.jml_ep || 0);
    return '<div class="dr-kartu" data-drama="' + d.id + '"><div class="dr-pst">' + sampulHTML(d) +
      (bolehVip() || d.gratis >= d.jml_ep ? "" : '<span class="dr-gembok">' + IK.gembok + "</span>") +
      (pr ? '<span class="dr-prog"><i style="width:' + Math.round(pr / d.jml_ep * 100) + '%"></i></span>' : "") +
      '</div><div class="dr-nama">' + esc(d.judul) + "</div>" +
      '<div class="dr-ket">' + (pr ? "Ep. " + pr + "/" + d.jml_ep : d.jml_ep + " episode") + "</div></div>";
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
    const lanjutNo = 1;
    const label = terkunci && !bolehEp(d, 1) ? "Buka semua " + d.jml_ep + " episode" : "Tonton Ep 1";
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
    if (fv && !e.target.closest("#feed") && !e.target.closest("#ep-player")) { toggleFav(cariDrama(fv.dataset.favDrama)); return; }
    if (e.target.closest("[data-perpanjang]")) bukaSheet(null);
  });
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
  function kecilkanFoto(file) {
    return new Promise((ok, gagal) => {
      const img = new Image();
      img.onload = () => {
        const S = 160, c = document.createElement("canvas");
        c.width = S; c.height = S;
        const m = Math.min(img.width, img.height);
        c.getContext("2d").drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, S, S);
        URL.revokeObjectURL(img.src);
        ok(c.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => gagal(new Error("Gambar tidak bisa dibaca"));
      img.src = URL.createObjectURL(file);
    });
  }
  const renderAkunFoto = renderAkun;
  renderAkun = function () {
    renderAkunFoto();
    const u = SESI.user, av = $("#page-akun .avatar");
    if (!u || !av) return;
    av.outerHTML = '<div class="akun-foto">' + avatarHTML(u.nama, u.foto, "akun-av") +
      '<label class="akun-ganti">📷<input type="file" accept="image/*" id="akun-file" hidden></label></div>';
    $("#akun-file").onchange = async e => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      try {
        toast("Mengunggah foto...");
        const data = await kecilkanFoto(f);
        const j = await panggil("/api/foto", { foto: data });
        setSesi(SESI.token, j.user);
        toast("Foto profil diperbarui");
        renderAkun();
      } catch (err) { toast(err.message); }
    };
  };
  if (halaman === "akun") renderAkun();
  let otpMundur = 0, otpTimer = null;
  function aturTombolOtp() {
    const b = $("#otp-kirim");
    if (!b) return;
    b.disabled = otpMundur > 0;
    b.textContent = otpMundur > 0 ? "Kirim ulang (" + otpMundur + ")" : "Kirim kode";
  }
  function mulaiMundur(detik) {
    otpMundur = detik;
    clearInterval(otpTimer);
    otpTimer = setInterval(() => {
      otpMundur--;
      if (otpMundur <= 0) { otpMundur = 0; clearInterval(otpTimer); }
      aturTombolOtp();
    }, 1000);
    aturTombolOtp();
  }
  const renderAkunOtp = renderAkun;
  renderAkun = function () {
    renderAkunOtp();
    const form = $("#form-auth");
    if (!form || !$("#a-nama") || $("#a-otp")) return;
    const kirim = form.querySelector("button[type=submit]");
    const baris = document.createElement("div");
    baris.className = "otp-baris";
    baris.innerHTML = '<input id="a-otp" inputmode="numeric" maxlength="6" placeholder="Kode OTP (6 angka)" autocomplete="one-time-code">' +
      '<button type="button" class="btn ghost otp-kirim" id="otp-kirim">Kirim kode</button>';
    const ket = document.createElement("p");
    ket.className = "muted otp-ket";
    ket.textContent = "Tekan \"Kirim kode\", lalu buka email kamu dan masukkan 6 angka. Cek juga folder Spam.";
    form.insertBefore(baris, kirim);
    form.insertBefore(ket, kirim);
    $("#a-otp").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6); });
    aturTombolOtp();
    $("#otp-kirim").onclick = async () => {
      const email = ($("#a-email").value || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast("Isi email yang benar dulu"); $("#a-email").focus(); return; }
      const b = $("#otp-kirim");
      b.disabled = true; b.textContent = "Mengirim...";
      try {
        await panggil("/api/otp/kirim", { email });
        toast("Kode dikirim ke " + email);
        mulaiMundur(60);
        $("#a-otp").focus();
      } catch (err) {
        toast(err.message);
        const m = /(\d+) detik/.exec(err.message);
        if (m) mulaiMundur(Number(m[1])); else aturTombolOtp();
      }
    };
  };
  if (typeof panggil === "function") {
    const panggilAsli = panggil;
    panggil = function (path, body) {
      if (path === "/api/daftar" && body && $("#a-otp")) body.otp = $("#a-otp").value.trim();
      return panggilAsli(path, body);
    };
  }
  if (halaman === "akun") renderAkun();

  function aturMode() {
    const home = halaman === "home";
    document.body.classList.toggle("mode-feed", home);
    if (home) lanjutFeed(); else jedaFeed();
  }
  const pindahAsli = pindah;
  pindah = function (n) {
    if (pemutar.classList.contains("buka")) { videoPemutar().forEach(lepasVideo); epAktif = -1; pemutar.classList.remove("buka"); }
    komen.classList.remove("buka");
    daftarEp.classList.remove("buka");
    sheet.classList.remove("buka");
    cari.classList.remove("buka");
    pindahAsli(n);
    aturMode();
  };
  const navVip = $('.bottom button[data-page="langganan"]');
  if (navVip) navVip.addEventListener("click", () => { detailId = 0; }, true);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { jedaFeed(); jedaPemutar(); } else if (pemutar.classList.contains("buka")) { const s = epSlides.find(x => Number(x.dataset.no) === epAktif); const v = s && s.querySelector("video"); if (v && !s.classList.contains("jeda")) v.play().catch(() => {}); } else lanjutFeed(); });

  const cariLama = $("#cari");
  if (cariLama) {
    cariLama.placeholder = "Cari drama...";
    cariLama.addEventListener("focus", e => { e.target.blur(); bukaCari(); });
  }

  document.addEventListener("touchmove", e => { if (e.touches && e.touches.length > 1) e.preventDefault(); }, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach(n => document.addEventListener(n, e => e.preventDefault(), { passive: false }));
  (function pasangViewport() {
    let m = document.querySelector('meta[name="viewport"]');
    if (!m) { m = document.createElement("meta"); m.name = "viewport"; document.head.appendChild(m); }
    m.content = "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
  })();

  document.addEventListener("contextmenu", e => {
    if (e.target.closest && e.target.closest("video, #feed, #ep-player")) e.preventDefault();
  }, true);
  new MutationObserver(() => {
    document.querySelectorAll("video:not([data-aman])").forEach(v => {
      v.setAttribute("data-aman", "1");
      v.setAttribute("controlslist", "nodownload noplaybackrate");
      v.setAttribute("disablepictureinpicture", "");
      v.setAttribute("disableremoteplayback", "");
    });
  }).observe(document.body, { childList: true, subtree: true });

  let adaPenjaga = false, waktuKeluar = 0;
  function pasangPenjaga() {
    if (adaPenjaga) return;
    try { history.pushState({ se: 1 }, "", location.href); adaPenjaga = true; } catch (e) {}
  }
  document.addEventListener("pointerdown", pasangPenjaga, true);
  function langkahMundur() {
    if (komen.classList.contains("buka")) { komen.classList.remove("buka"); return true; }
    if (daftarEp.classList.contains("buka")) { daftarEp.classList.remove("buka"); return true; }
    if (sheet.classList.contains("buka")) { tutupSheet(); return true; }
    if (cari.classList.contains("buka")) { cari.classList.remove("buka"); lanjutFeed(); return true; }
    if (pemutar.classList.contains("buka")) { tutupPemutar(); return true; }
    if (halaman === "langganan" && detailId) { detailId = 0; renderLangganan(); window.scrollTo({ top: 0 }); return true; }
    if (halaman !== "home") { pindah("home"); return true; }
    return false;
  }
  window.addEventListener("popstate", () => {
    adaPenjaga = false;
    if (langkahMundur()) { pasangPenjaga(); return; }
    if (Date.now() - waktuKeluar < 2000) { history.back(); return; }
    waktuKeluar = Date.now();
    if (typeof toast === "function") toast("Tekan kembali sekali lagi untuk keluar");
    pasangPenjaga();
  });

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
    renderFeed(true);
    const q = new URLSearchParams(location.search);
    const idBagi = Number(q.get("drama"));
    if (idBagi && cariDrama(idBagi)) {
      history.replaceState(null, "", location.pathname);
      bukaDetail(idBagi);
    } else if (halaman === "langganan") renderLangganan();
    if (halaman === "aktivitas") renderAktivitas();
    bukaJalanPintas(q.get("buka"));
  }

  function bukaJalanPintas(b) {
    if (!b) return;
    history.replaceState(null, "", location.pathname);
    if (b === "vip") return pindah("langganan");
    if (b === "cari") return bukaCari();
    if (b === "baru") { const t = $('.fd-tab button[data-tab="baru"]', feed); if (t) t.click(); return; }
    if (b === "lanjut") {
      const pr = progres(), wkt = sk("se_progres_waktu", {});
      const id = Object.keys(pr).filter(k => cariDrama(k)).sort((a, c) => (wkt[c] || 0) - (wkt[a] || 0))[0];
      if (id) bukaEpisode(cariDrama(id), pr[id] || 1);
      else pindah("aktivitas");
    }
  }

  aturMode();
  siapkanKunci();
  muatDrama();
})();
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
(function () {
  const list = document.getElementById("fd-list");
  if (!list) return;
  const hapus = () => list.querySelectorAll("video[poster]").forEach(v => v.removeAttribute("poster"));
  new MutationObserver(hapus).observe(list, { childList: true });
  hapus();
})();
(function () {
  const root = document.documentElement;
  const selesai = () => root.classList.add("sp-sudah");
  const mm = q => !!(window.matchMedia && matchMedia(q).matches);
  const aplikasi = mm("(display-mode: standalone)") || mm("(display-mode: fullscreen)") || mm("(display-mode: minimal-ui)") || navigator.standalone === true;
  const paksa = /[?&]sp=1/.test(location.search);         
  let muatUlang = false;
  try { const n = performance.getEntriesByType("navigation")[0]; muatUlang = !!n && n.type === "reload"; } catch (e) {}
  if (!paksa && (!aplikasi || muatUlang)) { selesai(); return; }

  const box = document.createElement("div");
  box.id = "sp-buka";
  box.innerHTML =
    '<div class="sp-rays"></div><canvas></canvas>' +
    '<div class="sp-ring"></div><div class="sp-ring r2"></div>' +
    '<div class="sp-logo"><img class="sp-cincin" alt="" src="pusaran-cincin.png"><img class="sp-tengah" alt="" src="pusaran-tengah.png"></div>' +
    '<div class="sp-judul"><div class="sp-kata">' +
    "SPESIAL".split("").map((c, i) => '<span style="--i:' + i + '" data-c="' + c + '">' + c + '</span>').join("") +
    '<div class="sp-flare"></div><div class="sp-aura"></div><div class="sp-orbit"></div><div class="sp-orbit o2"></div></div>' +
    '<div class="sp-edisi">' + "EDITION".split("").map((c, i) => '<span style="--j:' + i + '">' + c + '</span>').join("") + '</div>' +
    '<div class="sp-garis"><i></i><b></b><i></i></div><div class="sp-sub">NONTON TANPA BATAS</div></div>' +
    '<div class="sp-flash"></div><div class="sp-bar t"></div><div class="sp-bar u"></div>';
  const img = box.querySelector(".sp-cincin");
  img.onerror = () => { img.onerror = null; box.querySelector(".sp-logo").innerHTML = '<img alt="" src="icon-512.png" style="width:60%;margin:0 auto;border-radius:50%">'; };
  document.body.appendChild(box);
  selesai();

  const cv = box.querySelector("canvas"), ctx = cv.getContext("2d");
  let P = [], t0 = 0, raf = 0, W = 0, H = 0, cx = 0, cy = 0, meledak = false, tutup = false;
  const ukur = () => {
    const d = Math.min(2, window.devicePixelRatio || 1);
    W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0); cx = W / 2; cy = H * 0.44;
  };
  const acak = (a, b) => a + Math.random() * (b - a);
  const R = () => Math.min(W, H);
  const hisap = () => { const a = acak(0, 6.283), r = acak(R() * 0.55, R() * 0.95); P.push({ k: 0, a, r, v: acak(2.2, 4), s: acak(1, 2.4) }); };
  const ledak = () => { for (let i = 0; i < 90; i++) { const a = acak(0, 6.283), v = acak(2, 9); P.push({ k: 1, x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: acak(1, 3), l: 1 }); } };
  const bara = () => P.push({ k: 2, x: acak(0, W), y: H + 5, vy: acak(.4, 1.3), vx: acak(-.3, .3), s: acak(1, 2.6), l: 1, f: acak(0, 6) });

  let huruf = [], sudahH = [];
  const posHuruf = () => {
    huruf = [...box.querySelectorAll(".sp-kata span")].map(el => {
      const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    sudahH = [];
  };
  const percik = (x, y, n) => { for (let i = 0; i < n; i++) { const a = acak(0, 6.283), v = acak(1.5, 6); P.push({ k: 1, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, s: acak(.8, 2.2), l: 1 }); } };
  const petir = (x1, y1, x2, y2, w) => {
    ctx.strokeStyle = "rgba(255,225,245,.95)"; ctx.shadowColor = "#ff4f9a"; ctx.shadowBlur = 12; ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1, y1);
    for (let i = 1; i <= 8; i++) { const t = i / 8; ctx.lineTo(x1 + (x2 - x1) * t + (i < 8 ? acak(-9, 9) : 0), y1 + (y2 - y1) * t + (i < 8 ? acak(-9, 9) : 0)); }
    ctx.stroke(); ctx.shadowBlur = 0;
  };

  function gambar(t) {
    const e = (t - t0) / 1000;
    ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = "lighter";
    if (e < 1) {
      for (let i = 0; i < 6; i++) hisap();
      const rr = R() * 0.35 * e + 4, g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
      g.addColorStop(0, "rgba(255,194,224," + (0.9 * e) + ")"); g.addColorStop(1, "rgba(255,79,154,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr, 0, 7); ctx.fill();
    }
    if (e >= 1 && !meledak) { meledak = true; P = P.filter(p => p.k !== 0); ledak(); }
    if (e > 1.3 && e < 3.7 && Math.random() < 0.5) bara();
    for (let h = 0; h < huruf.length; h++) if (!sudahH[h] && e >= 1.65 + h * 0.08) { sudahH[h] = 1; percik(huruf[h].x, huruf[h].y, 22); }
    if (e > 2.1 && e < 3.6 && huruf.length && Math.random() < 0.18) {
      const A = huruf[0], Z = huruf[huruf.length - 1];
      petir(A.x - 30, A.y + acak(-25, 25), Z.x + 30, Z.y + acak(-25, 25), acak(1, 2.2));
    }
    for (let j = P.length - 1; j >= 0; j--) {
      const p = P[j];
      if (p.k === 0) {
        p.r -= p.v * (1 + (R() * 0.95 - p.r) / 60);
        if (p.r < 6) { P.splice(j, 1); continue; }
        ctx.strokeStyle = "rgba(255,150,205,.85)"; ctx.lineWidth = p.s; ctx.beginPath();
        ctx.moveTo(cx + Math.cos(p.a) * p.r, cy + Math.sin(p.a) * p.r);
        ctx.lineTo(cx + Math.cos(p.a) * (p.r + 14), cy + Math.sin(p.a) * (p.r + 14)); ctx.stroke();
      } else if (p.k === 1) {
        p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy = p.vy * .95 + .06; p.l -= .016;
        if (p.l <= 0) { P.splice(j, 1); continue; }
        ctx.fillStyle = "rgba(255," + (90 + Math.random() * 80 | 0) + ",210," + p.l + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill();
      } else {
        p.y -= p.vy; p.f += .05; p.x += p.vx + Math.sin(p.f) * .3; p.l -= .004;
        if (p.l <= 0 || p.y < -5) { P.splice(j, 1); continue; }
        ctx.fillStyle = "rgba(200,120,255," + (p.l * .8) + ")";
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 7); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = "source-over";
    if (!tutup) raf = requestAnimationFrame(gambar);
  }

  function akhiri() {
    if (tutup) return; tutup = true;
    box.classList.add("pergi");
    setTimeout(() => { cancelAnimationFrame(raf); box.remove(); }, 520);
  }

  ukur();
  box.classList.add("run");
  posHuruf();
  const pelan = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!pelan) raf = requestAnimationFrame(t => { t0 = t; gambar(t); });
  setTimeout(akhiri, pelan ? 900 : 3800);
  box.addEventListener("click", akhiri);       
  setTimeout(akhiri, 6500);                          
})();
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const garis = d => '<svg class="tm-ik" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  const IKON = {
    gem: garis('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3l3 18 3-18"/>'),
    api: garis('<path d="M12 3s5 4.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 1.5-4s.5 2.5 2.5 3c0-4 1-7 1-9z"/>'),
    cek: garis('<path d="m5 12 5 5 9-10"/>'),
    jam: garis('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    bintang: garis('<path d="M12 3l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6L3.3 9.2l6.1-.6z"/>'),
    struk: garis('<path d="M5 3h14v18l-2.3-1.5-2.4 1.5-2.3-1.5-2.3 1.5-2.4-1.5L5 21z"/><path d="M9 8h6M9 12h6M9 16h4"/>'),
    putar: garis('<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m10 8.5 5 3.5-5 3.5z"/>'),
    play: garis('<path d="M7 5v14l11-7z"/>'),
    bisu: garis('<path d="M4 9v6h4l5 4V5L8 9z"/><path d="m16.5 9.5 5 5m0-5-5 5"/>'),
    gembok: garis('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    pin: garis('<path d="M9 3h6l-1 6 3 3H7l3-3z"/><path d="M12 12v9"/>'),
    kamera: garis('<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'),
    unduh: garis('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
    film: garis('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M17 9h4M3 15h4M17 15h4"/>'),
    chat: garis('<path d="M4 5h16v11H9l-5 4z"/>'),
    sampah: garis('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    keluar: garis('<path d="M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"/>'),
    panah: garis('<path d="m9 6 6 6-6 6"/>')
  };
  const PETA = {
    "👑": "gem", "🔥": "api", "💎": "gem", "✅": "cek", "🕘": "jam", "⭐": "bintang", "🧾": "struk",
    "▶️": "putar", "▶": "play", "🔇": "bisu", "🔒": "gembok", "📌": "pin", "📷": "kamera", "📲": "unduh", "🎬": "film", "🎉": ""
  };
  const POLA = /(▶️|👑|🔥|💎|✅|🕘|⭐|🧾|▶|🔇|🔒|📌|📷|📲|🎬|🎉)\s?/;
  const POLA_G = new RegExp(POLA.source, "g");
  const LEWAT = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1 };

  function gantiTeks(t) {
    const p = t.parentNode;
    if (!p || LEWAT[p.nodeName] || !POLA.test(t.nodeValue)) return;
    if (p.classList && p.classList.contains("crown")) {
      p.innerHTML = '<img class="crown-img" alt="" src="ikon-192.png">';
      return;
    }
    const f = document.createDocumentFragment();
    let sisa = t.nodeValue, m;
    POLA_G.lastIndex = 0;
    let awal = 0;
    while ((m = POLA_G.exec(sisa))) {
      if (m.index > awal) f.appendChild(document.createTextNode(sisa.slice(awal, m.index)));
      const nama = PETA[m[1]];
      if (nama) {
        const s = document.createElement("span");
        s.className = "tm-wadah";
        s.innerHTML = IKON[nama];
        f.appendChild(s);
      }
      awal = m.index + m[0].length;
    }
    if (awal < sisa.length) f.appendChild(document.createTextNode(sisa.slice(awal)));
    p.replaceChild(f, t);
  }
  function sapu(akar) {
    if (!akar) return;
    if (akar.nodeType === 3) return gantiTeks(akar);
    if (akar.nodeType !== 1 || LEWAT[akar.nodeName]) return;
    const w = document.createTreeWalker(akar, NodeFilter.SHOW_TEXT);
    const kumpul = [];
    while (w.nextNode()) if (POLA.test(w.currentNode.nodeValue)) kumpul.push(w.currentNode);
    kumpul.forEach(gantiTeks);
  }
  sapu(document.body);
  new MutationObserver(ms => ms.forEach(m => {
    if (m.type === "characterData") gantiTeks(m.target);
    else m.addedNodes.forEach(sapu);
  })).observe(document.body, { childList: true, subtree: true, characterData: true });
  function bukaChat() {
    const b = $("#btn-chat");
    if (b) b.click();
  }
  function baris(ikon, teks, ekstra) {
    return '<span class="ak-ik">' + IKON[ikon] + '</span><span class="ak-tx">' + teks + "</span>" + (ekstra || "") +
      '<span class="ak-pn">' + IKON.panah + "</span>";
  }
  if (typeof renderAkun === "function") {
    const renderAkunSblm = renderAkun;
    renderAkun = function () {
      renderAkunSblm();
      const el = $("#page-akun");
      if (!el) return;
      const menu = $(".menu-akun", el);
      if (!menu) {
        if (!$("#ak-chat-tamu", el)) {
          const b = document.createElement("button");
          b.id = "ak-chat-tamu";
          b.className = "ak-row ak-tamu";
          b.innerHTML = baris("chat", "Live Chat", '<em class="ak-on">Online</em>');
          b.onclick = bukaChat;
          el.appendChild(b);
        }
        return;
      }
      menu.classList.add("ak-menu");
      const chat = document.createElement("button");
      chat.className = "ak-row";
      chat.innerHTML = baris("chat", "Live Chat", '<em class="ak-on">Online</em>');
      chat.onclick = bukaChat;
      menu.insertBefore(chat, menu.firstChild);
      const susun = [["#b-lang", "gem", "Kelola Langganan"], ["#akun-pasang", "unduh", "Install aplikasi"],
        ["#b-hapus", "sampah", "Hapus Riwayat Tonton"], ["#b-keluar", "keluar", "Keluar"]];
      susun.forEach(([sel, ik, teks]) => {
        const b = $(sel, el);
        if (!b) return;
        b.className = "ak-row" + (sel === "#b-keluar" ? " ak-merah" : "");
        b.innerHTML = baris(ik, teks);
        menu.appendChild(b);
      });
    };
    if (typeof halaman !== "undefined" && halaman === "akun") renderAkun();
  }
})();
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const garis = d => '<svg class="tm-ik" viewBox="0 0 24 24" aria-hidden="true">' + d + "</svg>";
  const IK = {
    kal: garis('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    lonceng: garis('<path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10.3 20a2 2 0 0 0 3.4 0"/>'),
    hp: garis('<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>'),
    cek: garis('<path d="m5 12 5 5 9-10"/>'),
    gem: garis('<path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18"/>'),
    kado: garis('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z"/>'),
    panah: garis('<path d="m9 6 6 6-6 6"/>')
  };
  const masuk = () => typeof SESI !== "undefined" && !!SESI.user;
  const getar = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
  const fmtN = n => (typeof fmt === "function" ? fmt(n) : String(n));
  document.addEventListener("click", e => {
    if (e.target.closest("[data-suka]")) return;
    if (e.target.closest("button, .fd-semua, .ak-row, .sh-pk, .ep-btn, a.btn")) getar(8);
  }, true);
  const hapusBadge = () => { try { navigator.clearAppBadge && navigator.clearAppBadge(); } catch (e) {} };
  hapusBadge();
  document.addEventListener("visibilitychange", () => { if (!document.hidden) hapusBadge(); });
  window.SE_SUKA = new Set();
  const segarSukaTombol = () => $$("[data-suka]").forEach(b => b.classList.toggle("on", window.SE_SUKA.has(Number(b.dataset.suka))));
  async function muatSuka() {
    window.SE_SUKA = new Set();
    if (masuk()) { try { const j = await panggil("/api/suka/saya"); window.SE_SUKA = new Set(j.ids || []); } catch (e) {} }
    segarSukaTombol();
  }
  document.addEventListener("click", async e => {
    const b = e.target.closest("[data-suka]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    if (!masuk()) { toast("Masuk dulu buat kasih suka"); return; }
    const id = Number(b.dataset.suka), jadi = !window.SE_SUKA.has(id);
    const span = $("[data-jsuka='" + id + "']");
    const lama = span ? Number(span.dataset.n || 0) : 0;
    jadi ? window.SE_SUKA.add(id) : window.SE_SUKA.delete(id);
    segarSukaTombol();
    $$("[data-suka='" + id + "']").forEach(x => { x.classList.remove("pop"); void x.offsetWidth; x.classList.add("pop"); });
    getar(jadi ? [12, 30, 12] : 8);
    try {
      const j = await panggil("/api/suka", { id });
      j.suka ? window.SE_SUKA.add(id) : window.SE_SUKA.delete(id);
      $$("[data-jsuka='" + id + "']").forEach(x => { x.textContent = fmtN(j.jml); x.dataset.n = j.jml; });
      if (window.SE_aturSuka) window.SE_aturSuka(id, j.jml);
    } catch (err) {
      jadi ? window.SE_SUKA.delete(id) : window.SE_SUKA.add(id);
      toast(err.message);
    }
    segarSukaTombol();
  }, true);
  new MutationObserver(() => {
    $$("[data-suka]:not([data-siap])").forEach(b => { b.dataset.siap = "1"; b.classList.toggle("on", window.SE_SUKA.has(Number(b.dataset.suka))); });
  }).observe(document.body, { childList: true, subtree: true });
  const halAbsen = document.createElement("section");
  halAbsen.id = "page-absen";
  halAbsen.className = "page";
  const main = $("main");
  if (main) main.appendChild(halAbsen);
  const nav = $(".bottom");
  if (nav && !$('[data-page="absen"]', nav)) {
    const b = document.createElement("button");
    b.dataset.page = "absen";
    b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2zm-2 7v11h14V9zm3 3h3v3H8z"/></svg>Absen';
    b.onclick = () => pindah("absen");
    nav.insertBefore(b, $('[data-page="aktivitas"]', nav) || $('[data-page="akun"]', nav));
  }
  let ABSEN = null;
  async function renderAbsen() {
    const el = halAbsen;
    if (!masuk()) {
      el.innerHTML = '<div class="ab-kosong">' + IK.kado + "<b>Absen Harian</b><p>Masuk dulu buat ambil koin harian dan VIP gratis di hari ke-7.</p>" +
        '<button class="btn" id="ab-masuk">Masuk / Daftar</button></div>';
      $("#ab-masuk").onclick = () => pindah("akun");
      return;
    }
    if (!ABSEN) el.innerHTML = '<p class="kosong">Memuat absen...</p>';
    try { ABSEN = await panggil("/api/absen"); } catch (e) { el.innerHTML = '<p class="kosong">' + e.message + "</p>"; return; }
    const a = ABSEN;
    const kotak = a.hadiah.map((h, i) => {
      const n = i + 1, ok = n <= a.hari, kini = !a.sudah && n === a.hari + 1;
      const isi = h === "vip" ? IK.gem + "<b>VIP 1 hari</b>" : (ok ? IK.cek : '<span class="koin">S</span>') + "<b>" + h + "</b>";
      return '<div class="ab-h' + (ok ? " ok" : "") + (kini ? " kini" : "") + (h === "vip" ? " ab-vip" : "") + '"><small>Hari ' + n + "</small>" + isi + "</div>";
    }).join("");
    const besok = a.hadiah[a.hari % 7];
    el.innerHTML =
      '<div class="sec-head"><h2>' + IK.kado + 'Absen Harian</h2><span class="ab-saldo"><span class="koin">S</span>' + a.koin + " koin</span></div>" +
      '<div class="ab-kartu"><p>Absen 7 hari berturut-turut, hari ke-7 dapat VIP 1 hari gratis. Bolong sehari, mulai lagi dari hari 1.</p>' +
      '<div class="ab-grid">' + kotak + "</div>" +
      (a.sudah ? '<button class="btn" disabled>Sudah absen hari ini · balik lagi besok</button>'
        : '<button class="btn" id="ab-ambil">' + (besok === "vip" ? "Ambil VIP 1 hari gratis" : "Ambil " + besok + " koin hari ini") + "</button>") + "</div>" +
      '<div class="sec-head"><h2>' + IK.gem + "Tukar Koin</h2></div>" +
      Object.keys(a.tukar).map(k => {
        const t = a.tukar[k];
        return '<div class="ab-tukar"><div><b>' + t.nama + '</b><small><span class="koin">S</span>' + t.harga + ' koin</small></div>' +
          '<button data-tukar="' + k + '"' + (a.koin < t.harga ? " disabled" : "") + ">Tukar</button></div>";
      }).join("");
    const amb = $("#ab-ambil");
    if (amb) amb.onclick = async () => {
      amb.disabled = true;
      try {
        const j = await panggil("/api/absen/ambil", {});
        if (j.user) setSesi(SESI.token, j.user);
        getar([15, 40, 15]);
        toast(j.dapat === "vip" ? "Selamat! VIP 1 hari aktif" : "+" + j.dapat + " koin");
        ABSEN = j; renderAbsen();
      } catch (e) { toast(e.message); amb.disabled = false; }
    };
    $$("[data-tukar]", el).forEach(b => b.onclick = async () => {
      b.disabled = true;
      try {
        const j = await panggil("/api/absen/tukar", { item: b.dataset.tukar });
        if (j.user) setSesi(SESI.token, j.user);
        toast("Berhasil, VIP kamu bertambah");
        ABSEN = j; renderAbsen();
      } catch (e) { toast(e.message); b.disabled = false; }
    });
  }
  if (typeof pindah === "function") {
    const pindahSblm = pindah;
    pindah = function (n) {
      pindahSblm(n);
      if (n === "absen") renderAbsen();
    };
  }
  const API_URL = typeof API !== "undefined" ? API : "https://vjjdeyyjinerila.xyz";
  const bisaNotif = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  const kunciUint8 = b => { const p = "=".repeat((4 - b.length % 4) % 4); const r = atob((b + p).replace(/-/g, "+").replace(/_/g, "/")); return Uint8Array.from(r, c => c.charCodeAt(0)); };
  async function langgananNotif() {
    if (!bisaNotif()) return null;
    const reg = await navigator.serviceWorker.ready;
    return reg.pushManager.getSubscription();
  }
  async function nyalakanNotif() {
    if (!bisaNotif()) throw new Error("HP ini belum mendukung notifikasi. Pasang aplikasinya dulu dari Chrome.");
    const izin = await Notification.requestPermission();
    if (izin !== "granted") throw new Error("Izin notifikasi ditolak. Buka pengaturan aplikasi buat mengizinkan.");
    const reg = await navigator.serviceWorker.ready;
    const k = await panggil("/api/notif/kunci");
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: kunciUint8(k.kunci) });
    await panggil("/api/notif/daftar", { sub: sub.toJSON() });
  }
  async function matikanNotif() {
    const sub = await langgananNotif();
    if (!sub) return;
    try { await panggil("/api/notif/hapus", { endpoint: sub.endpoint }); } catch (e) {}
    await sub.unsubscribe();
  }
  setTimeout(async () => {
    try { const s = await langgananNotif(); if (s && Notification.permission === "granted") await panggil("/api/notif/daftar", { sub: s.toJSON() }); } catch (e) {}
  }, 5000);
  const lembar = document.createElement("div");
  lembar.className = "sheet";
  lembar.id = "sheet-perangkat";
  document.body.appendChild(lembar);
  lembar.addEventListener("click", e => { if (e.target === lembar) lembar.classList.remove("buka"); });
  async function bukaPerangkat() {
    lembar.innerHTML = '<div class="sheet-isi"><div class="sh-head"><span class="sh-tile">' + IK.hp + '</span><div class="sh-judul"><h3>Perangkat masuk</h3></div><button class="sh-x" aria-label="Tutup">✕</button></div><p class="kosong">Memuat...</p></div>';
    lembar.classList.add("buka");
    $(".sh-x", lembar).onclick = () => lembar.classList.remove("buka");
    let j;
    try { j = await panggil("/api/perangkat"); } catch (e) { $(".kosong", lembar).textContent = e.message; return; }
    const tgl2 = t => new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    $(".kosong", lembar).outerHTML =
      '<p class="muted" style="margin:10px 0">Akun ' + (j.maks === 2 ? "VIP" : "biasa") + " bisa dipakai di " + j.maks + " HP. Masuk di HP baru otomatis mengeluarkan HP paling lama.</p>" +
      j.perangkat.map(p => '<div class="pr-baris"><span class="pr-ik">' + IK.hp + '</span><div><b>' + p.nama + "</b><small>Masuk " + tgl2(p.dibuat) + "</small></div>" +
        (p.ini ? '<em>HP ini</em>' : '<button data-keluarkan="' + p.id + '">Keluarkan</button>') + "</div>").join("");
    $$("[data-keluarkan]", lembar).forEach(b => b.onclick = async () => {
      b.disabled = true;
      try { await panggil("/api/perangkat/hapus", { id: b.dataset.keluarkan }); toast("Perangkat dikeluarkan"); bukaPerangkat(); renderAkun(); }
      catch (e) { toast(e.message); b.disabled = false; }
    });
  }
  const baris = (ik, teks, ekstra) => '<span class="ak-ik">' + ik + '</span><span class="ak-tx">' + teks + "</span>" + (ekstra || "") + '<span class="ak-pn">' + IK.panah + "</span>";
  if (typeof renderAkun === "function") {
    const renderAkunSblm = renderAkun;
    renderAkun = function () {
      renderAkunSblm();
      const menu = $("#page-akun .ak-menu");
      if (!menu) return;
      const sesudah = menu.firstChild ? menu.firstChild.nextSibling : null;
      const ab = document.createElement("button");
      ab.className = "ak-row";
      ab.innerHTML = baris(IK.kal, "Absen harian", '<em class="ak-nw" hidden>Ambil koin</em>');
      ab.onclick = () => pindah("absen");
      menu.insertBefore(ab, sesudah);
      panggil("/api/absen").then(a => { const em = $(".ak-nw", ab); if (em && !a.sudah) { em.hidden = false; em.textContent = "Ambil " + (a.hadiah[a.hari % 7] === "vip" ? "VIP" : a.hadiah[a.hari % 7] + " koin"); } }).catch(() => {});
      const nt = document.createElement("button");
      nt.className = "ak-row";
      nt.innerHTML = '<span class="ak-ik">' + IK.lonceng + '</span><span class="ak-tx">Notifikasi episode baru</span><span class="ak-sw"><i></i></span>';
      menu.insertBefore(nt, sesudah);
      const aturSw = on => nt.classList.toggle("on", !!on);
      langgananNotif().then(s => aturSw(s && Notification.permission === "granted")).catch(() => {});
      nt.onclick = async () => {
        const nyala = nt.classList.contains("on");
        nt.disabled = true;
        try {
          if (nyala) { await matikanNotif(); aturSw(false); toast("Notifikasi dimatikan"); }
          else { await nyalakanNotif(); aturSw(true); toast("Notifikasi nyala. Kamu dikabari tiap ada episode baru"); }
        } catch (e) { toast(e.message); }
        nt.disabled = false;
      };
      const pr = document.createElement("button");
      pr.className = "ak-row";
      pr.innerHTML = baris(IK.hp, "Perangkat masuk", '<em class="ak-jml"></em>');
      pr.onclick = bukaPerangkat;
      menu.insertBefore(pr, $("#b-keluar", menu) || null);
      panggil("/api/perangkat").then(j => { const em = $(".ak-jml", pr); if (em) em.textContent = j.perangkat.length + " dari " + j.maks; }).catch(() => {});
    };
    if (typeof halaman !== "undefined" && halaman === "akun") renderAkun();
  }
  if (typeof setSesi === "function") {
    const setSesiSblm = setSesi;
    let kunciLama = masuk() ? SESI.user.id : 0;
    setSesi = function (t, u) {
      setSesiSblm(t, u);
      const k = masuk() ? SESI.user.id : 0;
      if (k === kunciLama) return;
      kunciLama = k; ABSEN = null;
      muatSuka();
      if (typeof halaman !== "undefined" && halaman === "absen") renderAbsen();
    };
  }
  muatSuka();
})();
