const PlaceholderList = () => {
  return (
    <>
      {Array(4)
        .fill(null)
        .map((_, i) => (
          <li key={'balance-list' + i} className="animate-shimmer h-6 bg-gray-400"></li>
        ))}
    </>
  );
};

export default PlaceholderList;
