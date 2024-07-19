import ProductCard from "./components/ProductCard";




const App = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="./background1.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <ProductCard />
      </div>
    </div>
  );
}

export default App;
