"use client";

import { useEffect, useState } from "react";
import { KineticText } from "@/components/ui/kinetic-text";
import { LightRays } from "@/components/ui/light-rays";
import { PulsatingButton } from "@/components/ui/pulsating-button";
import { TypingAnimation } from "@/components/ui/typing-animation";

const TYPE_SPEED = 90;
const DELETE_SPEED = 40;
const PAUSE_DELAY = 300;
const STAY_DELAY = 7000;

const RECRUITING_WORDS = ["Wir brauchen Dich!"];
const SKYCRY_TEXT = "SkyCryGaming braucht noch 10 Follower auf Twitch :)";

function wordDuration(word: string) {
  return word.length * TYPE_SPEED + PAUSE_DELAY + word.length * DELETE_SPEED;
}

const PHASE1_DURATION =
  RECRUITING_WORDS.slice(0, -1).reduce((acc, w) => acc + wordDuration(w), 0) +
  RECRUITING_WORDS[RECRUITING_WORDS.length - 1].length * TYPE_SPEED +
  STAY_DELAY +
  500;

const PHASE2_DURATION = SKYCRY_TEXT.length * TYPE_SPEED + STAY_DELAY + 500;

export default function Page() {
  const [phase, setPhase] = useState<"recruiting" | "skycry">("recruiting");
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const duration = phase === "recruiting" ? PHASE1_DURATION : PHASE2_DURATION;
    const timer = setTimeout(() => {
      if (phase === "recruiting") {
        setPhase("skycry");
      } else {
        setPhase("recruiting");
        setCycle((c) => c + 1);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [phase, cycle]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 flex flex-col items-center justify-center">
      <LightRays color="hsl(213 90% 70%)" count={12} />

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-5xl">
        <KineticText
          text="CLAN IMG"
          className="text-[4rem] sm:text-[6rem] md:text-[8rem] font-bold tracking-tight text-white"
        />
        <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light -mt-4">
          bereitet sich auf Release vor...
        </p>

        <a
          href="https://discord.gg/clan-img"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2"
        >
          <PulsatingButton
            variant="ripple"
            distance="10px"
            className="bg-indigo-600 text-white"
          >
            Join Discord for more funny Content
          </PulsatingButton>
        </a>

        <div className="mt-8 h-10 flex items-center justify-center">
          {phase === "recruiting" ? (
            <TypingAnimation
              key={`recruiting-${cycle}`}
              words={RECRUITING_WORDS}
              loop={false}
              pauseDelay={PAUSE_DELAY}
              typeSpeed={TYPE_SPEED}
              deleteSpeed={DELETE_SPEED}
              startOnView={false}
              className="text-lg sm:text-xl text-white/70 font-light"
            />
          ) : (
            <TypingAnimation
              key={`skycry-${cycle}`}
              loop={false}
              typeSpeed={TYPE_SPEED}
              startOnView={false}
              className="text-lg sm:text-xl text-white/70 font-light"
            >
              {SKYCRY_TEXT}
            </TypingAnimation>
          )}
        </div>
      </div>
    </div>
  );
}
