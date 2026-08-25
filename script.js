// ==========================================
// 1. FUNGSI UNTUK MENGIRIM DATA KE GOOGLE SHEETS
// ==========================================
function handleKirimLaporan(event) {
    event.preventDefault(); // Mencegah halaman refresh saat tombol ditekan

    // GANTI TULISAN DI BAWAH DENGAN URL WEB APP GOOGLE SCRIPT ANDA
    const scriptURL = 'AKfycbyrnTYpPZGxIY6z07kOK2WZevoL3IxlMGn3shjWT-3y-iMdmG69nBrR9WRylTQsYe4Wmw'; 
    
    const formData = new FormData();
    
    // Mengambil data berdasarkan ID dari form di index.html
    formData.append('opd', document.getElementById('inputOpd').value);
    formData.append('nama', document.getElementById('inputNama').value);
    
    // (Opsional) Jika Anda punya input lain di HTML, hapus tanda // di bawah ini:
    // formData.append('jabatan', document.getElementById('inputJabatan').value);
    // formData.append('no_skep', document.getElementById('inputSkep').value);

    // Proses mengirim data menggunakan mode 'no-cors' agar tidak diblokir
    fetch(scriptURL, { 
        method: 'POST', 
        body: formData,
        mode: 'no-cors' 
    })
    .then(response => {
        alert('Data PPNS berhasil disimpan ke server Google Sheets!');
        document.getElementById('formLaporan').reset(); // Mengosongkan form
    })
    .catch(error => {
        alert('Terjadi kesalahan saat menyimpan data.');
        console.error('Error!', error.message);
    });
}

// ==========================================
// 2. FUNGSI UNTUK TOMBOL EKSPOR & FILTER
// ==========================================
function exportData() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "OPD,Nama & Jabatan,Lembaga Pendidikan,No SKEP & KTA,Tgl Berlaku,Status\n";
    csvContent += "Satpol PP,Budi Santoso S.H.,Diklat Reserse Polri,SKEP: SK-001/2020 KTA: KTA-9981,2027-12-31,Aktif\n";
    csvContent += "Dinas Perhubungan,Siti Aminah,Pusdiklat Darat,SKEP: SK-042/2019 KTA: KTA-8822,2023-05-10,Tidak Aktif\n";

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Data_PPNS_Pemprov_NTT.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function fokusPencarian() {
    const searchBox = document.querySelector('input[placeholder="Cari nama atau NIP..."]');
    if(searchBox) {
        searchBox.focus();
        searchBox.classList.add('ring-2', 'ring-blue-500');
        setTimeout(() => searchBox.classList.remove('ring-2', 'ring-blue-500'), 1000);
    }
}

function lihatDetail() {
    alert("Menampilkan rincian profil PPNS terkait...");
}

// ==========================================
// 3. FUNGSI UNTUK PENYIMPANAN LAPORAN LOKAL
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    muatLaporanLokal();
});

function prosesFileImport(event) {
    const file = event.target.files[0];
    if (file) {
        alert("File berhasil dipilih: " + file.name);
    }
}

function simpanLaporanLokal() {
    const nama = document.getElementById('namaLaporan').value;
    const input = document.getElementById('fileLaporan');
    
    if (!nama || input.files.length === 0) {
        alert("Mohon isi nama laporan dan pilih file terlebih dahulu!");
        return;
    }

    const file = input.files[0];
    
    if(file.size > 2000000) { 
        alert("Ukuran file terlalu besar. Mohon gunakan file di bawah 2MB.");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const fileData = e.target.result;
        let riwayat = JSON.parse(localStorage.getItem('dataLaporan')) || [];
        
        const laporanBaru = {
            id: Date.now(),
            waktu: new Date().toLocaleString('id-ID'),
            nama: nama,
            data: fileData,
            namaFile: file.name
        };
        
        riwayat.push(laporanBaru);
        localStorage.setItem('dataLaporan', JSON.stringify(riwayat));
        
        alert("Laporan berhasil disimpan di sistem!");
        
        document.getElementById('namaLaporan').value = '';
        input.value = '';
        muatLaporanLokal();
    };
    
    reader.readAsDataURL(file);
}

function muatLaporanLokal() {
    const tabel = document.getElementById('tabelLaporan');
    if(!tabel) return; 
    
    tabel.innerHTML = '';
    const riwayat = JSON.parse(localStorage.getItem('dataLaporan')) || [];
    
    if(riwayat.length === 0) {
        tabel.innerHTML = '<tr><td colspan="3" class="py-4 text-center text-gray-500">Belum ada laporan tersimpan.</td></tr>';
        return;
    }
    
    riwayat.forEach(laporan => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-gray-50";
        tr.innerHTML = `
            <td class="py-2 px-4 border-b text-sm">${laporan.waktu}</td>
            <td class="py-2 px-4 border-b text-sm font-medium">${laporan.nama} <br><span class="text-xs text-gray-500">${laporan.namaFile}</span></td>
            <td class="py-2 px-4 border-b text-center text-sm">
                <a href="${laporan.data}" download="${laporan.namaFile}" class="text-green-600 hover:text-green-800 bg-green-100 px-2 py-1 rounded text-xs">
                    <i class="fas fa-download"></i> Unduh
                </a>
            </td>
        `;
        tabel.appendChild(tr);
    });
}
// Fungsi untuk mengganti tampilan halaman (Tab)
function pindahTab(tabId) {
  // Sembunyikan semua elemen dengan class 'tab-content'
  const semuaTab = document.querySelectorAll('.tab-content');
  semuaTab.forEach(tab => {
    tab.classList.add('hidden');
    tab.classList.remove('block');
  });

  // Tampilkan tab yang dipilih
  const tabAktif = document.getElementById(tabId);
  if (tabAktif) {
    tabAktif.classList.remove('hidden');
    tabAktif.classList.add('block');
  }
}
