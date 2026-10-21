// iklan-popunder.js
const KODE_POPUNDER = `
<script data-cfasync="false" src="https://abscloud.org/1/7dc0f51577c92b0e7166a7adf63b7a86"></script>
`;

function muatPopunder() {
  if (typeof aktif === "function" && aktif()) return; // VIP: tanpa iklan

  const wadah = document.createElement("div");
  wadah.innerHTML = KODE_POPUNDER;

  wadah.querySelectorAll("script").forEach(lama => {
    const baru = document.createElement("script");
    [...lama.attributes].forEach(a => baru.setAttribute(a.name, a.value));
    baru.textContent = lama.textContent;
    document.body.appendChild(baru);
  });
}

document.addEventListener("DOMContentLoaded", muatPopunder);
