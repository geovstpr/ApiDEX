# ApiDEX

Pokédex construida con React Native (Expo) que consume la PokeAPI en tiempo real y permite guardar Pokémon como favoritos con persistencia local en el dispositivo.

## Descripción

Este proyecto integra consumo de una API REST pública (PokeAPI) con almacenamiento local de preferencias del usuario (favoritos), separando claramente la lógica de red, la lógica de base de datos local y las vistas.

## Tecnologías

- Expo SDK 57 + TypeScript
- Expo Router (navegación basada en archivos)
- Context API (estado global)
- AsyncStorage (persistencia local)
- PokeAPI (https://pokeapi.co)

## Arquitectura

```
ApiDEX/
├── app/                          # Vistas y navegación (Expo Router)
│   ├── _layout.tsx               # Layout raiz, envuelve la app en PokedexProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Navegacion por tabs
│   │   ├── index.tsx             # Pantalla Pokedex (lista)
│   │   └── favorites.tsx         # Pantalla de favoritos
│   └── pokemon/
│       └── [id].tsx              # Pantalla de detalle
├── src/
│   ├── api/
│   │   └── pokeapi.ts            # Logica de red (fetch a PokeAPI)
│   ├── storage/
│   │   └── favoritesStorage.ts   # Logica de AsyncStorage
│   ├── context/
│   │   └── PokedexContext.tsx    # Estado global: une red + almacenamiento
│   └── types/
│       └── pokemon.ts            # Interfaces TypeScript compartidas
```

Principio de separación: las vistas dentro de `app/` nunca llaman a `fetch` ni a `AsyncStorage` directamente. Siempre pasan por `src/api`, `src/storage`, o por el hook `usePokedex()` que expone el Context.

## Funcionalidades

- Listado de Pokémon con scroll infinito (paginación vía PokeAPI)
- Pantalla de detalle con imagen, tipos y estadísticas
- Guardar y eliminar Pokémon de favoritos, persistidos localmente con AsyncStorage
- Pantalla de Favoritos independiente de la red
- Manejo de estados de carga y error en cada pantalla, con opción de reintentar

## Cómo correr el proyecto

```bash
git clone <url-de-tu-repo>
cd ApiDEX
npm install
npx expo start
```

Escanea el QR con la app Expo Go (Android/iOS), presiona `a` para abrir en un emulador Android, o `w` para abrirlo en el navegador. Requiere una versión de Expo Go compatible con SDK 57.

## Decisiones técnicas

- El proyecto se creó originalmente con Expo SDK 54, pero se actualizó a SDK 57 porque la versión de Expo Go instalada en los dispositivos de prueba ya no soportaba SDK 54 (Expo Go solo admite la última versión de SDK publicada).
- Se usó AsyncStorage en vez de SQLite: es suficiente para el volumen de datos de favoritos y más simple de mantener.
- Se guarda el objeto completo del Pokémon favorito (no solo el id) para que la pantalla de Favoritos no dependa de una nueva petición de red.
