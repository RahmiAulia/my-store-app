import { test, expect } from "@playwright/test";

test.describe("Update Product form test", () => {
  test.beforeEach(async ({ page }) => {
    const productId = "2";
    await page.goto(`http://localhost:5173/update-product/${productId}`);
  });

  test("Header bisa route ke halaman utama", async ({ page }) => {
    const header = page.locator('text="Product"');
    await expect(header).toBeVisible();
    await expect(header).toHaveText("Product");

    await header.click();
    await expect(page).toHaveURL("http://localhost:5173/");
  });

    test("Memastikan bahwa form update tampil", async ({ page }) => {
      const title = page.locator('text="Product Title"');
      await expect(title).toBeVisible();

      const price = page.locator('text="Price"');
      await expect(price).toBeVisible();

      const description = page.locator('text="Description"');
      await expect(description).toBeVisible();

      const image = page.locator('text="Image Link"');
      await expect(image).toBeVisible();

      const category = page.locator('text="Category"');
      await expect(category).toBeVisible();
    });

    test("Melakukan update data", async ({page}) => {
      await page.fill('input[name="title"]', "Sample Product");
      await page.fill('input[name="price"]', "1000");
      await page.fill('input[name="description"]', "This is a description");
      await page.fill('input[name="image"]', "http://example.com/image.jpg");
      await page.fill('input[name="category"]', "Sample Category");

      await page.click('button[type="submit"]');

      const alertMessage = page.locator('text="Product updated successfully!"');
      await expect(alertMessage).toBeVisible();
    });

    test("Menampilkan error ketika harga negatif", async ({ page }) => {
      await page.fill('input[name="title"]', "Sample Product");
      await page.fill('input[name="price"]', "-1000"); // Harga negatif
      await page.fill('input[name="description"]', "This is a description");
      await page.fill('input[name="image"]', "http://example.com/image.jpg");
      await page.fill('input[name="category"]', "Sample Category");

      await page.click('button[type="submit"]');

      const alertMessage = page.locator('text="Price cannot be negative!"');
      await expect(alertMessage).toBeVisible();
    });

    test("Menampilkan error ketika input berupa spasi", async ({ page }) => {
      await page.fill('input[name="title"]', " ");
      await page.fill('input[name="price"]', "0");
      await page.fill('input[name="description"]', " ");
      await page.fill('input[name="image"]', " ");
      await page.fill('input[name="category"]', " ");

      await page.click('button[type="submit"]');

      const alertMessage = page.locator('text="All fields are required"');
      await expect(alertMessage).toBeVisible();
    });
});
