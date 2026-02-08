Universidad Internacional SEK

Carrera de Ingeniería de Software Online – Business & Digital School

Interacción Persona Computador – Período 2026-1

Nombre: Diego Rafael Andrade Gutiérrez

Fecha de entrega: 8 de febrero de 2026

Laboratorio 5

---

Evidencia de la calibración y del Heatmap estático generado:

![GIF de Calibración](screenshots/calibration.gif)

![Imagen del Heatmap](screenshots/heatmapSS.jpg)

---

### Descripción breve del objetivo del ejercicio

El objetivo principal de este laboratorio fue la implementación técnica de la librería WebGazer.js para realizar un estudio de seguimiento ocular (eye-tracking) en un entorno web controlado. El ejercicio buscó validar decisiones de diseño mediante datos cuantitativos, específicamente analizando cómo los usuarios interactúan visualmente con una landing page orientada a la conversión ("EcoTravel") y verificando si la jerarquía visual propuesta dirige efectivamente la atención hacia los elementos clave de negocio.

---

### Explicación de la solución implementada

Para cumplir con el objetivo, se desarrolló una interfaz web basada en una estructura de "Hero Section" optimizada para la captura de datos visuales y la conversión de usuarios.

**Detalles técnicos de la implementación:**

1. Se configuró el script de seguimiento para superponer una malla de calibración de 9 puntos y recolectar las coordenadas (x,y) de la mirada en tiempo real, almacenando los datos localmente.
2. Se ubicaron el logotipo y el título en el cuadrante superior izquierdo.
3. Se implementó un botón "Reservar Ahora" con alto contraste para maximizar la saliencia visual.

Código CSS implementado para el botón CTA:

```css
.hero-cta {
    background-color: #e63946; /* Rojo de alto contraste */
    color: white;
    padding: 15px 30px;
    border-radius: 5px;
    font-weight: 700;
    text-transform: uppercase;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.hero-cta:hover {
    background-color: #d62828;
    transform: translateY(-2px); /* Feedback de interacción */
}
```

---

**Análisis de las zonas de atención visual observadas**

- La mayor densidad del heatmap se concentró en el título principal. Esto confirma que el usuario busca contextualizar el sitio inmediatamente al ingresar (primeros 7.5 segundos).

- El CTA recibió una atención considerable. Sin embargo, el tiempo de localización promedio fue de 4.8 segundos, lo que sugiere que el usuario realiza un escaneo previo del texto antes de buscar el elemento de interacción.

- En la sección de características, la atención visual cae drásticamente después del segundo elemento, indicando una posible fatiga visual o falta de interés en el contenido inferior.

---

**Relación de los resultados con principios de usabilidad (heurísticas de Nielsen)**

**Heurística 1:** Visibilidad del estado del sistema

Durante la fase de calibración (como se observa en el GIF adjunto), el sistema proporciona retroalimentación visual inmediata mediante el movimiento de los puntos y el feedback de la cámara. Esto es crítico en interfaces de seguimiento ocular para asegurar que el usuario entienda que el sistema está "aprendiendo" su mirada antes de iniciar la tarea principal.

**Heurística 6:** Reconocimiento antes que recuerdo

El diseño del botón CTA y los elementos de navegación permiten que el usuario reconozca las acciones disponibles sin necesidad de recordar instrucciones previas. El mapa de calor muestra fijaciones directas sobre el botón, validando que su affordance (capacidad de sugerir su uso) es correcta y se percibe como un elemento interactivo.

**Heurística 8:** Diseño estético y minimalista

La decisión de eliminar elementos decorativos superfluos resultó efectiva. El análisis visual muestra pocas fijaciones en áreas vacías ("espacios negativos"), lo que significa que el diseño minimalista dirigió exitosamente la carga cognitiva del usuario hacia el contenido relevante (título y botón) sin distracciones.
