       let isiKeranjang = [];

        // === FUNGSI 1: RENDER KATALOG PRODUK ===
        function jalankanRenderMandiri() {
            const wadah = document.getElementById('konten-produk');
            if (!wadah) return;

            const produkDummy = [{
                    nama: "Cireng Rujak Spesial Crispy",
                    harga: 15000,
                    kategori: "Aci-Acian",
                    gambar: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80"
                },
                {
                    nama: "Cilok Kuah Pedas Bumbu Kacang",
                    harga: 12000,
                    kategori: "Aci-Acian",
                    gambar: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=500&q=80"
                },
                {
                    nama: "Siomay Asli Bandung Ikan Tenggiri",
                    harga: 25000,
                    kategori: "Makanan Basah",
                    gambar: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=500&q=80"
                },
                {
                    nama: "Batagor Premium Saus Kacang",
                    harga: 22000,
                    kategori: "Gorengan",
                    gambar: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=500&q=80"
                }
            ];

            let dataInputAdmin = JSON.parse(localStorage.getItem('database_produk')) || [];

            const namaProdukDummy = produkDummy.map(d => d.nama);
            const dataAdminMurni = dataInputAdmin.filter(item => !namaProdukDummy.includes(item.nama));

            const semuaProduk = [...dataAdminMurni, ...produkDummy];

            wadah.innerHTML = '';

            semuaProduk.forEach(item => {
                const formatRupiah = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                }).format(item.harga || 0);

                const gambarValid = item.gambar && item.gambar.trim() !== "" ?
                    item.gambar :
                    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80';

                wadah.innerHTML += `
                    <div class="col d-flex">
                        <div class="card product-card w-100 d-flex flex-column justify-content-between">
                            <div>
                                <div class="img-container">
                                    <img src="${gambarValid}" class="product-img" alt="${item.nama}"
                                         onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80'">
                                </div>
                                <div class="p-3 pb-0">
                                    <span class="category-badge mb-1 d-block">${item.kategori || 'GENERAL'}</span>
                                    <h5 class="product-title" title="${item.nama}">${item.nama}</h5>
                                </div>
                            </div>
                            <div class="p-3 pt-0">
                                <div class="product-price mb-3">${formatRupiah}</div>
                                <button class="btn btn-buy w-100 d-flex align-items-center justify-content-center gap-2" 
                                        onclick="tambahSimulasiKeranjang('${item.nama.replace(/'/g, "\\'")}', ${item.harga})">
                                    <i class="bi bi-plus-lg"></i> Beli Sekarang
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        // === FUNGSI 2: TAMBAH ITEM KE KERANJANG ===
        function tambahSimulasiKeranjang(namaProduk, hargaProduk) {
            isiKeranjang.push({
                nama: namaProduk,
                harga: hargaProduk
            });

            const badge = document.getElementById('cart-badge');
            if (badge) badge.innerText = isiKeranjang.length;

            renderIsiKeranjang();
        }

        // === FUNGSI 3: RENDER ITEM DI POP-UP MODAL KERANJANG ===
        function renderIsiKeranjang() {
            const wadahKeranjang = document.getElementById('list-item-keranjang');
            const totalHargaEl = document.getElementById('total-harga-keranjang');
            const tombolBayar = document.querySelector('#keranjangBelanja .btn-dark');

            if (!wadahKeranjang) return;

            if (isiKeranjang.length === 0) {
                wadahKeranjang.innerHTML = `
                    <div class="text-center py-5 text-muted">
                        <i class="bi bi-cart-x text-muted opacity-50 display-4 mb-3 d-block"></i>
                        <p class="small mb-0 fw-medium">Keranjang belanja kamu masih kosong nih.</p>
                    </div>`;
                totalHargaEl.innerText = "Rp 0";
                if (tombolBayar) tombolBayar.disabled = true;
                return;
            }

            let totalBelanja = 0;
            wadahKeranjang.innerHTML = '';

            isiKeranjang.forEach((item, index) => {
                totalBelanja += item.harga;
                const hargaFormat = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0
                }).format(item.harga);

                wadahKeranjang.innerHTML += `
                    <div class="cart-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="cart-item-title mb-1 text-truncate" style="max-width: 250px;">${item.nama}</h6>
                            <span class="cart-item-price">${hargaFormat}</span>
                        </div>
                        <button class="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center border-0" 
                                style="width: 32px; height: 32px; background-color: #fef2f2; color: #dc2626;"
                                onclick="hapusItemKeranjang(${index})">
                            <i class="bi bi-trash fs-6"></i>
                        </button>
                    </div>
                `;
            });

            totalHargaEl.innerText = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
            }).format(totalBelanja);
            if (tombolBayar) tombolBayar.disabled = false;
        }

        // === FUNGSI 4: HAPUS ITEM DI KERANJANG ===
        function hapusItemKeranjang(index) {
            isiKeranjang.splice(index, 1);
            const badge = document.getElementById('cart-badge');
            if (badge) badge.innerText = isiKeranjang.length;
            renderIsiKeranjang();
        }

        // === FUNGSI 5: PROSES CHECKOUT ===
        function prosesCheckout() {
            if (isiKeranjang.length === 0) {
                alert('Keranjang kamu masih kosong nih! Yuk, pilih jajanan Bandung dulu. 😋');
                return;
            }

            alert('Terima kasih! Pembayaran berhasil dilakukan.');
            isiKeranjang = [];

            const badge = document.getElementById('cart-badge');
            if (badge) badge.innerText = 0;

            renderIsiKeranjang();

            const modalEl = document.getElementById('keranjangBelanja');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) modalInstance.hide();
        }

        // === FUNGSI 6: DINAMIS CEK AKUN LOGIN ===
        function cekStatusLogin() {
            const wrapper = document.getElementById('user-nav-wrapper');
            if (!wrapper) return;

            const isLoggedIn = localStorage.getItem('is_logged_in');
            const namaUser = localStorage.getItem('nama_user') || 'User';

            if (isLoggedIn === 'true') {
                const inisial = namaUser.charAt(0).toUpperCase();

                wrapper.innerHTML = `
                    <a href="javascript:void(0)" onclick="logoutUser()" class="nav-action-item" title="Klik untuk Keluar">
                        <div class="nav-icon-circle fw-bold text-white" style="background-color: var(--accent-brand); border-color: var(--accent-brand);">
                            ${inisial}
                        </div>
                        <span class="nav-action-text text-truncate" style="max-width: 75px;">${namaUser}</span>
                    </a>
                `;
            }
        }

        // === FUNGSI 7: LOGOUT KELUAR AKUN ===
        function logoutUser() {
            if (confirm('Apakah Anda ingin keluar dari akun ini?')) {
                localStorage.removeItem('is_logged_in');
                localStorage.removeItem('nama_user');
                window.location.reload();
            }
        }

        // === EVENT TRIGGER ===
        window.addEventListener('DOMContentLoaded', () => {
            jalankanRenderMandiri();
            renderIsiKeranjang();
            cekStatusLogin();
        });
        window.addEventListener('focus', jalankanRenderMandiri);
        window.addEventListener('storage', (e) => {
            if (e.key === 'database_produk') jalankanRenderMandiri();
        });

        // Logika Aktivasi Menu Navigasi biasa
        const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuLinks.forEach(item => item.classList.remove('active'));
                this.classList.add('active');
            });
        });