import ListaPersonas from './components/ListaPersonas';
import aborellanaimg from './assets/aborellana.jpeg';

function App() {
  return (
    
      <div className="mx-auto p-4 text-center bg-black min-h-screen flex flex-col justify-center items-center">
        <div className='flex flex-col sm:flex-row items-center justify-center mb-4'>
          <img src={aborellanaimg} alt="martino" className="h-16 sm:h-20 mr-0 sm:mr-4 object-contain rounded-full mb-2 sm:mb-0" />
          <h1 className="text-xl sm:text-3xl font-bold text-white rgb-text">ACID CAVE CONTROL DE VENTAS</h1>
          <h2 className="text-lg sm:text-xl font-semibold text-white ml-2 hidden sm:block">APP </h2>
        </div>
        <ListaPersonas />
        <h2 className="text-lg sm:text-xl font-semibold text-white mt-4 block sm:hidden">APP </h2>
      </div>
    
  );
}

export default App;