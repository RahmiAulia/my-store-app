import { test, expect } from "@playwright/test";

test.describe("Add Product Form Test", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/add-product");
  });

  // Test routing dari header ke halaman utama
  test("Header bisa route ke halaman utama", async ({ page }) => {
    const header = page.locator('text="Product"');
    await expect(header).toBeVisible();
    await expect(header).toHaveText("Product");

    await header.click();
    await expect(page).toHaveURL("http://localhost:5173/");
  });

  // Test untuk memastikan error muncul saat harga negatif
  test("Menampilkan error ketika harga negatif", async ({ page }) => {
    await page.fill('input[name="title"]', "Sample Product");
    await page.fill('input[name="price"]', "-10"); // Harga negatif
    await page.fill('input[name="description"]', "This is a description");
    await page.fill('input[name="image"]', "http://example.com/image.jpg");
    await page.fill('input[name="category"]', "Sample Category");

    await page.click('button[type="submit"]');

    const alertMessage = page.locator('text="Price cannot be negative!"');
    await expect(alertMessage).toBeVisible();
  });

  // Test jika input hanya spasi
  test("Menampilkan error ketika input berupa spasi", async ({ page }) => {
    await page.fill('input[name="title"]', " ");
    await page.fill('input[name="price"]', "0");
    await page.fill('input[name="description"]', " ");
    await page.fill('input[name="image"]', " ");
    await page.fill('input[name="category"]', " ");

    await page.click('button[type="submit"]');

    const alertMessage = page.locator('text="All fields are required"');
    await page.waitForSelector('text="All fields are required"', {
      timeout: 10000,
    });
    await expect(alertMessage).toBeVisible();
  });

  // Test untuk memastikan produk ditambahkan dengan input yang valid
  test("Menambahkan produk dengan input yang valid", async ({ page }) => {
    await page.fill('input[name="title"]', "test product");
    await page.fill('input[name="price"]', "1000");
    await page.fill('input[name="description"]', "test a valid description");
    await page.fill('input[name="image"]', "test image link");
    await page.fill('input[name="category"]', "test category");

    await page.click('button[type="submit"]');

    // Pastikan halaman berhasil dialihkan
    await expect(page).toHaveURL("http://localhost:5173/");

    const successMessage = page.locator('text="Product added successfully!"');
    await expect(successMessage).toBeVisible();
  });
});
