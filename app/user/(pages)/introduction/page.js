import UserIntroHero from "./components/UserIntroHero";
import SystemFlow from "./components/SystemFlow";
import HumanitarianNote from "./components/HumanitarianNote";
import IntroRules from "./components/IntroRules";
import WalletOverview from "./components/WalletOverview";
import IntroActions from "./components/IntroActions";

export const metadata = {
  title: "Introduction | UKAIDS",
};

export default function IntroductionPage() {
  return (
    <div
      id="intro-pdf"
      data-pdf="true"
      className="w-[360px] min-h-screen mx-auto bg-[#121212] text-white pb-10"
    >
      <UserIntroHero />
      <SystemFlow />
      <HumanitarianNote />
      <IntroRules />
      <WalletOverview />
      <IntroActions />
    </div>
  );
}
