import type { test, Page } from "@playwright/test";
import { format } from "prettier";

export function noOperatingSystemInSnapshotFilename(t: typeof test) {
  // Playwright says "First argument must use the object destructuring pattern"
  // eslint-disable-next-line no-empty-pattern
  t.beforeAll(({}, testInfo) => {
    testInfo.snapshotSuffix = ""; // no operating system name in snapshot filename
  });
}

export async function getHtml(
  page: Page,
  selector: string = "#__next"
): Promise<string> {
  const raw = await page.locator(selector).innerHTML();
  return format(raw, { parser: "html" });
}

export class GraphqlRequestCounter {
  public count = 0;
  constructor(private page: Page) {
    this.page.on("request", (request) => {
      const { pathname } = new URL(request.url());
      if (pathname === "/api/graphql") {
        this.count++;
      }
    });
  }
}
