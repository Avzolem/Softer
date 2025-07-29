"use client";

import { useState } from "react";
import Link from "next/link";
import apiClient from "@/libs/api";
import toast from "react-hot-toast";

// Productos iniciales basados en las imágenes analizadas
const initialProducts = [
  {
    name: "Arnés Angel Wings",
    description: "Arnés de cuero sintético con diseño de alas de ángel. Perfecto para añadir un toque atrevido y único a tu look.",
    price: 899,
    originalPrice: 1299,
    category: "Premium",
    image: "/images/products/softer.mx_1590984365_2321667591510357441_35563853848.webp",
    colors: ["Negro"],
    sizes: ["S", "M", "L"],
    isNew: false,
    featured: true,
    inStock: true
  },
  {
    name: "Body Brillante Crystal",
    description: "Body de malla con cristales brillantes. Diseño elegante y sensual con mangas largas y escote pronunciado.",
    price: 1299,
    originalPrice: 1599,
    category: "Bodies",
    image: "/images/products/softer.mx_1593896006_2346092201110451313_35563853848.webp",
    colors: ["Negro", "Plateado"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    featured: true,
    inStock: true
  },
  {
    name: "Conjunto Maid Fantasy",
    description: "Conjunto de lencería temático con detalles de encaje y volantes. Incluye top, panty y accesorios.",
    price: 999,
    originalPrice: 1399,
    category: "Conjuntos",
    image: "/images/products/softer.mx_1598645832_2385936630910476217_35563853848.webp",
    colors: ["Negro", "Blanco"],
    sizes: ["S", "M", "L"],
    isNew: false,
    featured: true,
    inStock: true
  },
  {
    name: "Conjunto Angelical Blanco",
    description: "Delicado conjunto de lencería con volantes y encaje. Diseño romántico y femenino en color blanco puro.",
    price: 799,
    originalPrice: 999,
    category: "Conjuntos",
    image: "/images/products/softer.mx_1600919405_2405008744123549851_35563853848.webp",
    colors: ["Blanco", "Rosa"],
    sizes: ["XS", "S", "M", "L"],
    isNew: true,
    featured: true,
    inStock: true
  },
  {
    name: "Brasier Encaje Floral",
    description: "Brasier de encaje con diseño floral delicado. Copa suave con soporte natural y tirantes ajustables.",
    price: 499,
    originalPrice: 699,
    category: "Brasieres",
    image: "/images/products/softer.mx_1603807217_2429233470140237658_35563853848.webp",
    colors: ["Negro", "Blanco", "Rosa", "Nude"],
    sizes: ["32A", "32B", "34A", "34B", "34C", "36B", "36C"],
    isNew: false,
    featured: false,
    inStock: true
  },
  {
    name: "Body Transparente Mesh",
    description: "Body de malla transparente con detalles estratégicos. Diseño minimalista y sensual.",
    price: 899,
    originalPrice: 1199,
    category: "Bodies",
    image: "/images/products/softer.mx_1604857685_2438045434232508518_35563853848.webp",
    colors: ["Negro", "Nude"],
    sizes: ["S", "M", "L"],
    isNew: false,
    featured: true,
    inStock: true
  },
  {
    name: "Conjunto Básico Algodón",
    description: "Conjunto de brasier y panty en algodón suave. Perfecto para el uso diario con máxima comodidad.",
    price: 399,
    originalPrice: 499,
    category: "Básicos",
    image: "/images/products/softer.mx_1605678934_2444934567035026678_35563853848.webp",
    colors: ["Negro", "Blanco", "Gris", "Nude"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: false,
    featured: false,
    inStock: true
  },
  {
    name: "Conjunto Premium Satín",
    description: "Lujoso conjunto de satín con detalles de encaje francés. Incluye brasier con push-up y panty brasileña.",
    price: 1499,
    originalPrice: 1899,
    category: "Premium",
    image: "/images/products/softer.mx_1606245696_2449688908749064617_35563853848.webp",
    colors: ["Negro", "Rojo Vino", "Azul Noche"],
    sizes: ["S", "M", "L"],
    isNew: true,
    featured: true,
    inStock: true
  },
  {
    name: "Brasier Push-Up Encaje",
    description: "Brasier con efecto push-up y hermoso encaje. Realza tu figura naturalmente.",
    price: 599,
    originalPrice: 799,
    category: "Brasieres",
    image: "/images/products/softer.mx_1606951821_2455612319203446116_35563853848.webp",
    colors: ["Negro", "Blanco", "Rosa"],
    sizes: ["32A", "32B", "34A", "34B", "34C", "36B"],
    isNew: false,
    featured: false,
    inStock: true
  },
  {
    name: "Body Encaje Romántico",
    description: "Body de encaje con diseño romántico y femenino. Escote profundo y espalda descubierta.",
    price: 999,
    originalPrice: 1299,
    category: "Bodies",
    image: "/images/products/softer.mx_1607219766_2457860004430158184_35563853848.webp",
    colors: ["Negro", "Blanco", "Burgundy"],
    sizes: ["S", "M", "L"],
    isNew: true,
    featured: true,
    inStock: true
  }
];

export default function ImportProductsPage() {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  const handleImport = async () => {
    setImporting(true);
    setResults(null);

    try {
      let imported = 0;
      let skipped = 0;
      let errors = 0;

      for (const productData of initialProducts) {
        try {
          await apiClient.post('/api/admin/products', productData);
          imported++;
          toast.success(`Importado: ${productData.name}`);
        } catch (error) {
          if (error.response?.status === 409) {
            // Producto ya existe
            skipped++;
            console.log(`Omitido: ${productData.name}`);
          } else {
            errors++;
            console.error(`Error con ${productData.name}:`, error);
            toast.error(`Error: ${productData.name}`);
          }
        }
      }

      setResults({ imported, skipped, errors });
      toast.success(`Importación completada: ${imported} productos importados`);

    } catch (error) {
      console.error('Error en importación:', error);
      toast.error('Error durante la importación');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Importar Productos</h1>
        <Link href="/admin/dashboard/products" className="btn btn-ghost">
          ← Volver
        </Link>
      </div>

      {/* Info */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Importación de Productos Iniciales</h2>
          <p className="text-gray-600 mb-4">
            Esta función importará {initialProducts.length} productos iniciales basados en las imágenes 
            de Softer MX. Los productos incluyen descripciones detalladas, precios, categorías y configuraciones.
          </p>
          
          <div className="space-y-2 text-sm">
            <p><strong>Categorías incluidas:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Premium (arneses y piezas exclusivas)</li>
              <li>Bodies (bodies transparentes, brillantes, encaje)</li>
              <li>Conjuntos (sets temáticos y románticos)</li>
              <li>Brasieres (push-up, encaje, básicos)</li>
              <li>Básicos (uso diario, algodón)</li>
            </ul>
          </div>

          <div className="alert alert-info mt-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Los productos duplicados serán omitidos automáticamente</span>
          </div>
        </div>
      </div>

      {/* Lista previa de productos */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h3 className="text-lg font-semibold mb-4">Productos a Importar</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {initialProducts.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">{product.category}</span>
                    </td>
                    <td>
                      <div>
                        <span className="font-semibold">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through ml-1">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        {product.featured && <span className="badge badge-primary badge-sm">Destacado</span>}
                        {product.isNew && <span className="badge badge-success badge-sm">Nuevo</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Botón de importación */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <div className="flex justify-center">
            <button
              onClick={handleImport}
              disabled={importing}
              className="btn btn-primary btn-lg"
            >
              {importing ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Importando productos...
                </>
              ) : (
                `Importar ${initialProducts.length} Productos`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {results && (
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="text-lg font-semibold mb-4">Resultados de Importación</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="stat">
                <div className="stat-title">Importados</div>
                <div className="stat-value text-success">{results.imported}</div>
                <div className="stat-desc">Productos nuevos</div>
              </div>
              <div className="stat">
                <div className="stat-title">Omitidos</div>
                <div className="stat-value text-warning">{results.skipped}</div>
                <div className="stat-desc">Ya existían</div>
              </div>
              <div className="stat">
                <div className="stat-title">Errores</div>
                <div className="stat-value text-error">{results.errors}</div>
                <div className="stat-desc">Con problemas</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}