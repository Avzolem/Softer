import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { config } from 'dotenv';

config({ path: '.env.local' });

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
    inStock: true,
    sortOrder: 1
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
    inStock: true,
    sortOrder: 2
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
    inStock: true,
    sortOrder: 3
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
    inStock: true,
    sortOrder: 4
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
    inStock: true,
    sortOrder: 5
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
    inStock: true,
    sortOrder: 6
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
    inStock: true,
    sortOrder: 7
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
    inStock: true,
    sortOrder: 8
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
    inStock: true,
    sortOrder: 9
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
    inStock: true,
    sortOrder: 10
  }
];

async function importProducts() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Limpiar productos existentes (opcional)
    const clearExisting = process.argv.includes('--clear');
    if (clearExisting) {
      await Product.deleteMany({});
      console.log('Productos existentes eliminados');
    }

    // Importar productos
    let imported = 0;
    let skipped = 0;

    for (const productData of initialProducts) {
      // Verificar si el producto ya existe
      const exists = await Product.findOne({ name: productData.name });
      
      if (exists) {
        console.log(`⏭️  Omitido (ya existe): ${productData.name}`);
        skipped++;
        continue;
      }

      // Crear nuevo producto
      const product = new Product(productData);
      await product.save();
      console.log(`✅ Importado: ${productData.name}`);
      imported++;
    }

    console.log(`\n📊 Resumen de importación:`);
    console.log(`   - ${imported} productos importados`);
    console.log(`   - ${skipped} productos omitidos`);
    console.log(`   - Total en base de datos: ${await Product.countDocuments()}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDesconectado de MongoDB');
  }
}

// Ejecutar importación
importProducts();