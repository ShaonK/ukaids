"use client";

import { useState } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";

export default function GetPage() {
    const [copied, setCopied] = useState(false);

    const link = "https://ukaids.com/r/YOUR-USERNAME";

    const copyLink = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <div className="space-y-4">
            <Card>
                <h2 className="text-lg font-bold text-gray-800">Your Referral Link</h2>

                <p className="bg-gray-100 p-2 rounded text-blue-700 text-sm mt-2">
                    {link}
                </p>

                <Button
                    label={copied ? "Copied!" : "Copy Link"}
                    onClick={copyLink}
                    className="mt-3"
                />
            </Card>

            <Card>
                <h3 className="font-semibold text-gray-700">How it Works?</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Share your referral link.
                    When someone signs up & deposits → you earn commissions.
                </p>
            </Card>
        </div>
    );
}
