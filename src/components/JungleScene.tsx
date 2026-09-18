export default function JungleScene() {
  const jungleBg = `${import.meta.env.BASE_URL}jungle-bg.jpg`;

  return (
    <>
      <div
        className="jungle-scene"
        style={{
          ["--bg" as string]: `url("${jungleBg}")`,
        }}
      />

      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
    </>
  );
}
