export function ThinkingDots() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_infinite] rounded-full bg-zinc-400/80" />
      <div className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_0.2s_infinite] rounded-full bg-zinc-400/80" />
      <div className="h-2 w-2 animate-[pulse_1.2s_ease-in-out_0.4s_infinite] rounded-full bg-zinc-400/80" />
    </div>
  );
}

