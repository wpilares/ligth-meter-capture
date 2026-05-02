# LightMeter Capture

Aplicación para registrar y capturar lecturas de medidores de departamentos.

## Stack

- **Bun** - Gestor de paquetes y runtime
- **Vite** - Build tool
- **React 19** - UI library
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Biome** - Linter y formatter
- **Zustand** - State management (tema)
- **html-to-image** - Generación de capturas
- **lucide-react** - Iconos

## Scripts

```bash
bun install       # Instalar dependencias
bun run dev       # Servidor de desarrollo (puerto 3000)
bun run build     # Build de producción
bun run preview   # Preview del build
bun run lint      # Chequear con Biome
bun run lint:fix  # Arreglar con Biome
bun run format    # Formatear con Biome
```

## Husky

El pre-commit hook corre `biome check --write --staged` automáticamente.

## Features

- Registro de lecturas para 4 departamentos (201, 202, 301, 302)
- Selector de fecha
- Generación de captura PNG con `html-to-image`
- Tema oscuro/claro con persistencia
- Persistencia de lecturas en localStorage
- Validación de campos
- Diseño responsive con Tailwind CSS
