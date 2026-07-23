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
    page.getByRole("heading", { name: "@Karrot | Selected work" }),
  ).toBeVisible();
  await expect(page.getByText("Resume", { exact: true })).toBeVisible();
});

test("article filters update the URL and category result", async ({ page }) => {
  await page.goto("/articles");

  const automation = page.locator("#automation");
  await automation.getByRole("button", { name: "Naver" }).click();

  await expect(page).toHaveURL(/automation=naver/);
  await expect(
    automation.getByRole("heading", {
      name: "팀의 반복 업무를 줄이는 자동화 시스템",
    }),
  ).toBeVisible();
  await expect(
    automation.getByRole("heading", { name: "스위치로 만든 계산기" }),
  ).toHaveCount(0);
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
  await expect(page.getByText(/Karrot \| Product Engineer/)).toBeVisible();
  await expect(page.getByText(/Naver \| Frontend Engineer/)).toBeVisible();
});
