const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            // Data dari dataBahanAjar.js
            upbjjList: dataBahanAjar.upbjjList,
            kategoriList: dataBahanAjar.kategoriList,
            stok: dataBahanAjar.stok,

            // Reactive state untuk filter, sort, dan tampilan tabel
            selectedUpbjj: "",
            selectedKategori: "",
            isSafety: false,
            sortBy: "",

            // Data untuk form tambah stok
            newData: {
                kode: "",
                judul: "",
                kategori: "",
                upbjj: "",
                lokasiRak: "",
                harga: 0,
                stok: 0,
                catatanHTML: ""
            }
        };
    },
    computed: {
        // untuk memfilter upbjj terlebih dahulu sebelum menampilkan kategori
        kategoriListFiltered() {
            if (!this.selectedUpbjj) return [];
            // ambil kategori unik yang hanya muncul di stok dengan UPBJJ yang dipilih
            const filtered = this.stok
                .filter(item => item.upbjj === this.selectedUpbjj)
                .map(item => item.kategori);
            return [...new Set(filtered)]; // hilangkan duplikat
        },

        // utk menampilkan data yg sudah difilter
        filteredData() {
            let data = [...this.stok];

            // filter UPBJJ
            if (this.selectedUpbjj)
                data = data.filter(i => i.upbjj === this.selectedUpbjj);

            // filter kategori (jika dipilih)
            if (this.selectedKategori)
                data = data.filter(i => i.kategori === this.selectedKategori);

            // filter stok menipis / kosong
            if (this.isSafety)
                data = data.filter(i => i.qty <= i.safety || i.qty === 0);

            // sorting
            if (this.sortBy === "judul")
                data.sort((a, b) => a.judul.localeCompare(b.judul));
            else if (this.sortBy === "qty")
                data.sort((a, b) => a.qty - b.qty);
            else if (this.sortBy === "harga")
                data.sort((a, b) => a.harga - b.harga);

            return data;
        }
    },
    methods: {
        // reset filter
        resetFilter() {
            this.selectedUpbjj = "";
            this.selectedKategori = "";
            this.isSafety = false;
            this.sortBy = "";
        },
        statusText(item){

   const qty = Number(item.qty);

   if(qty === 0){
      return "Kosong";
   } 
   else if(qty <= 10){
      return "Menipis";
   } 
   else{
      return "Tersedia";
   }
},


statusKelas(item){

   const qty = Number(item.qty);

   if(qty === 0){
      return "danger";
   } 
   else if(qty <= 10){
      return "warning";
   } 
   else{
      return "success";
   }
},

// ====== DETAIL ITEM ======
showDetail(item){

Swal.fire({

    width: 850,

    background:"#f8fafc",

    confirmButtonText:"Tutup",

    confirmButtonColor:"#2563eb",

    html:`

    <div class="detail-popup">

        <!-- HEADER -->
        <div class="detail-header">

            <div>

                <h2>${item.judul}</h2>

                <p class="detail-code">
                    ${item.kode}
                </p>

            </div>

            <div class="${this.statusKelas(item)} detail-badge">

    ${this.statusText(item)}

</div>

        </div>

        <!-- GRID -->
        <div class="detail-grid">

            <div class="detail-card">
                <label>Kategori</label>
                <p>${item.kategori}</p>
            </div>

            <div class="detail-card">
                <label>UPBJJ</label>
                <p>${item.upbjj}</p>
            </div>

            <div class="detail-card">
                <label>Lokasi Rak</label>
                <p>${item.lokasiRak}</p>
            </div>

            <div class="detail-card">
                <label>Harga</label>
                <p>
                    Rp ${item.harga.toLocaleString('id-ID')}
                </p>
            </div>

            <div class="detail-card">
                <label>Jumlah Stok</label>
                <p>${item.qty}</p>
            </div>

            <div class="detail-card">
                <label>Safety Stock</label>
                <p>${item.safety}</p>
            </div>

        </div>

        <!-- CATATAN -->
        <div class="detail-note">

            <h4>Catatan Tambahan</h4>

            <div class="note-content">
                ${item.catatanHTML}
            </div>

        </div>

    </div>

    `

});

},
        // ====== ADD ITEM ======
        async openAddModal() {
            const upbjjOptions = this.upbjjList.map(
                (u) => `<option value="${u}">${u}</option>`
            ).join("");

            const kategoriOptions = this.kategoriList.map(
                (k) => `<option value="${k}">${k}</option>`
            ).join("");

            const { value: formValues } = await Swal.fire({
                title: 'Tambah Bahan Ajar',
                width: 600,
                html: `
          <input id="kode" class="swal2-input" placeholder="Kode">
          <input id="judul" class="swal2-input" placeholder="Judul">
          <select id="kategori" class="swal2-select">
                <option value="">Pilih Kategori</option>${kategoriOptions}
            </select>
            <select id="upbjj" class="swal2-select">
                <option value="">Pilih Kategori</option>${upbjjOptions}
            </select>
          <input id="lokasiRak" class="swal2-input" placeholder="Lokasi Rak">
          <input id="harga" class="swal2-input" type="number" placeholder="Harga">
          <input id="qty" class="swal2-input" type="number" placeholder="Jumlah">
          <textarea id="catatanHTML" class="swal2-textarea" type="text" placeholder="Catatan"></textarea>
          `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan",
                cancelButtonText: "Batal",
                preConfirm: () => {
                    return {
                        kode: document.getElementById('kode').value.trim(),
                        judul: document.getElementById('judul').value.trim(),
                        kategori: document.getElementById('kategori').value,
                        upbjj: document.getElementById('upbjj').value,
                        lokasiRak: document.getElementById('lokasiRak').value.trim(),
                        harga: Number(document.getElementById('harga').value),
                        qty: Number(document.getElementById('qty').value),
                        catatanHTML: document.getElementById('catatanHTML').value.trim(),
                        safety: 10
                    };
                }
            });

            if (formValues) {
                if (!formValues.kode || !formValues.judul) {
                    Swal.fire("Gagal", "Semua field wajib diisi!", "error");
                    return;
                }

                // Cek kode duplikat
                if (this.stok.some(i => i.kode === formValues.kode)) {
                    Swal.fire("Gagal", "Kode sudah terdaftar!", "error");
                    return;
                }

                this.stok.push(formValues);
                Swal.fire("Berhasil", "Data bahan ajar ditambahkan!", "success");
            }
        },

        // ====== EDIT ITEM ======
        async editItem(item) {
            const upbjjOptions = this.upbjjList.map(
                (u) => `<option value="${u}" ${u === item.upbjj ? "selected" : ""}>${u}</option>`
            ).join("");

            const kategoriOptions = this.kategoriList.map(
                (k) => `<option value="${k}" ${k === item.kategori ? "selected" : ""}>${k}</option>`
            ).join("");

            const { value: formValues } = await Swal.fire({
                title: 'Edit Data Bahan Ajar',
                width: 600,
                html: `
          <input id="judul" class="swal2-input" value="${item.judul}">
          <select id="kategori" class="swal2-select">${kategoriOptions}</select>
          <select id="upbjj" class="swal2-select">${upbjjOptions}</select>
          <input id="lokasiRak" class="swal2-input" value="${item.lokasiRak}">
          <input id="harga" class="swal2-input" type="number" value="${item.harga}">
          <input id="qty" class="swal2-input" type="number" value="${item.qty}">
          <textarea id="catatanHTML" class="swal2-textarea">${item.catatanHTML || ""}</textarea>
        `,
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: "Simpan Perubahan",
                cancelButtonText: "Batal",
                preConfirm: () => ({
                    judul: document.getElementById('judul').value.trim(),
                    kategori: document.getElementById('kategori').value,
                    upbjj: document.getElementById('upbjj').value,
                    lokasiRak: document.getElementById('lokasiRak').value.trim(),
                    harga: Number(document.getElementById('harga').value),
                    qty: Number(document.getElementById('qty').value),
                    catatanHTML: document.getElementById('catatanHTML').value.trim()
                })
            });
            if (formValues) {
                Object.assign(item, formValues);
                Swal.fire("Berhasil", "Data bahan ajar telah diperbarui!", "success");
            }
        },
        // ====== DELETE ITEM ======
        deleteItem(item) {
            Swal.fire({
                title: 'Yakin ingin menghapus?',
                text: `Data ${item.judul} akan dihapus!`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            }).then(result => {
                if (result.isConfirmed) {
                    this.stok = this.stok.filter(i => i.kode !== item.kode);
                    Swal.fire("Terhapus!", "Data telah dihapus.", "success");
                }
            });
        }
    }
});

app.mount("#stockApp");