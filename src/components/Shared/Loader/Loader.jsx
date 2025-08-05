const Loader = () => {
    return (
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Simple line loader at top */}
        <div className="w-full h-1 bg-gray-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-gray-100 to-transparent animate-slide"></div>
        </div>
        
        <style jsx>{`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
          .animate-slide {
            animation: slide 1.2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  };
  
  export default Loader;