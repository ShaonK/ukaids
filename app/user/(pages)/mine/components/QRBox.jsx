import Image from "next/image";

export default function QRBox({ address }) {
    function copyAddress() {
        navigator.clipboard.writeText(address);
        alert("Wallet Address Copied!");
    }

    return (
        <div>
            <p className="text-sm mb-2">Method Currency: <span className="text-[#EC7B03]">USDT</span></p>

            {/* Copy Button */}
            <button
                onClick={copyAddress}
                className="
          w-full py-2 rounded-md 
          bg-[#EC7B03] text-white font-semibold 
          active:scale-95
        "
            >
                Copy Wallet Address
            </button>

            {/* QR CODE */}
            <div className="flex justify-center mt-4">
                <div className="bg-white p-3 rounded-lg">
                    <Image
                        src="/qr.png"    // ← এখানে তোমার আসল QR image দিবে
                        width={180}
                        height={180}
                        alt="QR Code"
                    />
                </div>
            </div>

            {/* Wallet Address */}
            <p className="text-center mt-3 text-[12px] text-gray-300 break-all">
                {address}
            </p>
        </div>
    );
}
