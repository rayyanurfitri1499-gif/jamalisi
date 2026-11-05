// GANTI dengan nomor WA admin kamu (format 62)
const NOMOR_ADMIN = "6281234567890";

const data = {
  ml: { nama:"Mobile Legends", ic:"⚔️", zone:true, item:[
    ["86 Diamond",22000],["172 Diamond",44000],["257 Diamond",65000],
    ["344 Diamond",87000],["514 Diamond",130000],["706 Diamond",175000],
    ["Weekly Pass",28000],["Twilight Pass",145000]]},
  ff: { nama:"Free Fire", ic:"🔥", zone:false, item:[
    ["70 Diamond",10000],["140 Diamond",20000],["355 Diamond",50000],
    ["720 Diamond",100000],["Member Mingguan",30000],["Member Bulanan",90000]]},
  pubg:{ nama:"PUBG Mobile", ic:"🎯", zone:false, item:[
    ["60 UC",15000],["325 UC",75000],["660 UC",150000],["1800 UC",375000]]}
};

const bayar = [
  ["QRIS","Semua e-wallet & m-banking",0],
  ["DANA","Biaya Rp1.000",1000],
  ["GoPay","Biaya Rp1.000",1000],
  ["OVO","Biaya Rp1.000",1000],
  ["Virtual Account BCA","Biaya Rp4.000",4000]
];

let pilih = { game:"ml", item:null, bayar:null };
const rp = n => "Rp" + n.toLocaleString("id-ID");
const $ = id => document.getElementById(id);

function tampilGame(){
  $("games").innerHTML = Object.keys(data).map(k =>
    `<div class="game ${pilih.game===k?'aktif':''}" onclick="gantiGame('${k}')">
      <div class="ic">${data[k].ic}</div><p>${data[k].nama}</p></div>`).join("");
}

function tampilItem(){
  $("nominal").innerHTML = data[pilih.game].item.map((it,i) =>
    `<div class="item ${pilih.item===i?'aktif':''}" onclick="pilihItem(${i})">
      <b>💎 ${it[0]}</b><small>${rp(it[1])}</small></div>`).join("");
}

function tampilBayar(){
  $("pay").innerHTML = bayar.map((b,i) =>
    `<div class="met ${pilih.bayar===i?'aktif':''}" onclick="pilihBayar(${i})">
      <div>${b[0]}<br><span>${b[1]}</span></div></div>`).join("");
}
function totalHarga(){
  if(pilih.item===null) return 0;
  let t = data[pilih.game].item[pilih.item][1];
  if(pilih.bayar!==null) t += bayar[pilih.bayar][2];
  return t;
}
function hitung(){ $("total").textContent = rp(totalHarga()); }

function gantiGame(k){
  pilih.game = k; pilih.item = null;
  $("zoneId").style.display = data[k].zone ? "block" : "none";
  $("hint").textContent = data[k].zone ? "Contoh: 12345678 (1234)" : "Contoh: 123456789";
  tampilGame(); tampilItem(); hitung();
}
function pilihItem(i){ pilih.item = i; tampilItem(); hitung(); }
function pilihBayar(i){ pilih.bayar = i; tampilBayar(); hitung(); }

$("beli").onclick = () => {
  const g = data[pilih.game];
  const uid = $("userId").value.trim();
  const zid = $("zoneId").value.trim();
  const wa = $("wa").value.trim();
  if(!uid) return alert("Isi User ID dulu");
  if(g.zone && !zid) return alert("Isi Zone ID dulu");
  if(pilih.item===null) return alert("Pilih nominal dulu");
  if(pilih.bayar===null) return alert("Pilih pembayaran dulu");
  if(wa.length < 10) return alert("Isi nomor WhatsApp yang benar");

  $("ringkasan").innerHTML = `
    <p><span>Game</span><b>${g.nama}</b></p>
    <p><span>ID</span><b>${uid}${g.zone ? " ("+zid+")" : ""}</b></p>
    <p><span>Item</span><b>${g.item[pilih.item][0]}</b></p>
    <p><span>Pembayaran</span><b>${bayar[pilih.bayar][0]}</b></p>
    <p><span>Total</span><b>${rp(totalHarga())}</b></p>`;
  $("modal").classList.add("buka");
};

$("batal").onclick = () => $("modal").classList.remove("buka");

$("lanjut").onclick = () => {
  // Sementara kirim pesanan ke WA admin.
  // Nanti diganti ke pembayaran DOKU.
  const teks = $("ringkasan").innerText.replace(/\n+/g, "\n");
  const pesan = "Halo admin, saya mau top up:\n" + teks + "\nWA: " + $("wa").value;
  window.open("https://wa.me/" + NOMOR_ADMIN + "?text=" + encodeURIComponent(pesan));
};

tampilGame(); tampilItem(); tampilBayar(); hitung();
