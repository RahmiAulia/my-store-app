import { test, expect } from "@playwright/test";

test.describe("Add Product Form Test", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("http://localhost:5173/add-product");
      
    });
  
    test('Should display error if price is negative', async ({ page }) => {
      // Isi semua field
      await page.fill('input[name="title"]', 'Sample Product');
      await page.fill('input[name="price"]', '-10');  // Harga negatif
      await page.fill('input[name="description"]', 'This is a description');
      await page.fill('input[name="image"]', 'http://example.com/image.jpg');
      await page.fill('input[name="category"]', 'Sample Category');
  
      // Klik tombol submit
      await page.click('button[type="submit"]');
  
      // Verifikasi bahwa pesan error muncul
      const alertMessage = page.locator('text="Price cannot be negative!"');
      await expect(alertMessage).toBeVisible();
    });
  
    test("menambahkan produk dengan input yang valid", async ({ page }) => {
      //mengisi semua field
      await page.fill('input[name="title"]', "test product");
      await page.fill('input[name="price"]', "1000");
      await page.fill('input[name="description"]', "test a valid description");
      await page.fill('input[name="image"]', "test image link");
      await page.fill('input[name="category"]', "test category");
  
      await page.click('button[type="submit"]');
  
      await expect(page).toHaveURL("http://localhost:5173/");
  
      const successMessage = await page.locator(
        'text="Product added successfully!"'
      );
      await expect(successMessage).toBeVisible();
    });
  });