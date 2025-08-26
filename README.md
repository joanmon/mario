# 🎮 Clon de Mario en HTML + JavaScript

Un proyecto educativo para aprender a programar un videojuego **tipo Mario** en el navegador usando **HTML5 Canvas + JavaScript (ES Modules)**.

👉 Este código forma parte de una serie de **video-tutoriales** en el canal [Programa que es fácil](https://www.youtube.com/@programaqueesfacil).

---

## 🚀 Características

- Motor en **JavaScript puro** (sin librerías externas).
- Renderizado en **Canvas 2D**.
- **Mapa por tiles** definido en código (`config.js`).
- **Física simple**: gravedad, salto, colisiones AABB.
- **Cámara lateral** que sigue a Mario.
- Entidades implementadas:
    - 🧑‍🦱 **Mario** (pequeño / grande, con animaciones y power-ups).
    - 🐭 **Ratones** (enemigos básicos).
    - ❓ **Bloques interrogación** que sueltan champiñones.
    - 🍄 **Mushrooms** (power-up para crecer).
- 🎵 Sonidos y música de fondo.
- Arquitectura modular (`src/core` para motor, `src/app` para el juego).

---

## 📺 Serie de tutoriales en YouTube

Este proyecto se desarrolla paso a paso en la serie de vídeos:

1. [Episodio 1 – Configuración inicial y renderizado del mapa](https://www.youtube.com/watch?v=sCMA7nDBL3U)
2. [Episodio 2 – Movimiento y físicas de Mario](https://www.youtube.com/watch?v=s-vc0yfd2iM)
3. [Episodio 3 – Cámara y scroll lateral](https://www.youtube.com/watch?v=23AUagdAF_w)
4. [Episodio 4 – Primer enemigo: los ratones](https://www.youtube.com/watch?v=2K8hgOE-t1w)
5. [Episodio 5 – Power-ups: bloques sorpresa y champiñón](https://www.youtube.com/watch?v=ysDe7QURP3c)


> 🔗 Suscríbete a [Programa que es fácil](https://www.youtube.com/@programaqueesfacil?sub_confirmation=1) para no perderte los próximos capítulos.

---

## 🕹️ Controles

- **← / →** Moverse
- **↑** Saltar

---

## ⚡ Ejecución local

1. Clona este repositorio:
   ```bash
   git clone https://github.com/joanmon/mario.git
   cd mario
   ```

2. Opciones para lanzar el proyecto:
    - **Con Python** (servidor HTTP simple):
      ```bash
      python -m http.server 5173
      ```
    - **Con Node.js** (usando `serve`):
      ```bash
      npx serve .
      ```
    - **Abrir directamente `index.html`**: también funciona abrir el archivo en el navegador “a pelo”, aunque algunos navegadores pueden bloquear ciertas rutas por CORS.

3. Abre en tu navegador:
   [http://localhost:5173](http://localhost:5173)

---

## 📂 Estructura

```
Mario/
├── index.html       # Punto de entrada (Canvas + main.js)
├── main.js          # Bucle principal del juego
├── src/
│   ├── core/        # Motor genérico: render, motion, collision, physics
│   └── app/         # Clases específicas del juego (Mario, Mice, Mushroom…)
├── assets/          # Sprites y sonidos
├── ASSETS.md        # Créditos de recursos
├── LICENSE          # Licencia MIT (código) + CC BY-NC 4.0 (assets)
└── README.md        # Este documento
```

---

## 📜 Licencia

- **Código:** [MIT License](LICENSE)
- **Recursos gráficos y audio:** ver [ASSETS.md](ASSETS.md)
    - Sprites de Adam "mudmask" Howard (CC BY-NC 4.0).
    - Sonidos de [Pixabay](https://pixabay.com/).

---

✍️ Desarrollado por [Joan Mon](https://github.com/joanmon)  
🎥 Tutoriales en [Programa que es fácil](https://www.youtube.com/@programaqueesfacil)
