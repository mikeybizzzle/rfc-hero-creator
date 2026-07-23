import {
  findTemplate,
  heroRefsSorted,
  heroRefName,
  heroRefRank,
} from "@/lib/data";
import { rankInfo, type Rank } from "@/lib/prompts";
import { CardSlider } from "./card-slider";
import { CopyImageCard } from "./copy-image-card";
import { StepHeading } from "./flow";
import { PromptForm } from "./prompt-form";

const rankTextClass: Record<Rank, string> = {
  S: "text-rank-s",
  A: "text-rank-a",
  B: "text-rank-b",
};

const ranks: Rank[] = ["S", "A", "B"];

export function HeroFlow() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
        <StepHeading n="1" title="Copy a base card" />
        <p className="text-[14.5px] text-muted leading-normal mb-3.5">
          Tap a card to copy it, then paste it into ChatGPT — pick whichever you like.
          You&rsquo;ll choose your prompt&rsquo;s rank in step 3.
        </p>
        <div className="grid max-w-2xl grid-cols-3 gap-2.5 sm:gap-3">
          {ranks.map((r, i) => (
            <CopyImageCard
              key={r}
              image={findTemplate(rankInfo[r].templateSlug)}
              label=" Rank"
              prefix={r}
              prefixClass={rankTextClass[r]}
              sizes="(max-width: 640px) 30vw, 200px"
              priority={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
        <StepHeading n="2" title="Copy a hero style example" />
        <p className="text-[14.5px] text-muted leading-normal mb-3.5">
          Tap one to copy, paste it into ChatGPT after the base card. It only shows ChatGPT the
          art style — <strong className="text-cream">it doesn&rsquo;t matter much who you pick</strong>.
        </p>
        <CardSlider>
          {heroRefsSorted.map((h) => (
            <CopyImageCard
              key={h.slug}
              image={h}
              label={heroRefName(h)}
              prefix={`${heroRefRank(h)} `}
              prefixClass={rankTextClass[heroRefRank(h)]}
              sizes="(max-width: 640px) 31vw, 175px"
            />
          ))}
        </CardSlider>
        <p className="text-[13px] text-muted mt-1.5">
          Scroll for more &rarr; &nbsp;&middot;&nbsp; If tap-to-copy is blocked on your phone,
          press &amp; hold the image and choose Copy.
        </p>
      </section>

      <section className="step-panel card-frame rounded-[18px] p-4 sm:p-6">
        <StepHeading n="3" title="Build your prompt" />
        <p className="text-[14.5px] text-muted leading-normal mb-3.5">
          Fill in the blanks — the prompt updates itself. Copy it, attach a photo of who
          you&rsquo;re transforming as the 3rd image, paste the prompt, and hit send.
        </p>
        <PromptForm mode="photo" />
        <div className="bg-raised border border-line rounded-xl mt-3.5 px-3.5 py-3 flex items-start gap-2.5">
          <span className="display text-base text-gold shrink-0">GO</span>
          <p className="text-sm text-cream/90 leading-normal">
            In ChatGPT: paste the base card, paste the style example,{" "}
            <strong className="text-cream">attach your photo</strong>, paste the prompt &rarr;
            send. Wait a minute or two.
          </p>
        </div>
      </section>
    </div>
  );
}
