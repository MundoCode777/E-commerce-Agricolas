// backend/resetAdminPassword.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdminPassword = async () => {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const admin = await User.findOne({ email: 'admin@agricola.com' });
    
    if (!admin) {
      console.log('❌ Admin no encontrado. Creando uno nuevo...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      await User.create({
        nombre: 'Admin',
        apellido: 'Principal',
        email: 'admin@agricola.com',
        password: hashedPassword,
        rol: 'administrador',
        telefono: '0999999999'
      });
      
      console.log('✅ Admin creado exitosamente');
    } else {
      console.log('✅ Admin encontrado. Actualizando contraseña...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      admin.password = hashedPassword;
      admin.rol = 'administrador';
      await admin.save();
      
      console.log('✅ Contraseña actualizada exitosamente');
    }

    console.log('═══════════════════════════════════════');
    console.log('📧 Email: admin@agricola.com');
    console.log('🔑 Contraseña: admin123');
    console.log('═══════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdminPassword();