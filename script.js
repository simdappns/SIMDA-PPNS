<script>
// Jalankan fungsi otomatis saat halaman dimuat
window.addEventListener('load', loadGoogleSheetData);
    <script>
    function prosesFileImport(event) {
        const file = event.target.files[0];
        if (file) {
            alert("File berhasil dipilih: " + file.name);
            // Tambahkan logika untuk membaca file excel di sini jika diperlukan
        }
    }
    function exportData() {
    // Ini akan mengunduh data tabel sebagai file CSV sederhana
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "OPD,Nama & Jabatan,Lembaga Pendidikan,No SKEP & KTA,Tgl Berlaku,Status\n";
    csvContent += "Satpol PP,Budi Santoso S.H.,Diklat Reserse Polri,SKEP: SK-001/2020 KTA: KTA-9981,2027-12-31,Aktif\n";
    csvContent += "Dinas Perhubungan,Siti Aminah,Pusdiklat Darat,SKEP: SK-042/2019 KTA: KTA-8822,2023-05-10,Tidak Aktif\n";

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Data_PPNS_Pemprov_NTT.csv"); // Nama file yang akan terunduh
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fungsi untuk tombol Filter
function fokusPencarian() {
    // Secara otomatis mengarahkan kursor ke kolom pencarian
    const searchBox = document.querySelector('input[placeholder="Cari nama atau NIP..."]');
    if(searchBox) {
        searchBox.focus();
        searchBox.classList.add('ring-2', 'ring-blue-500'); // Memberikan efek highlight
        setTimeout(() => searchBox.classList.remove('ring-2', 'ring-blue-500'), 1000);
    }
}

// Fungsi untuk ikon Aksi/Mata
function lihatDetail() {
    alert("Menampilkan rincian profil PPNS terkait...");
}
</script>
    // Fungsi untuk memuat data saat halaman dibuka
document.addEventListener("DOMContentLoaded", function() {
    muatLaporanLokal();
});

function simpanLaporanLokal() {
    const nama = document.getElementById('namaLaporan').value;
    const input = document.getElementById('fileLaporan');
    
    if (!nama || input.files.length === 0) {
        alert("Mohon isi nama laporan dan pilih file terlebih dahulu!");
        return;
    }

    const file = input.files[0];
    
    // Karena Local Storage punya batas kecil (sekitar 5MB), kita batasi ukuran file
    if(file.size > 2000000) { // 2MB
        alert("Ukuran file terlalu besar untuk purwarupa ini. Mohon gunakan file di bawah 2MB.");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        // Mendapatkan data file berupa teks (Base64)
        const fileData = e.target.result;
        
        // Mengambil data lama dari memori (jika ada)
        let riwayat = JSON.parse(localStorage.getItem('dataLaporan')) || [];
        
        // Membuat data baru
        const laporanBaru = {
            id: Date.now(),
            waktu: new Date().toLocaleString('id-ID'),
            nama: nama,
            data: fileData,
            namaFile: file.name
        };
        
        // Menyimpan ke memori browser
        riwayat.push(laporanBaru);
        localStorage.setItem('dataLaporan', JSON.stringify(riwayat));
        
        alert("Laporan berhasil disimpan di sistem!");
        
        // Reset form dan perbarui tabel
        document.getElementById('namaLaporan').value = '';
        input.value = '';
        muatLaporanLokal();
    };
    
    // Membaca file
    reader.readAsDataURL(file);
}

function muatLaporanLokal() {
    const tabel = document.getElementById('tabelLaporan');
    if(!tabel) return; // Jika tabel tidak ada di halaman ini, abaikan
    
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
<script src="script.js"></script>
