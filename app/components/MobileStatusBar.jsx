export default function MobileStatusBar() {
  return (
    <div className="w-full h-8 bg-black text-white flex items-center justify-between px-4 text-xs">
      {/* Time */}
      <span>9:41</span>

      {/* Icons */}
      <div className="flex items-center gap-2">
        {/* Signal */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M2 20h2v-2H2v2zm4 0h2v-6H6v6zm4 0h2v-10h-2v10zm4 0h2v-14h-2v14zm4 0h2V4h-2v16z" />
        </svg>

        {/* WiFi */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
          <path d="M12 18c-.552 0-1 .447-1 1s.448 1 1 1 1-.447 1-1-.448-1-1-1zm6-2c-.737 0-1.477.204-2.121.586l-1.415-1.415A5.979 5.979 0 0 1 12 14c-1.64 0-3.209.664-4.464 1.929l-1.414-1.414A7.963 7.963 0 0 1 12 12c2.137 0 4.14.833 5.657 2.343L18 16zm4-4c-3.867-3.867-10.133-3.867-14 0l-1.414-1.414c4.688-4.688 12.24-4.688 16.97 0L22 12z" />
        </svg>

        {/* Battery */}
        <div className="flex items-center">
          <div className="w-6 h-3 border border-white rounded-sm flex items-center">
            <div className="w-4 h-full bg-white" />
          </div>
          <div className="w-1 h-2 bg-white ml-1 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
