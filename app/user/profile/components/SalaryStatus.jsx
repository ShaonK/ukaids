"use client";

export default function SalaryStatus({ rank }) {
    if (!rank) return null;

    if (!rank.salaryStartAt) {
        return (
            <p className="text-xs text-gray-400 mt-1">
                ⏳ Salary will start after 30 days
            </p>
        );
    }

    const start = new Date(rank.salaryStartAt);
    const now = new Date();
    const diff = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

    if (diff > 0) {
        return (
            <p className="text-xs text-yellow-400 mt-1">
                ⏳ Salary starts in {diff} days
            </p>
        );
    }

    return (
        <p className="text-xs text-green-400 mt-1">
            💰 Salary Active
        </p>
    );
}
