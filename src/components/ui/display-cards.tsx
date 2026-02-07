"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Shield, Sun, Zap } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-secondary",
  titleClassName = "text-secondary",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-border bg-card/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-secondary/30 hover:bg-card [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn("relative inline-flex size-6 items-center justify-center rounded-full bg-primary/10", iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-heading font-semibold", titleClassName)}>{title}</p>
      </div>

      <p className="whitespace-nowrap text-lg text-muted-foreground font-body">{description}</p>

      <p className="text-muted-foreground text-sm font-body">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      icon: <Shield className="size-4" />,
      title: "Security Systems",
      description: "CCTV & Smart Protection",
      date: "24/7 Monitoring",
      iconClassName: "text-primary",
      titleClassName: "text-primary",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Sun className="size-4" />,
      title: "Solar Energy",
      description: "Clean Power Solutions",
      date: "Save up to 70%",
      iconClassName: "text-secondary",
      titleClassName: "text-secondary",
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Zap className="size-4" />,
      title: "Electrical",
      description: "Professional Installation",
      date: "Certified Team",
      iconClassName: "text-accent",
      titleClassName: "text-accent",
      className:
        "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}

export { DisplayCards, DisplayCard };
export type { DisplayCardProps, DisplayCardsProps };
