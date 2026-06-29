# Banco Startup • Simulador de Crédito

Un simulador de crédito y plan de amortización interactivo, diseñado bajo una estética moderna, limpia y de alto impacto visual utilizando **React**, **TypeScript** y **Tailwind CSS**. 

---

## 🚀 Características Clave

- **Tres Líneas de Crédito Integradas**:
  - 🌟 **Libre Inversión**: Tasa del 1.55% M.V. (20.23% E.A.) para viajes, estudios o libre destino.
  - 🏠 **Crédito de Vivienda**: Tasa del 0.92% M.V. (11.61% E.A.) con condiciones preferenciales para adquisición de inmuebles.
  - 🚗 **Crédito de Vehículo**: Tasa del 1.18% M.V. (15.11% E.A.) para autos y motos.
- **Sistema de Amortización Francés**: Generación dinámica y precisa del plan de cuotas mes a mes, asegurando cuotas fijas mensuales con amortización progresiva de capital y decreciente de intereses.
- **Cálculo de Seguro de Deudores**: Incorporación realista de un seguro obligatorio de deudores tasado en $750 por cada millón de pesos de deuda inicial (mínimo de $1,000 mensuales).
- **Análisis Gráfico e Interactividad**: Panel visual que muestra la composición de cada una de las cuotas (capital, intereses y seguros) a lo largo de todo el crédito mediante gráficos interactivos construidos con **Recharts**.
- **Descargas y Exportación Multiformato**:
  - 📄 **PDF Formal**: Reporte de simulación profesional y paginado con firmas de marca de Banco Startup, tablas detalladas de amortización y cláusulas legales de transparencia financiera.
  - 📊 **CSV estructurado**: Exportación idónea para hojas de cálculo (Excel, Google Sheets).

---

## 🛠️ Tecnologías y Librerías Utilizadas

La aplicación está construida sobre una arquitectura modular moderna:

| Herramienta / Librería | Propósito |
| :--- | :--- |
| **React 19** | Biblioteca principal para la construcción de interfaces de usuario reactivas. |
| **Vite 6** | Entorno de desarrollo rápido y empaquetador para producción. |
| **TypeScript** | Tipado estático estricto para garantizar la robustez del código y prevenir errores en tiempo de ejecución. |
| **Tailwind CSS 4** | Framework CSS orientado a utilidades para un diseño visual altamente optimizado y responsivo. |
| **Recharts** | Biblioteca de visualización de datos utilizada para renderizar los gráficos de barras apiladas en el modal de análisis. |
| **jsPDF** | Motor de generación de PDF en el cliente para la descarga instantánea de reportes de crédito. |
| **Lucide React** | Conjunto de iconos vectoriales consistentes y minimalistas. |
| **Motion** | Librería de animaciones fluidas para transiciones y microinteracciones de interfaz. |

---

## 📁 Estructura del Proyecto

```text
/
├── src/
│   ├── components/
│   │   ├── Header.tsx             # Barra de navegación principal y branding
│   │   ├── PlanCuotasModal.tsx    # Modal interactivo con la tabla completa de cuotas
│   │   └── ChartModal.tsx         # Modal de visualización analítica con gráficos apilados
│   ├── utils/
│   │   ├── creditCalculator.ts    # Motor de simulación y lógica matemática
│   │   ├── pdfGenerator.ts        # Lógica de dibujo de PDF formal estructurado y paginado
│   │   └── csvGenerator.ts        # Conversión de simulación a formato CSV descargable
│   ├── types.ts                   # Interfaces estáticas TypeScript de los modelos de crédito
│   ├── App.tsx                    # Componente principal con el formulario, resúmenes y layouts
│   ├── main.tsx                   # Punto de entrada de la aplicación React
│   └── index.css                  # Estilos globales y variables de entorno de Tailwind CSS
├── package.json                   # Dependencias y scripts de ejecución npm
├── vite.config.ts                 # Configuración de Vite y plugins
└── tsconfig.json                  # Configuración de compilación de TypeScript
```

---

## 🧮 Motor de Cálculo (Fórmula de Amortización)

La aplicación utiliza la fórmula de cuota fija mensual del **Sistema de Amortización Francés**:

$$CuotaBase = \frac{Monto \times r \times (1 + r)^{n}}{(1 + r)^{n} - 1}$$

Donde:
- **$Monto$** = Valor total prestado (rango: \$1,000,000 - \$1,000,000,000 COP).
- **$r$** = Tasa de interés nominal mensual vencida correspondiente al tipo de crédito.
- **$n$** = Plazo total del crédito en meses (rango: 1 - 360 meses).

La **Cuota Mensual Total** final que paga el usuario se compone de:
$$CuotaTotal = CuotaBase + SeguroDeudores$$

---

## 💻 Guía de Instalación y Ejecución Local

Para ejecutar esta aplicación en tu entorno local usando **Visual Studio Code**, sigue estos sencillos pasos:

### Prerrequisitos
Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior recomendada) y un gestor de paquetes como `npm`.

### 1. Clonar o descargar el código
Descarga el código del proyecto y ábrelo en tu editor Visual Studio Code.

### 2. Abrir la terminal en VS Code
Puedes abrir una nueva terminal integrada dentro de VS Code presionando las teclas `Ctrl + \`` (o yendo al menú superior `Terminal > New Terminal`).

### 3. Instalar las dependencias
Ejecuta el siguiente comando en la terminal para descargar e instalar todas las librerías necesarias:
```bash
npm install
```

### 4. Iniciar el servidor de desarrollo
Una vez finalizada la instalación, ejecuta el servidor local con:
```bash
npm run dev
```

La terminal te indicará que el servidor está corriendo. Usualmente, podrás acceder abriendo tu navegador e ingresando a:
👉 `http://localhost:3000`

### 5. Compilar para producción (Opcional)
Si deseas generar los archivos estáticos listos para desplegar en producción, ejecuta:
```bash
npm run build
```
Los archivos optimizados se guardarán en la carpeta `/dist`.

---

## 🎨 Principios de Diseño Aplicados

- **Desktop-First y Mobile-Friendly**: La interfaz se adapta dinámicamente desde pantallas ultra-anchas hasta dispositivos móviles compactos mediante rejillas flexibles de Tailwind (`grid-cols-1 lg:grid-cols-12`).
- **Jerarquía Tipográfica Clara**: Uso exclusivo de fuentes sans-serif de alta legibilidad, combinadas con tamaños y grosores que guían visualmente al usuario en la lectura de sus compromisos financieros.
- **Microinteracciones**: Efectos de transiciones suaves al interactuar con botones de descarga, alternar pestañas o abrir modales informativos.
- **Optimización de Gráficos**: Leyendas interactivas y cálculo automático de intervalos dinámicos (`minTickGap`) para prevenir superposiciones tipográficas en los ejes de tiempo extensos (ej. créditos a 240 o 360 meses).
- **Transparencia**: Ausencia de simulaciones confusas; toda la información legal y tasas reales de amortización están detalladas explícitamente en el flujo del usuario.
