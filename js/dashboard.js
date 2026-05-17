document.addEventListener("DOMContentLoaded", function() {
    let penjualanChart;
    let kategoriChart;

    // 1. DATA AWAL (DUMMY) 
    const produkDummy = [
        { id: 1, nama: "Cireng Rujak Spesial Crispy", kategori: "Aci-Acian", harga: 15000, terjual: 45, gambar: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80" },
        { id: 2, nama: "Cilok Kuah Pedas Bumbu Kacang", kategori: "Aci-Acian", harga: 12000, terjual: 60, gambar: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80" },
        { id: 3, nama: "Siomay Asli Bandung Ikan Tenggiri", kategori: "Makanan Basah", harga: 25000, terjual: 30, gambar: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80" },
        { id: 4, nama: "Batagor Premium Saus Kacang", kategori: "Gorengan", harga: 22000, terjual: 40, gambar: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=500&q=80" }
    ];

    // Ambil data admin dari localStorage
    let dataInputAdmin = JSON.parse(localStorage.getItem('database_produk')) || [];

    // Filter duplikasi data dummy
    const namaProdukDummy = produkDummy.map(d => d.nama);
    let dataAdminMurni = dataInputAdmin.filter(item => !namaProdukDummy.includes(item.nama));

    // Gabungkan data
    let daftarProduk = [...dataAdminMurni, ...produkDummy];

    // INSTANCE MODAL UNTUK MANIPULASI JS
    const modalTambahBS = new bootstrap.Modal(document.getElementById('modalTambah'));
    const modalEditBS = new bootstrap.Modal(document.getElementById('modalEdit'));

    function perbaruiDashboard() {
        const tabelBody = document.getElementById('tabelProduk');
        if (!tabelBody) return;
        
        tabelBody.innerHTML = ""; 

        let totalOmset = 0;
        let totalJenisProduk = daftarProduk.length;

        let arrayNamaProduk = [];
        let arrayUnitTerjual = [];
        let hitungKategori = { "Aci-Acian": 0, "Makanan Basah": 0, "Gorengan": 0, "Lainnya": 0 };

        daftarProduk.forEach((produk) => {
            totalOmset += (produk.harga * produk.terjual);
            arrayNamaProduk.push(produk.nama);
            arrayUnitTerjual.push(produk.terjual);

            let katSesuai = produk.kategori || "Lainnya";
            if (hitungKategori[katSesuai] !== undefined) {
                hitungKategori[katSesuai] += produk.terjual;
            } else {
                hitungKategori["Lainnya"] += produk.terjual;
            }

            const hargaFormat = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(produk.harga);

            // Perbaikan innerHTML: Kolom Gambar sekarang terisi tag img
            tabelBody.innerHTML += `
                <tr>
                    <td>
                        <img src="${produk.gambar || 'https://placehold.co/50x50?text=No+Img'}" class="img-preview-table" alt="Foto ${produk.nama}">
                    </td>
                    <td class="fw-semibold">${produk.nama}</td>
                    <td><span class="badge bg-secondary">${produk.kategori}</span></td>
                    <td>${hargaFormat}</td>
                    <td>${produk.terjual} pcs</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-outline-warning btn-edit me-1" data-id="${produk.id}">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-outline-danger btn-hapus" data-id="${produk.id}">
                            <i class="bi bi-trash"></i> Hapus
                        </button>
                    </td>
                </tr>
            `;
        });

        // Sinkronisasi komponen Info Box atas
        const totalOmsetEl = document.getElementById('totalOmset');
        if (totalOmsetEl) {
            totalOmsetEl.innerText = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalOmset);
        }

        const jumlahProdukEl = document.getElementById('jumlahProduk');
        if (jumlahProdukEl) {
            jumlahProdukEl.innerText = totalJenisProduk + " Menu";
        }

        // Simpan data admin murni ke local storage
        const produkUntukDisimpan = daftarProduk.filter(item => !namaProdukDummy.includes(item.nama));
        localStorage.setItem('database_produk', JSON.stringify(produkUntukDisimpan));

        renderGrafik(arrayNamaProduk, arrayUnitTerjual, hitungKategori);
    }

    // PROSES CONVERT FILE GAMBAR KE BASE64 DATA URL
    function ambilBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // TAMBAH PRODUK BARU
    const formTambah = document.getElementById('formTambahProduk');
    if (formTambah) {
        formTambah.addEventListener('submit', async function(e) {
            e.preventDefault();

            const fileInput = document.getElementById('inputGambarFile');
            let gambarResult = "https://placehold.co/500x500?text=GudangCemilan";

            // Jika user upload file, konversi ke base64 string
            if (fileInput && fileInput.files.length > 0) {
                try {
                    gambarResult = await ambilBase64(fileInput.files[0]);
                } catch (error) {
                    console.error("Gagal membaca file gambar:", error);
                }
            }

            const produkBaru = {
                id: Date.now(), // ID Unik berbasis timestamp
                nama: document.getElementById('inputNama').value,
                kategori: document.getElementById('inputKategori').value,
                harga: parseInt(document.getElementById('inputHarga').value),
                terjual: parseInt(document.getElementById('inputTerjual').value) || 0,
                gambar: gambarResult
            };

            daftarProduk.unshift(produkBaru);
            perbaruiDashboard();

            formTambah.reset();
            modalTambahBS.hide();
        });
    }

    // EVENT DELEGATION: KLIK HAPUS & EDIT PADA TABEL
    const tabelProdukEl = document.getElementById('tabelProduk');
    if (tabelProdukEl) {
        tabelProdukEl.addEventListener('click', function(e) {
            // Logika Tombol Hapus
            const tombolHapus = e.target.closest('.btn-hapus');
            if (tombolHapus) {
                if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
                    const idProduk = parseInt(tombolHapus.getAttribute('data-id'));
                    daftarProduk = daftarProduk.filter(p => p.id !== idProduk);
                    perbaruiDashboard();
                }
                return;
            }

            // Logika Tombol Edit (Triger Pengisian Data Lama ke Form)
            const tombolEdit = e.target.closest('.btn-edit');
            if (tombolEdit) {
                const idProduk = parseInt(tombolEdit.getAttribute('data-id'));
                const dataProduk = daftarProduk.find(p => p.id === idProduk);

                if (dataProduk) {
                    document.getElementById('editProdukId').value = dataProduk.id;
                    document.getElementById('editNama').value = dataProduk.nama;
                    document.getElementById('editKategori').value = dataProduk.kategori;
                    document.getElementById('editHarga').value = dataProduk.harga;
                    document.getElementById('editTerjual').value = dataProduk.terjual;
                    
                    // Reset input file edit bawaan terdahulu
                    document.getElementById('editGambarFile').value = "";
                    
                    modalEditBS.show();
                }
            }
        });
    }

    // SIMPAN PERUBAHAN EDIT DATA PRODUK
    const formEdit = document.getElementById('formEditProduk');
    if (formEdit) {
        formEdit.addEventListener('submit', async function(e) {
            e.preventDefault();

            const idProduk = parseInt(document.getElementById('editProdukId').value);
            const index = daftarProduk.findIndex(p => p.id === idProduk);

            if (index !== -1) {
                daftarProduk[index].nama = document.getElementById('editNama').value;
                daftarProduk[index].kategori = document.getElementById('editKategori').value;
                daftarProduk[index].harga = parseInt(document.getElementById('editHarga').value);
                daftarProduk[index].terjual = parseInt(document.getElementById('editTerjual').value);

                // Check jika admin mengunggah foto baru saat editing
                const fileInputEdit = document.getElementById('editGambarFile');
                if (fileInputEdit && fileInputEdit.files.length > 0) {
                    try {
                        daftarProduk[index].gambar = await ambilBase64(fileInputEdit.files[0]);
                    } catch (error) {
                        console.error("Gagal membaca file gambar baru:", error);
                    }
                }

                perbaruiDashboard();
                modalEditBS.hide();
            }
        });
    }

    // RENDER GRAFIK CHART.JS
    function renderGrafik(nama, terjual, kategori) {
        if (penjualanChart) {
            penjualanChart.data.labels = nama;
            penjualanChart.data.datasets[0].data = terjual;
            penjualanChart.update();
        } else {
            const ctxBar = document.getElementById('barChart')?.getContext('2d');
            if(ctxBar) {
                penjualanChart = new Chart(ctxBar, {
                    type: 'bar',
                    data: {
                        labels: nama,
                        datasets: [{ label: 'Pcs Terjual', data: terjual, backgroundColor: '#ea580c', borderRadius: 6 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        }

        if (kategoriChart) {
            kategoriChart.data.labels = Object.keys(kategori);
            kategoriChart.data.datasets[0].data = Object.values(kategori);
            kategoriChart.update();
        } else {
            const ctxPie = document.getElementById('pieChart')?.getContext('2d');
            if(ctxPie) {
                kategoriChart = new Chart(ctxPie, {
                    type: 'pie',
                    data: {
                        labels: Object.keys(kategori),
                        datasets: [{ data: Object.values(kategori), backgroundColor: ['#ea580c', '#f59e0b', '#10b981', '#64748b'] }]
                    },
                    options: { responsive: true, maintainAspectRatio: false }
                });
            }
        }
    }

    perbaruiDashboard();
});