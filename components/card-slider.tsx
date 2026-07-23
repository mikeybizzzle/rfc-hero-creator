export function CardSlider({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-none overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-pl-1 px-0.5 pb-2.5 pt-0.5">
      <div className="grid auto-cols-[clamp(104px,29vw,175px)] grid-flow-col grid-rows-2 gap-2.5">
        {children}
      </div>
    </div>
  );
}
