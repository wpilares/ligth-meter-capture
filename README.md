# LightMeter Capture

Aplicación web para registrar y capturar lecturas de medidores de departamentos. Diseñada con foco en **accesibilidad y claridad**, pensada para que personas mayores puedan leer y revisar las capturas sin dificultad.

## Capturas de pantalla

*(Próximamente)*

---

## Requisitos previos

- **[Bun](https://bun.sh)** `>= 1.1.0` (gestor de paquetes y runtime)

> Nota: aunque el proyecto usa Bun, es compatible con Node.js 18+. Si preferís usar npm/pnpm/yarn, cambiá los scripts en `package.json` reemplazando `bunx --bun` por `npx`.

---

## Instalación rápida

```bash
# Clonar el repositorio
git clone <repo-url>
cd light-meter-capture

# Instalar dependencias
bun install

# Iniciar servidor de desarrollo
bun run dev
```

La app se abre automáticamente en `http://localhost:3000`.

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `bun run dev` | Servidor de desarrollo con hot reload (puerto 3000) |
| `bun run build` | Build de producción optimizado en `/dist` |
| `bun run preview` | Previsualizar el build de producción localmente |
| `bun run lint` | Chequear código con Biome |
| `bun run lint:fix` | Chequear y auto-corregir con Biome |
| `bun run format` | Formatear todo el código con Biome |
| `bun run ci` | Ejecutar Biome CI en archivos modificados |

---

## Stack tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Bun** | 1.1.42 | Runtime y gestor de paquetes (alternativa rápida a Node.js) |
| **Vite** | 8.x | Build tool y dev server |
| **React** | 19.x | Biblioteca de UI |
| **TypeScript** | 5.8.x | Tipado estático |
| **Tailwind CSS** | 3.4.x | Estilos utilitarios con paleta dark/light personalizada |
| **Biome** | 2.4.x | Linter y formatter (reemplaza ESLint + Prettier) |
| **Zustand** | 5.x | State management minimalista (tema oscuro/claro) |
| **html-to-image** | 1.11.x | Generación de capturas PNG desde DOM |
| **lucide-react** | 0.460.x | Iconos vectoriales |
| **Husky** | 9.x | Git hooks (pre-commit con Biome) |

---

## Estructura del proyecto

```
light-meter-capture/
├── public/
│   └── favicon.svg              # Favicon SVG
├── src/
│   ├── components/
│   │   ├── ui/                  # Componentes reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   └── layout/
│   │       └── Header.tsx       # Header sticky con toggle de tema
│   ├── pages/
│   │   └── HomePage.tsx         # Página principal con formulario y captura
│   ├── store/
│   │   └── themeStore.ts        # Zustand store: tema oscuro/claro + persistencia
│   ├── hooks/
│   │   └── useTheme.ts          # Hook wrapper del store de tema
│   ├── styles/
│   │   └── globals.css          # Tailwind directives + custom components
│   ├── utils/
│   │   └── index.ts             # Utilidades (formato de fecha para archivo)
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Punto de entrada React 19
│   └── vite-env.d.ts            # Tipos de Vite
├── index.html                   # HTML entry con script de detección de tema
├── vite.config.ts               # Configuración Vite + aliases
├── tsconfig.json                # TypeScript strict mode
├── tsconfig.node.json           # TypeScript para Vite config
├── biome.json                   # Reglas de lint/format
├── tailwind.config.js           # Paleta dark/light + fuente Poppins + animaciones
├── postcss.config.js            # Tailwind + Autoprefixer
├── package.json
└── .husky/pre-commit            # Hook: biome check --write --staged
```

---

## Arquitectura y decisiones clave

### ¿Por qué Vite en vez de Next.js?

La app es **100% cliente** (sin SSR, sin API routes, sin SEO complejo). Vite ofrece:
- Arranque de dev server instantáneo
- Hot Module Replacement (HMR) nativo
- Builds más rápidos y livianos
- Menos overhead para una SPA simple

### ¿Por qué Biome en vez de ESLint + Prettier?

Biome unifica linter y formatter en una sola herramienta:
- **Mucho más rápido** (escrito en Rust)
- **Configuración única** (`biome.json`)
- Soporte nativo para Tailwind CSS (`tailwindDirectives`)
- Reglas estrictas: `noUnusedImports`, `noUnusedVariables`, `useExhaustiveDependencies`

### ¿Por qué html-to-image en vez de html2canvas?

| | html2canvas | html-to-image |
|---|---|---|
| Último release | **Enero 2022** (abandonado) | Febrero 2025 (activo) |
| Issues abiertos | 974+ | 156 |
| Descargas semanales | ~500k | **3.4M** |
| API para excluir elementos | ❌ Hack de visibilidad | ✅ Opción `filter` nativa |
| Soporte TypeScript | Requiere @types | ✅ Nativo |
| Tamaño | Más pesado | Más liviano |

### Tema oscuro/claro

Implementado con **Zustand + persist** (`localStorage`):
- La clase `dark` o `light` se aplica a `<html>` antes del primer render (evita flash)
- Paleta completa de colores definida en `tailwind.config.js`
- Transiciones suaves en todos los elementos (`transition-colors duration-300`)
- Scrollbar customizado por tema

---

## Cómo funciona la captura

1. El usuario completa las 4 lecturas y hace clic en **"Tomar Captura"**
2. Se valida que todos los campos tengan valor
3. `html-to-image` convierte solo el contenido de la tarjeta a PNG:
   - **Se incluye**: fecha, departamentos, lecturas
   - **Se excluye**: botones, input de fecha, hints (usando `filter` nativo)
   - Fondo respeta el tema actual (dark/light)
   - Pixel ratio 2x para alta calidad
4. Se descarga automáticamente: `captura-DD-MM-YYYY.png`
5. Las lecturas se guardan en `localStorage` por fecha

### Diseño pensado para accesibilidad

- **Una sola columna** para lectura natural de arriba hacia abajo
- **Texto grande**: labels `text-lg md:text-xl`, inputs `text-xl md:text-2xl`
- **Fecha prominente** en formato legible `DD/MM/YYYY`
- **Contraste fuerte** entre texto y fondo en ambos temas
- **Sin resumen innecesario** que distraiga

---

## Husky + pre-commit

Antes de cada commit se ejecuta automáticamente:

```bash
biome check --write --staged --no-errors-on-unmatched
```

Esto asegura que todo el código commiteado esté linteado y formateado.

---

## Basado en

La arquitectura, tooling, estilos y convenciones de este proyecto están basados en **[spendmaster](https://github.com/willpilares/spendmaster)** — un proyecto personal de control de gastos con el mismo stack.

---

## Licencia

MIT
