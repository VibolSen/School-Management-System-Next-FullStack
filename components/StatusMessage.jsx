const StatusMessage = ({ error, success, setError, setSuccess }) => {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")} className="font-bold text-xl">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess("")} className="font-bold text-xl">
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default StatusMessage;
