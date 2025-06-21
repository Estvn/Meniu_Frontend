function GenericComponent() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600">
          Hello, Vite + React!
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-700 max-w-md">
          This is a simple PWA example designed to be responsive on all devices.
        </p>
      </div>
    </div>
  );
}
export default GenericComponent;