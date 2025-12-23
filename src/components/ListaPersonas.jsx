import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FaPlus, FaMinus } from 'react-icons/fa';
import acidtrollfondo from '../assets/acidtrollfondo.png';

function ListaPersonas() {
  // 1. CLAVE ÚNICA PARA LOCALSTORAGE (Evita choques con apps viejas)
  const STORAGE_KEY = 'listaVentas_AcidTroll_v2';

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
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validamos que sea un array para evitar errores de datos corruptos
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error("Error cargando LocalStorage, iniciando vacío", error);
      return [];
    }
  });
  
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const personRefs = useRef({});

  // 2. EFECTO DE GUARDADO (Sin bucles infinitos)
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(personas));
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
    return Object.keys(precios).reduce((acc, key) => {
      return acc + (persona[key] || 0) * precios[key];
    }, 0);
  };

  // 3. TOTAL GENERAL DE VENTAS
  const totalGeneralVentas = personas.reduce((acc, p) => acc + calcularTotalPersona(p), 0);

  const eliminarPersona = (idPersona) => {
    setPersonas(personas.filter(persona => persona.id !== idPersona));
  };

  const togglePagado = (idPersona) => {
    setPersonas(personas.map(persona =>
      persona.id === idPersona ? { ...persona, pagado: !persona.pagado } : persona
    ));
  };

  const resetearTodasLasCompras = () => {
    if (window.confirm("¿Seguro que quieres limpiar todos los consumos?")) {
      setPersonas(personas.map(p => ({
        ...p, bebidas: 0, vasoBebida: 0, cervezas: 0, cervezasGrandes: 0, 
        energeticas: 0, alfajores: 0, choripanes: 0, papasFritas: 0, pisco2x: 0, completos: 0 
      })));
    }
  };

  // Ordenamos para la vista
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
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col items-center p-4 pb-32"
      style={{ backgroundImage: `url(${acidtrollfondo})` }}
    >
      <div className="bg-white bg-opacity-95 p-6 rounded-lg shadow-2xl w-full max-w-lg border-t-8 border-blue-600">
        <h2 className="text-2xl font-black mb-6 text-center text-blue-900 tracking-tighter">SISTEMA DE VENTAS</h2>

        <div className="space-y-3 mb-6">
          <input
            type="text"
            placeholder="Nombre del Cliente..."
            className="border-2 border-gray-200 p-3 rounded-md w-full focus:border-blue-500 outline-none transition-all"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && agregarPersona()}
          />
          <div className="flex gap-2">
            <button onClick={agregarPersona} className="bg-blue-600 text-white flex-1 py-3 rounded-md font-bold hover:bg-blue-700">AÑADIR</button>
            <button onClick={resetearTodasLasCompras} className="bg-red-100 text-red-600 px-4 rounded-md font-bold hover:bg-red-200 uppercase text-xs">Reset</button>
          </div>
        </div>

        <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Buscar en la lista..."
              className="bg-gray-100 p-2 rounded w-full text-sm border-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <ul className="space-y-6">
          {filteredPersonas.map(persona => (
            <li key={persona.id} ref={el => (personRefs.current[persona.id] = el)} className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div className="bg-gray-800 p-3 flex justify-between items-center text-white">
                <h3 className="font-bold uppercase tracking-wide">{persona.nombre}</h3>
                <button onClick={() => eliminarPersona(persona.id)} className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-[10px] hover:bg-red-500 hover:text-white transition">BORRAR</button>
              </div>

              <div className="p-4 grid grid-cols-2 gap-3">
                {Object.keys(precios).map(prod => (
                  <div key={prod} className="flex flex-col bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[9px] font-black text-gray-400 uppercase mb-1">{prod.replace(/([A-Z])/g, ' $1')}</span>
                    <div className="flex justify-between items-center">
                      <button onClick={() => actualizarCantidad(persona.id, prod, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-red-500"><FaMinus size={10}/></button>
                      <span className="font-bold text-lg">{persona[prod] || 0}</span>
                      <button onClick={() => actualizarCantidad(persona.id, prod, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-green-500"><FaPlus size={10}/></button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 flex justify-between items-center border-t">
                <div className="flex flex-col">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">Total a pagar</span>
                    <span className="font-black text-2xl text-blue-900">${calcularTotalPersona(persona).toLocaleString()}</span>
                </div>
                <button 
                    onClick={() => togglePagado(persona.id)}
                    className={`px-4 py-2 rounded-full font-black text-[10px] transition-all ${persona.pagado ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-white border-2 border-orange-400 text-orange-500'}`}
                >
                    {persona.pagado ? '✓ PAGADO' : 'PENDIENTE'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* DIV INFERIOR CON TOTAL GENERAL */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-600 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 flex justify-center">
        <div className="max-w-lg w-full flex justify-between items-center px-4">
            <div>
                <p className="text-[10px] font-black text-blue-400 uppercase leading-none">Ventas Totales APP</p>
                <p className="text-gray-900 font-black text-xl italic leading-none">ACID TROLL</p>
            </div>
            <div className="bg-blue-900 text-white px-6 py-2 rounded-lg text-3xl font-black shadow-lg">
                ${totalGeneralVentas.toLocaleString()}
            </div>
        </div>
      </div>
    </div>
  );
}

export default ListaPersonas;