import { test, expect } from "@playwright/test";

test.describe("Store App Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  // Test header
  test("Menampilkan header", async ({ page }) => {
    const header = page.locator('text="Product"');
    await expect(header).toBeVisible();
    await expect(header).toHaveText("Product");
  });

  // Test menampilkan daftar produk
  test("Menampilkan daftar produk", async ({ page }) => {
    await page.waitForSelector("table", { timeout: 10000 });
    await expect(page.locator("table")).toBeVisible();

    // Memastikan ada baris di dalam tabel
    const rowCount = await page.locator("table tbody tr").count();
    console.log("Row Count:", rowCount);
    expect(rowCount).toBeGreaterThan(0);
  });

  // Test menampilkan data produk di tabel
  test("Menampilkan data produk di tabel", async ({ page }) => {
    await page.waitForSelector("table tbody tr", { timeout: 10000 });

    const firstRow = page.locator("table tbody tr").first();
    const productIdCell = firstRow.locator("td").nth(0); // Kolom pertama: ID Produk
    const productNameCell = firstRow.locator("td").nth(1); // Kolom kedua: Nama Produk
    const categoryCell = firstRow.locator("td").nth(2); // Kolom ketiga: Kategori
    const priceCell = firstRow.locator("td").nth(3); // Kolom keempat: Harga

    // Verifikasi bahwa data produk tidak kosong
    await expect(productIdCell).not.toHaveText("");
    await expect(productNameCell).not.toHaveText("");
    await expect(categoryCell).not.toHaveText("");
    await expect(priceCell).not.toHaveText("");
  });

  // Test mengarahkan ke halaman update-product saat tombol Update diklik
  test("Mengarahkan ke halaman update-product saat tombol Update diklik", async ({ page }) => {
    const firstRowUpdateButton = page.locator("table tbody tr:first-child button:has-text('Update')");
    await firstRowUpdateButton.click();

    await expect(page).toHaveURL(/http:\/\/localhost:5173\/update-product\/\d+/);

    const updateFormTitle = page.locator('button:has-text("Update Product")');
    await expect(updateFormTitle).toBeVisible();
  });

  // Test memungkinkan export data produk ke file Excel
  test("Memungkinkan export data produk ke file Excel", async ({ page }) => {
    await page.waitForSelector('button:has-text("Download")', { timeout: 10000 });
    const downloadButton = page.locator('button:has-text("Download")');
    await expect(downloadButton).toBeVisible();
    await downloadButton.click();

    // Menunggu download
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      downloadButton.click(),
    ]);

    const fileName = await download.suggestedFilename();
    expect(fileName).toBe("products_filtered.xlsx");
  });

  // Test mengarahkan halaman ke halaman add-product saat FAB diklik
  test("Harus mengarahkan halaman ke halaman add-product saat FAB diklik", async ({ page }) => {
    const fabButton = page.locator('button[aria-label="add"]');

    await fabButton.waitFor({ state: "visible", timeout: 10000 });
    await expect(fabButton).toBeVisible();
    await fabButton.click();

    await expect(page).toHaveURL("http://localhost:5173/add-product");

    const productFormInput = page.locator('text="Add a New Product"');
    await expect(productFormInput).toBeVisible();
  });

  // Test menghapus produk
  test("Harus menghapus produk", async ({ page }) => {
    const firstRowDeleteButton = page.locator("table tbody tr:first-child button:has-text('Delete')");
    await firstRowDeleteButton.click();

    const alert = page.locator('text="Product deleted successfully!"');
    await expect(alert).toBeVisible();
  });
});
