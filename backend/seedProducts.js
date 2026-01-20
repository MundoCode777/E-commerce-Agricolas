// backend/seedProducts.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const productos = [
  // ========== VERDURAS ==========
  {
    nombre: 'Tomates Orgánicos',
    descripcion: 'Tomates frescos y jugosos',
    descripcionLarga: 'Tomates rojos maduros cultivados de forma orgánica en nuestras fincas. Perfectos para ensaladas, salsas y guisos. Rico en licopeno y vitaminas.',
    precio: 3.50,
    image: '🍅',
    imagenes: ['🍅', '🍅', '🍅'],
    unit: 'kg',
    categoria: 'verduras',
    stock: 150,
    origen: 'Ecuador',
    certificaciones: ['Orgánico', 'Sin Pesticidas'],
    beneficios: [
      'Rico en licopeno y antioxidantes',
      'Bajo en calorías',
      'Ayuda a la salud cardiovascular',
      'Buena fuente de vitamina C'
    ],
    informacionNutricional: {
      calorias: '18 kcal por 100g',
      proteinas: '0.9g',
      carbohidratos: '3.9g',
      grasas: '0.2g',
      fibra: '1.2g',
      vitaminas: ['Vitamina C', 'Vitamina A', 'Vitamina K']
    }
  },
  {
    nombre: 'Lechugas Verdes',
    descripcion: 'Lechugas crocantes y frescas',
    descripcionLarga: 'Lechugas verdes cultivadas hidropónicamente. Crujientes, frescas y llenas de sabor. Ideales para ensaladas saludables.',
    precio: 2.00,
    image: '🥬',
    imagenes: ['🥬', '🥬', '🥬'],
    unit: 'unidad',
    categoria: 'verduras',
    stock: 200,
    origen: 'Ecuador',
    beneficios: [
      'Baja en calorías',
      'Rica en fibra',
      'Alto contenido de agua',
      'Fuente de vitaminas A y K'
    ],
    informacionNutricional: {
      calorias: '15 kcal por 100g',
      proteinas: '1.4g',
      carbohidratos: '2.9g',
      grasas: '0.2g',
      fibra: '1.3g',
      vitaminas: ['Vitamina A', 'Vitamina K', 'Ácido fólico']
    }
  },
  {
    nombre: 'Zanahorias',
    descripcion: 'Zanahorias dulces y nutritivas',
    descripcionLarga: 'Zanahorias frescas cultivadas en tierra rica en nutrientes. Dulces, crujientes y perfectas tanto crudas como cocidas.',
    precio: 2.80,
    image: '🥕',
    imagenes: ['🥕', '🥕', '🥕'],
    unit: 'kg',
    categoria: 'verduras',
    stock: 180,
    origen: 'Ecuador',
    beneficios: [
      'Excelente fuente de beta-caroteno',
      'Mejora la visión',
      'Fortalece el sistema inmunológico',
      'Buena para la piel'
    ],
    informacionNutricional: {
      calorias: '41 kcal por 100g',
      proteinas: '0.9g',
      carbohidratos: '9.6g',
      grasas: '0.2g',
      fibra: '2.8g',
      vitaminas: ['Vitamina A', 'Vitamina K', 'Potasio']
    }
  },
  {
    nombre: 'Brócoli',
    descripcion: 'Brócoli fresco y saludable',
    descripcionLarga: 'Brócoli verde fresco, rico en nutrientes y antioxidantes. Perfecto para una alimentación saludable.',
    precio: 3.20,
    image: '🥦',
    imagenes: ['🥦', '🥦', '🥦'],
    unit: 'kg',
    categoria: 'verduras',
    stock: 120,
    origen: 'Ecuador',
    beneficios: [
      'Alto en vitamina C y K',
      'Propiedades anticancerígenas',
      'Rico en antioxidantes',
      'Fortalece los huesos'
    ],
    informacionNutricional: {
      calorias: '34 kcal por 100g',
      proteinas: '2.8g',
      carbohidratos: '7g',
      grasas: '0.4g',
      fibra: '2.6g',
      vitaminas: ['Vitamina C', 'Vitamina K', 'Ácido fólico']
    }
  },
  {
    nombre: 'Pimientos',
    descripcion: 'Pimientos rojos y verdes',
    descripcionLarga: 'Pimientos frescos y coloridos. Perfectos para saltear, asar o comer crudos en ensaladas.',
    precio: 4.00,
    image: '🫑',
    imagenes: ['🫑', '🫑', '🫑'],
    unit: 'kg',
    categoria: 'verduras',
    stock: 100,
    origen: 'Ecuador',
    beneficios: [
      'Rico en vitamina C',
      'Antioxidantes naturales',
      'Bajo en calorías',
      'Mejora la salud ocular'
    ],
    informacionNutricional: {
      calorias: '31 kcal por 100g',
      proteinas: '1g',
      carbohidratos: '6g',
      grasas: '0.3g',
      fibra: '2.1g',
      vitaminas: ['Vitamina C', 'Vitamina A', 'Vitamina B6']
    }
  },
  {
    nombre: 'Cebollas',
    descripcion: 'Cebollas blancas y moradas',
    descripcionLarga: 'Cebollas frescas de alta calidad. Base esencial para infinidad de recetas.',
    precio: 1.80,
    image: '🧅',
    imagenes: ['🧅', '🧅', '🧅'],
    unit: 'kg',
    categoria: 'verduras',
    stock: 220,
    origen: 'Ecuador',
    beneficios: [
      'Propiedades antibacterianas',
      'Mejora la salud cardiovascular',
      'Rico en antioxidantes',
      'Fortalece el sistema inmune'
    ],
    informacionNutricional: {
      calorias: '40 kcal por 100g',
      proteinas: '1.1g',
      carbohidratos: '9.3g',
      grasas: '0.1g',
      fibra: '1.7g',
      vitaminas: ['Vitamina C', 'Vitamina B6', 'Ácido fólico']
    }
  },

  // ========== TUBÉRCULOS ==========
  {
    nombre: 'Papas',
    descripcion: 'Papas de primera calidad',
    descripcionLarga: 'Papas frescas ideales para cualquier preparación. Perfectas para freír, hornear o hervir. Alta calidad garantizada.',
    precio: 1.50,
    image: '🥔',
    imagenes: ['🥔', '🥔', '🥔'],
    unit: 'kg',
    categoria: 'tuberculos',
    stock: 250,
    origen: 'Ecuador',
    beneficios: [
      'Rica en potasio',
      'Fuente de energía',
      'Alto contenido de vitamina C',
      'Versátil en la cocina'
    ],
    informacionNutricional: {
      calorias: '77 kcal por 100g',
      proteinas: '2g',
      carbohidratos: '17g',
      grasas: '0.1g',
      fibra: '2.2g',
      vitaminas: ['Vitamina C', 'Vitamina B6', 'Potasio']
    }
  },

  // ========== GRANOS ==========
  {
    nombre: 'Maíz',
    descripcion: 'Maíz tierno y dulce',
    descripcionLarga: 'Mazorcas de maíz tierno y dulce. Perfecto para asar, hervir o preparar en ensaladas.',
    precio: 2.50,
    image: '🌽',
    imagenes: ['🌽', '🌽', '🌽'],
    unit: 'kg',
    categoria: 'granos',
    stock: 150,
    origen: 'Ecuador',
    beneficios: [
      'Alto contenido de fibra',
      'Fuente de energía',
      'Rico en antioxidantes',
      'Contiene vitaminas del complejo B'
    ],
    informacionNutricional: {
      calorias: '86 kcal por 100g',
      proteinas: '3.3g',
      carbohidratos: '19g',
      grasas: '1.4g',
      fibra: '2.7g',
      vitaminas: ['Vitamina B', 'Vitamina C', 'Magnesio']
    }
  },

  // ========== AGROQUÍMICOS ==========
  {
    nombre: 'Glifosato 48% SL',
    descripcion: 'Herbicida sistémico de amplio espectro',
    descripcionLarga: 'El glifosato es un herbicida sistémico no selectivo utilizado para el control eficaz de malezas anuales y perennes. Actúa inhibiendo el crecimiento de las plantas no deseadas y es ampliamente usado en agricultura para la preparación del terreno antes de la siembra. Formulación concentrada al 48%.',
    precio: 20.00,
    image: '🧪',
    imagenes: ['🧪', '⚠️', '🌱'],
    unit: 'litro',
    categoria: 'agroquimicos',
    stock: 80,
    disponible: true,
    marca: 'AgroTech',
    esAgroquimico: true,
    beneficios: [
      'Control eficaz de malezas',
      'Acción sistémica',
      'Amplio espectro',
      'Uso agrícola profesional'
    ],
    informacionUso: {
      tipo: 'Herbicida sistémico no selectivo',
      aplicacion: 'Aspersión foliar con equipo de bombeo',
      dosis: '1-3 litros por hectárea según tipo de maleza (consultar etiqueta)',
      advertencia: 'USO EXCLUSIVO AGRÍCOLA - VENTA BAJO RECETA AGRONÓMICA'
    },
    informacionSeguridad: {
      precauciones: [
        'Usar equipo de protección personal completo (guantes, mascarilla, overol)',
        'Evitar contacto con la piel, ojos y mucosas',
        'No inhalar vapores o neblina',
        'No contaminar fuentes de agua, ríos o quebradas',
        'Mantener alejado de niños y animales domésticos',
        'No comer, beber ni fumar durante la aplicación',
        'Lavar las manos y cara después del uso',
        'Almacenar en lugar fresco, seco y bajo llave'
      ],
      simbolos: ['☠️', '⚠️', '🚫'],
      clasificacion: 'Clase II - Moderadamente Peligroso',
      restricciones: 'Prohibido su uso cerca de cuerpos de agua. Aplicar solo en cultivos autorizados.'
    }
  },
  {
    nombre: 'Abono NPK 10-30-10',
    descripcion: 'Fertilizante completo balanceado',
    descripcionLarga: 'Fertilizante granulado de liberación controlada con balance NPK 10-30-10. Ideal para promover el desarrollo radicular y la floración. Rico en fósforo para etapas críticas del cultivo.',
    precio: 35.00,
    image: '💊',
    imagenes: ['💊', '🌱', '📦'],
    unit: 'saco 50kg',
    categoria: 'fertilizantes',
    stock: 60,
    disponible: true,
    marca: 'FertiCrop',
    esAgroquimico: false,
    beneficios: [
      'Promueve desarrollo radicular',
      'Estimula la floración',
      'Balance nutricional completo',
      'Liberación controlada'
    ],
    informacionUso: {
      tipo: 'Fertilizante NPK granulado',
      aplicacion: 'Aplicación al suelo incorporado o en banda',
      dosis: '200-400 kg por hectárea según cultivo y análisis de suelo',
      advertencia: 'Seguir recomendaciones agronómicas'
    },
    informacionSeguridad: {
      precauciones: [
        'Usar guantes al manipular',
        'Evitar contacto con los ojos',
        'Lavar las manos después de usar',
        'Almacenar en lugar seco y ventilado'
      ],
      simbolos: ['⚠️'],
      clasificacion: 'Producto de baja toxicidad',
      restricciones: 'No aplicar en exceso para evitar contaminación de aguas subterráneas'
    }
  },
  {
    nombre: 'Insecticida Cipermetrina 25%',
    descripcion: 'Insecticida piretroide de amplio espectro',
    descripcionLarga: 'Insecticida de contacto e ingestión del grupo de los piretroides. Efectivo contra una amplia gama de insectos plaga en cultivos agrícolas. Acción rápida y efecto residual.',
    precio: 28.00,
    image: '🦟',
    imagenes: ['🦟', '⚠️', '🌿'],
    unit: 'litro',
    categoria: 'agroquimicos',
    stock: 50,
    disponible: true,
    marca: 'PlagControl',
    esAgroquimico: true,
    beneficios: [
      'Acción rápida contra insectos',
      'Amplio espectro de control',
      'Efecto residual prolongado',
      'Compatible con otros productos'
    ],
    informacionUso: {
      tipo: 'Insecticida piretroide',
      aplicacion: 'Aspersión foliar dirigida a las plagas',
      dosis: '0.5-1 litro por hectárea según plaga (consultar etiqueta)',
      advertencia: 'USO AGRÍCOLA - VENTA BAJO RECETA AGRONÓMICA'
    },
    informacionSeguridad: {
      precauciones: [
        'Usar equipo de protección personal completo',
        'Altamente tóxico para abejas y peces',
        'No aplicar en floración',
        'Respetar períodos de carencia antes de cosecha',
        'No contaminar fuentes de agua',
        'Evitar deriva hacia cultivos vecinos',
        'Almacenar bajo llave lejos de alimentos'
      ],
      simbolos: ['☠️', '⚠️', '🐝', '🐟'],
      clasificacion: 'Clase II - Moderadamente Peligroso',
      restricciones: 'Prohibido uso en zonas cercanas a colmenas o cuerpos de agua. Respetar carencia de 15 días.'
    }
  },
  {
    nombre: 'Fungicida Mancozeb 80%',
    descripcion: 'Fungicida preventivo de contacto',
    descripcionLarga: 'Fungicida de contacto de amplio espectro para el control preventivo de enfermedades fungosas. Ideal para aplicaciones preventivas en diversos cultivos. Formulación en polvo mojable.',
    precio: 18.00,
    image: '🍄',
    imagenes: ['🍄', '⚠️', '💧'],
    unit: 'kg',
    categoria: 'agroquimicos',
    stock: 70,
    disponible: true,
    marca: 'FungiPro',
    esAgroquimico: true,
    beneficios: [
      'Amplio espectro de acción',
      'Control preventivo eficaz',
      'Compatible en mezclas',
      'Buena adherencia foliar'
    ],
    informacionUso: {
      tipo: 'Fungicida preventivo de contacto',
      aplicacion: 'Aspersión foliar preventiva',
      dosis: '2-3 kg por hectárea según cultivo y enfermedad',
      advertencia: 'USO AGRÍCOLA - APLICAR PREVENTIVAMENTE'
    },
    informacionSeguridad: {
      precauciones: [
        'Usar equipo de protección completo',
        'Evitar inhalación del polvo',
        'No aplicar con equipos manuales sin protección',
        'Respetar intervalos entre aplicaciones',
        'No mezclar con productos alcalinos',
        'Lavar equipo después de usar'
      ],
      simbolos: ['⚠️', '🚫'],
      clasificacion: 'Clase III - Ligeramente Peligroso',
      restricciones: 'Respetar carencia de 7-14 días según cultivo antes de cosecha'
    }
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');

    // Limpiar productos existentes
    await Product.deleteMany();
    console.log('🗑️  Productos existentes eliminados');

    // Insertar nuevos productos
    const productosCreados = await Product.insertMany(productos);
    console.log(`✅ ${productosCreados.length} productos creados exitosamente`);
    
    console.log('\n📦 Productos creados:');
    productosCreados.forEach(p => {
      console.log(`  - ${p.nombre} (${p.categoria}) - $${p.precio}`);
    });

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();