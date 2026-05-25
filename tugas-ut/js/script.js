/* FUNCTION LOGIN */
function login(){

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  let user = dataPengguna.find(function(item){

    return item.email === email &&
           item.password === password;

  });

  /* BERHASIL */
  if(user){

    showPopup(
      "success",
      "Login Berhasil",
      "Selamat datang " + user.nama
    );

  }

  /* GAGAL */
  else{

    showPopup(
      "error",
      "Login Gagal",
      "Email atau password salah"
    );

  }

}

/* POPUP */
function showPopup(type, title, message){

  let popup = document.getElementById("popupLogin");
  let icon = document.getElementById("popupIcon");

  popup.style.display = "flex";

  document.getElementById("popupTitle").innerHTML = title;
  document.getElementById("popupMessage").innerHTML = message;

  if(type === "success"){

    icon.innerHTML = "✓";
    icon.className = "popup-icon popup-success";

    document.getElementById("popupButton").innerHTML = "Lanjutkan";

    document.getElementById("popupButton").onclick = function(){

      window.location.href = "dashboard.html";

    };

  }

  else{

    icon.innerHTML = "✕";
    icon.className = "popup-icon popup-error";

    document.getElementById("popupButton").innerHTML = "OK";

    document.getElementById("popupButton").onclick = function(){

      popup.style.display = "none";

    };

  }

}

function togglePass(){
  let pass = document.getElementById("password");
  pass.type = pass.type === "password" ? "text" : "password";
}

let emailInput = document.getElementById("email");

if(emailInput){
  emailInput.addEventListener("input", function(){
    this.style.borderColor =
      this.value.includes("@") ? "green" : "red";
  });
}



// ================= MODAL =================
function openModal(id){
  document.getElementById(id).style.display = "flex";
}

function closeModal(id){
  document.getElementById(id).style.display = "none";
}

function kirimLupaPassword(){
  let email = document.getElementById("emailLupa").value;

  if(email === ""){
    alert("Email tidak boleh kosong!");
    return;
  }

  if(!email.includes("@")){
    alert("Format email tidak valid!");
    return;
  }

  alert("Link reset password dikirim ke: " + email);

  document.getElementById("emailLupa").value = "";

  closeModal("lupaModal");
}
function go(page){
  window.location = page;
}


// DASHBOARD

// DARK MODE
function toggleDarkMode(){
  document.body.classList.toggle("dark");
}

//GREETING
function setGreeting(){

  let greeting = document.getElementById("greeting");

  let jam = new Date().getHours();

  let teks = "";

  if(jam < 12){
    teks = "Selamat Pagi 👋";
  }

  else if(jam < 18){
    teks = "Selamat Siang ☀️";
  }

  else{
    teks = "Selamat Malam 🌙";
  }

  greeting.innerHTML = teks;

}

function closePopup(){

  document.getElementById("popupLogin")
    .style.display = "none";

}

// NOTIF
function showNotif(){
  alert("Tidak ada notifikasi");
}


// ================= TRACKING =================
function cariData() {
  let no = document.getElementById("resi").value;
  let hasil = document.getElementById("hasil");

  let data = dataTracking[no];

  if (data) {
    let perjalananHTML = data.perjalanan.map(p => `
      <li>
        <b>${p.waktu}</b><br>
        ${p.keterangan}
      </li>
    `).join("");

    hasil.innerHTML = `
      <h3>Detail Pengiriman</h3>
      <p><b>Nama:</b> ${data.nama}</p>
      <p><b>Status:</b> ${data.status}</p>
      <p><b>Ekspedisi:</b> ${data.ekspedisi}</p>
      <p><b>Tanggal Kirim:</b> ${data.tanggalKirim}</p>
      <p><b>Total:</b> ${data.total}</p>

      <h4>Riwayat Perjalanan:</h4>
      <ul>${perjalananHTML}</ul>
    `;
  } else {
    hasil.innerHTML = "<p>Data tidak ditemukan</p>";
  }
}

// ================= STOK =================
function loadTable(){

  let tableBody =
    document.getElementById("tableBody");

  tableBody.innerHTML = "";

  dataBahanAjar.forEach(function(data){

    let row = tableBody.insertRow();

    /* COVER */
    row.insertCell(0).innerHTML = `
      <img 
        src="${data.cover}"
        class="cover-img clickable"
      >
    `;

    /* KODE */
    row.insertCell(1).innerHTML = `
      <span class="clickable">
        ${data.kodeBarang}
      </span>
    `;

    /* NAMA */
    row.insertCell(2).innerHTML = `
      <span class="clickable">
        ${data.namaBarang}
      </span>
    `;

    /* STOK */
    row.insertCell(3).innerText =
      data.stok;

    /* CLICK EVENT */
    row.cells[0].onclick = function(){
      showDetail(data);
    };

    row.cells[1].onclick = function(){
      showDetail(data);
    };

    row.cells[2].onclick = function(){
      showDetail(data);
    };

  });

}

function searchData() {

  let input = document
    .getElementById("searchInput")
    .value
    .toLowerCase();

  let table = document.getElementById("tableBody");

  let rows = table.getElementsByTagName("tr");

  for(let i = 0; i < rows.length; i++) {

    let kode = rows[i]
      .cells[1]
      .innerText
      .toLowerCase();

    let nama = rows[i]
      .cells[2]
      .innerText
      .toLowerCase();

    if(
      kode.includes(input) ||
      nama.includes(input)
    ){
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }

  }
}

function showDetail(data){

  let popup =
    document.getElementById("detailPopup");

  popup.style.display = "flex";

  // ISI DATA
  document.getElementById("detailCover").src =
    data.cover;

  document.getElementById("detailNama").innerText =
    data.namaBarang;

  document.getElementById("detailKode").innerText =
    data.kodeBarang;

  document.getElementById("detailLokasi").innerText =
    data.kodeLokasi;

  document.getElementById("detailJenis").innerText =
    data.jenisBarang;

  document.getElementById("detailEdisi").innerText =
    data.edisi;

  document.getElementById("detailStok").innerText =
    data.stok;

}

function closeDetail(){

  document.getElementById("detailPopup")
    .style.display = "none";

}

function tambahData(){

  let kode =
    document.getElementById("kode").value;

  let nama =
    document.getElementById("nama").value;

  let stok =
    document.getElementById("stok").value;

  let coverFile =
    document.getElementById("cover").files[0];

  // VALIDASI
  if(!kode || !nama || !stok || !coverFile){

    alert("Lengkapi semua data!");

    return;

  }

  // BACA GAMBAR
  let reader = new FileReader();

  reader.onload = function(e){

    let gambar = e.target.result;

    // TAMBAH DATA
    dataBahanAjar.push({

      kodeLokasi: "NEW01",
      kodeBarang: kode,
      namaBarang: nama,
      jenisBarang: "BMP",
      edisi: "1",
      stok: stok,
      cover: gambar

    });

    // RELOAD TABEL
    loadTable();

    // RESET INPUT
    document.getElementById("kode").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("stok").value = "";
    document.getElementById("cover").value = "";

  };

  reader.readAsDataURL(coverFile);

}




const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const menuToggler = document.querySelector(".menu-toggler");

if(sidebar && sidebarToggler && menuToggler){

  sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  const toggleMenu = (isMenuActive) => {
    sidebar.style.height = isMenuActive
      ? `${sidebar.scrollHeight}px`
      : collapsedSidebarHeight;

    menuToggler.querySelector("span").innerText =
      isMenuActive ? "close" : "menu";
  }

  menuToggler.addEventListener("click", () => {
    toggleMenu(sidebar.classList.toggle("menu-active"));
  });

}

// Ensure these heights match the CSS sidebar height values
let collapsedSidebarHeight = "56px"; // Height in mobile view (collapsed)
let fullSidebarHeight = "calc(100vh - 32px)"; // Height in larger screen
// Toggle sidebar's collapsed state
sidebarToggler.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
// Update sidebar height and menu toggle text
const toggleMenu = (isMenuActive) => {
  sidebar.style.height = isMenuActive ? `${sidebar.scrollHeight}px` : collapsedSidebarHeight;
  menuToggler.querySelector("span").innerText = isMenuActive ? "close" : "menu";
}
// Toggle menu-active class and adjust height
menuToggler.addEventListener("click", () => {
  toggleMenu(sidebar.classList.toggle("menu-active"));
});
// (Optional code): Adjust sidebar height on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth >= 1024) {
    sidebar.style.height = fullSidebarHeight;
  } else {
    sidebar.classList.remove("collapsed");
    sidebar.style.height = "auto";
    toggleMenu(sidebar.classList.contains("menu-active"));
  }
});

/* =========================
   LOGOUT
========================= */

function logout(){

  let konfirmasi =
    confirm("Yakin ingin logout?");

  if(konfirmasi){

    window.location.href = "login.html";

  }

}


function toggleSubmenu(){
  let sub = document.getElementById("submenuLaporan");
  let parent = sub.parentElement;

  sub.classList.toggle("show");
  parent.classList.toggle("active");
}


// OPEN MODAL
function openModal2(){
  document.getElementById("devModal").style.display = "flex";
}

// CLOSE MODAL
function closeModal2(){
  document.getElementById("devModal").style.display = "none";
}

// CLICK OUTSIDE MODAL
window.onclick = function(event){
  let modal = document.getElementById("devModal");
  if(event.target == modal){
    modal.style.display = "none";
  }
}

// ALERT MENU "LAPORAN" & "HISTORI"
document.addEventListener("DOMContentLoaded", function(){

  // Laporan (parent menu)
  let laporan = document.querySelector(".has-submenu .nav-link");
  if(laporan){
    laporan.addEventListener("click", function(){
      openModal2();
    });
  }

  // Histori
  let histori = document.querySelectorAll(".nav-item a")[3]; 
  if(histori){
    histori.addEventListener("click", function(e){
      e.preventDefault();
      openModal2();
    });
  }

  // Submenu laporan juga kena popup
  let submenuLaporan = document.querySelectorAll("#submenuLaporan li a");
  submenuLaporan.forEach(item=>{
    item.addEventListener("click", function(e){
      e.preventDefault();
      openModal2();
    });
  });

});

document.addEventListener("DOMContentLoaded", function(){

  // LOAD TABLE
  if(document.getElementById("tableBody")){
    loadTable();
  }

  // GREETING
  if(document.getElementById("greeting")){
    setGreeting();
  }

});


// CARI RESI
function cariResi(){
  let resi = document.getElementById("resi").value;
  let data = dataTracking[resi];
  let hasil = document.getElementById("hasil");

  if(!data){
    hasil.innerHTML = "<p style='color:red'>Data tidak ditemukan</p>";
    return;
  }

  let perjalananHTML = "";

  data.perjalanan.forEach(p=>{
    perjalananHTML += `
    <div class="timeline-item">

      <div class="timeline-left">
        <div class="dot"></div>
        <div class="ket">${formatKeterangan(p.keterangan)}</div>
      </div>

      <div class="timeline-right">
        ${p.waktu}
      </div>

    </div>
    `;
  });

  hasil.innerHTML = `
  <div class="card-hasil">

    <div class="row">
      <div class="label">Nama</div>
      <div class="value">${data.nama}</div>
    </div>

    <div class="row">
      <div class="label">No DO</div>
      <div class="value">${data.nomorDO}</div>
    </div>

    <div class="row">
      <div class="label">Status</div>
      <div class="value">${data.status}</div>
    </div>

    <div class="row">
      <div class="label">Ekspedisi</div>
      <div class="value">${data.ekspedisi}</div>
    </div>

    <div class="row">
      <div class="label">Tanggal Kirim</div>
      <div class="value">${data.tanggalKirim}</div>
    </div>

    <div class="row">
      <div class="label">Total</div>
      <div class="value">${data.total}</div>
    </div>

  </div>

  <h3 style="margin-top:20px;">Perjalanan Paket</h3>

  <div class="timeline">
    ${perjalananHTML}
  </div>
  `;
}

// FORMAT TEKS
function formatKeterangan(text){
  if(text.includes("Pengirim")){
    let parts = text.split("Pengirim:");
    return `
      <b>${parts[0]}</b><br>
      <span style="font-size:12px;color:#ccc;">Pengirim: ${parts[1]}</span>
    `;
  }
  return text;
}