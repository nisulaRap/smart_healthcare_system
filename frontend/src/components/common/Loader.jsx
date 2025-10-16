const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 ${sizes[size]}`}
      />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
};

export default Loader;