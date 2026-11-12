import type { ProjectContent } from "./types";

export const wids25: ProjectContent = {
  slug: "wids-25",
  title: "wids '25",
  category: "Reinforcement Learning",
  description: "Deep Q-Learning agent designed for high-frequency trading simulations.",
  intro:
    "A Deep Q-Learning agent designed for high-frequency trading simulations, trained to react to sequential market state rather than static snapshots.",
  cover: { type: "image", src: "/dqn2.webp", width: 1600, height: 341 },
  hero: { type: "image", src: "/dqn2.webp", width: 1600, height: 341 },
  meta: {
    role: "Quant Researcher",
    timeline: "2025",
    team: ["Solo"],
    stack: ["Gymnasium", "PyTorch", "Pandas", "DQN"],
    links: [
      {
        label: "github",
        href: "https://github.com/silentlooop/Kalman-Filtered-Trend-Trader-A-Deep-Reinforcement-Learning-Agent-for-Portfolio-Optimization",
      },
    ],
  },
  metrics: [{ value: "+15%", label: "vs buy & hold" }],
  sections: [
    {
      heading: "The Problem",
      body: "Modeling market volatility is complex. Standard regression models fail to capture the sequential decision-making nature of trading, where immediate actions affect future rewards.",
      layout: "inset",
      media: [{ type: "image", placeholder: "market state / problem framing visual" }],
    },
    {
      heading: "Agent & Training",
      body: "Developed a Deep Q-Network agent. The model takes market state vectors (MACD, RSI, Price Action) as input and outputs discrete actions (Buy, Sell, Hold). Implemented Experience Replay to stabilize training.",
      layout: "split",
      media: [
        { type: "image", placeholder: "DQN architecture diagram" },
        { type: "image", placeholder: "training-reward curve" },
      ],
    },
    {
      heading: "Backtest Results",
      body: "Outperformed the baseline 'Buy and Hold' strategy by 15% in backtesting on historical NIFTY 50 data during high-volatility periods.",
      layout: "inset",
      media: [{ type: "image", placeholder: "backtest equity curve vs. buy & hold" }],
    },
  ],
  nextProject: "karyogram",
};
