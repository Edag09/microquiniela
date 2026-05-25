const Footer = () => {
  return (
    <footer
      className="text-center p-3 border-top-1"
      style={{
        borderColor: "var(--surface-border)",
        color: "var(--text-color-secondary)",
        fontSize: "0.85rem",
      }}
    >
      <span>🏆 Microquiniela — Mundial 2026 </span>
      <span className="mx-2">·</span>
      <span>🇺🇸 USA · 🇲🇽 México · 🇨🇦 Canadá</span>
    </footer>
  );
};

export default Footer;