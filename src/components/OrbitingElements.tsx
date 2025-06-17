
export const OrbitingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large Orbit */}
      <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full h-full rounded-full border border-cyan-400/10 animate-spin" style={{ animationDuration: '60s' }}>
          <div className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400/50"></div>
          <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
        </div>
      </div>
      
      {/* Medium Orbit */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full h-full rounded-full border border-purple-400/10 animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}>
          <div className="absolute top-1/4 right-0 w-2 h-2 bg-purple-400 rounded-full translate-x-1/2 shadow-lg shadow-purple-400/50"></div>
          <div className="absolute bottom-1/3 left-0 w-1.5 h-1.5 bg-indigo-400 rounded-full -translate-x-1/2 shadow-lg shadow-indigo-400/50"></div>
        </div>
      </div>
      
      {/* Small Orbit */}
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-full h-full rounded-full border border-emerald-400/10 animate-spin" style={{ animationDuration: '25s' }}>
          <div className="absolute top-0 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-lg shadow-emerald-400/50"></div>
          <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-teal-400 rounded-full shadow-lg shadow-teal-400/50"></div>
        </div>
      </div>
    </div>
  );
};
