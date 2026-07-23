export function CardSlider({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory scroll-pl-1 pt-0.5 pb-2.5 px-0.5">
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[min(31vw,175px)] gap-2.5">
        {children}
      </div>
    </div>
  );
}
