
export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Reduced moving stars - much fewer and slower */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 3}s`
          }}
        />
      ))}
      
      {/* Single subtle shooting star */}
      <div
        className="absolute w-16 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent animate-shooting-star"
        style={{
          left: '20%',
          top: '30%',
          animationDelay: '2s',
          animationDuration: '6s'
        }}
      />
    </div>
  );
};
