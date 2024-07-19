import ProductCard from "./components/ProductCard";

const App = () => {
  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <img
        src="https://img.freepik.com/free-vector/gradient-black-background-with-cubes_23-2149152313.jpg?size=626&ext=jpg&ga=GA1.1.1960653922.1712669991&semt=ais_user"
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
