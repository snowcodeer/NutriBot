"use client";

/**
 * Constrains the UI to a phone-width column and (on larger screens) a device frame
 * so the product reads as a mobile app in the browser.
 */
export function MobileAppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-[#050505] md:items-center md:py-6">
      <div
        className="flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background md:h-[min(852px,calc(100dvh-3rem))] md:rounded-[2.25rem] md:border md:border-white/10 md:shadow-[0_25px_80px_-24px_rgba(0,0,0,0.85)]"
        data-mobile-shell
      >
        <div
          className="flex min-h-0 min-w-0 flex-1 flex-col"
          style={{
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingLeft: "env(safe-area-inset-left, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
          }}
        >
          <div className="app-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
