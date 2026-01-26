// backend/utils/sentimentAnalyzer.js - VERSIÓN MEJORADA
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// Diccionario personalizado en español para productos agrícolas
const diccionarioAgricola = {
  // Palabras muy positivas (+4 a +5)
  'excelente': 5,
  'excepcional': 5,
  'perfecto': 5,
  'increíble': 5,
  'maravilloso': 5,
  'fantástico': 5,
  'genial': 4,
  'espectacular': 5,
  'magnífico': 5,
  'extraordinario': 5,
  'sobresaliente': 5,
  
  // Palabras positivas (+2 a +3)
  'bueno': 3,
  'bien': 2,
  'efectivo': 4,
  'eficaz': 4,
  'rápido': 3,
  'calidad': 3,
  'recomendado': 4,
  'recomiendo': 4,
  'satisfecho': 4,
  'contento': 3,
  'funciona': 3,
  'resultados': 2,
  'crecimiento': 2,
  'productivo': 4,
  'eficiente': 4,
  'útil': 3,
  'práctico': 3,
  'conveniente': 3,
  'mejora': 3,
  'mejoró': 3,
  'mejoraron': 3,
  'saludable': 4,
  'vigoroso': 4,
  'cumple': 2,
  
  // Palabras muy negativas (-4 a -5)
  'pésimo': -5,
  'horrible': -5,
  'terrible': -5,
  'malo': -4,
  'defectuoso': -5,
  'inútil': -5,
  'basura': -5,
  'estafa': -5,
  'fraude': -5,
  'murieron': -5,
  'muerto': -4,
  'murió': -5,
  
  // Palabras negativas (-2 a -3)
  'caro': -2,
  'costoso': -2,
  'lento': -3,
  'decepción': -4,
  'decepcionante': -4,
  'perdida': -3,
  'pérdida': -3,
  'problema': -2,
  'problemas': -3,
  'defecto': -3,
  'falla': -3,
  'no funciona': -5,
  'no sirve': -5,
  'no funcionó': -5,
  'no sirvió': -5,
  'no obtuve': -3,
  'no vi': -2,
  'no noté': -2,
  
  // Términos agrícolas específicos
  'plagas': -2,
  'enfermedad': -2,
  'marchito': -3,
  'seco': -2,
  'flores': 2,
  'cosecha': 3,
  'floración': 3,
  'frutos': 3,
  'verde': 2,
  
  // Negaciones
  'no': -1,
  'nunca': -2,
  'tampoco': -2,
  'ningún': -2,
  'ninguna': -2
};

// Frases negativas que reducen el score
const frasesNegativas = [
  { frase: 'no funciona', peso: -5 },
  { frase: 'no sirve', peso: -5 },
  { frase: 'no funcionó', peso: -5 },
  { frase: 'no sirvió', peso: -5 },
  { frase: 'no obtuve', peso: -4 },
  { frase: 'no vi', peso: -3 },
  { frase: 'no noté', peso: -3 },
  { frase: 'no hay', peso: -2 },
  { frase: 'no tiene', peso: -2 },
  { frase: 'plantas murieron', peso: -5 },
  { frase: 'no recomiendo', peso: -4 },
  { frase: 'no vale', peso: -3 },
  { frase: 'no diferencia', peso: -3 },
  { frase: 'lento crecimiento', peso: -4 },
  { frase: 'crecimiento lento', peso: -4 },
  { frase: 'resultados esperados', peso: -1 },
  { frase: 'no resultados', peso: -4 },
  { frase: 'sin resultados', peso: -4 }
];

// Indicadores de sarcasmo
const indicadoresSarcasmo = {
  frases: [
    'si claro',
    'sí claro',
    'claro que si',
    'claro que sí',
    'por supuesto',
    'obvio',
    'seguro',
    'ya claro',
    'wow',
    'genial',
    'super',
    'súper',
    'increible',
    'increíble',
    'fantastico',
    'fantástico',
    'maravilloso',
    'excelente producto',
    'muy bueno',
    'el mejor',
    'gracias por nada',
    'que bueno',
    'qué bueno',
    'que maravilla',
    'qué maravilla'
  ],
  
  conectores: [
    'pero',
    'sin embargo',
    'aunque',
    'lastima que',
    'lástima que',
    'pena que',
    'desafortunadamente',
    'por desgracia'
  ],
  
  emojis: ['🙄', '😒', '🤦', '😤', '🤬', '💩'],
  
  puntuacion: {
    excesiva: /!{3,}|\?{3,}/,
    mayusculas: /[A-Z]{5,}/
  }
};

// Función principal de análisis
function analizarSentimiento(texto, calificacion) {
  const textoLower = texto.toLowerCase();
  
  // 1. Análisis de sentimiento base
  const analisisBase = sentiment.analyze(texto, {
    extras: diccionarioAgricola
  });
  
  // 2. Buscar frases negativas completas
  let penalizacionFrases = 0;
  frasesNegativas.forEach(({ frase, peso }) => {
    if (textoLower.includes(frase)) {
      penalizacionFrases += peso;
    }
  });
  
  // 3. Detectar sarcasmo
  const esSarcasmo = detectarSarcasmo(textoLower, texto, calificacion);
  
  // 4. Calcular score con peso de calificación
  let scoreFinal = analisisBase.comparative + (penalizacionFrases * 0.1);
  
  // NUEVO: Ajustar según calificación de estrellas (muy importante)
  const pesoCalificacion = calcularPesoCalificacion(calificacion);
  scoreFinal = (scoreFinal * 0.4) + (pesoCalificacion * 0.6); // 60% peso a estrellas
  
  // Si es sarcasmo, invertir el sentimiento
  if (esSarcasmo.detectado) {
    scoreFinal = scoreFinal > 0 ? -Math.abs(scoreFinal) : scoreFinal;
  }
  
  // 5. Normalizar score (-1 a 1)
  scoreFinal = Math.max(-1, Math.min(1, scoreFinal));
  
  // 6. Clasificar sentimiento
  const clasificacion = clasificarSentimiento(scoreFinal, calificacion);
  
  // 7. Extraer palabras clave
  const palabrasClave = extraerPalabrasClave(analisisBase);
  
  return {
    sentimiento: clasificacion.sentimiento,
    score: scoreFinal,
    confianza: clasificacion.confianza,
    esSarcasmo: esSarcasmo.detectado,
    indicadoresSarcasmo: esSarcasmo.indicadores,
    palabrasPositivas: palabrasClave.positivas,
    palabrasNegativas: palabrasClave.negativas,
    emoji: clasificacion.emoji
  };
}

// NUEVA FUNCIÓN: Calcular peso según estrellas
function calcularPesoCalificacion(calificacion) {
  // Convertir estrellas (1-5) a score (-1 a 1)
  // 5 estrellas = +1.0
  // 4 estrellas = +0.5
  // 3 estrellas = 0.0
  // 2 estrellas = -0.5
  // 1 estrella = -1.0
  
  const mapeo = {
    5: 1.0,
    4: 0.5,
    3: 0.0,
    2: -0.5,
    1: -1.0
  };
  
  return mapeo[calificacion] || 0;
}

// Detectar sarcasmo
function detectarSarcasmo(textoLower, textoOriginal, calificacion) {
  let indicadores = [];
  let puntaje = 0;
  
  // 1. Buscar frases de sarcasmo
  indicadoresSarcasmo.frases.forEach(frase => {
    if (textoLower.includes(frase)) {
      indicadores.push(`Frase sarcástica: "${frase}"`);
      puntaje += 2;
    }
  });
  
  // 2. Detectar contradicción (positivo + negativo)
  const palabrasPositivas = textoLower.match(/excelente|bueno|genial|super|increible|fantastico|maravilloso|perfecto/g);
  const palabrasNegativas = textoLower.match(/malo|pesimo|no funciona|no sirve|murio|murieron|perdida|problema|defecto|basura|inutil|lento|no obtuve|no vi|no noté/g);
  
  if (palabrasPositivas && palabrasNegativas && palabrasPositivas.length > 0 && palabrasNegativas.length > 0) {
    indicadores.push('Contradicción detectada: palabras positivas + negativas');
    puntaje += 3;
  }
  
  // 3. Detectar conectores negativos después de palabras positivas
  indicadoresSarcasmo.conectores.forEach(conector => {
    const regex = new RegExp(`(excelente|bueno|genial|super|increible|fantastico).{0,20}${conector}`, 'i');
    if (regex.test(textoLower)) {
      indicadores.push(`Conector negativo después de palabra positiva: "${conector}"`);
      puntaje += 2;
    }
  });
  
  // 4. Detectar emojis de sarcasmo
  indicadoresSarcasmo.emojis.forEach(emoji => {
    if (textoOriginal.includes(emoji)) {
      indicadores.push(`Emoji de sarcasmo: ${emoji}`);
      puntaje += 2;
    }
  });
  
  // 5. Detectar puntuación excesiva
  if (indicadoresSarcasmo.puntuacion.excesiva.test(textoOriginal)) {
    indicadores.push('Puntuación excesiva detectada');
    puntaje += 1;
  }
  
  // 6. Detectar texto en mayúsculas
  if (indicadoresSarcasmo.puntuacion.mayusculas.test(textoOriginal)) {
    indicadores.push('Texto en mayúsculas (énfasis sospechoso)');
    puntaje += 1;
  }
  
  // 7. Comparar con calificación de estrellas
  if (calificacion <= 2) {
    const palabrasPositivasCount = (textoLower.match(/excelente|bueno|genial|super|increible|fantastico|maravilloso|perfecto/g) || []).length;
    if (palabrasPositivasCount >= 2) {
      indicadores.push('Inconsistencia: calificación baja + texto muy positivo');
      puntaje += 3;
    }
  }
  
  // Detectado si el puntaje es >= 4
  return {
    detectado: puntaje >= 4,
    indicadores: indicadores,
    confianza: Math.min(puntaje / 10, 1)
  };
}

// Clasificar sentimiento con ajuste por estrellas
function clasificarSentimiento(score, calificacion) {
  // Si tiene 1-2 estrellas, NUNCA puede ser positivo
  if (calificacion <= 2 && score > 0) {
    score = -0.3; // Forzar a negativo o neutro
  }
  
  // Si tiene 5 estrellas, NUNCA puede ser muy negativo
  if (calificacion === 5 && score < -0.5) {
    score = 0.3; // Forzar a positivo o neutro
  }
  
  if (score >= 0.5) {
    return { sentimiento: 'muy positivo', confianza: Math.abs(score), emoji: '😊' };
  } else if (score >= 0.1) {
    return { sentimiento: 'positivo', confianza: Math.abs(score), emoji: '🙂' };
  } else if (score >= -0.1) {
    return { sentimiento: 'neutro', confianza: 0.5, emoji: '😐' };
  } else if (score >= -0.5) {
    return { sentimiento: 'negativo', confianza: Math.abs(score), emoji: '🙁' };
  } else {
    return { sentimiento: 'muy negativo', confianza: Math.abs(score), emoji: '😞' };
  }
}

// Extraer palabras clave
function extraerPalabrasClave(analisisBase) {
  return {
    positivas: analisisBase.positive.slice(0, 5),
    negativas: analisisBase.negative.slice(0, 5)
  };
}

// Analizar todas las reseñas de un producto
function analizarReseñasProducto(reviews) {
  if (!reviews || reviews.length === 0) {
    return {
      totalReseñas: 0,
      sentimientos: {
        muyPositivo: 0,
        positivo: 0,
        neutro: 0,
        negativo: 0,
        muyNegativo: 0
      },
      porcentajes: {
        muyPositivo: 0,
        positivo: 0,
        neutro: 0,
        negativo: 0,
        muyNegativo: 0
      },
      promedioScore: 0,
      sarcasmoDetectado: 0
    };
  }
  
  const sentimientos = {
    'muy positivo': 0,
    'positivo': 0,
    'neutro': 0,
    'negativo': 0,
    'muy negativo': 0
  };
  
  let totalScore = 0;
  let sarcasmoCount = 0;
  
  reviews.forEach(review => {
    if (review.analisisSentimiento) {
      sentimientos[review.analisisSentimiento.sentimiento]++;
      totalScore += review.analisisSentimiento.score;
      if (review.analisisSentimiento.esSarcasmo) {
        sarcasmoCount++;
      }
    }
  });
  
  const total = reviews.length;
  
  return {
    totalReseñas: total,
    sentimientos: {
      muyPositivo: sentimientos['muy positivo'],
      positivo: sentimientos['positivo'],
      neutro: sentimientos['neutro'],
      negativo: sentimientos['negativo'],
      muyNegativo: sentimientos['muy negativo']
    },
    porcentajes: {
      muyPositivo: ((sentimientos['muy positivo'] / total) * 100).toFixed(1),
      positivo: ((sentimientos['positivo'] / total) * 100).toFixed(1),
      neutro: ((sentimientos['neutro'] / total) * 100).toFixed(1),
      negativo: ((sentimientos['negativo'] / total) * 100).toFixed(1),
      muyNegativo: ((sentimientos['muy negativo'] / total) * 100).toFixed(1)
    },
    promedioScore: (totalScore / total).toFixed(2),
    sarcasmoDetectado: sarcasmoCount
  };
}

module.exports = {
  analizarSentimiento,
  analizarReseñasProducto
};