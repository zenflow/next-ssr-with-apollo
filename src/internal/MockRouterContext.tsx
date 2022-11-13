import React from "react";
import type { AppContext } from "next/app";
import type { NextRouter } from "next/router";
import { RouterContext } from "next/dist/shared/lib/router-context";

export const MockRouterContext: React.FC<{
  ctx: AppContext;
  children: React.ReactNode;
}> = ({ ctx, children }) => {
  const mockRouter = {
    asPath: ctx.ctx.asPath,
    basePath: ctx.router.basePath,
    pathname: ctx.ctx.pathname,
    query: ctx.ctx.query,
    isReady: true,
    isFallback: false,
    isPreview: false,
  } as NextRouter;
  return (
    <RouterContext.Provider value={mockRouter}>
      {children}
    </RouterContext.Provider>
  );
};
