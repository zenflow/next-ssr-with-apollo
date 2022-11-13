import { expect, test } from "@playwright/test";
import {
  GraphqlRequestCounter,
  noOperatingSystemInSnapshotFilename,
} from "./helpers";

noOperatingSystemInSnapshotFilename(test);

test("directly", async ({ page }) => {
  const graphqlRequest = new GraphqlRequestCounter(page);
  await page.goto("/no-ssr-query", { waitUntil: "commit" });
  await Promise.all([
    expect(page.locator(".where-rendered")).toHaveText("server rendered"),
    expect(page.locator("main")).toHaveText("Loading..."),
  ]);
  await Promise.all([
    expect(page.locator(".where-rendered")).toHaveText("client rendered"),
    expect(page.locator("main")).toHaveText("6 seasons"),
  ]);
  expect(graphqlRequest.count).toEqual(1);
});

test("indirectly", async ({ page }) => {
  const graphqlRequest = new GraphqlRequestCounter(page);
  await page.goto("/");
  await page.locator("a:text('no-ssr-query')").click();
  await expect(page.locator(".loader.is-loading")).toHaveCount(1); // wait
  expect(graphqlRequest.count).toEqual(1); // 1 request before navigating to page
  await expect(page).toHaveURL("/no-ssr-query"); // wait
  expect(graphqlRequest.count).toEqual(2); // 1 more request after navigating to page
  await expect(page.locator("main")).toHaveText("Loading...");
  await expect(page.locator("main")).toHaveText("6 seasons");
});
