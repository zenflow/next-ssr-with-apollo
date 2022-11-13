/* eslint-disable testing-library/prefer-screen-queries */

import { expect, test } from "@playwright/test";
import {
  getHtml,
  GraphqlRequestCounter,
  noOperatingSystemInSnapshotFilename,
} from "./helpers";

noOperatingSystemInSnapshotFilename(test);

test("main", async ({ page }) => {
  const graphqlRequest = new GraphqlRequestCounter(page);

  // go to home page
  await page.goto("/", { waitUntil: "commit" });
  const homeInitialHtml = await getHtml(page);
  await expect(page.locator(".where-rendered")).toHaveText("client rendered"); // wait
  const homeHtml = await getHtml(page);
  expect(homeHtml).toEqual(
    homeInitialHtml.replace("server rendered", "client rendered")
  );
  await expect(homeHtml).toMatchSnapshot("01-home.html");
  expect(graphqlRequest.count).toEqual(0);

  // go to Rick Sanchez page
  await page.locator("a:text('Rick Sanchez')").click();
  await expect(page.locator(".loader.is-loading")).toHaveCount(1); // wait
  expect(await getHtml(page)).toEqual(
    homeHtml.replace("loader is-not-loading", "loader is-loading") // stays on previous page while loading next
  );
  await expect(page.locator(".loader.is-not-loading")).toHaveCount(1); // wait
  const rickHtml = await getHtml(page);
  await expect(rickHtml).toMatchSnapshot("02-rick.html");
  expect(graphqlRequest.count).toEqual(3);

  // refresh Rick Sanchez page
  await page.reload({ waitUntil: "commit" });
  expect(await getHtml(page)).toEqual(
    rickHtml.replace("client rendered", "server rendered")
  );
  await expect(page.locator(".where-rendered")).toHaveText("client rendered"); // wait
  expect(await getHtml(page)).toEqual(rickHtml);
  expect(graphqlRequest.count).toEqual(3);

  // go to Morty Brown page
  await page.locator("a:text('Morty Brown')").click();
  await expect(page.locator(".loader.is-loading")).toHaveCount(1); // wait
  expect(await getHtml(page)).toEqual(
    rickHtml.replace("loader is-not-loading", "loader is-loading") // stays on previous page while loading next
  );
  await expect(page.locator(".loader.is-not-loading")).toHaveCount(1); // wait
  const mortyHtml = await getHtml(page);
  await expect(mortyHtml).toMatchSnapshot("03-morty.html");
  expect(graphqlRequest.count).toEqual(6);
});
