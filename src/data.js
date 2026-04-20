/* ═══════════════════════════════════════════
   EL JUEGO DE LA DEMANDA — Casos & Config
═══════════════════════════════════════════ */

export const MULT = {
  gravedad: 2000,
  prueba: 1200,
  forma: 2000,
  respuesta: 2500,
  argumento: 2000,
  escalada: 3000,
}

export const START_MONEY = 50000
export const TRANSFER_MAX = 9000
export const TOTAL_CASES = 6

export const CASOS = [
  {
    id: 0, cat: "AMIGOS 👥", titulo: "La Nafta Sin Retorno",
    desc: "Viaje de 300km. Pusiste toda la nafta ($15.000). Tres amigos prometieron pagar. Tres semanas de silencio total.",
    base: 14000,
    ctx: {
      dem: "Tenés el ticket, el chat del grupo y al único que sí pagó como testigo.",
      def: "Te reclaman por un viaje donde supuestamente ibas a pagar. Nunca fue explícito.",
    },
    gravedad: [
      { id: "grave", lbl: "Lo que hicieron está mal", desc: "Un acuerdo es un acuerdo, verbal o no", emoji: "😤", v: 3 },
      { id: "leve", lbl: "Son cosas que pasan", desc: "Entre amigos hay que ser flexible", emoji: "🤷", v: -1 },
      { id: "drama", lbl: "Me destruyeron como persona", desc: "No soy el mismo desde ese viaje", emoji: "💀", v: -2 },
      { id: "mod", lbl: "No se hace con un amigo", desc: "La plata es lo de menos, es el gesto", emoji: "😔", v: 2 },
    ],
    prueba: [
      { id: "memo", lbl: "Lo recuerdo perfectamente", emoji: "🧠", v: -1 },
      { id: "ticket", lbl: "Comprobante de la nafta", emoji: "🧾", v: 4 },
      { id: "maps", lbl: "El recorrido en el mapa", emoji: "🗺️", v: 2 },
      { id: "chat", lbl: "La conversación del grupo", emoji: "📱", v: 3 },
      { id: "foto", lbl: "Estábamos todos juntos", emoji: "📸", v: 1 },
      { id: "testigo", lbl: "Alguien que puede confirmarlo", emoji: "👤", v: 3 },
    ],
    forma: [
      { id: "nuke", lbl: "Ir directamente al grano", desc: "Sin vueltas, exigís respuesta ya", emoji: "⚡", v: 1 },
      { id: "formal", lbl: "Ponerse serio de una vez", desc: "Detalles, montos, plazos, sin emojis", emoji: "📋", v: 3 },
      { id: "edu", lbl: "Mensaje de recordatorio", desc: "Suave, con humor, sin drama", emoji: "😊", v: 1 },
      { id: "grupo", lbl: "Que lo vea todo el grupo", desc: "Transparencia total con todos", emoji: "👨‍👩‍👧", v: 2 },
    ],
    respuesta: [
      { id: "parcial", lbl: "Algo te puedo dar", desc: "No lo que pedís, pero algo es algo", emoji: "💰", v: 2 },
      { id: "negar", lbl: "Yo no acordé nada", desc: "No hay acuerdo, no hay deuda", emoji: "🚫", v: -2 },
      { id: "total", lbl: "Tenés razón, lo pago", desc: "Reconocés todo y cerrás el tema", emoji: "✅", v: 4 },
      { id: "olvidar", lbl: "Se me fue completamente", desc: "Sin excusas, genuinamente lo olvidé", emoji: "😅", v: 1 },
    ],
    argumento: [
      { id: "contra", lbl: "Hablemos de lo que vos me debés", desc: "Hay muchas cuentas pendientes acá", emoji: "⚔️", v: -1 },
      { id: "noAcuerdo", lbl: "No quedó claro en ningún momento", desc: "Si hubiera acuerdo, lo recordaría", emoji: "❓", v: 2 },
      { id: "costumbre", lbl: "Así funciona entre nosotros", desc: "Siempre fue así y nunca fue problema", emoji: "🤷", v: 0 },
      { id: "favores", lbl: "Yo hice muchas cosas por vos", desc: "El historial me favorece bastante", emoji: "⚖️", v: 1 },
    ],
    escalada: [
      { id: "nuclear", lbl: "Si seguís, yo también tengo reclamos", desc: "Dos pueden jugar este juego", emoji: "💣", v: -2 },
      { id: "cerrar", lbl: "Esto no vale la amistad", desc: "Pagás y listo, la relación primero", emoji: "🤝", v: 3 },
      { id: "mediacion", lbl: "Que alguien neutral opine", desc: "Una voz de afuera puede ayudar", emoji: "⚖️", v: 2 },
      { id: "insistir", lbl: "Me quedo firme en mi postura", desc: "No doy el brazo a torcer", emoji: "💪", v: 1 },
    ],
  },
  {
    id: 1, cat: "PAREJA 💑", titulo: "La Tapa del Inodoro",
    desc: "TERCERA vez consecutiva. Tapa levantada. Dos advertencias previas ignoradas sistemáticamente.",
    base: 11000,
    ctx: {
      dem: "Foto fresca, historial de advertencias y el roommate como testigo.",
      def: "Te acusan por tercera vez. Planteás que esto es una persecución desproporcionada.",
    },
    gravedad: [
      { id: "drama", lbl: "Afecta mi bienestar cotidiano", desc: "Parece menor pero tiene impacto real", emoji: "😔", v: -1 },
      { id: "reinc", lbl: "Lo prometiste y lo rompiste de vuelta", desc: "Tres veces no es descuido, es decisión", emoji: "🔥", v: 4 },
      { id: "chiste", lbl: "Literalmente no puedo tomarlo en serio", desc: "Esto no es un conflicto", emoji: "😂", v: -3 },
      { id: "molestia", lbl: "Ya me cansé de repetir lo mismo", desc: "Una vez más está de más", emoji: "😒", v: 2 },
    ],
    prueba: [
      { id: "acuerdo", lbl: "Hubo un acuerdo verbal claro", emoji: "📋", v: 2 },
      { id: "foto", lbl: "Foto con timestamp incluido", emoji: "📸", v: 4 },
      { id: "nada", lbl: "Mi palabra tiene que valer", emoji: "🤞", v: -2 },
      { id: "historial", lbl: "Registro documentado de los tres episodios", emoji: "📊", v: 3 },
      { id: "chat", lbl: "La promesa por escrito", emoji: "📱", v: 3 },
      { id: "testigo", lbl: "Alguien más que lo vio", emoji: "👤", v: 3 },
    ],
    forma: [
      { id: "formal", lbl: "Se acabó la paciencia", desc: "Ultimátum con plazo y consecuencias", emoji: "⚡", v: 3 },
      { id: "charla", lbl: "Una vez más, con calma", desc: "Le explicás el impacto que tiene", emoji: "💬", v: 0 },
      { id: "nuke", lbl: "Tomás medidas unilaterales", desc: "Sin avisar, simplemente ejecutás", emoji: "🚽", v: 1 },
      { id: "multa", lbl: "Sistema de consecuencias claras", desc: "Cada vez que pasa, hay un costo", emoji: "💰", v: 2 },
    ],
    respuesta: [
      { id: "cultura", lbl: "En mi casa siempre funcionó así", desc: "Es algo cultural, no es malicia", emoji: "🏠", v: -2 },
      { id: "promesa", lbl: "Te juro que no vuelve a pasar", desc: "Con testigo, si querés", emoji: "✋", v: 2 },
      { id: "inconscie", lbl: "No me doy cuenta cuando lo hago", desc: "Es un hábito inconsciente de años", emoji: "😶", v: -1 },
      { id: "contra", lbl: "Hay otras cosas que también molestan", desc: "Si vamos a hablar, hablemos todo", emoji: "⚔️", v: 0 },
    ],
    argumento: [
      { id: "ridiculo", lbl: "Necesitamos perspectiva acá", desc: "Hay problemas más grandes en el mundo", emoji: "🤦", v: -1 },
      { id: "reforma", lbl: "Tengo un plan concreto para cambiar", desc: "Aplicación instalada, recordatorio activo", emoji: "🔔", v: 3 },
      { id: "buenafe", lbl: "No fue con ninguna intención", desc: "Estaba apurado, no fue personal", emoji: "😇", v: 2 },
      { id: "prop", lbl: "La respuesta no es proporcional", desc: "El nivel de drama no corresponde", emoji: "📏", v: 1 },
    ],
    escalada: [
      { id: "ignorar", lbl: "No dignificar esto con una respuesta", desc: "El silencio también es una postura", emoji: "🙄", v: -3 },
      { id: "tera", lbl: "Hablarlo con alguien profesional", desc: "Un espacio neutral para resolverlo", emoji: "🧠", v: 2 },
      { id: "lista", lbl: "Traer mis propios reclamos", desc: "La convivencia es una calle de doble mano", emoji: "📋", v: 1 },
      { id: "pacto", lbl: "Firmamos algo concreto hoy", desc: "Reglas claras, por escrito, con fecha", emoji: "📝", v: 4 },
    ],
  },
  {
    id: 2, cat: "DIGITAL 💻", titulo: "El Visto Clavado",
    desc: "Mensaje URGENTE. Dos vistos a las 14:32. Son las 20:45. El plan se canceló. Estuvo online 3 veces después.",
    base: 9000,
    ctx: {
      dem: "Screenshot del visto con hora exacta, online 3 veces y el plan se canceló.",
      def: "Te acusan por ver un mensaje y no responder de inmediato. Tenés tus razones.",
    },
    gravedad: [
      { id: "intencional", lbl: "Lo hiciste con todas las letras", desc: "Viste, estuviste online y elegiste no responder", emoji: "⚡", v: 3 },
      { id: "normal", lbl: "No siempre se puede responder", desc: "La vida pasa afuera del teléfono también", emoji: "😐", v: -1 },
      { id: "descuido", lbl: "Podías y no quisiste", desc: "Estabas activo, eso habla por sí solo", emoji: "😤", v: 2 },
      { id: "tragedia", lbl: "El daño ya está hecho", desc: "El plan se canceló y eso no se recupera", emoji: "😱", v: 1 },
    ],
    prueba: [
      { id: "hist", lbl: "No es la primera vez que pasa", emoji: "📊", v: 2 },
      { id: "ss", lbl: "La captura con hora exacta", emoji: "📱", v: 4 },
      { id: "memo", lbl: "Lo que yo recuerdo claramente", emoji: "🧠", v: -2 },
      { id: "plan", lbl: "El plan cancelado es prueba concreta", emoji: "💥", v: 3 },
      { id: "online", lbl: "Tres veces conectado, cero respuestas", emoji: "🟢", v: 4 },
      { id: "urgente", lbl: "El mensaje era explícitamente urgente", emoji: "🚨", v: 3 },
    ],
    forma: [
      { id: "silencio", lbl: "Devolvérsela con silencio", desc: "Que sepa cómo se siente", emoji: "🤐", v: 0 },
      { id: "llamada", lbl: "Saltarse el chat", desc: "Una llamada no se puede ignorar", emoji: "📞", v: 3 },
      { id: "grupo", lbl: "Que lo sepa el entorno", desc: "Transparencia total con amigos comunes", emoji: "👨‍👩‍👧", v: 1 },
      { id: "followup", lbl: "Mostrar la evidencia directo", desc: "El screenshot habla mejor que las palabras", emoji: "📸", v: 2 },
    ],
    respuesta: [
      { id: "disculpa", lbl: "Me equivoqué y lo reconozco", desc: "Mea culpa total, con compensación", emoji: "✅", v: 3 },
      { id: "bateria", lbl: "Tuve un problema técnico", desc: "La tecnología falla, no es personal", emoji: "🔋", v: -2 },
      { id: "derecho", lbl: "Tengo derecho a desconectarme", desc: "La disponibilidad constante no existe", emoji: "🏖️", v: 1 },
      { id: "reunion", lbl: "Estaba en algo que no podía esperar", desc: "El contexto importa", emoji: "💼", v: 2 },
    ],
    argumento: [
      { id: "mea", lbl: "No tengo excusas, fallé", desc: "La recontra posta, sin vueltas", emoji: "🙇", v: 4 },
      { id: "urgencia", lbl: "¿Qué tan urgente era realmente?", desc: "La urgencia es subjetiva", emoji: "🤷", v: 0 },
      { id: "contexto", lbl: "No leí el tono del mensaje", desc: "No interpreté que era tan importante", emoji: "🔍", v: 2 },
      { id: "autonomia", lbl: "Mi tiempo es mío", desc: "El teléfono no me define", emoji: "✊", v: 1 },
    ],
    escalada: [
      { id: "indif", lbl: "Seguir sin responder", desc: "El statement está hecho", emoji: "🙄", v: -3 },
      { id: "comp", lbl: "Yo organizo el plan que se perdió", desc: "Lo reparo con hechos, no con palabras", emoji: "🎉", v: 4 },
      { id: "arb", lbl: "Que alguien neutral lo evalúe", desc: "Una tercera opinión puede desempatar", emoji: "⚖️", v: 2 },
      { id: "promesa", lbl: "Ponemos una regla en común", desc: "Tiempo máximo de respuesta acordado", emoji: "⏰", v: 3 },
    ],
  },
  {
    id: 3, cat: "CONVIVENCIA 🏠", titulo: "La Ropa Tirada",
    desc: "Cuarta vez esta semana. Ropa tirada en el baño compartido. Advertencias previas ignoradas.",
    base: 10000,
    ctx: {
      dem: "Tenés fotos con fecha, historial de chats y el otro roommate lo vio todo.",
      def: "Te acusan de desorden. Decís que la convivencia es dar y recibir.",
    },
    gravedad: [
      { id: "mod", lbl: "Esto ya tiene un patrón", desc: "Cuatro veces en una semana no es casualidad", emoji: "😤", v: 3 },
      { id: "leve", lbl: "La convivencia implica estas cosas", desc: "Hay que ser tolerante con los demás", emoji: "😐", v: -1 },
      { id: "grave", lbl: "Es una falta de respeto al espacio común", desc: "Lo que es de todos es de todos", emoji: "🔥", v: 2 },
      { id: "drama", lbl: "No doy más en esta situación", desc: "Mi límite ya fue superado hace tiempo", emoji: "💔", v: -2 },
    ],
    prueba: [
      { id: "tuDesorden", lbl: "Yo también soy ordenado a veces", emoji: "😬", v: -2 },
      { id: "foto", lbl: "Las fotos con fecha y hora", emoji: "📸", v: 4 },
      { id: "testigo", lbl: "El otro roommate lo vio", emoji: "👤", v: 2 },
      { id: "chat", lbl: "Los mensajes de advertencia previos", emoji: "📱", v: 3 },
      { id: "acuerdo", lbl: "El acuerdo que firmamos al entrar", emoji: "📋", v: 3 },
      { id: "historial", lbl: "Registro de los cuatro episodios", emoji: "📊", v: 2 },
    ],
    forma: [
      { id: "ultimatum", lbl: "Se acabó la tolerancia", desc: "La próxima tiene consecuencias reales", emoji: "⚡", v: 3 },
      { id: "nota", lbl: "Un mensaje en lugar visible", desc: "Algo que no pueda ignorar", emoji: "🗒️", v: 1 },
      { id: "charla", lbl: "Sentarse a hablar en serio", desc: "Buscar solución juntos, sin acusaciones", emoji: "💬", v: 2 },
      { id: "puntos", lbl: "Consecuencias económicas claras", desc: "Cada vez que pasa, hay un costo", emoji: "📊", v: 1 },
    ],
    respuesta: [
      { id: "admite", lbl: "Es verdad, propongo algo concreto", desc: "Reconocés y ofrecés una salida real", emoji: "✅", v: 3 },
      { id: "noTanto", lbl: "Le estás dando demasiada bola", desc: "Hay cosas más importantes en la vida", emoji: "🤷", v: -1 },
      { id: "promesa", lbl: "Me comprometo a cambiar el hábito", desc: "Empezando hoy mismo", emoji: "✋", v: 2 },
      { id: "contra", lbl: "Hablemos de lo que vos hacés", desc: "La cancha tiene dos arcos", emoji: "⚔️", v: 0 },
    ],
    argumento: [
      { id: "stress", lbl: "Estoy pasando un momento difícil", desc: "El contexto personal afecta los hábitos", emoji: "😰", v: 1 },
      { id: "sistema", lbl: "Propongo un sistema que nos sirva a todos", desc: "Rutinas claras para los espacios comunes", emoji: "🔔", v: 3 },
      { id: "espacio", lbl: "Es mi espacio también", desc: "Tengo derecho a usarlo", emoji: "🏠", v: 0 },
      { id: "subjetivo", lbl: "Cada uno tiene su propia idea del orden", desc: "Lo que para vos es caos para mí es normal", emoji: "🤔", v: -1 },
    ],
    escalada: [
      { id: "ignorar", lbl: "No vale la pena responder", desc: "Silencio como postura", emoji: "🙄", v: -3 },
      { id: "mediacion", lbl: "Que alguien de afuera ayude", desc: "Reglas claras con mediación neutral", emoji: "⚖️", v: 2 },
      { id: "espacios", lbl: "Dividimos los espacios", desc: "Cada uno con su área definida", emoji: "📐", v: 3 },
      { id: "senales", lbl: "Sistema visual de estado del espacio", desc: "Señales físicas para evitar malentendidos", emoji: "🚦", v: 2 },
    ],
  },
  {
    id: 4, cat: "CONSUMO 🛒", titulo: "El Delivery que Llegó Frío",
    desc: "Sushi premium por $4.500. Llegó 45 minutos tarde y frío. El wasabi venía derramado sobre todo.",
    base: 8000,
    ctx: {
      dem: "Screenshot del pedido, hora de llegada y foto del estado de la comida.",
      def: "Sos el local. El pedido salió perfecto. La demora es responsabilidad del repartidor.",
    },
    gravedad: [
      { id: "normal", lbl: "Los deliveries tienen imprevistos", desc: "Es parte del servicio a distancia", emoji: "😐", v: -1 },
      { id: "grave", lbl: "Pagué por algo que no recibí", desc: "El servicio prometido no fue entregado", emoji: "⚡", v: 3 },
      { id: "arruino", lbl: "Me arruinó algo que importaba", desc: "Era una ocasión especial", emoji: "😢", v: 1 },
      { id: "pague", lbl: "El precio implicaba cierta calidad", desc: "No es lo mismo pagar $400 que $4.500", emoji: "💸", v: 2 },
    ],
    prueba: [
      { id: "screenshot", lbl: "El horario prometido versus el real", emoji: "📱", v: 4 },
      { id: "foto", lbl: "El estado en que llegó la comida", emoji: "📸", v: 3 },
      { id: "paladar", lbl: "Mi experiencia como cliente", emoji: "😤", v: -2 },
      { id: "publicidad", lbl: "Lo que prometían en la publicidad", emoji: "💻", v: 2 },
      { id: "wasabi", lbl: "El wasabi derramado sobre todo", emoji: "🟢", v: 3 },
      { id: "reseñas", lbl: "Otros clientes tuvieron lo mismo", emoji: "⭐", v: 2 },
    ],
    forma: [
      { id: "redes", lbl: "Compartirlo con toda mi red", desc: "Que otros sepan lo que pasó", emoji: "📲", v: 0 },
      { id: "app", lbl: "Usar el canal oficial del servicio", desc: "El proceso que corresponde por contrato", emoji: "📋", v: 3 },
      { id: "review", lbl: "Una reseña detallada y honesta", desc: "Una estrella bien justificada", emoji: "⭐", v: 1 },
      { id: "directo", lbl: "Hablar directamente con el local", desc: "Persona a persona, sin intermediarios", emoji: "📞", v: 2 },
    ],
    respuesta: [
      { id: "repetir", lbl: "El pedido sale de vuelta sin cargo", desc: "Reposición completa e inmediata", emoji: "🔄", v: 2 },
      { id: "trafico", lbl: "Eso ya no depende de nosotros", desc: "El repartidor es externo al local", emoji: "🚗", v: -1 },
      { id: "devolucion", lbl: "Devolvemos el dinero completo", desc: "Sin preguntas, reintegro total", emoji: "💰", v: 4 },
      { id: "cocina", lbl: "Reconocemos el error puntual", desc: "Descuento real en el próximo pedido", emoji: "👨‍🍳", v: 1 },
    ],
    argumento: [
      { id: "garantia", lbl: "Tenemos protocolo activo para esto", desc: "Cada reclamo tiene una respuesta establecida", emoji: "📜", v: 3 },
      { id: "cliente", lbl: "El tiempo de espera agravó todo", desc: "La demora amplificó el problema inicial", emoji: "⏱️", v: -1 },
      { id: "clima", lbl: "Las condiciones externas afectan", desc: "El frío del clima impacta el transporte", emoji: "🌧️", v: 0 },
      { id: "calidad", lbl: "Hay una falla que hay que corregir", desc: "Lo reconocemos y lo vamos a resolver", emoji: "✅", v: 2 },
    ],
    escalada: [
      { id: "olvidar", lbl: "Dejarlo pasar", desc: "El desgaste no vale lo que cuesta", emoji: "🤷", v: -2 },
      { id: "compensacion", lbl: "Aceptar lo que ofrecen", desc: "Un gesto concreto cierra el tema", emoji: "🎁", v: 3 },
      { id: "defcon", lbl: "Ir a una instancia oficial", desc: "El organismo de defensa del consumidor existe", emoji: "🏛️", v: 2 },
      { id: "acuerdo", lbl: "Resolverlo directo entre las partes", desc: "Rápido, sin intermediarios, ya", emoji: "🤝", v: 3 },
    ],
  },
  {
    id: 5, cat: "SOCIAL 📸", titulo: "La Foto Sin Permiso",
    desc: "Subieron una foto tuya sin permiso. Te ves terrible. 47 likes y dos comentarios comprometedores.",
    base: 7000,
    ctx: {
      dem: "Screenshot de la publicación, hora, alcance y tu cara claramente reconocible.",
      def: "Subiste una foto de grupo en un momento divertido. No pensaste que molestaría.",
    },
    gravedad: [
      { id: "privacidad", lbl: "Mi imagen es mía", desc: "Usarla sin permiso tiene consecuencias", emoji: "🔒", v: 3 },
      { id: "relax", lbl: "Le estás dando más de lo que merece", desc: "Es solo una foto", emoji: "😌", v: -1 },
      { id: "imagen", lbl: "Eso afecta cómo me perciben", desc: "La reputación digital importa hoy", emoji: "💻", v: 2 },
      { id: "incomoda", lbl: "Me molesta aunque entiendo", desc: "No hubo mala intención, pero igual", emoji: "😕", v: 1 },
    ],
    prueba: [
      { id: "captura", lbl: "La publicación está documentada", emoji: "📱", v: 4 },
      { id: "incomodidad", lbl: "Cómo me hizo sentir", emoji: "😔", v: -2 },
      { id: "comentarios", lbl: "Los comentarios que generó", emoji: "💬", v: 2 },
      { id: "likes", lbl: "La difusión que ya tuvo", emoji: "❤️", v: 2 },
      { id: "testigos", lbl: "Gente que estuvo ahí", emoji: "👤", v: 1 },
      { id: "screenshothora", lbl: "Timestamp y alcance documentados", emoji: "🕐", v: 3 },
    ],
    forma: [
      { id: "contra", lbl: "Devolvérsela con la misma moneda", desc: "Una foto horrible tuya también existe", emoji: "📸", v: -2 },
      { id: "privado", lbl: "Pedirlo en privado primero", desc: "Sin drama, sin exposición, directo", emoji: "💬", v: 2 },
      { id: "reporte", lbl: "Usar los canales de la plataforma", desc: "Para eso existen las herramientas", emoji: "🚨", v: 3 },
      { id: "comentario", lbl: "Que quede público el reclamo", desc: "En la misma publicación, para que lo vean", emoji: "📢", v: 1 },
    ],
    respuesta: [
      { id: "momento", lbl: "Era algo divertido para compartir", desc: "La intención era buena", emoji: "😄", v: -2 },
      { id: "baja", lbl: "Ya la bajé", desc: "Sin discutir, acción inmediata", emoji: "✅", v: 3 },
      { id: "publica", lbl: "Estábamos en un lugar público", desc: "No había expectativa de privacidad", emoji: "🌍", v: -1 },
      { id: "noto", lbl: "No me di cuenta de que molestaba", desc: "Si lo hubiera sabido, no la subía", emoji: "😓", v: 0 },
    ],
    argumento: [
      { id: "relajar", lbl: "Hay que poner esto en perspectiva", desc: "El nivel de reacción es excesivo", emoji: "🤦", v: -3 },
      { id: "noMas", lbl: "No vuelve a pasar, lo juro", desc: "Aprendí, y lo firmo si querés", emoji: "✋", v: 3 },
      { id: "contexto", lbl: "Todo el mundo sabía que había fotos", desc: "El contexto era completamente público", emoji: "🌐", v: 0 },
      { id: "intencion", lbl: "El espíritu era celebrar el momento", desc: "Nada de eso fue pensado para dañar", emoji: "🥳", v: 1 },
    ],
    escalada: [
      { id: "bloquear", lbl: "Fin del vínculo digital", desc: "Bloqueo en todas las plataformas", emoji: "🚫", v: -3 },
      { id: "acuerdo", lbl: "Acordamos cómo manejamos las fotos", desc: "Regla clara para el futuro", emoji: "📝", v: 3 },
      { id: "disculpa", lbl: "Disculpa pública donde subiste la foto", desc: "Reconocés el error donde todos pueden verlo", emoji: "🙏", v: 4 },
      { id: "legal", lbl: "Escalar a una instancia formal", desc: "Hay leyes de protección de datos", emoji: "⚖️", v: 1 },
    ],
  },
  {
    id: 6, cat: "TRABAJO 💼", titulo: "El Crédito Robado",
    desc: "Presentaste una idea en la reunión. Tu colega la repitió 10 minutos después como si fuera suya. El jefe la aplaudió a ella.",
    base: 13000,
    ctx: {
      dem: "Tenés el email previo donde describís la idea y dos colegas que te escucharon primero.",
      def: "La idea que presentaste tenía elementos de conversaciones anteriores con el equipo. Fue grupal.",
    },
    gravedad: [
      { id: "grave", lbl: "Me robaron el trabajo", desc: "La idea era mía y todos lo saben", emoji: "😤", v: 3 },
      { id: "leve", lbl: "En el trabajo las ideas son colectivas", desc: "Nadie es dueño de una idea", emoji: "🤷", v: -1 },
      { id: "mod", lbl: "Hay un problema de reconocimiento", desc: "No pido crédito extra, pido el que corresponde", emoji: "😔", v: 2 },
      { id: "drama", lbl: "Mi reputación está en juego", desc: "Esto impacta en mi carrera concretamente", emoji: "🔥", v: 1 },
    ],
    prueba: [
      { id: "email", lbl: "El email que mandé antes de la reunión", emoji: "📧", v: 4 },
      { id: "colegas", lbl: "Colegas que me escucharon primero", emoji: "👥", v: 3 },
      { id: "slack", lbl: "El hilo de Slack donde lo planteé", emoji: "💬", v: 3 },
      { id: "nada", lbl: "Solo sé que fue mía", emoji: "🧠", v: -2 },
      { id: "notas", lbl: "Mis notas previas con fecha", emoji: "📓", v: 2 },
      { id: "reunion", lbl: "La grabación de la reunión", emoji: "🎙️", v: 4 },
    ],
    forma: [
      { id: "jefe", lbl: "Hablarlo directo con el jefe", desc: "Ir a la fuente de autoridad directamente", emoji: "👔", v: 3 },
      { id: "colega", lbl: "Hablarlo primero con la colega", desc: "Darle la chance de reconocerlo sola", emoji: "💬", v: 2 },
      { id: "email", lbl: "Documentarlo por escrito", desc: "Mandar un resumen formal de lo ocurrido", emoji: "📧", v: 2 },
      { id: "publico", lbl: "Nombrarlo en la próxima reunión", desc: "Frente a todos, sin drama pero con claridad", emoji: "📢", v: 1 },
    ],
    respuesta: [
      { id: "grupal", lbl: "Fue una construcción grupal", desc: "Esas ideas vienen de muchas conversaciones", emoji: "👥", v: -1 },
      { id: "reconoce", lbl: "Tenés razón, tendría que haberlo nombrado", desc: "Error genuino, lo corrijo públicamente", emoji: "✅", v: 4 },
      { id: "casualidad", lbl: "Fue una coincidencia", desc: "A veces dos personas llegan al mismo lugar", emoji: "🤷", v: -2 },
      { id: "parcial", lbl: "Parte era tuya, parte era de otros", desc: "El crédito debería distribuirse", emoji: "⚖️", v: 1 },
    ],
    argumento: [
      { id: "intencion", lbl: "No fue intencional", desc: "Nadie en esta empresa actúa de mala fe", emoji: "😇", v: 0 },
      { id: "historial", lbl: "Tengo un historial de reconocer el trabajo ajeno", desc: "Esto no es un patrón en mí", emoji: "📊", v: 1 },
      { id: "mea", lbl: "Me equivoqué y lo asumo", desc: "Lo corrijo con hechos ahora mismo", emoji: "🙇", v: 4 },
      { id: "contexto", lbl: "El contexto de la reunión era confuso", desc: "No hubo claridad sobre quién decía qué", emoji: "🌀", v: 2 },
    ],
    escalada: [
      { id: "rrhh", lbl: "Escalar a recursos humanos", desc: "El canal formal existe para esto", emoji: "🏛️", v: 2 },
      { id: "cerrar", lbl: "Cerrarlo entre nosotros", desc: "Una conversación honesta y listo", emoji: "🤝", v: 3 },
      { id: "nuclear", lbl: "Hacerlo público en toda la empresa", desc: "Que todos sepan lo que pasó", emoji: "💣", v: -2 },
      { id: "seguir", lbl: "Que quede documentado y seguir", desc: "No escalar, pero no olvidar", emoji: "📋", v: 2 },
    ],
  },
  {
    id: 7, cat: "VECINOS 🏢", titulo: "La Música a las 2am",
    desc: "Tercer sábado consecutivo. Música fuerte a las 2am. Llamaste al timbre dos veces. Silencio total.",
    base: 10000,
    ctx: {
      dem: "Audio grabado con hora, registro de las veces que llamaste y vecinos como testigos.",
      def: "Fue una reunión puntual. La música no era tan alta. Las quejas son exageradas.",
    },
    gravedad: [
      { id: "grave", lbl: "Tres veces ya es un patrón claro", desc: "No fue un evento aislado", emoji: "😤", v: 3 },
      { id: "leve", lbl: "Es un edificio, hay ruidos", desc: "La convivencia implica tolerancia", emoji: "🤷", v: -1 },
      { id: "salud", lbl: "Afecta mi descanso y mi salud", desc: "El sueño no es negociable", emoji: "😴", v: 2 },
      { id: "drama", lbl: "Llegué a mi límite absoluto", desc: "Esto ya es insoportable", emoji: "💔", v: -1 },
    ],
    prueba: [
      { id: "audio", lbl: "Grabación con fecha y hora", emoji: "🎙️", v: 4 },
      { id: "vecinos", lbl: "Otros vecinos que también escucharon", emoji: "👥", v: 3 },
      { id: "timbre", lbl: "Registro de las veces que llamé", emoji: "🔔", v: 2 },
      { id: "consorcio", lbl: "Reclamo formal al consorcio", emoji: "📋", v: 3 },
      { id: "nada", lbl: "Solo yo lo escuché", emoji: "👂", v: -2 },
      { id: "mensajes", lbl: "Mensajes al grupo del edificio", emoji: "📱", v: 2 },
    ],
    forma: [
      { id: "consorcio", lbl: "Reclamo formal al consorcio", desc: "El canal correcto para esto", emoji: "📋", v: 3 },
      { id: "cara", lbl: "Hablar cara a cara de día", desc: "Sin adrenalina, con calma", emoji: "💬", v: 2 },
      { id: "nota", lbl: "Una nota bajo la puerta", desc: "Escrito, sin confrontación directa", emoji: "🗒️", v: 1 },
      { id: "policia", lbl: "Llamar a quien corresponde", desc: "Cuando los recursos internos fallan", emoji: "🚔", v: 2 },
    ],
    respuesta: [
      { id: "exag", lbl: "La música no estaba tan alta", desc: "La percepción es subjetiva", emoji: "🎵", v: -1 },
      { id: "puntual", lbl: "Fue algo puntual, no se repite", desc: "Comprometerse con hechos", emoji: "✅", v: 3 },
      { id: "cumple", lbl: "Era mi cumpleaños", desc: "Una vez al año no hace daño", emoji: "🎂", v: -2 },
      { id: "bajar", lbl: "Cambio el horario y el volumen", desc: "Solución concreta e inmediata", emoji: "🔇", v: 4 },
    ],
    argumento: [
      { id: "reglas", lbl: "No hay regla escrita en el reglamento", desc: "Si no está prohibido, está permitido", emoji: "📜", v: 0 },
      { id: "compromiso", lbl: "Me comprometo a respetar los horarios", desc: "Nunca más música después de medianoche", emoji: "⏰", v: 3 },
      { id: "vivir", lbl: "La gente tiene derecho a vivir", desc: "Un departamento no es un monasterio", emoji: "🏠", v: -1 },
      { id: "disculpa", lbl: "No medí el impacto en los demás", desc: "Reconocés que no pensaste en los vecinos", emoji: "😓", v: 2 },
    ],
    escalada: [
      { id: "reglamento", lbl: "Pedir que se actualice el reglamento", desc: "Reglas claras para todos", emoji: "📝", v: 3 },
      { id: "mediacion", lbl: "Mediación del consorcio", desc: "Con el administrador como árbitro", emoji: "⚖️", v: 3 },
      { id: "legal", lbl: "Asesoramiento legal formal", desc: "Siguiente paso si no hay solución", emoji: "🏛️", v: 2 },
      { id: "ignorar", lbl: "Ignorar cualquier planteo", desc: "Tu departamento, tus reglas", emoji: "🙄", v: -3 },
    ],
  },
  {
    id: 8, cat: "PRESTAMO 💸", titulo: "La Plata Que No Vuelve",
    desc: "Le prestaste $12.000 a un amigo hace tres meses. Prometió devolvértelos en dos semanas. Nada.",
    base: 12000,
    ctx: {
      dem: "Tenés el mensaje donde lo pedía, la transferencia y los dos WhatsApps que ignoró.",
      def: "El préstamo fue, sí. Pero las circunstancias cambiaron y no hay plazos incumplidos explícitos.",
    },
    gravedad: [
      { id: "grave", lbl: "Prometió y no cumplió", desc: "Hay una fecha implícita que pasó", emoji: "😤", v: 3 },
      { id: "leve", lbl: "Son cosas de amigos", desc: "La plata no puede más que la amistad", emoji: "🤷", v: -1 },
      { id: "confianza", lbl: "Me rompió la confianza", desc: "Lo económico ya es lo de menos", emoji: "😔", v: 2 },
      { id: "drama", lbl: "Esa plata yo la necesitaba", desc: "No es un capricho, era dinero real para mí", emoji: "💸", v: 1 },
    ],
    prueba: [
      { id: "transf", lbl: "La transferencia con fecha y monto", emoji: "💸", v: 4 },
      { id: "mensaje", lbl: "El mensaje donde lo pedía", emoji: "📱", v: 3 },
      { id: "plazo", lbl: "Donde dijo en dos semanas", emoji: "🗓️", v: 4 },
      { id: "ignorados", lbl: "Los WhatsApps que ignoró", emoji: "👁️", v: 3 },
      { id: "nada", lbl: "Fue de palabra, sin registro", emoji: "🧠", v: -2 },
      { id: "testigo", lbl: "Alguien que sabe que le presté", emoji: "👤", v: 2 },
    ],
    forma: [
      { id: "directo", lbl: "Preguntarle directamente", desc: "Sin rodeos, en persona o por mensaje", emoji: "💬", v: 2 },
      { id: "formal", lbl: "Un mensaje serio con fecha límite", desc: "Claro, educado y con consecuencias", emoji: "📋", v: 3 },
      { id: "comun", lbl: "Pedirle a alguien en común que hable", desc: "Un intermediario de confianza", emoji: "👥", v: 1 },
      { id: "olvido", lbl: "Mandárselo como recordatorio casual", desc: "Como si se te hubiera pasado la fecha", emoji: "😊", v: 0 },
    ],
    respuesta: [
      { id: "pronto", lbl: "Te lo mando la semana que viene", desc: "Plazo concreto, aunque se haya demorado", emoji: "📅", v: 1 },
      { id: "paso", lbl: "Me pasaron cosas que no planeé", desc: "Circunstancias reales que cambiaron todo", emoji: "😰", v: 0 },
      { id: "ahora", lbl: "Te lo transfiero ahora mismo", desc: "Sin más vueltas", emoji: "✅", v: 4 },
      { id: "noplazo", lbl: "Nunca acordamos una fecha exacta", desc: "Dos semanas era una estimación", emoji: "🤷", v: -2 },
    ],
    argumento: [
      { id: "relacion", lbl: "La relación vale más que doce mil pesos", desc: "Esto se puede resolver sin conflicto", emoji: "🤝", v: 1 },
      { id: "asume", lbl: "Me equivoqué y lo asumo completamente", desc: "Sin excusas, con plata en mano", emoji: "🙇", v: 4 },
      { id: "contexto", lbl: "Estoy en un momento económico difícil", desc: "No es que no quiero, es que no puedo", emoji: "📉", v: 0 },
      { id: "antes", lbl: "Yo también te presté cosas antes", desc: "Esto tiene historia de los dos lados", emoji: "⚖️", v: -1 },
    ],
    escalada: [
      { id: "plazo", lbl: "Acordar un plan de pago concreto", desc: "Cuotas, fechas, compromisos reales", emoji: "📝", v: 3 },
      { id: "amistad", lbl: "Resolverlo por la amistad", desc: "Pagar y cerrar el tema para siempre", emoji: "🤝", v: 3 },
      { id: "nuclear", lbl: "Empezar a cobrarlo públicamente", desc: "Que todo el mundo sepa lo que pasó", emoji: "💣", v: -2 },
      { id: "esperar", lbl: "Darle más tiempo", desc: "La relación puede más que el dinero", emoji: "⏳", v: 1 },
    ],
  },,

{
  id:9,cat:"PAREJA 💑",titulo:"El Spoiler Imperdonable",
  desc:"Te contaron el final de la serie que llevabas tres semanas cuidando. Cuatro temporadas destruidas en diez segundos.",
  base:9000,
  ctx:{dem:"Tenés el mensaje con el spoiler y el historial de advertencias de no spoilear.",def:"No sabía que no habías llegado ahí. Además, la serie tiene cinco años."},
  gravedad:[
    {id:"catastrofe",lbl:"Me destruyó la experiencia entera",desc:"Tres semanas cuidando eso para nada",emoji:"💀",v:3},
    {id:"exag",lbl:"Es una serie, no la vida real",desc:"Ya vas a ver otra cosa",emoji:"😌",v:-2},
    {id:"dolio",lbl:"Dolió y no tiene vuelta atrás",desc:"Ese momento no se recupera",emoji:"😤",v:2},
    {id:"menor",lbl:"Me molestó pero ya lo superé",desc:"No es para tanto",emoji:"🤷",v:-1}
  ],
  prueba:[
    {id:"mensaje",lbl:"El mensaje con el spoiler textual",emoji:"📱",v:4},
    {id:"aviso",lbl:"Mensajes donde avisé que no había llegado",emoji:"⚠️",v:4},
    {id:"progreso",lbl:"Captura de mi progreso en la plataforma",emoji:"💻",v:3},
    {id:"historial",lbl:"Historial de episodios vistos hasta ahí",emoji:"📺",v:3},
    {id:"testigo",lbl:"Alguien que escuchó la conversación",emoji:"👤",v:2},
    {id:"memo",lbl:"Lo recuerdo perfectamente",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"directo",lbl:"Mensaje claro con lo que sentís",desc:"Sin drama, sin emojis, solo los hechos",emoji:"📋",v:3},
    {id:"silencio",lbl:"Silencio total hasta que pida disculpas",desc:"Que note la ausencia",emoji:"🤐",v:1},
    {id:"sarcasmo",lbl:"Spoilearle algo a él también",desc:"Ojo por ojo, final por final",emoji:"😏",v:-2},
    {id:"grupo",lbl:"Contarlo en el grupo de amigos",desc:"Que el entorno juzgue",emoji:"👥",v:0}
  ],
  respuesta:[
    {id:"disculpa",lbl:"Me equivoqué totalmente, lo reconozco",desc:"No había dimensionado lo que hacía",emoji:"✅",v:3},
    {id:"prescripcion",lbl:"La serie tiene cinco años",desc:"No es mi responsabilidad saber dónde estás",emoji:"🗓️",v:-1},
    {id:"involuntario",lbl:"Lo dije sin pensar",desc:"No hubo intención de arruinar nada",emoji:"😅",v:1},
    {id:"culpa",lbl:"Deberías haberla visto antes",desc:"Cinco años es mucho tiempo",emoji:"🤦",v:-2}
  ],
  argumento:[
    {id:"comp",lbl:"Te ofrezco ver el final juntos de nuevo",desc:"Lo resignificamos con nueva perspectiva",emoji:"🎬",v:3},
    {id:"intencion",lbl:"La intención importa",desc:"No hubo ningún ánimo de dañar",emoji:"😇",v:2},
    {id:"exagerado",lbl:"La reacción es desproporcionada",desc:"Es entretenimiento, no cirugía",emoji:"📏",v:0},
    {id:"cultura",lbl:"Los spoilers son parte de la cultura",desc:"Imposible evitarlos indefinidamente",emoji:"📺",v:-1}
  ],
  escalada:[
    {id:"regla",lbl:"Acordamos una regla de spoilers para siempre",desc:"Por escrito, sin excepciones",emoji:"📝",v:4},
    {id:"olvidar",lbl:"Lo dejo pasar esta vez",desc:"No vale el desgaste de la relación",emoji:"🤝",v:2},
    {id:"igual",lbl:"Aceptás las disculpas y seguís mirando",desc:"La vida es corta, la serie también",emoji:"▶️",v:1},
    {id:"nuclear",lbl:"Bloqueo preventivo durante próximas series",desc:"No te cuento nada de lo que miro",emoji:"🚫",v:-2}
  ],
},
{
  id:10,cat:"PAREJA 💑",titulo:"El Celular en la Cena",
  desc:"Cuarta cena seguida mirando el teléfono. Conversación unilateral. El otro ausente en cuerpo presente.",
  base:8500,
  ctx:{dem:"Cuatro cenas documentadas y un mozo que preguntó si estaban bien.",def:"Estaba esperando un mensaje importante. Y la conversación tampoco era tan interesante."},
  gravedad:[
    {id:"patron",lbl:"No es una vez, es un patrón claro",desc:"Cuatro cenas seguidas no es casualidad",emoji:"😤",v:3},
    {id:"moderno",lbl:"El teléfono es parte de la vida moderna",desc:"Todo el mundo lo hace",emoji:"📱",v:-2},
    {id:"descuido",lbl:"Se olvida de que estoy ahí",desc:"Eso dice más que mil palabras",emoji:"😔",v:2},
    {id:"menor",lbl:"Tampoco fue tan seguido",desc:"Estás exagerando un poco",emoji:"🤷",v:-1}
  ],
  prueba:[
    {id:"foto",lbl:"Foto de él mirando el celu en la mesa",emoji:"📸",v:4},
    {id:"mozo",lbl:"El mozo que preguntó si estaban bien",emoji:"👤",v:3},
    {id:"historial",lbl:"Las cuatro fechas con capturas",emoji:"📊",v:3},
    {id:"nota",lbl:"Nota que le dejaste en el mantel",emoji:"🗒️",v:2},
    {id:"mensajes",lbl:"Sus propios mensajes durante la cena",emoji:"📱",v:2},
    {id:"yo",lbl:"Lo viví en primera persona",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"hablar",lbl:"Conversación directa después de cenar",desc:"Sin teléfonos, cara a cara",emoji:"💬",v:3},
    {id:"regla",lbl:"Propuesta formal de cenas sin celular",desc:"Con horario y consecuencias claras",emoji:"📋",v:3},
    {id:"nota",lbl:"Nota escrita sobre la mesa",desc:"Si no escucha, que lea",emoji:"🗒️",v:1},
    {id:"mismoJuego",lbl:"Vos también ignorás la próxima cena",desc:"Que sienta cómo es",emoji:"😏",v:-1}
  ],
  respuesta:[
    {id:"reconoce",lbl:"Tenés razón, no lo había notado",desc:"Voy a cambiar el hábito",emoji:"✅",v:3},
    {id:"urgente",lbl:"Era un mensaje urgente de trabajo",desc:"No podía ignorarlo en ese momento",emoji:"💼",v:1},
    {id:"todos",lbl:"Todo el mundo usa el celu en la mesa",desc:"Es la norma actual",emoji:"🤷",v:-1},
    {id:"aburrido",lbl:"La conversación tampoco enganchaba tanto",desc:"El teléfono llenó un vacío real",emoji:"😴",v:-3}
  ],
  argumento:[
    {id:"cena",lbl:"Propongo una cena especial sin teléfonos",desc:"Esta semana, yo reservo",emoji:"🍽️",v:4},
    {id:"habito",lbl:"Es un hábito difícil de romper",desc:"Necesito tiempo para cambiar",emoji:"⏳",v:1},
    {id:"mutual",lbl:"Los dos miramos el celu a veces",desc:"No soy el único en esta mesa",emoji:"⚖️",v:0},
    {id:"exagerado",lbl:"Le estás dando demasiada importancia",desc:"No es tan grave lo que pasó",emoji:"📏",v:-1}
  ],
  escalada:[
    {id:"ritual",lbl:"Ritual de cenas sin tecnología acordado",desc:"Una vez por semana, mínimo",emoji:"📝",v:4},
    {id:"disculpa",lbl:"Disculpa genuina y cambio inmediato",desc:"Empezando esta noche",emoji:"🙏",v:3},
    {id:"parcial",lbl:"Celu en silencio pero visible",desc:"Transacción a mitad de camino",emoji:"🔇",v:1},
    {id:"ignorar",lbl:"Hacerse el que no pasó nada",desc:"El tema se disuelve solo",emoji:"🙄",v:-2}
  ],
},
{
  id:11,cat:"PAREJA 💑",titulo:"El Control Remoto Secuestrado",
  desc:"Cuatro horas de realities que nadie pidió. El control remoto desapareció estratégicamente al inicio de la noche.",
  base:7000,
  ctx:{dem:"El control apareció debajo de su almohada y hay registro del zapping unilateral.",def:"Me gusta lo que estaba dando. Vos podías hacer otra cosa."},
  gravedad:[
    {id:"cuatro",lbl:"Cuatro horas de televisión dictatorial",desc:"Sin posibilidad de negociación",emoji:"📺",v:3},
    {id:"acuerdo",lbl:"Acordamos turnos que no se respetaron",desc:"Eso hace la diferencia",emoji:"😤",v:2},
    {id:"normal",lbl:"A alguien le tiene que tocar decidir",desc:"Así funciona la convivencia",emoji:"🤷",v:-1},
    {id:"menor",lbl:"Podías hacer otra cosa",desc:"Nadie te obligó a mirar",emoji:"😌",v:-2}
  ],
  prueba:[
    {id:"remoto",lbl:"El control bajo la almohada, foto con hora",emoji:"📸",v:4},
    {id:"acuerdo",lbl:"El acuerdo de turnos que teníamos",emoji:"📋",v:3},
    {id:"historial",lbl:"Historial del televisor esa noche",emoji:"📺",v:3},
    {id:"testigo",lbl:"Testigo que estuvo en el living",emoji:"👤",v:2},
    {id:"guia",lbl:"La guía de programación de esa noche",emoji:"🗓️",v:1},
    {id:"yo",lbl:"Lo sufrí en carne propia",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"turno",lbl:"Propuesta formal de turnos de televisión",desc:"Por semana, rotativo, sin excepciones",emoji:"📋",v:3},
    {id:"tv",lbl:"Segunda pantalla para el cuarto",desc:"Inversión que resuelve el problema",emoji:"📺",v:2},
    {id:"tomar",lbl:"Tomás el control vos también",desc:"Sin pedirlo, sin drama",emoji:"🎮",v:0},
    {id:"otro",lbl:"Te vas a hacer otra cosa esa noche",desc:"Que quede sola mirando su reality",emoji:"🚶",v:1}
  ],
  respuesta:[
    {id:"turno",lbl:"Acordemos turnos formales desde hoy",desc:"Sistema claro para los dos",emoji:"✅",v:3},
    {id:"almohada",lbl:"El control estaba ahí por casualidad",desc:"No hubo estrategia ninguna",emoji:"😅",v:-2},
    {id:"compartir",lbl:"Podías haberme dicho que querías otra cosa",desc:"Nunca lo mencionaste",emoji:"🤷",v:0},
    {id:"gusto",lbl:"Era lo que yo quería ver esa noche",desc:"Tengo derecho a mis gustos",emoji:"📺",v:-1}
  ],
  argumento:[
    {id:"app",lbl:"Instalamos app de votación de contenido",desc:"Democracia televisiva real",emoji:"🗳️",v:3},
    {id:"comp",lbl:"Mañana elegís vos toda la noche",desc:"Compensación inmediata",emoji:"🎁",v:2},
    {id:"derecho",lbl:"Tengo derecho a ver lo que me gusta",desc:"No me pueden dictar el consumo cultural",emoji:"⚖️",v:0},
    {id:"exag",lbl:"Es televisión, no una dictadura",desc:"Estás construyendo un caso por el control",emoji:"🤦",v:-1}
  ],
  escalada:[
    {id:"turno2",lbl:"Sistema de turnos semanales firmado",desc:"Con veto disponible una vez por semana",emoji:"📝",v:4},
    {id:"tv2",lbl:"Invertimos en segunda televisión",desc:"Problema resuelto para siempre",emoji:"📺",v:3},
    {id:"acuerdo",lbl:"Acuerdo verbal de respeto por los gustos",desc:"Sin sistema formal pero con consciencia",emoji:"🤝",v:1},
    {id:"ignorar",lbl:"Cada uno que vea lo que pueda",desc:"El caos televisivo reina",emoji:"🙄",v:-3}
  ],
},
{
  id:12,cat:"CONVIVENCIA 🏠",titulo:"Los Platos Sin Lavar",
  desc:"Tercer día consecutivo. La pileta desbordada. Una nota pasivo-agresiva ignorada. El aroma ya tiene nombre propio.",
  base:9000,
  ctx:{dem:"Foto de la pileta, la nota que dejaste y registro de los tres días.",def:"Estuve muy ocupado. Y la nota era innecesariamente agresiva."},
  gravedad:[
    {id:"tres",lbl:"Tres días es un patrón, no un olvido",desc:"La pileta ya tiene ecosistema propio",emoji:"🦠",v:3},
    {id:"olor",lbl:"El olor ya afecta a todos en la casa",desc:"Consecuencias comunitarias concretas",emoji:"🤢",v:3},
    {id:"ocupado",lbl:"Estaba muy ocupado esta semana",desc:"Las circunstancias no ayudaron",emoji:"💼",v:-1},
    {id:"leve",lbl:"Son platos, se lavan en cinco minutos",desc:"La solución está disponible",emoji:"🤷",v:-2}
  ],
  prueba:[
    {id:"foto",lbl:"Foto de la pileta con fecha",emoji:"📸",v:4},
    {id:"nota",lbl:"La nota que dejaste ignorada",emoji:"🗒️",v:3},
    {id:"acuerdo",lbl:"El acuerdo de turnos de limpieza",emoji:"📋",v:3},
    {id:"testigo",lbl:"El otro roommate como testigo",emoji:"👤",v:3},
    {id:"historial",lbl:"Registro de tres días sin lavar",emoji:"📊",v:3},
    {id:"yo",lbl:"Lo vi con mis propios ojos",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"turno",lbl:"Sistema de turnos de limpieza formal",desc:"Con fecha, hora y responsable",emoji:"📋",v:3},
    {id:"directo",lbl:"Conversación directa sobre el impacto",desc:"Sin nota, cara a cara",emoji:"💬",v:2},
    {id:"multa",lbl:"Sistema de compensación económica",desc:"Por cada día sin lavar hay un costo",emoji:"💰",v:2},
    {id:"fotos",lbl:"Documentación fotográfica diaria",desc:"Para registro del deterioro",emoji:"📸",v:0}
  ],
  respuesta:[
    {id:"lavo",lbl:"Los lavo ahora mismo",desc:"Sin discutir más el tema",emoji:"✅",v:4},
    {id:"turno2",lbl:"Acordemos turnos rotativos",desc:"Sistema claro para todos",emoji:"📋",v:3},
    {id:"ocupado2",lbl:"Tuve una semana muy complicada",desc:"No es un patrón, fue una excepción",emoji:"💼",v:0},
    {id:"igual",lbl:"Vos tampoco sos perfecto con la limpieza",desc:"Miremos el panorama completo",emoji:"⚖️",v:-2}
  ],
  argumento:[
    {id:"lavo2",lbl:"Lavo todo y propongo sistema preventivo",desc:"Para que no vuelva a pasar",emoji:"🧽",v:4},
    {id:"turno3",lbl:"Acordemos turnos rotativos",desc:"Sistema claro para todos",emoji:"📋",v:3},
    {id:"ocupado3",lbl:"Hay semanas que desbordan",desc:"No siempre se puede cumplir todo",emoji:"😰",v:0},
    {id:"exag",lbl:"Tres días no es el apocalipsis",desc:"Hay que relativizar",emoji:"📏",v:-2}
  ],
  escalada:[
    {id:"sistema",lbl:"Sistema de limpieza con consecuencias reales",desc:"Firmado por todos los roommates",emoji:"📝",v:4},
    {id:"inmediato",lbl:"Lavar ahora más compensación económica",desc:"Por los tres días de incumplimiento",emoji:"💰",v:3},
    {id:"mediacion",lbl:"Mediación con el tercer roommate",desc:"Voz neutral que establezca reglas",emoji:"⚖️",v:2},
    {id:"ignorar",lbl:"Seguir dejando que se acumulen",desc:"El tiempo resolverá",emoji:"🙄",v:-3}
  ],
},
{
  id:13,cat:"CONVIVENCIA 🏠",titulo:"El Papel Higiénico Eterno",
  desc:"Tres veces esta semana. El rollo vacío en el soporte. El de repuesto a quince centímetros. Nadie lo cambia.",
  base:6500,
  ctx:{dem:"Tres fotos del rollo vacío con hora. El repuesto a quince centímetros en cada foto.",def:"Se me olvidó. No es intencional. Y el de repuesto estaba justo ahí disponible."},
  gravedad:[
    {id:"tres",lbl:"Tres veces esta semana es un patrón",desc:"El repuesto estaba a quince centímetros",emoji:"🧻",v:3},
    {id:"principio",lbl:"Es una cuestión de principios",desc:"El detalle dice todo",emoji:"🎯",v:2},
    {id:"olvido",lbl:"Se olvida, no hay mala fe",desc:"No es un crimen",emoji:"😅",v:-1},
    {id:"menor",lbl:"Es papel higiénico",desc:"Hay problemas más serios",emoji:"🤷",v:-2}
  ],
  prueba:[
    {id:"foto",lbl:"Las tres fotos con timestamp",emoji:"📸",v:4},
    {id:"repuesto",lbl:"El repuesto a quince centímetros en la foto",emoji:"📏",v:4},
    {id:"historial",lbl:"Patrón documentado de la semana",emoji:"📊",v:3},
    {id:"testigo",lbl:"Testigo del incidente",emoji:"👤",v:2},
    {id:"nota",lbl:"Nota que dejaste la primera vez",emoji:"🗒️",v:2},
    {id:"yo",lbl:"Lo descubrí en el peor momento posible",emoji:"🧠",v:-1}
  ],
  forma:[
    {id:"regla",lbl:"Regla simple: quien termina, cambia",desc:"Sin excepciones ni debate",emoji:"📋",v:3},
    {id:"comprar",lbl:"Acordar stock mínimo en el baño",desc:"Nunca más el repuesto afuera",emoji:"🛒",v:3},
    {id:"charla",lbl:"Conversación sobre los pequeños detalles",desc:"Que forman la convivencia",emoji:"💬",v:2},
    {id:"multa",lbl:"Multa simbólica por cada vez",desc:"Consecuencia económica proporcional",emoji:"💰",v:1}
  ],
  respuesta:[
    {id:"cambio",lbl:"Cambio el rollo siempre de ahora en más",desc:"Promesa simple y directa",emoji:"✅",v:3},
    {id:"automatico",lbl:"Pongo alerta en el teléfono para recordarlo",desc:"Solución técnica al problema",emoji:"🔔",v:3},
    {id:"olvido2",lbl:"Genuinamente se me olvidó",desc:"Sin ninguna intención",emoji:"😅",v:0},
    {id:"disponible",lbl:"El repuesto estaba disponible",desc:"No era tan difícil resolverlo",emoji:"🤷",v:-1}
  ],
  argumento:[
    {id:"stock",lbl:"Propongo stock fijo en el baño",desc:"Nunca menos de tres rollos",emoji:"🛒",v:3},
    {id:"automatico2",lbl:"Alerta en el teléfono instalada ya",desc:"Solución técnica inmediata",emoji:"🔔",v:2},
    {id:"olvido3",lbl:"El hábito tarda en formarse",desc:"Necesito tiempo para incorporarlo",emoji:"⏳",v:0},
    {id:"exag",lbl:"Tres incidentes no hacen un caso",desc:"La proporcionalidad está ausente",emoji:"📏",v:-2}
  ],
  escalada:[
    {id:"regla2",lbl:"Regla oficial incorporada al acuerdo de convivencia",desc:"Quien termina, cambia. Sin debate.",emoji:"📝",v:4},
    {id:"stock2",lbl:"Sistema de stock mínimo implementado",desc:"Con responsable semanal de reposición",emoji:"🛒",v:3},
    {id:"acuerdo",lbl:"Acuerdo verbal con doble confirmación",desc:"Comprometido en presencia de testigo",emoji:"🤝",v:1},
    {id:"ignorar",lbl:"Seguir documentando sin hacer nada",desc:"Construir el caso por si acaso",emoji:"🙄",v:-2}
  ],
},
{
  id:14,cat:"AMIGOS 👥",titulo:"El que Cancela Siempre",
  desc:"Confirmó el viernes. Canceló el sábado a las 7pm. Ya habías comprado la entrada. Tercera vez este mes.",
  base:11000,
  ctx:{dem:"La confirmación por chat, la entrada comprada, el ticket no reembolsable y el historial de cancelaciones.",def:"Me surgió algo urgente. No lo pude evitar. Pasa a veces."},
  gravedad:[
    {id:"entrada",lbl:"Compré la entrada basándome en su confirmación",desc:"Hay pérdida económica concreta",emoji:"🎫",v:3},
    {id:"patron",lbl:"No es la primera vez que cancela así",desc:"Hay un historial documentado",emoji:"📊",v:3},
    {id:"surge",lbl:"Le surgió algo, pasa",desc:"La vida es impredecible",emoji:"🤷",v:-1},
    {id:"menor",lbl:"La entrada no era tan cara",desc:"La pérdida es manejable",emoji:"😌",v:-2}
  ],
  prueba:[
    {id:"confirmacion",lbl:"El mensaje de confirmación del viernes",emoji:"📱",v:4},
    {id:"entrada",lbl:"La entrada comprada",emoji:"🎫",v:4},
    {id:"ticket",lbl:"El gasto no reembolsable",emoji:"🧾",v:3},
    {id:"horario",lbl:"Hora de la cancelación vs hora del evento",emoji:"⏰",v:3},
    {id:"historial",lbl:"Las otras veces que canceló así",emoji:"📊",v:3},
    {id:"yo",lbl:"Lo recuerdo perfectamente",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"reembolso",lbl:"Pedís que cubra el costo de la entrada",desc:"Consecuencia directa de la cancelación",emoji:"💰",v:3},
    {id:"directo",lbl:"Mensaje directo sobre el impacto",desc:"Sin drama, con datos",emoji:"💬",v:2},
    {id:"regla",lbl:"Nueva regla: confirmar con 48hs de anticipación",desc:"O asumir el costo",emoji:"📋",v:2},
    {id:"silencio",lbl:"Silencio selectivo por una semana",desc:"Que note la ausencia",emoji:"🤐",v:0}
  ],
  respuesta:[
    {id:"pago",lbl:"Pago la entrada, lo reconozco",desc:"Error mío, consecuencia mía",emoji:"✅",v:4},
    {id:"surge2",lbl:"Me surgió algo urgente e inevitable",desc:"No tenía alternativa",emoji:"😔",v:0},
    {id:"pasa",lbl:"Pasa en todas las amistades",desc:"Nadie es perfecto en esto",emoji:"🤷",v:-1},
    {id:"cara",lbl:"No debías haber comprado sin confirmar bien",desc:"El riesgo era tuyo",emoji:"😤",v:-2}
  ],
  argumento:[
    {id:"pago2",lbl:"Pago y me comprometo a avisar con anticipación",desc:"Cambio de conducta real",emoji:"💸",v:4},
    {id:"proxima",lbl:"La próxima salida es a mi cargo",desc:"Compensación futura",emoji:"🎁",v:2},
    {id:"urgente",lbl:"Fue una emergencia genuina",desc:"Sin poder evitarlo",emoji:"🚨",v:1},
    {id:"impredecible",lbl:"La vida no siempre es predecible",desc:"El sistema de confirmación tiene fallas",emoji:"🌪️",v:-1}
  ],
  escalada:[
    {id:"pago3",lbl:"Pago la entrada más una salida de compensación",desc:"Cierra el tema de forma justa",emoji:"📝",v:4},
    {id:"regla2",lbl:"Sistema de confirmación con 48hs de margen",desc:"Y cobertura de gastos si se cancela tarde",emoji:"📋",v:3},
    {id:"mediacion",lbl:"Que un amigo en común opine",desc:"Perspectiva neutral sobre lo justo",emoji:"⚖️",v:1},
    {id:"ignorar",lbl:"Absorber el gasto y bajar las expectativas",desc:"Nunca más comprar basado en su confirmación",emoji:"🙄",v:-2}
  ],
},
{
  id:15,cat:"AMIGOS 👥",titulo:"El que Siempre Llega Tarde",
  desc:"Citados a las 8pm. Llegó a las 9:15pm. El restaurante ya no tenía la mesa reservada. Cuarta vez este mes.",
  base:9000,
  ctx:{dem:"La reserva perdida, los mensajes de la hora acordada y el historial de llegadas tarde.",def:"Me surgió algo. Y tampoco son tan puntuales todos. Llegar tarde es parte de mi forma de ser."},
  gravedad:[
    {id:"reserva",lbl:"Perdimos la mesa por su demora",desc:"Consecuencias concretas para todos",emoji:"🍽️",v:3},
    {id:"patron",lbl:"Cuarta vez este mes es sistemático",desc:"No fue una excepción",emoji:"📊",v:3},
    {id:"surge",lbl:"Le surgió algo imprevisto",desc:"La vida es impredecible",emoji:"🤷",v:-1},
    {id:"menor",lbl:"Igual comimos bien",desc:"El resultado final no fue tan malo",emoji:"😌",v:-2}
  ],
  prueba:[
    {id:"reserva2",lbl:"Confirmación de la reserva perdida",emoji:"📋",v:4},
    {id:"hora",lbl:"Los mensajes indicando la hora acordada",emoji:"📱",v:3},
    {id:"historial",lbl:"Registro de llegadas tarde previas",emoji:"📊",v:3},
    {id:"testigos",lbl:"El resto del grupo como testigos",emoji:"👥",v:3},
    {id:"foto",lbl:"Foto del grupo esperando sin mesa",emoji:"📸",v:2},
    {id:"yo",lbl:"Lo vi llegar tarde",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"directo",lbl:"Decirle el impacto que tuvo su demora",desc:"Sin gritar, con datos concretos",emoji:"💬",v:3},
    {id:"sistema",lbl:"Sistema de grupos: se espera 20 minutos máximo",desc:"Regla del grupo de acá en más",emoji:"⏰",v:3},
    {id:"adelante",lbl:"La próxima empiezan sin esperarlo",desc:"Consecuencia natural",emoji:"🚀",v:2},
    {id:"temprano",lbl:"Citarlo una hora antes que al resto",desc:"Que llegue cuando debería",emoji:"⏰",v:1}
  ],
  respuesta:[
    {id:"reconoce",lbl:"Fue mi culpa, no vuelve a pasar",desc:"Reconocimiento sin excusas",emoji:"✅",v:3},
    {id:"comp",lbl:"Pago la diferencia de mesa más la incomodidad",desc:"Compensación concreta",emoji:"💰",v:3},
    {id:"surge2",lbl:"Me surgió algo genuinamente urgente",desc:"Fue una situación extraordinaria",emoji:"🚨",v:0},
    {id:"exag",lbl:"Una hora tampoco es tanto",desc:"La reacción es exagerada",emoji:"😤",v:-2}
  ],
  argumento:[
    {id:"proxima",lbl:"La próxima me encargo de la reserva",desc:"Compensación organizativa",emoji:"📋",v:3},
    {id:"comp2",lbl:"Pago algo de la noche como compensación",desc:"Reconocimiento económico",emoji:"💰",v:2},
    {id:"urgente",lbl:"Fue genuinamente urgente",desc:"Sin poder evitarlo",emoji:"🚨",v:1},
    {id:"flexible",lbl:"Las reuniones sociales tienen margen de flexibilidad",desc:"La rigidez también tiene un costo",emoji:"🤷",v:-1}
  ],
  escalada:[
    {id:"regla",lbl:"Regla del grupo: 20 minutos de espera máximo",desc:"Acordada por todos para el futuro",emoji:"📝",v:4},
    {id:"comp3",lbl:"Compensación económica por el daño causado",desc:"Más compromiso de puntualidad",emoji:"💰",v:3},
    {id:"ignorar",lbl:"Seguir citándolo una hora antes",desc:"Solución unilateral no oficial",emoji:"🙄",v:1},
    {id:"excluir",lbl:"No incluirlo en reservas futuras",desc:"Consecuencia lógica",emoji:"🚫",v:0}
  ],
},
{
  id:16,cat:"SALIDAS 🍔",titulo:"La Cuenta Imposible de Dividir",
  desc:"Ocho personas, siete opiniones. Uno pidió agua y quiere pagar lo mismo que el que pidió lo más caro.",
  base:8000,
  ctx:{dem:"Pediste lo más económico. El total dividido igual incluye tres tragos que no tomaste.",def:"Dividir a detalle es un horror logístico. Así funciona cuando se sale en grupo."},
  gravedad:[
    {id:"diferencia",lbl:"La diferencia entre lo que pedí y lo que pago es el doble",desc:"No es un asunto menor",emoji:"💰",v:3},
    {id:"justo",lbl:"La equidad importa incluso entre amigos",desc:"Cada uno paga lo que consumió",emoji:"⚖️",v:2},
    {id:"grupo",lbl:"Así funciona cuando se sale en grupo",desc:"A veces se gana, a veces se pierde",emoji:"🤷",v:-2},
    {id:"menor",lbl:"La diferencia no es tan grande",desc:"No vale el conflicto",emoji:"😌",v:-1}
  ],
  prueba:[
    {id:"cuenta",lbl:"La cuenta original con detalle de consumo",emoji:"🧾",v:4},
    {id:"calculo",lbl:"El cálculo de la diferencia real",emoji:"🧮",v:3},
    {id:"pedido",lbl:"El registro de lo que pediste vos",emoji:"📱",v:3},
    {id:"foto",lbl:"Foto de tu plato",emoji:"📸",v:2},
    {id:"testigo",lbl:"Alguien que vio lo que pediste",emoji:"👤",v:2},
    {id:"yo",lbl:"Lo que recuerdo haber pedido",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"app",lbl:"Usar una app de división de cuentas",desc:"Tecnología que resuelve el debate",emoji:"📱",v:3},
    {id:"detalle",lbl:"Propuesta de división por consumo real",desc:"Cada uno paga lo suyo exactamente",emoji:"🧮",v:3},
    {id:"propina",lbl:"División igual pero sacando propina aparte",desc:"Compromiso intermedio",emoji:"💰",v:2},
    {id:"hablar",lbl:"Plantearlo antes de pedir",desc:"Acordar el sistema antes del menú",emoji:"💬",v:2}
  ],
  respuesta:[
    {id:"app2",lbl:"Usemos la app, resuelve todo",desc:"Sin debate manual",emoji:"📱",v:3},
    {id:"detalle2",lbl:"Está bien, dividimos por consumo",desc:"Es lo más justo",emoji:"✅",v:3},
    {id:"logistica",lbl:"Dividir a detalle lleva una hora",desc:"No es práctico",emoji:"⏰",v:-1},
    {id:"promedio",lbl:"La división igual promedia las diferencias",desc:"A veces pagás más, a veces menos",emoji:"⚖️",v:-2}
  ],
  argumento:[
    {id:"siempre",lbl:"Propongo este sistema para todas las salidas futuras",desc:"App de división, acordado antes de sentarse",emoji:"📱",v:4},
    {id:"social",lbl:"La dinámica social vale más que unos pesos",desc:"No arruino una noche por esto",emoji:"🤝",v:0},
    {id:"vez",lbl:"Esta vez pago más pero la próxima compenso",desc:"Balance a largo plazo",emoji:"⚖️",v:1},
    {id:"norma",lbl:"La norma del grupo es dividir igual",desc:"Si no te gusta, proponelo antes",emoji:"📏",v:-1}
  ],
  escalada:[
    {id:"app3",lbl:"App de cuentas para todas las salidas futuras",desc:"Acordado por el grupo antes de la próxima",emoji:"📝",v:4},
    {id:"paga",lbl:"Esta vez pagan la diferencia, próxima se usa app",desc:"Compensación y sistema para adelante",emoji:"💰",v:3},
    {id:"acuerdo",lbl:"Acuerdo oral de división por consumo",desc:"Que quede claro para el futuro",emoji:"🤝",v:2},
    {id:"ignorar",lbl:"Absorber la diferencia y cambiar de grupo",desc:"El costo de una lección aprendida",emoji:"🙄",v:-3}
  ],
},
{
  id:17,cat:"DIGITAL 💻",titulo:"Los Audios Eternos",
  desc:"Quince audios. El primero dura cuatro minutos. El último dice lo mismo que el primero. Todo podría ser un texto.",
  base:6500,
  ctx:{dem:"Los quince audios documentados con duración total de 23 minutos. El resumen cabe en dos líneas.",def:"Me expreso mejor hablando. Y no estás obligado a escucharlos al instante."},
  gravedad:[
    {id:"quince",lbl:"Quince audios en un día es invasión sonora",desc:"El chat quedó inutilizable",emoji:"🎙️",v:3},
    {id:"23min",lbl:"23 minutos de audio para info de 2 líneas",desc:"La proporción está mal",emoji:"⏱️",v:2},
    {id:"expreso",lbl:"Es su forma de comunicarse",desc:"Cada uno tiene su estilo",emoji:"🤷",v:-2},
    {id:"menor",lbl:"Los audios son parte de la vida moderna",desc:"Acostumbrarse",emoji:"📱",v:-1}
  ],
  prueba:[
    {id:"captura",lbl:"Captura de los quince audios en el chat",emoji:"📱",v:4},
    {id:"duracion",lbl:"La duración total de 23 minutos",emoji:"⏱️",v:3},
    {id:"resumen",lbl:"El texto de dos líneas que los resume",emoji:"📝",v:3},
    {id:"testigo",lbl:"Otro miembro del chat que también sufre",emoji:"👤",v:2},
    {id:"silenciados",lbl:"Los audios silenciados que acumulé",emoji:"🔇",v:2},
    {id:"yo",lbl:"Lo tuve que escuchar todo",emoji:"🧠",v:-2}
  ],
  forma:[
    {id:"regla",lbl:"Regla de audios: máximo 2 por conversación",desc:"Y que duren menos de un minuto",emoji:"⏱️",v:3},
    {id:"texto",lbl:"Pedís que use texto cuando pueda",desc:"Para mensajes informativos",emoji:"📝",v:2},
    {id:"hablar",lbl:"Plantearlo directamente",desc:"Sin drama, con claridad",emoji:"💬",v:2},
    {id:"silenciar",lbl:"Silenciás el chat por una semana",desc:"Consecuencia natural",emoji:"🔇",v:0}
  ],
  respuesta:[
    {id:"texto2",lbl:"Voy a usar más texto cuando sea posible",desc:"Cambio de hábito genuino",emoji:"✅",v:3},
    {id:"minuto",lbl:"Límite de un minuto por audio de acá en más",desc:"Compromiso concreto",emoji:"⏱️",v:2},
    {id:"expreso2",lbl:"Me expreso mejor hablando",desc:"Es mi forma de comunicarme",emoji:"🗣️",v:-1},
    {id:"nooblig",lbl:"No estás obligado a escucharlos de inmediato",desc:"Son audios, no llamadas",emoji:"🤷",v:-2}
  ],
  argumento:[
    {id:"balance",lbl:"Audio para lo complejo, texto para lo simple",desc:"Sistema racional acordado",emoji:"⚖️",v:3},
    {id:"minuto2",lbl:"Límite de un minuto por audio de acá en más",desc:"Compromiso concreto",emoji:"⏱️",v:2},
    {id:"escucha",lbl:"Podés escucharlos cuando quieras",desc:"No son urgentes si no los marco así",emoji:"📱",v:0},
    {id:"forma",lbl:"La forma de comunicarse es personal",desc:"No se puede legislar",emoji:"🗣️",v:-1}
  ],
  escalada:[
    {id:"protocolo",lbl:"Protocolo de comunicación acordado",desc:"Audio solo para lo urgente o emotivo",emoji:"📝",v:4},
    {id:"reducir",lbl:"Máximo un audio por mensaje de ahora en más",desc:"Límite técnico self-impuesto",emoji:"⏱️",v:3},
    {id:"llamada",lbl:"Llamada directa cuando haya mucho para decir",desc:"Más eficiente que quince audios",emoji:"📞",v:2},
    {id:"ignorar",lbl:"Silenciar para siempre y leer los importantes",desc:"Solución unilateral",emoji:"🙄",v:-2}
  ],
}

]
