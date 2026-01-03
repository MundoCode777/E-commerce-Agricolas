// backend/seedProducts.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const productos = [
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
    nombre: 'Papas',
    descripcion: 'Papas de primera calidad',
    descripcionLarga: 'Papas frescas ideales para cualquier preparación. Perfectas para freír, hornear o hervir. Alta calidad garantizada.',
    precio: 1.50,
    image: '🥔',
    imagenes: ['🥔', '🥔', '🥔'],
    unit: 'kg',
    categoria: 'tuberculos',
    stock: 250,
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
    await Product.insertMany(productos);
    console.log('✅ Productos creados exitosamente');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedProducts();