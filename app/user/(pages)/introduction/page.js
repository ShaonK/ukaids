import UserIntroHero from "./components/UserIntroHero";
import HumanitarianNote from "./components/HumanitarianNote";
import IntroActions from "./components/IntroActions";

// ✅ Accordion based detailed sections
import DepositSystemAccordion from "./components/DepositSystemAccordion";
import ReferralCommissionAccordion from "./components/ReferralCommissionAccordion";
import ROIRequirementsAccordion from "./components/ROIRequirementsAccordion";
import WalletSystemAccordion from "./components/WalletSystemAccordion";
import VIPRankAccordion from "./components/VIPRankAccordion";
import WithdrawSystemAccordion from "./components/WithdrawSystemAccordion";
import PlatformOverviewCard from "./components/PlatformOverviewCard";



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
      <PlatformOverviewCard />
      <DepositSystemAccordion />
      <ReferralCommissionAccordion />
      <ROIRequirementsAccordion />
      <WalletSystemAccordion />
      <VIPRankAccordion />
      <WithdrawSystemAccordion />
      <HumanitarianNote />
      <IntroActions />
    </div>
  );
}
