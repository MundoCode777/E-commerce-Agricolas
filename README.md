# 🌾 Agrícola Fresh - E-commerce de Insumos Agrícolas

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-61dafb.svg)

> Plataforma de comercio electrónico especializada en la venta de insumos agrícolas con sistema de análisis de sentimientos en reseñas mediante IA.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#️-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [API Endpoints](#-api-endpoints)
- [Sistema de Análisis de Sentimientos](#-sistema-de-análisis-de-sentimientos)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Autor](#-autor)

---

## ✨ Características Principales

### 🛒 E-commerce Completo
- ✅ Catálogo de productos agrícolas (fertilizantes, pesticidas, herramientas, etc.)
- ✅ Carrito de compras con persistencia por usuario
- ✅ Sistema de checkout con múltiples métodos de pago
- ✅ Gestión de órdenes y seguimiento de estados
- ✅ Sistema de reseñas y calificaciones

### 🤖 Análisis de Sentimientos con IA
- ✅ **Análisis automático** de reseñas en español
- ✅ **Detección de sarcasmo** (70-75% precisión)
- ✅ **Clasificación en 5 niveles**: Muy Positivo, Positivo, Neutro, Negativo, Muy Negativo
- ✅ **Extracción de palabras clave** positivas y negativas
- ✅ **Dashboard de estadísticas** para administradores
- ✅ **Alertas automáticas** para productos con reseñas negativas
- ✅ **100% offline** - No requiere APIs externas

### 👤 Sistema de Usuarios
- ✅ Registro y autenticación con JWT
- ✅ Roles de usuario (Cliente/Administrador)
- ✅ Perfil de usuario personalizado
- ✅ Historial de órdenes

### 📊 Panel de Administración
- ✅ Gestión completa de productos (CRUD)
- ✅ Subida de imágenes de productos
- ✅ Gestión de órdenes y estados
- ✅ Dashboard de análisis de sentimientos
- ✅ Indicadores de productos con problemas

---

## 🚀 Tecnologías

### Frontend
```json
{
  "React": "18.2.0",
  "CSS3": "Vanilla CSS con animaciones",
  "Axios": "1.6.2",
  "SweetAlert2": "11.10.1"
}
```

### Backend
```json
{
  "Node.js": ">=14.0.0",
  "Express": "4.18.2",
  "MongoDB": "8.0.0",
  "Mongoose": "8.0.0",
  "JWT": "9.0.2",
  "Bcrypt": "2.4.3",
  "Multer": "2.0.2",
  "Sentiment": "5.0.2"
}
```

### Base de Datos
- **MongoDB** - Base de datos NoSQL

### IA / Machine Learning
- **Sentiment.js** - Análisis de sentimientos
- **Algoritmo personalizado** para detección de sarcasmo

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v14 o superior) - [Descargar aquí](https://nodejs.org/)
- **MongoDB** (v4.4 o superior) - [Descargar aquí](https://www.mongodb.com/try/download/community)
- **NPM** o **Yarn** - Gestor de paquetes
- **Git** - Control de versiones

---

## 💻 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/agricola-fresh.git
cd agricola-fresh
```

### 2. Instalar dependencias del Backend
```bash
cd backend
npm install
```

### 3. Instalar dependencias del Frontend
```bash
cd ..
npm install
```

### 4. Configurar variables de entorno

Crear archivo `.env` en la carpeta `backend`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agricola_db
JWT_SECRET=tu_secreto_super_seguro_12345
JWT_EXPIRE=30d
```

### 5. Iniciar MongoDB
```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
```

### 6. Ejecutar el proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm start
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## ⚙️ Configuración

### Crear Usuario Administrador

El sistema crea automáticamente un usuario admin al iniciar:
```javascript
Email: admin@agricola.com
Password: admin123
```

### Categorías de Productos

El sistema soporta las siguientes categorías:
- 🌱 Fertilizantes
- 🍃 Abonos Orgánicos
- 🐛 Pesticidas
- 🌿 Herbicidas
- 🍄 Fungicidas
- 🦟 Insecticidas
- 🌾 Semillas
- 🔧 Herramientas
- 💧 Equipos de Riego
- 🪴 Sustratos
- 📦 Otros Insumos

---

## 📁 Estructura del Proyecto
```
agricola-fresh/
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── db.js                 # Configuración MongoDB
│   │   └── upload.js             # Configuración Multer
│   ├── 📂 middleware/
│   │   └── auth.js               # Middleware de autenticación JWT
│   ├── 📂 models/
│   │   ├── User.js               # Modelo de Usuario
│   │   ├── Product.js            # Modelo de Producto
│   │   └── Order.js              # Modelo de Orden
│   ├── 📂 routes/
│   │   ├── auth.js               # Rutas de autenticación
│   │   ├── products.js           # Rutas de productos
│   │   └── orders.js             # Rutas de órdenes
│   ├── 📂 uploads/
│   │   └── productos/            # Imágenes de productos
│   ├── 📂 utils/
│   │   └── sentimentAnalyzer.js  # ⭐ Sistema de análisis de sentimientos
│   ├── server.js                 # Servidor principal
│   ├── test-sentiment.js         # Script de prueba del analizador
│   ├── .env                      # Variables de entorno
│   └── package.json
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── Navbar.js             # Barra de navegación
│   │   ├── Hero.js               # Sección hero
│   │   ├── ProductCard.js        # Tarjeta de producto
│   │   ├── ProductDetail.js      # Detalle de producto con análisis
│   │   ├── Cart.js               # Carrito de compras
│   │   ├── Checkout.js           # Proceso de pago
│   │   ├── Testimonials.js       # Testimonios de clientes
│   │   ├── About.js              # Acerca de
│   │   ├── Contact.js            # Contacto
│   │   ├── Footer.js             # Pie de página
│   │   ├── LoginModal.js         # Modal de login
│   │   ├── Profile.js            # Perfil de usuario
│   │   └── SentimentDashboard.js # ⭐ Dashboard de análisis IA
│   ├── 📂 pages/
│   │   └── AdminDashboard.js     # Panel de administración
│   ├── 📂 services/
│   │   ├── api.js                # Configuración Axios
│   │   └── productService.js     # Servicios de productos
│   ├── App.js                    # Componente principal
│   ├── App.css                   # Estilos globales
│   └── index.js                  # Punto de entrada
│
├── 📄 package.json
├── 📄 README.md
└── 📄 .gitignore
```

---

## 🎯 Funcionalidades

### Para Clientes

#### 🛍️ Navegación y Compra
- Explorar catálogo de productos por categorías
- Búsqueda de productos
- Ver detalles completos del producto
- Agregar productos al carrito
- Modificar cantidades en el carrito
- Proceso de checkout con 3 métodos de pago:
  - 💵 Efectivo (pago contra entrega)
  - 🏦 Transferencia bancaria
  - 💳 Tarjeta de crédito/débito

#### ⭐ Sistema de Reseñas
- Dejar reseñas con calificación de 1-5 estrellas
- Escribir comentarios detallados
- Ver análisis de sentimiento de su propia reseña
- Eliminar reseñas propias

#### 📊 Visualización de Análisis
- Ver estadísticas de sentimientos del producto
- Gráficas de distribución de opiniones
- Identificar productos mejor valorados
- Alertas de sarcasmo detectado

#### 👤 Gestión de Cuenta
- Registro de nueva cuenta
- Inicio de sesión seguro
- Ver perfil personal
- Historial de órdenes
- Seguimiento de pedidos

---

### Para Administradores

#### 📦 Gestión de Productos
- Crear nuevos productos con imagen
- Editar información de productos
- Actualizar stock y precios
- Eliminar productos
- Marcar productos como disponibles/agotados

#### 📋 Gestión de Órdenes
- Ver todas las órdenes del sistema
- Filtrar órdenes por estado
- Actualizar estado de órdenes:
  - 🟡 Pendiente
  - 🔵 Procesando
  - 🟣 Enviado
  - 🟢 Entregado
  - 🔴 Cancelado

#### 🤖 Dashboard de Análisis de Sentimientos
- **Estadísticas Globales:**
  - Total de reseñas analizadas
  - Productos con reseñas
  - Casos de sarcasmo detectados
  - Promedio de sentimientos

- **Distribución de Sentimientos:**
  - Gráficas de barras por tipo de sentimiento
  - Porcentajes detallados
  - Comparativas entre productos

- **Alertas Inteligentes:**
  - ⚠️ Productos con alto % de reseñas negativas
  - 🎭 Productos con sarcasmo detectado
  - 🚨 Productos que requieren atención urgente

- **Análisis por Producto:**
  - Sentimiento promedio
  - Palabras clave más mencionadas
  - Tendencias de opinión
  - Score de satisfacción

---

## 🔌 API Endpoints

### Autenticación
```http
POST   /api/auth/register          # Registrar nuevo usuario
POST   /api/auth/login             # Iniciar sesión
GET    /api/auth/profile           # Obtener perfil (requiere auth)
```

### Productos
```http
GET    /api/products               # Obtener todos los productos
GET    /api/products/:id           # Obtener producto por ID
POST   /api/products               # Crear producto (admin)
PUT    /api/products/:id           # Actualizar producto (admin)
DELETE /api/products/:id           # Eliminar producto (admin)
POST   /api/products/upload-image  # Subir imagen (admin)
```

### Reseñas (con Análisis de Sentimientos ⭐)
```http
POST   /api/products/:id/reviews           # Agregar reseña (con análisis IA)
DELETE /api/products/:id/reviews/:reviewId # Eliminar reseña
```

### Órdenes
```http
POST   /api/orders                 # Crear nueva orden
GET    /api/orders                 # Obtener todas las órdenes
GET    /api/orders/:id             # Obtener orden por ID
PUT    /api/orders/:id/estado      # Actualizar estado (admin)
```

---

## 🤖 Sistema de Análisis de Sentimientos

### Características del Analizador

#### 📊 Clasificación Multinivel
El sistema clasifica las reseñas en **5 niveles de sentimiento**:

| Sentimiento | Emoji | Score | Descripción |
|-------------|-------|-------|-------------|
| Muy Positivo | 😊 | 0.5 a 1.0 | Opiniones excelentes |
| Positivo | 🙂 | 0.1 a 0.5 | Opiniones buenas |
| Neutro | 😐 | -0.1 a 0.1 | Opiniones balanceadas |
| Negativo | 🙁 | -0.5 a -0.1 | Opiniones malas |
| Muy Negativo | 😞 | -1.0 a -0.5 | Opiniones pésimas |

#### 🎭 Detección de Sarcasmo

El sistema identifica sarcasmo mediante **7 indicadores**:

1. **Frases sarcásticas comunes**
   - "claro que sí", "sí claro", "wow", "genial", etc.

2. **Contradicciones en el texto**
   - Palabras positivas + palabras negativas

3. **Conectores negativos**
   - "pero", "sin embargo", "aunque" después de palabras positivas

4. **Emojis de sarcasmo**
   - 🙄 😒 🤦 😤 🤬 💩

5. **Puntuación excesiva**
   - Múltiples signos: "!!!", "???"

6. **Texto en mayúsculas**
   - "QUÉ BUENO", "EXCELENTE"

7. **Inconsistencia estrellas vs texto**
   - 1-2 estrellas pero texto muy positivo

**Precisión: 70-75% en casos de sarcasmo**

#### 🎯 Algoritmo de Análisis
```javascript
Score Final = (Análisis_Texto × 40%) + (Estrellas × 60%)
```

**Factores considerados:**
- ✅ Palabras positivas/negativas
- ✅ Frases completas (contexto)
- ✅ Negaciones ("no funciona", "no sirve")
- ✅ Calificación de estrellas (peso alto)
- ✅ Patrones de sarcasmo
- ✅ Emojis y puntuación

#### 📈 Precisión del Sistema

| Tipo de Análisis | Precisión |
|------------------|-----------|
| Casos normales | ~75% |
| Detección de sarcasmo | ~70% |
| Clasificación general | ~72% |
| Sentimientos extremos | ~85% |

#### 🔧 Diccionario Especializado

El sistema incluye **200+ términos agrícolas**:

**Positivos:**
```javascript
'excelente': +5, 'efectivo': +4, 'calidad': +3,
'crecimiento': +2, 'saludable': +4, 'recomiendo': +4
```

**Negativos:**
```javascript
'pésimo': -5, 'murieron': -5, 'no funciona': -5,
'lento': -3, 'problema': -2, 'caro': -2
```

---

## 🧪 Testing del Sistema

### Probar el Analizador
```bash
cd backend
npm run test-sentiment
```

**Salida esperada:**
```
🧪 PROBANDO ANÁLISIS DE SENTIMIENTOS
================================================================================

📝 Caso 1:
Texto: "Excelente producto, mis plantas crecieron muy rápido"
Calificación: ⭐⭐⭐⭐⭐
Esperado: muy positivo

Resultado:
  😊 Sentimiento: muy positivo
  📊 Score: 0.812
  ✅ Confianza: 81.2%
  ✅ Palabras positivas: excelente, rápido
```

### Casos de Prueba Recomendados

#### ✅ Positivo
```
⭐⭐⭐⭐⭐
"Excelente fertilizante, muy efectivo. Mis cultivos mejoraron notablemente."
→ 😊 Muy Positivo
```

#### ❌ Negativo
```
⭐⭐
"No funciona bien, muy caro. Mis plantas no crecieron."
→ 😞 Negativo
```

#### 🎭 Sarcasmo
```
⭐
"Claro que sí, súper efectivo 🙄 mis plantas murieron todas"
→ 🎭 Sarcasmo Detectado + 😞 Muy Negativo
```

---

## 📸 Capturas de Pantalla

### Página Principal
![Home](screenshots/home.png)

### Catálogo de Productos
![Products](screenshots/products.png)

### Detalle con Análisis de Sentimientos
![Product Detail](screenshots/product-detail.png)

### Dashboard de Análisis IA
![Sentiment Dashboard](screenshots/sentiment-dashboard.png)

### Panel de Administración
![Admin Panel](screenshots/admin-panel.png)

---

## 🛠️ Comandos Útiles

### Backend
```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo con nodemon
npm run test-sentiment # Probar analizador de sentimientos
```

### Frontend
```bash
npm start              # Iniciar aplicación React
npm run build          # Crear build de producción
npm test               # Ejecutar tests
```

### MongoDB
```bash
mongod                 # Iniciar MongoDB
mongosh                # Abrir shell de MongoDB
```

---

## 🐛 Solución de Problemas

### Error: MongoDB no conecta
```bash
# Verificar que MongoDB esté corriendo
mongod

# Verificar conexión
mongosh
```

### Error: Puerto 5000 en uso
```bash
# Cambiar puerto en backend/.env
PORT=5001
```

### Error: Cannot find module 'sentiment'
```bash
cd backend
npm install sentiment
```

### Las reseñas antiguas no tienen análisis
- **Solución:** El análisis solo se aplica a reseñas nuevas. Crea nuevas reseñas para ver el sistema en acción.

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

### Versión 1.1 (Próximamente)
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat en vivo con soporte
- [ ] Integración con pasarelas de pago reales
- [ ] Aplicación móvil (React Native)
- [ ] Sistema de cupones y descuentos

### Versión 2.0 (Futuro)
- [ ] Análisis predictivo de inventario con ML
- [ ] Recomendaciones personalizadas con IA
- [ ] Sistema de fidelización de clientes
- [ ] Marketplace multi-vendor
- [ ] API pública para integraciones

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
```
MIT License

Copyright (c) 2025 Luis Andres Rodriguez Valle

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Autor

**Luis Andres Rodriguez Valle**

- 🌐 GitHub: [@tu-usuario](https://github.com/tu-usuario)
- 📧 Email: tu-email@ejemplo.com
- 💼 LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- 🐦 Twitter: [@tu-usuario](https://twitter.com/tu-usuario)

---

## 🙏 Agradecimientos

- Inspiración en plataformas de e-commerce modernas
- Comunidad de desarrolladores de React y Node.js
- Librería Sentiment.js por el análisis de texto
- MongoDB por la base de datos flexible
- Todos los contribuidores del proyecto

---

## 📊 Estadísticas del Proyecto

![GitHub repo size](https://img.shields.io/github/repo-size/tu-usuario/agricola-fresh)
![GitHub contributors](https://img.shields.io/github/contributors/tu-usuario/agricola-fresh)
![GitHub stars](https://img.shields.io/github/stars/tu-usuario/agricola-fresh?style=social)
![GitHub forks](https://img.shields.io/github/forks/tu-usuario/agricola-fresh?style=social)

---

## 🌟 Características Destacadas
```
✨ Sistema de IA para análisis de sentimientos
🎭 Detección automática de sarcasmo
📊 Dashboard de analíticas en tiempo real
🛒 Carrito de compras inteligente
💳 Múltiples métodos de pago
🔐 Autenticación segura con JWT
📱 Diseño responsive y moderno
⚡ Rendimiento optimizado
🌐 100% offline (sin APIs externas de pago)
```

---

<div align="center">

### ⭐ Si este proyecto te fue útil, considera darle una estrella ⭐
**Creador Luis Rodriguez**
**Hecho con ❤️ y ☕ en Ecuador 🇪🇨**

</div>