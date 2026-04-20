# 🕷️ Web Scraping Toolkit - Portafolio de Pruebas

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Proyecto de portafolio personal con scripts de web scraping desarrollados en Node.js.

Este repositorio reúne ejemplos prácticos sobre sitios públicos de práctica (entornos de prueba), con el objetivo de demostrar mis habilidades técnicas como desarrollador junior. No son proyectos de clientes reales ni representan el producto final que entregaría en un servicio comercial.

## 📌 Características

- Scraping de páginas estáticas con Axios + Cheerio.
- Scraping de contenido dinámico con Puppeteer.
- Scraping resiliente con paginación y reintentos automáticos.
- Limpieza y deduplicación de datos para entregables de negocio.
- Exportación de resultados en formatos JSON y CSV.
- Delays aleatorios y rotación de User-Agent para reducir bloqueos.
- Registro de logs con timestamp para trazabilidad.
- Código modular y reutilizable con utilidades en helpers.

## 🛠️ Tecnologías utilizadas

| Herramienta | Propósito |
|-------------|-----------|
| Node.js | Entorno de ejecución |
| Axios | Peticiones HTTP a sitios estáticos |
| Cheerio | Parseo y navegación del DOM |
| Puppeteer | Automatización de navegador para sitios con JavaScript |
| fs | Manejo de archivos JSON y CSV |

## 🎯 ¿Qué demuestran estos scripts?

Estos ejemplos muestran competencias técnicas clave para proyectos de extracción de datos:

- Diseño de scraping para páginas estáticas y dinámicas.
- Peticiones HTTP y parseo estructurado del HTML con selectores.
- Automatización de navegación con Puppeteer cuando el contenido se renderiza con JavaScript.
- Aplicación de buenas prácticas anti-bloqueo: delays aleatorios y rotación de User-Agent.
- Exportación de datasets a JSON/CSV para análisis posterior.
- Arquitectura modular con funciones reutilizables en helpers.
- Logs claros y consistentes para monitoreo y depuración.
- Preparación de datasets para clientes (estructurados y deduplicados).

## 💼 Aplicación comercial (para clientes)

Aunque este repositorio contiene scripts de prueba, el mismo enfoque técnico se aplica a proyectos reales.

Como freelancer, ofrezco soluciones a medida para:

- Extracción de datos desde portales públicos o internos autorizados.
- Monitoreo periódico de precios, catálogos, publicaciones o cambios de contenido.
- Automatización de tareas repetitivas de consulta y recolección de información.

Según la necesidad del cliente, puedo entregar:

- Resultados procesados en CSV/Excel.
- Scripts personalizados listos para ejecutar o integrar.
- Flujo de extracción adaptado al formato y frecuencia requerida.

## 📁 Estructura del proyecto

```text
web-scraping-toolkit/
├── utils/
│   └── helpers.js              # Funciones reutilizables (delay, guardado, logs, User-Agent)
├── scripts/
│   ├── scraper-citas.js        # Extrae citas de un sitio de práctica
│   ├── scraper-reddit.js       # Extrae títulos en un caso dinámico
│   ├── scraper-directorio.js   # Extrae productos de un directorio de prueba
│   ├── scraper-citas-resiliente.js   # Paginación + reintentos automáticos
│   └── scraper-productos-business.js # Dataset limpio para CSV de negocio
├── datos/                      # Salidas generadas (JSON, CSV)
├── package.json
└── README.md
```

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/web-scraping-toolkit.git
cd web-scraping-toolkit
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar los scripts

```bash
# Scraper de citas (estático)
node scripts/scraper-citas.js

# Scraper de Reddit (dinámico, requiere Puppeteer)
node scripts/scraper-reddit.js

# Scraper de productos (estático)
node scripts/scraper-directorio.js

# Scraper resiliente (paginación + reintentos)
node scripts/scraper-citas-resiliente.js

# Scraper con salida business (limpieza + deduplicación)
node scripts/scraper-productos-business.js
```

Todos los archivos generados se guardan automáticamente en la carpeta `datos/`.

## 📄 Ejemplo de salida (CSV)

### citas.csv

```csv
"text","author","tags"
"The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.","Albert Einstein","change|deep-thoughts|thinking|world"
...
```

### productos.csv

```csv
"name","price"
"Riley Smith Tote","$150.00"
"Riley Smith Shopper","$175.00"
```

### Archivos de salida adicionales

- citas_resiliente.json
- citas_resiliente.csv
- productos_business_limpio.json
- productos_business_limpio.csv

## 🧠 ¿Cómo adaptar estos scripts a otros sitios?

1. Inspecciona la página (F12 > Elements) para identificar los selectores CSS de los datos que necesitas.
2. Modifica los selectores en el script correspondiente.
3. Si el sitio carga datos con JavaScript, usa Puppeteer en lugar de Axios + Cheerio.
4. Ajusta la paginación según la estructura del sitio.
5. Aplica delays para no sobrecargar el servidor.

## 📬 Contacto

Si te interesa colaborar conmigo en proyectos de scraping o automatización:

- Correo: tu-email@ejemplo.com
- Workana: [link a tu perfil de Workana]
- GitHub: [tu-usuario]

## ⚠️ Nota ética y legal

Estos scripts están diseñados con fines educativos y de demostración para portafolio.

Antes de scrapear cualquier sitio web:

- Revisa su robots.txt.
- Verifica los términos de servicio.
- No sobrecargues servidores.
- Obtén permiso cuando corresponda.

El autor no se hace responsable del uso indebido de este material.

## 📄 Licencia

Este proyecto está publicado bajo la licencia MIT.