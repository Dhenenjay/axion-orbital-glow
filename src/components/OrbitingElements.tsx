
export const OrbitingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Single, very subtle orbit */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full h-full rounded-full border border-cyan-400/5 animate-spin" style={{ animationDuration: '120s' }}>
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400/30 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};
