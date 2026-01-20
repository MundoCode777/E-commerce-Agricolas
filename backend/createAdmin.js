// backend/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Verificar si ya existe un admin con este email
    const adminExiste = await User.findOne({ email: 'admin@agricola.com' });
    
    if (adminExiste) {
      console.log('⚠️  Ya existe un administrador con este email');
      console.log('📧 Email:', adminExiste.email);
      console.log('👤 Nombre:', adminExiste.nombre, adminExiste.apellido);
      
      // Actualizar a rol administrador por si acaso
      adminExiste.rol = 'administrador';
      await adminExiste.save();
      console.log('✅ Rol de administrador actualizado');
    } else {
      // Crear nuevo admin
      const admin = await User.create({
        nombre: 'Admin',
        apellido: 'Principal',
        email: 'admin@agricola.com',
        password: 'admin123',
        rol: 'administrador',
        telefono: '0999999999',
        direccion: {
          direccion: 'Oficina Central',
          ciudad: 'Milagro',
          provincia: 'Guayas'
        }
      });

      console.log('✅ Administrador creado exitosamente');
      console.log('═══════════════════════════════════════');
      console.log('📧 Email:', admin.email);
      console.log('🔑 Contraseña: admin123');
      console.log('👤 Nombre:', admin.nombre, admin.apellido);
      console.log('🔧 Rol:', admin.rol);
      console.log('═══════════════════════════════════════');
      console.log('🌐 Accede al panel en: http://localhost:3000/admin');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear administrador:', error.message);
    process.exit(1);
  }
};

createAdmin();