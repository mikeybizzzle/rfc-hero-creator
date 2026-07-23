export function SiteFooter() {
  return (
    <footer className="mt-14 border-t border-line/60 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-7 text-[13px] text-[#e5e5e5]">
        <span className="display text-base text-white">RfC alliance</span>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>Last Z: Survival Shooter</span>
          <span aria-hidden="true">·</span>
          <span>Works with the ChatGPT app or chatgpt.com</span>
        </div>
      </div>
    </footer>
  );
}
