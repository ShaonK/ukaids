export default function PublicHome() {
    return (
        <div className="p-5">
            <h1 className="text-xl font-bold text-center">Ukaids Referral App</h1>
            <p className="text-gray-600 text-center mt-2">
                Welcome to the system. Please Login or Register.
            </p>

            <div className="flex flex-col gap-3 mt-6">
                <a
                    href="/login"
                    className="bg-blue-600 text-white p-3 rounded text-center active:scale-95 transition"
                >
                    Login
                </a>

                <a
                    href="/register"
                    className="bg-green-600 text-white p-3 rounded text-center active:scale-95 transition"
                >
                    Register
                </a>
            </div>

            <footer className="mt-10 text-center text-gray-500 text-sm">
                © 2025 Ukaids. All rights reserved.
            </footer>
        </div>
    );
}
