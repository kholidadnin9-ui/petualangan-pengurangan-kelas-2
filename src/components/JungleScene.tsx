export default function JungleScene() {
  return (
    <>
      <div
        className="jungle-scene"
        style={{
          ["--bg" as string]: "url('/jungle-bg.jpg')",
        }}
      />

      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
    </>
  );
}
