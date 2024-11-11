import { test, expect } from "@playwright/test";

test.describe("Store App Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  test("Harus menampilkan header halaman dengan benar", async ({ page }) => {
    const header = page.locator('text="Product"');
    await expect(header).toBeVisible(); //Memastikan header terlihat di halaman
    await expect(header).toHaveText("Product"); // Verifikasi teks header
  });

  test("Harus menampilkan daftar produk", async ({ page }) => {
    await expect(page.locator("Table")).toBeVisible();
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

  // test('Harus memungkinkan menghapus produk', async ({ page }) => {
  //   await page.click('table tbody tr:first-child button:has-text("Delete")');
  //   const modal = page.locator('.modal');
  //   await expect(modal).toBeVisible();
  //   await modal.click('button:has-text("Confirm")');
  //   const rowCountAfterDelete = await page.locator('table tbody tr').count();
  //   const rowCountBeforeDelete = await page.locator('table tbody tr').count();
  //   expect(rowCountAfterDelete).toBeLessThan(rowCountBeforeDelete);
  // });

  test("Harus mengarahkan halaman ke halaman add-product saat FAB diklik", async ({
    page,
  }) => {
    //menemunkan fab dengan selector
    const fabButton = page.locator('button[aria-label = "add"]');

    //verifikasi bahwa fab ada di halaman
    await expect(fabButton).toBeVisible();
    await fabButton.click();
    await expect(page).toHaveURL("http://localhost:5173/add-product");

    //melakukan verifikasi bahwa form yang berada pada halaman add product ada atau muncul
    const productFormInput = page.locator('text="Add a New Product"');
    await expect(productFormInput).toBeVisible();
  });
});


