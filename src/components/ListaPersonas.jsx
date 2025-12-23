import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus, FaMinus } from 'react-icons/fa';
import acidtrollfondo from '../assets/acidtrollfondo.png';

function ListaPersonas() {
  // 1. CORRECCIÓN: Nombres de precios normalizados a plural para coincidir con el estado
  const precios = {
    bebidas: 1500,
    vasoBebida: 1000,
    cervezas: 1000,
    cervezasGrandes: 2000,
    energeticas: 2000,
    alfajores: 1200, 
    choripanes: 1500,
    papasFritas: 1000,
    pisco2x: 5000,
    completos: 2000,
  };

  const [personas, setPersonas] = useState(() => {
    const storedPersonas = localStorage.getItem('listaPersonas');
    return storedPersonas ? JSON.parse(storedPersonas) : [];
  });
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const personRefs = useRef({});

  // 2. CORRECCIÓN: Quitamos el .sort() de aquí para evitar el bucle infinito
  useEffect(() => {
    localStorage.setItem('listaPersonas', JSON.stringify(personas));
  }, [personas]);

  const agregarPersona = () => {
    if (nuevoNombre.trim()) {
      const nuevaPersona = {
        id: uuidv4(),
        nombre: nuevoNombre.toUpperCase(),
        bebidas: 0,
        vasoBebida: 0,
        cervezas: 0,
        cervezasGrandes: 0,
        energeticas: 0,
        alfajores: 0,
        choripanes: 0,
        papasFritas: 0,
        pisco2x: 0,
        completos: 0,
        pagado: false,
      };
      setPersonas(prev => [...prev, nuevaPersona]);
      setNuevoNombre('');
    }
  };

  const actualizarCantidad = (idPersona, tipo, cantidad) => {
    setPersonas(personas.map(persona =>
      persona.id === idPersona
        ? { ...persona, [tipo]: Math.max(0, persona[tipo] + cantidad) }
        : persona
    ));
  };

  const calcularTotalPersona = (persona) => {
    return Object.keys(precios).reduce((acc, item) => {
      return acc + (persona[item] || 0) * precios[item];
    }, 0);
  };

  // 3. JAVASCRIPT PARA EL TOTAL DE TODAS LAS VENTAS
  const totalTodasLasVentas = personas.reduce((acc, persona) => acc + calcularTotalPersona(persona), 0);

  const eliminarPersona = (idPersona) => {
    setPersonas(personas.filter(persona => persona.id !== idPersona));
  };

  const togglePagado = (idPersona) => {
    setPersonas(personas.map(persona =>
      persona.id === idPersona ? { ...persona, pagado: !persona.pagado } : persona
    ));
  };

  const resetearTodasLasCompras = () => {
    const confirmacion = window.confirm("¿Estás seguro de dejar todo en cero?");
    if (confirmacion) {
      setPersonas(personas.map(p => ({
        ...p, bebidas: 0, vasoBebida: 0, cervezas: 0, cervezasGrandes: 0, 
        energeticas: 0, alfajores: 0, choripanes: 0, papasFritas: 0, pisco2x: 0, completos: 0 
      })));
    }
  };

  const filteredPersonas = personas
    .filter(persona => persona.nombre.toUpperCase().includes(searchTerm.toUpperCase()))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

  const handleSearch = () => {
    const foundPerson = filteredPersonas.find(p => p.nombre.includes(searchTerm.toUpperCase()));
    if (foundPerson && personRefs.current[foundPerson.id]) {
      personRefs.current[foundPerson.id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center p-4 sm:p-6 pb-24"
      style={{ backgroundImage: `url(${acidtrollfondo})` }}
    >
      <div className="bg-white bg-opacity-90 p-6 rounded-md shadow-md w-full max-w-lg mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">APP - Lista de Consumos</h2>

        {/* Controles de búsqueda y añadir (se mantienen igual) */}
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Nuevo nombre..."
                    className="border p-2 rounded w-full"
                    value={nuevoNombre}
                    onChange={(e) => setNuevoNombre(e.target.value)}
                />
                <button onClick={agregarPersona} className="bg-green-500 text-white px-4 rounded font-bold">Añadir</button>
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Buscar..."
                    className="border p-2 rounded w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded font-bold">Buscar</button>
            </div>
        </div>

        <button onClick={resetearTodasLasCompras} className="w-full bg-red-600 text-white py-2 rounded mb-4 font-bold">
            Resetear Todas las Compras
        </button>

        <hr className="my-4" />

        <ul className="space-y-4">
          {filteredPersonas.map(persona => (
            <li key={persona.id} ref={el => (personRefs.current[persona.id] = el)} className="bg-gray-100 p-4 border rounded-md shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">{persona.nombre}</h3>
                <button onClick={() => eliminarPersona(persona.id)} className="text-red-500 text-xs">ELIMINAR</button>
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.keys(precios).map(producto => (
                  <div key={producto} className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="capitalize">{producto.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => actualizarCantidad(persona.id, producto, -1)}><FaMinus className="text-red-500"/></button>
                      <span className="font-bold">{persona[producto] || 0}</span>
                      <button onClick={() => actualizarCantidad(persona.id, producto, 1)}><FaPlus className="text-green-500"/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between items-center border-t pt-2">
                <span className="font-bold text-lg">Total: ${calcularTotalPersona(persona)}</span>
                <label className="flex items-center gap-2">
                    <span className="text-[10px] font-bold">{persona.pagado ? 'PAGADO' : 'PENDIENTE'}</span>
                    <input type="checkbox" checked={persona.pagado} onChange={() => togglePagado(persona.id)} className="w-5 h-5" />
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* DIV INFERIOR CON EL TOTAL GLOBAL */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 shadow-2xl flex justify-around items-center border-t-4 border-green-500">
        <div className="text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">APP VENTAS</p>
            <p className="text-xl font-black">TOTAL GENERAL</p>
        </div>
        <div className="text-3xl font-mono text-green-400">
            ${totalTodasLasVentas.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

export default ListaPersonas;