import DailyKeyScore from "./components/DailyKeyScore";
import EarningsOverview from "./components/EarningsOverview";
import MyWallets from "./components/MyWallets";
import UserActionMenu from "./components/UserActionMenu";

export default function MinePage() {
  return (
    <div className="w-full p-4 flex flex-col items-center">
      <DailyKeyScore name="dks ukaids" score={70} />
      <MyWallets income="250.00" personal="250.00" />
      {/* Earnings Overview Section */}
      <EarningsOverview />
      <UserActionMenu />
    </div>
  );
}
