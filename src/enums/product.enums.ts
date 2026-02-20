export enum ProductCategory {
    // Básicos de oficina
    FURNITURE = 'Mobiliario',                     // Mesas, sillas, armarios
    IT = 'Informática y Computación',             // PCs, monitores, servidores, impresoras
    OFFICE_EQUIPMENT = 'Equipamiento de Oficina', // Fotocopiadoras, destructoras, anilladoras (cosas que no son PC ni Mueble)
    
    // Tecnología específica
    ELECTRONICS = 'Electrónica y Audio/Video',  // Proyectores, cámaras, radios, sonido (distinto de IT)
    
    // Trabajo pesado y mantenimiento
    TOOLS = 'Herramientas',                     // Taladros, martillos, herramientas de mano
    MACHINERY = 'Maquinaria y Equipos',         // Hormigoneras, motoguadañas, generadores
    VEHICLES = 'Vehículos',                     // Camionetas, autos, motos, tractores
    
    // Deporte y Cultura
    SPORTS = 'Deporte',                         // Pelotas, trofeos, arcos,etc
    CULTURE = 'Cultura',                        // Instrumentos musicales, atriles, etc
    EDUCATION = 'Educación',                    // Libros, mapas, material didáctico

    // Infraestructura y Edificio
    URBAN_ELEMENTS = 'Mobiliario Urbano',               // Bancos de plaza, luminarias de calle, señalética
    INSTALLATIONS = 'Instalaciones y Climatización',    // Aires acondicionados, estufas, bombas de agua 
    
    // Decoración
    TEXTILES = 'Textiles',                               // Cortinas, alfombras, banderas, etc
    ARTWORK = 'Arte y decoración',                       // Estatuas, cuadros, etc


    // Varios
    SAFETY = 'Seguridad y Protección',          // Matafuegos, EPP, botiquines, etc
    APPLIANCES = 'Electrodomésticos',           // Heladeras, microondas, cafeteras, etc
    KITCHENWARE = 'Vajillas y Utensillos',     // Platos, ollas, tenedores, cucharas, etc


    OTHER = 'Otros'
}

export enum ProductCondition {
    NEW = 'Nuevo',
    EXCELLENT = 'Excelente',
    GOOD = 'Bueno',
    REGULAR = 'Regular',
    BAD = 'Malo',
    BROKEN = 'Roto / Para baja'
}