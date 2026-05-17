document.addEventListener("DOMContentLoaded", function () {
    
    // === 1. INISIALISASI AKUN DEFAULT UTK KULINER BANDUNG (Disimpan di LocalStorage) ===
    if (!localStorage.getItem("user_email")) {
        localStorage.setItem("user_email", "pelanggan@gudangcemilan.com");
        localStorage.setItem("user_password", "user123");
    }
    if (!localStorage.getItem("admin_username")) {
        localStorage.setItem("admin_username", "admin");
        localStorage.setItem("admin_password", "admin123");
    }

    // Ambil elemen kontainer form
    const userContainer = document.getElementById("user-login");
    const adminContainer = document.getElementById("admin-login");

    const userForm = userContainer ? userContainer.querySelector("form") : null;
    const adminForm = adminContainer ? adminContainer.querySelector("form") : null;

    // =======================================================
    // 2. LOGIKA LOGIN & GANTI KREDENSIAL - USER/PELANGGAN
    // =======================================================
    if (userForm) {
        userForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputEmail = userForm.querySelector('input[type="email"]').value.trim();
            const inputPassword = userForm.querySelector('input[type="password"]').value;

            const validEmail = localStorage.getItem("user_email");
            const validPassword = localStorage.getItem("user_password");

            if (inputEmail === validEmail && inputPassword === validPassword) {
                alert("Login Pelanggan Berhasil! Selamat Datang di GudangCemilan...");
                window.location.href = "landingpage.html"; 
            } else {
                alert(`Login Gagal!\nEmail atau Password Pelanggan salah.\n\nAkun aktif saat ini:\nEmail: ${validEmail}\nSandi: ${validPassword}`);
            }
        });

        // Fitur Perbarui Kredensial Akun Pelanggan lewat klik "Lupa Password?"
        const btnLupaSandiUser = userForm.querySelector(".btn-lupa-password");
        if (btnLupaSandiUser) {
            btnLupaSandiUser.addEventListener("click", function (e) {
                e.preventDefault();

                const konfirmasi = confirm("Apakah Anda ingin memperbarui/mengganti Email dan Sandi akun Pelanggan?");
                if (konfirmasi) {
                    const emailBaru = prompt("Masukkan Email Baru:", localStorage.getItem("user_email"));
                    if (emailBaru && emailBaru.trim() !== "") {
                        const sandiBaru = prompt("Masukkan Sandi Baru (Minimal 6 Karakter):");
                        if (sandiBaru && sandiBaru.length >= 6) {
                            
                            localStorage.setItem("user_email", emailBaru.trim());
                            localStorage.setItem("user_password", sandiBaru);

                            alert("Sukses! Email dan Sandi Pelanggan berhasil diganti.\nSilakan masuk menggunakan akun baru Anda.");
                            userForm.reset();
                        } else {
                            alert("Gagal! Sandi dibatalkan atau terlalu pendek (Minimal 6 karakter).");
                        }
                    } else {
                        alert("Gagal! Format Email tidak valid.");
                    }
                }
            });
        }
    }

    // =======================================================
    // 3. LOGIKA LOGIN & GANTI KREDENSIAL - ADMIN
    // =======================================================
    if (adminForm) {
        adminForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const inputUsername = adminForm.querySelector('input[type="text"]').value.trim();
            const inputPassword = adminForm.querySelector('input[type="password"]').value;

            const validUsername = localStorage.getItem("admin_username");
            const validPassword = localStorage.getItem("admin_password");

            if (inputUsername === validUsername && inputPassword === validPassword) {
                alert("Login Admin Berhasil! Masuk ke Dashboard Manajemen...");
                window.location.href = "dashboard-admin.html"; 
            } else {
                alert(`Login Admin Gagal!\nUsername atau Password salah.\n\nAkun admin aktif saat ini:\nUsername: ${validUsername}\nSandi: ${validPassword}`);
            }
        });
    }

    // =======================================================
    // 4. LOGIKA FORM PENDAFTARAN BARU DARI POP-UP MODAL
    // =======================================================
    const formPendaftaran = document.getElementById("formPendaftaran");
    if (formPendaftaran) {
        formPendaftaran.addEventListener("submit", function(e) {
            e.preventDefault();

            const namaBaru = document.getElementById("regNama").value.trim();
            const emailBaru = document.getElementById("regEmail").value.trim();
            const passwordBaru = document.getElementById("regPassword").value;

            // Menyimpan akun hasil pendaftaran ke localStorage (Menimpa Akun Default)
            localStorage.setItem("user_email", emailBaru);
            localStorage.setItem("user_password", passwordBaru);

            alert(`Pendaftaran Berhasil!\nHalo ${namaBaru}, akun Anda telah aktif.\n\nSilakan coba login menggunakan:\nEmail: ${emailBaru}`);
            
            // Reset input form pendaftaran
            formPendaftaran.reset();

            // Sembunyikan Pop-up Modal secara otomatis menggunakan Bootstrap JavaScript API
            const modalEl = document.getElementById('modalDaftar');
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            // Isi otomatis input email di halaman login agar user tinggal mengetik password saja
            if (userForm) {
                userForm.querySelector('input[type="email"]').value = emailBaru;
            }
        });
    }

    // Fungsi Global Pintas via Console Browser untuk mengganti kredensial Admin
    window.gantiKredensialAdmin = function (usernameBaru, sandiBaru) {
        if (usernameBaru && sandiBaru) {
            localStorage.setItem("admin_username", usernameBaru);
            localStorage.setItem("admin_password", sandiBaru);
            console.log("Kredensial admin berhasil diperbarui di sistem!");
        } else {
            console.error("Gagal! Masukkan usernameBaru dan sandiBaru.");
        }
    };
});