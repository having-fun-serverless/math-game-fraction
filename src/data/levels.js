export const QPL = 5;
export const PASS = 4;

export const LEVELS = [
  {
    id: 1, name: "Golden", emoji: "✨", description: "כפל וחילוק ב-10, 100, 1000",
    spotifyId: "1CPZ5BxNNd0n0nF4Orb9JS", color: "#FFD700",
    generate: () => {
      const ops = [
        () => {
          const a = +(Math.random() * 90 + 1).toFixed(Math.floor(Math.random() * 3) + 1);
          const m = [10, 100, 1000][Math.floor(Math.random() * 3)];
          return { q: `${a} × ${m} = ?`, a: +(a * m).toFixed(4) };
        },
        () => {
          const m = [10, 100, 1000][Math.floor(Math.random() * 3)];
          const a = +(Math.random() * 900 + 10).toFixed(Math.floor(Math.random() * 3) + 1);
          return { q: `${a} ÷ ${m} = ?`, a: +(a / m).toFixed(6) };
        },
      ];
      return ops[Math.floor(Math.random() * ops.length)]();
    },
  },
  {
    id: 2, name: "How It's Done", emoji: "⚡", description: "כפל מספרים עשרוניים (א)",
    spotifyId: "4iSXiBGqVNflQPYnYciMBT", color: "#FF69B4",
    generate: () => {
      const a = +(Math.floor(Math.random() * 90 + 10) / 10).toFixed(1);
      const b = +(Math.floor(Math.random() * 9 + 1) / 10).toFixed(1);
      return { q: `${a} × ${b} = ?`, a: +(a * b).toFixed(4) };
    },
  },
  {
    id: 3, name: "Soda Pop", emoji: "🫧", description: "כפל מספרים עשרוניים (ב)",
    spotifyId: "02sy7FAs8dkDNYsHp4Ul3f", color: "#00BFFF",
    generate: () => {
      const a = +(Math.floor(Math.random() * 90 + 10) / 10).toFixed(1);
      const b = +(Math.floor(Math.random() * 90 + 10) / 10).toFixed(1);
      return { q: `${a} × ${b} = ?`, a: +(a * b).toFixed(4) };
    },
  },
  {
    id: 4, name: "What It Sounds Like", emoji: "🔥", description: "חילוק מספרים עשרוניים",
    spotifyId: "3TGxSPlHPbrhGhw0DVdHqN", color: "#9B59B6",
    generate: () => {
      const b = +(Math.floor(Math.random() * 9 + 1) / 10).toFixed(1);
      const r = +(Math.floor(Math.random() * 90 + 10) / 10).toFixed(1);
      const a = +(b * r).toFixed(4);
      return { q: `${a} ÷ ${b} = ?`, a: r };
    },
  },
  {
    id: 5, name: "Golden Honmoon 🌙", emoji: "👹", description: "משבר פשוט למספר עשרוני",
    spotifyId: "1CPZ5BxNNd0n0nF4Orb9JS", color: "#FFD700",
    generate: () => {
      const ds = [2, 4, 5, 8, 10, 20, 25, 50];
      const d = ds[Math.floor(Math.random() * ds.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      return { q: `הפכו לעשרוני: ${n}/${d} = ?`, a: +(n / d).toFixed(6) };
    },
  },
];
