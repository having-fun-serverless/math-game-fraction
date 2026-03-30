export default function SpotifyEmbed({ trackId }) {
  return (
    <div style={{
      margin: "16px auto",
      maxWidth: 340,
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 0 30px rgba(255,215,0,0.3)",
      animation: "slideIn 0.6s ease",
    }}>
      <iframe
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: 16 }}
      />
    </div>
  );
}
