"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const SCENES = [
  { src: "/images/landing/clarte.jpg", label: "Clarté" },
  { src: "/images/landing/collaboration.jpg", label: "Collaboration" },
  { src: "/images/landing/concentration.jpg", label: "Concentration" },
];

const SCENE_DURATION = 6500;

// Arrière-plan cinématique : 3 ambiances qui s'enchaînent, parallaxe
// à la souris, orbes lumineux, grain, indicateur de scène.
// Doit être placé dans un conteneur .landing (variables --pointer-x/y).
export default function LandingEffects() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(0);

  // Rotation automatique (désactivée si l'utilisateur réduit les animations)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % SCENES.length),
      SCENE_DURATION,
    );

    return () => window.clearTimeout(timer);
  }, [active]);

  // Parallaxe : met à jour les variables CSS du conteneur .landing
  useEffect(() => {
    const landing = rootRef.current?.closest(".landing");
    if (!landing) return;

    function handleMove(event) {
      const rect = landing.getBoundingClientRect();
      landing.style.setProperty(
        "--pointer-x",
        String((event.clientX - rect.left) / rect.width - 0.5),
      );
      landing.style.setProperty(
        "--pointer-y",
        String((event.clientY - rect.top) / rect.height - 0.5),
      );
    }

    function handleLeave() {
      landing.style.setProperty("--pointer-x", "0");
      landing.style.setProperty("--pointer-y", "0");
    }

    landing.addEventListener("pointermove", handleMove);
    landing.addEventListener("pointerleave", handleLeave);

    return () => {
      landing.removeEventListener("pointermove", handleMove);
      landing.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <>
      <div ref={rootRef} className="landing-bg" aria-hidden="true">
        {SCENES.map((scene, index) => (
          <div
            key={scene.src}
            className={`landing-scene ${index === active ? "is-active" : ""}`}
          >
            <Image
              src={scene.src}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="landing-depth" />
        <div className="landing-vignette" />
        <div className="landing-grain" />
        <div className="landing-orb landing-orb-one" />
        <div className="landing-orb landing-orb-two" />
      </div>

      <div className="landing-scene-control">
        <span className="landing-scene-name" key={active} aria-live="off">
          {String(active + 1).padStart(2, "0")} — {SCENES[active].label}
        </span>
        <div>
          {SCENES.map((scene, index) => (
            <button
              key={scene.label}
              type="button"
              className={index === active ? "is-active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Afficher l’ambiance ${scene.label}`}
              aria-current={index === active ? "true" : undefined}
            >
              <span />
            </button>
          ))}
        </div>
      </div>

      <div className="landing-scroll-cue" aria-hidden="true">
        <span />
        Explorer
      </div>
    </>
  );
}
