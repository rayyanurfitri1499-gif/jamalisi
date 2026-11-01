const PENGATURAN = {
  smartlinkUtama: "https://uplcm.com/4/11563571",

  logo:      "https://uplcm.com/4/11563571",
  aplikasi:  "https://uplcm.com/4/11563571",
  telegram:  "https://t.me/spesialedition",

  smartlinkPlay: "https://uplcm.com/4/11563571",
  jumlahKlikPlay: 1,

  
  jedaIklanDetik: 15,

  bukaTabBaru: false,

  episode: [
    {
      judul: "PERISAI PANTANG MENYERAH",
      deskripsi: "Deskripsi singkat episode 1",
      label: "TRENDING #1",
      durasi: "02:15",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793026933527.mp4",
      poster: "",
      smartlink: "https://asiaso.org/4/5b2ebc879d26c5fdc3cfc191cfe9aaba"
    },
    {
      judul: "TABIB AJAIB",
      deskripsi: "Deskripsi singkat episode 2",
      label: "BARU RILIS",
      durasi: "01:48",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793026993304.mp4",
      poster: "",
      smartlink: "https://asiaso.org/4/5b2ebc879d26c5fdc3cfc191cfe9aaba"
    },
    {
      judul: "TERLAHIR UNTUK MENGUASAI",
      deskripsi: "Deskripsi singkat episode 3",
      label: "PALING DITONTON",
      durasi: "02:30",
      video: "https://pub-90b5435915404f77b08fdbcb2b3ca36d.r2.dev/ssstik.io_1793029459677.mp4",
      poster: "",
      smartlink: "https://asiaso.org/4/5b2ebc879d26c5fdc3cfc191cfe9aaba"
    }
  ]
};

(function () {
  const P = PENGATURAN;
  const $ = (id) => document.getElementById(id);
  const layar = document.querySelector(".layar");
  const video = $("video");
  const tombolPlay = $("tombolPlay");
  const tombolSuara = $("tombolSuara");
  const tombolEp = document.querySelectorAll(".ep");

  function bacaHash() {
    const m = location.hash.match(/^#(ep|putar)-(\d+)(?:-(\d+))?$/);
    return m ? { jenis: m[1], ep: Number(m[2]), detik: Number(m[3] || 0) } : null;
  }
  function tulisHash(h) {
    try { history.replaceState(null, "", h ? "#" + h : location.pathname + location.search); } catch (e) {}
  }

  const klik = {};

  const link = (u) => (u && u.trim()) ? u.trim() : P.smartlinkUtama;

  function buka(url) {
    if (!url) return;
    if (P.bukaTabBaru) {
      const w = window.open(url, "_blank");
      if (!w) location.href = url;
    } else {
      location.href = url;
    }
  }

  function pasangLink(id, url) {
    const el = $(id);
    el.href = link(url);
    if (P.bukaTabBaru) { el.target = "_blank"; el.rel = "noopener"; }
  }
  pasangLink("linkLogo", P.logo);
  pasangLink("linkAplikasi", P.aplikasi);
  pasangLink("linkTelegram", P.telegram);

  const awal = bacaHash();
  let ep = (awal && P.episode[awal.ep]) ? awal.ep : 0;

  function tampilkanEpisode(i) {
    const d = P.episode[i];
    ep = i;
    $("judul").textContent = d.judul;
    $("deskripsi").textContent = d.deskripsi;
    $("label").textContent = d.label;
    $("durasi").textContent = d.durasi;
    document.title = d.judul;

    hentikanVideo();
    if (d.poster) {
      layar.style.backgroundImage = "url('" + d.poster + "')";
      layar.classList.add("ada-poster");
      video.poster = d.poster;
    } else {
      layar.style.backgroundImage = "";
      layar.classList.remove("ada-poster");
      video.removeAttribute("poster");
      
      video.muted = true;
      video.preload = "auto";
      video.src = d.video + "#t=0.1";
      video.style.display = "block";
      video.style.opacity = "1";
      video.style.visibility = "visible";
      
      video.addEventListener("loadeddata", () => {
        if (layar.classList.contains("main")) return;
        video.play().then(() => {
          if (!layar.classList.contains("main")) video.pause();
        }).catch(() => {});
      }, { once: true });
    }
    tombolEp.forEach((b, k) => b.classList.toggle("aktif", k === i));
  }

  
  function tambahRiwayat(h) {
    try { history.pushState(null, "", "#" + h); } catch (e) {}
  }

  tombolEp.forEach((b, k) => {
    b.addEventListener("click", () => {
      const lama = ep;
      tampilkanEpisode(k);
      if (k !== lama) tambahRiwayat("ep-" + k);
      else tulisHash("ep-" + k);
      buka(link(P.episode[k].smartlink));
    });
  });

  function hentikanVideo() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.controls = false;
    layar.classList.remove("main");
    tombolSuara.hidden = true;
  }

  function putarVideo(mulai) {
    const d = P.episode[ep];
    if (video.getAttribute("src") !== d.video) video.src = d.video;
    
    if (mulai > 0) {
      const lompat = () => { try { video.currentTime = mulai; } catch (e) {} };
      if (video.readyState >= 1) lompat();
      else video.addEventListener("loadedmetadata", lompat, { once: true });
    }
    detikTonton = 0;
    waktuTerakhir = mulai || 0;
    layar.classList.add("main");
    video.controls = true;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      tombolSuara.hidden = false;
      video.play().catch(() => {
        layar.classList.remove("main");
        video.controls = false;
      });
    });
  }

  
  let detikTonton = 0;
  let waktuTerakhir = 0;
  video.addEventListener("timeupdate", () => {
    if (!layar.classList.contains("main")) return;
    const t = video.currentTime;
    const selisih = t - waktuTerakhir;
    waktuTerakhir = t;
    if (selisih > 0 && selisih < 2) detikTonton += selisih;
    const jeda = Number(P.jedaIklanDetik) || 0;
    if (jeda > 0 && detikTonton >= jeda) {
      detikTonton = 0;
      video.pause();
      tulisHash("putar-" + ep + "-" + Math.floor(t));
      buka(link(P.episode[ep].smartlink || P.smartlinkPlay));
    }
  });

  tombolSuara.addEventListener("click", () => {
    video.muted = false;
    tombolSuara.hidden = true;
    video.play().catch(() => {});
  });

  tombolPlay.addEventListener("click", () => {
    const sudah = klik[ep] || 0;
    const target = Math.max(0, Number(P.jumlahKlikPlay) || 0);

    if (sudah < target) {
      klik[ep] = sudah + 1;
      if (sudah + 1 >= target) tulisHash("putar-" + ep);
      buka(link(P.episode[ep].smartlink || P.smartlinkPlay));
      return;
    }
    putarVideo();
  });

  function cekKembali() {
    const h = bacaHash();
    if (h && h.jenis === "putar" && h.ep === ep) {
      tulisHash("ep-" + ep);
      putarVideo(h.detik);
    }
  }

  function ikutiRiwayat() {
    const h = bacaHash();
    if (h && h.jenis === "putar") { cekKembali(); return; }
    const i = (h && P.episode[h.ep]) ? h.ep : 0;
    if (i !== ep) tampilkanEpisode(i);
  }
  window.addEventListener("popstate", ikutiRiwayat);

  window.addEventListener("pageshow", cekKembali);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") cekKembali();
  });

  $("tombolSuka").addEventListener("click", (e) => e.currentTarget.classList.toggle("aktif"));
  $("tombolBagikan").addEventListener("click", () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) navigator.share(data).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(() => alert("Link disalin"));
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((list) => {
      list.forEach((x) => x.target.classList.toggle("diam", !x.isIntersecting));
    });
    document.querySelectorAll(".bingkai, .atas, .tombol-bawah").forEach((el) => io.observe(el));
  }

  tampilkanEpisode(ep);
  cekKembali();
})();
