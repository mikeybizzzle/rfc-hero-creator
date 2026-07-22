export function CardSlider({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto snap-x snap-mandatory scroll-pl-4 -mx-4 px-4 pb-2">
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[30vw] sm:auto-cols-[168px] gap-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
