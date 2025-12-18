"use client";

import { useEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useStackingAnimation = (containerRef: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const main = containerRef.current;
    if (!main) return;

    const sections = gsap.utils.toArray<HTMLElement>("section");

    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        if (i < sections.length - 1) {
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            pin: true,
            pinSpacing: false,
            scrub: true,
          });
        }
      });

      sections.forEach((section) => {
        gsap.from(section.querySelectorAll(".reveal"), {
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power2.out",
        });
      });
    }, main);

    return () => ctx.revert();
  }, [containerRef]);
};