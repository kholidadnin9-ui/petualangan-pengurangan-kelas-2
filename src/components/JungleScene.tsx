import jungleBg from "../assets/jungle-bg.jpg";

export default function JungleScene() {
  return (
    <>
      <div
        className="jungle-scene"
        style={{ ["--bg" as string]: `url(${jungleBg})` }}
      />
      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
    </>
  );
}
