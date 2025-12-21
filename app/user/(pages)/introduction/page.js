import UserIntroHero from "./components/UserIntroHero";
import HumanitarianNote from "./components/HumanitarianNote";
import IntroActions from "./components/IntroActions";

// ✅ Accordion based detailed sections
import DepositSystemAccordion from "./components/DepositSystemAccordion";
import ReferralCommissionAccordion from "./components/ReferralCommissionAccordion";
import ROIRequirementsAccordion from "./components/ROIRequirementsAccordion";
import WalletSystemAccordion from "./components/WalletSystemAccordion";

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
      {/* Hero */}
      <UserIntroHero />

      {/* Detailed requirement sections */}
      <DepositSystemAccordion />
      <ReferralCommissionAccordion />
      <ROIRequirementsAccordion />
      <WalletSystemAccordion />

      {/* Humanitarian commitment */}
      <HumanitarianNote />

      {/* Share + PDF download */}
      <IntroActions />
    </div>
  );
}
