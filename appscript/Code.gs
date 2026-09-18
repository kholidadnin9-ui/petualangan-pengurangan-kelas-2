/**
 * ============================================================
 *  PETUALANGAN PENGURANGAN - BACKEND (Google Apps Script)
 *  Dibuat oleh: Widodo, guru SD
 *  Game matematika pengurangan 1-50 untuk siswa kelas 2 SD
 * ============================================================
 *
 * File ini adalah BACKEND (server-side). Simpan sebagai "Code.gs"
 * pada project Apps Script Anda.
 *
 * Fungsi utama:
 *  - doGet()            -> menyajikan halaman web game (frontend)
 *  - include()          -> helper untuk menggabungkan file HTML/CSS/JS
 *  - saveScore()        -> menyimpan skor siswa ke Google Sheets
 *  - getStudentProgress() -> mengambil progres/level terbuka siswa
 *  - getLeaderboard()   -> mengambil papan peringkat 10 besar
 */

var SHEET_NAME = "Skor Siswa";
var SPREADSHEET_NAME = "Data Game - Petualangan Pengurangan";

/**
 * Entry point saat Web App diakses lewat browser.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .setTitle("Petualangan Pengurangan - Game Matematika SD")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Helper untuk menyisipkan file HTML/CSS/JS lain ke dalam Index.html.
 * Dipakai dengan sintaks: <?!= include('NamaFile'); ?>
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Membuat (jika belum ada) atau membuka spreadsheet penyimpanan data.
 * ID spreadsheet disimpan di Script Properties agar konsisten
 * walau fungsi dipanggil berkali-kali dari Web App (standalone).
 */
function getOrCreateSpreadsheet_() {
  var props = PropertiesService.getScriptProperties();
  var ssId = props.getProperty("SHEET_ID");
  var ss = null;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (err) {
      ss = null;
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(SPREADSHEET_NAME);
    props.setProperty("SHEET_ID", ss.getId());
  }

  return ss;
}

/**
 * Mengambil (atau membuat) sheet "Skor Siswa" dengan header kolom.
 */
function getOrCreateSheet_() {
  var ss = getOrCreateSpreadsheet_();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Waktu",
      "Nama Siswa",
      "ID Level",
      "Nama Level",
      "Skor",
      "Total Soal",
      "Bintang",
    ]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold").setBackground("#fde68a");
    sheet.autoResizeColumns(1, 7);
  }

  return sheet;
}

/**
 * Dipanggil dari frontend (google.script.run) setiap kali siswa
 * menyelesaikan satu level. Data disimpan sebagai satu baris baru.
 *
 * @param {Object} data { name, levelId, levelName, score, total, stars }
 */
function saveScore(data) {
  try {
    var sheet = getOrCreateSheet_();
    sheet.appendRow([
      new Date(),
      data.name || "Anonim",
      data.levelId,
      data.levelName,
      data.score,
      data.total,
      data.stars,
    ]);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Mengambil skor terbaik per level untuk seorang siswa (berdasarkan nama),
 * lalu menghitung level tertinggi yang sudah terbuka (butuh skor >= 6/10).
 *
 * @param {string} name Nama siswa
 * @return {Object} { bestScores: {1: 8, 2: 6, ...}, unlockedLevel: 3 }
 */
function getStudentProgress(name) {
  try {
    var sheet = getOrCreateSheet_();
    var values = sheet.getDataRange().getValues();
    var bestScores = {};

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var rowName = row[1];
      var levelId = row[2];
      var score = row[4];

      if (rowName === name) {
        if (!bestScores[levelId] || score > bestScores[levelId]) {
          bestScores[levelId] = score;
        }
      }
    }

    var unlockedLevel = 1;
    for (var lv = 1; lv <= 5; lv++) {
      if (bestScores[lv] >= 6 && lv < 5) {
        unlockedLevel = Math.max(unlockedLevel, lv + 1);
      }
    }

    return { bestScores: bestScores, unlockedLevel: unlockedLevel };
  } catch (err) {
    return { bestScores: {}, unlockedLevel: 1 };
  }
}

/**
 * Mengambil 10 besar papan peringkat berdasarkan total skor gabungan
 * semua level yang pernah dimainkan oleh masing-masing siswa.
 */
function getLeaderboard() {
  try {
    var sheet = getOrCreateSheet_();
    var values = sheet.getDataRange().getValues();
    var totals = {};

    for (var i = 1; i < values.length; i++) {
      var row = values[i];
      var name = row[1];
      var score = row[4];
      if (!totals[name]) totals[name] = 0;
      totals[name] += Number(score) || 0;
    }

    var arr = Object.keys(totals).map(function (name) {
      return { name: name, total: totals[name] };
    });

    arr.sort(function (a, b) {
      return b.total - a.total;
    });

    return arr.slice(0, 10);
  } catch (err) {
    return [];
  }
}
