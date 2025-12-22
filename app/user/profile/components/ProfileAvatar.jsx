"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export default function ProfileAvatar({ avatar, username }) {
    const fileRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const uploadAvatar = async (file) => {
        setLoading(true);

        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch("/api/user/profile/avatar", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            window.location.reload(); // simple refresh
        } else {
            alert("Avatar upload failed");
        }

        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center mb-6">
            <div
                className="relative cursor-pointer"
                onClick={() => fileRef.current.click()}
            >
                <Image
                    src={preview || avatar || "/default-avatar.png"}
                    alt="User Avatar"
                    width={96}
                    height={96}
                    className="rounded-full border-2 border-yellow-400"
                />

                <div className="absolute bottom-0 right-0 bg-[#EC7B03] text-xs px-2 py-1 rounded">
                    Edit
                </div>
            </div>

            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    setPreview(URL.createObjectURL(file));
                    uploadAvatar(file);
                }}
            />

            <p className="mt-2 text-sm text-gray-300">@{username}</p>

            {loading && (
                <p className="text-xs text-yellow-400 mt-1">
                    Uploading...
                </p>
            )}
        </div>
    );
}
