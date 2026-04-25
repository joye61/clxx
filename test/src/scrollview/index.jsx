import "./index.css";
import BasicSection from "./BasicSection";
import ImperativeSection from "./ImperativeSection";
import CustomLoadingSection from "./CustomLoadingSection";
import NotScrollableSection from "./NotScrollableSection";
import PerfSection from "./PerfSection";
import HeightModeSection from "./HeightModeSection";

export default function Index() {
  return (
    <div className="scrollview-demo">
      <BasicSection />
      <ImperativeSection />
      <CustomLoadingSection />
      <NotScrollableSection />
      <PerfSection />
      <HeightModeSection />
    </div>
  );
}
