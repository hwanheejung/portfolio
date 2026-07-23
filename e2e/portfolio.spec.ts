import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  page.on("pageerror", (error) => {
    console.error(`Browser error: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      console.error(`Browser console: ${message.text()}`);
    }
  });
});

test("home composes content-driven sections", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Building human-centered products/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByText("Featured work", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "@Karrot | Product Engineer" }),
  ).toBeVisible();
});

test("article spotlight opens by default and disclosure rows toggle", async ({
  page,
}) => {
  await page.goto("/articles");

  const automation = page.locator("#automation");
  const spotlight = automation.getByRole("button", {
    name: "스위치로 만든 계산기 preview",
  });
  const secondArticle = automation.getByRole("button", {
    name: "Karrot | Local jobs preview",
  });

  await expect(spotlight).toHaveAttribute("aria-expanded", "true");
  await secondArticle.hover();
  await expect(secondArticle).toHaveAttribute("aria-expanded", "true");
  await expect(spotlight).toHaveAttribute("aria-expanded", "false");
  await page.getByRole("banner").hover();
  await expect(spotlight).toHaveAttribute("aria-expanded", "true");
  await secondArticle.click();
  await expect(secondArticle).toHaveAttribute("aria-expanded", "true");
  await expect(spotlight).toHaveAttribute("aria-expanded", "false");

  await automation
    .getByRole("link", { name: "Read Karrot | Local jobs", exact: true })
    .click();
  await expect(page).toHaveURL("/articles/karrot-local-jobs");
});

test("an MDX article renders an interactive component", async ({ page }) => {
  await page.goto("/articles/adder");

  await expect(
    page.getByRole("heading", { level: 1, name: "스위치로 만든 계산기" }),
  ).toBeVisible();
  const node = page.getByRole("button", { name: "A: 0" });
  await node.click();
  await expect(page.getByRole("button", { name: "A: 1" })).toBeVisible();
});

test("about renders curated experiences", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: /Leadership is creating room/,
    }),
  ).toBeVisible();
  const experience = page.getByRole("complementary");
  await expect(experience.getByText("Karrot", { exact: true })).toBeVisible();
  await expect(
    experience.getByText("Product Engineer", { exact: true }),
  ).toBeVisible();
  await expect(experience.getByText("Naver", { exact: true })).toBeVisible();
  await expect(
    experience.getByText("Frontend Engineer", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "About Hwanhee" }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByText("How I work", { exact: true }),
  ).toBeVisible();
});
