// The card's stripe: alternating filled bars of ink and paper, like the printed band on a kankotri.
// Filled blocks, not a gradient or a border. Height and bar width come from the caller.
export default function Stripe({ className = "h-14", bar = 28 }: { className?: string; bar?: number }) {
  return (
    <div aria-hidden className={`flex overflow-hidden ${className}`}>
      {Array.from({ length: 96 }, (_, i) => (
        <span key={i} className={`h-full shrink-0 ${i % 2 ? "bg-paper" : "bg-ink"}`} style={{ width: bar }} />
      ))}
    </div>
  );
}
