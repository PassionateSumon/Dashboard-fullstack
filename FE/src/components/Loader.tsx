const Loader = () => {
  // console.log("here")
  return (
    <div className="loading-overlay">
      <div className="loader">Loading...</div>
      <style>{`
        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .loader {
          padding: 20px;
          background: white;
          border-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default Loader;
