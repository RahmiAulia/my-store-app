import { test, expect } from "@playwright/test";

test.describe("Store App Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Harus menampilkan header halaman dengan benar", async ({ page }) => {
    const header = page.locator('text="Product"');
    await expect(header).toBeVisible(); // Memastikan header terlihat di halaman
    await expect(header).toHaveText("Product"); // Verifikasi teks header
  });

  test("Harus menampilkan daftar produk", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible();
    const rowCount = await page.locator("table tbody tr").count();
    expect(rowCount).toBeGreaterThan(0);
  });

  test("Harus menampilkan data produk di tabel", async ({ page }) => {
    const firstRow = page.locator("table tbody tr").first();
    const productIdCell = firstRow.locator("td").nth(0); // Kolom pertama: ID Produk
    const productNameCell = firstRow.locator("td").nth(1); // Kolom kedua: Nama Produk
    const categoryCell = firstRow.locator("td").nth(2); // Kolom ketiga: Kategori
    const priceCell = firstRow.locator("td").nth(3); // Kolom keempat: Harga

    // Periksa bahwa data tidak kosong
    await expect(productIdCell).not.toHaveText("");
    await expect(productNameCell).not.toHaveText("");
    await expect(categoryCell).not.toHaveText("");
    await expect(priceCell).not.toHaveText("");
  });

  test("Harus mengarahkan halaman ke halaman update-product saat tombol Update diklik", async ({ page }) => {
    // Klik tombol Update pada baris pertama tabel
    const firstRowUpdateButton = page.locator(
      "table tbody tr:first-child button:has-text('Update')"
    );
    await firstRowUpdateButton.click();

    // Verifikasi URL diarahkan ke halaman update-product dengan ID produk
    await expect(page).toHaveURL(/http:\/\/localhost:5173\/update-product\/\d+/);

    // Verifikasi form update muncul dengan input data produk
    const updateFormTitle = page.locator('button:has-text("Update Product")');
    await expect(updateFormTitle).toBeVisible();
  });

  test("Harus memungkinkan export data produk ke file Excel", async ({ page }) => {
    // Klik tombol Download untuk export data
    await page.waitForSelector('button:has-text("Download")', {
      timeout: 10000,
    });
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Tunggu unduhan selesai
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.locator('button:has-text("Download")').click(),
    ]);

    // Verifikasi file yang diunduh memiliki nama yang benar
    const fileName = await download.suggestedFilename();
    expect(fileName).toBe("products_filtered.xlsx");
  });

  test("Pagination bekerja dengan benar saat mengubah halaman dan jumlah baris per halaman", async ({ page }) => {
    await page.waitForTimeout(2000); // Menunggu sejenak untuk elemen rendering
    await page.waitForSelector("div[data-testid='TablePagination']", {
      state: "visible",
      timeout: 13000,
    });

    await page.waitForTimeout(2000);
    // Verifikasi elemen pagination terlihat
    const pagination = page.locator("div[data-testid='TablePagination']");
    await pagination.waitFor({ state: "visible", timeout: 10000 });
    await expect(pagination).toBeVisible();

    // Ubah jumlah baris per halaman
    const rowsPerPageSelect = page.locator('select[aria-label="rows per page"]');
    await rowsPerPageSelect.selectOption("25");

    // Verifikasi jumlah baris di tabel berubah
    const rowCount = await page.locator("table tbody tr").count();
    expect(rowCount).toBeGreaterThan(10);
    expect(rowCount).toBeLessThanOrEqual(25);

    // Pindah ke halaman berikutnya
    const nextPageButton = page.locator('button[aria-label="Next page"]');
    await nextPageButton.click();

    // Verifikasi halaman berubah
    await expect(page.locator("table tbody tr")).toBeVisible();
  });

  test("Harus mengarahkan halaman ke halaman add-product saat FAB diklik", async ({ page }) => {
    // Menemukan fab dengan selector
    const fabButton = page.locator('button[aria-label="add"]');

    await fabButton.waitFor({ state: "visible", timeout: 5000 });

    // Verifikasi bahwa fab ada di halaman
    await expect(fabButton).toBeVisible();
    await fabButton.click();
    await expect(page).toHaveURL("http://localhost:5173/add-product");

    // Melakukan verifikasi bahwa form yang berada pada halaman add-product ada atau muncul
    const productFormInput = page.locator('text="Add a New Product"');
    await expect(productFormInput).toBeVisible();
  });

  test("Harus menghapus produk", async ({ page }) => {
    // Klik tombol Delete pada baris pertama tabel
    const firstRowDeleteButton = page.locator(
      "table tbody tr:first-child button:has-text('Delete')"
    );
    await firstRowDeleteButton.click();

    // Verifikasi modal konfirmasi muncul
    const modal = page.locator(".modal");
    await expect(modal).toBeVisible();

    // Klik tombol konfirmasi di modal
    const confirmButton = modal.locator('button:has-text("Confirm")');
    await confirmButton.click();

    // Verifikasi jumlah baris setelah penghapusan berkurang
    const rowCountBeforeDelete = await page.locator("table tbody tr").count();
    const rowCountAfterDelete = await page.locator("table tbody tr").count();
    expect(rowCountAfterDelete).toBeLessThan(rowCountBeforeDelete);
  });
});
