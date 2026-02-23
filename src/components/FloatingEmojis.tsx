const emojis = [
  { emoji: "🌶️", top: "10%", left: "5%", rotation: "-15deg", delay: "0s" },
  { emoji: "🥚", top: "20%", right: "8%", rotation: "20deg", delay: "0.5s" },
  { emoji: "🍅", top: "60%", left: "3%", rotation: "10deg", delay: "1s" },
  { emoji: "🧅", top: "70%", right: "5%", rotation: "-25deg", delay: "1.5s" },
  { emoji: "🫙", top: "40%", left: "7%", rotation: "15deg", delay: "0.8s" },
  { emoji: "🍛", top: "45%", right: "4%", rotation: "-10deg", delay: "1.2s" },
  { emoji: "🥔", top: "85%", left: "10%", rotation: "30deg", delay: "0.3s" },
  { emoji: "🫑", top: "15%", right: "15%", rotation: "-20deg", delay: "0.7s" },
];

const FloatingEmojis = () => (
  <>
    {emojis.map((item, i) => (
      <span
        key={i}
        className="absolute text-3xl md:text-5xl animate-float pointer-events-none select-none opacity-40"
        style={{
          top: item.top,
          left: item.left,
          right: item.right,
          ["--rotation" as string]: item.rotation,
          animationDelay: item.delay,
        }}
      >
        {item.emoji}
      </span>
    ))}
  </>
);

export default FloatingEmojis;
