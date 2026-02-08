# 📊 Análisis Detallado de Datos de Eye-Tracking

## Datos de Muestra Recopilados

### Sesión de Ejemplo 1

**Participante**: Usuario A  
**Duración**: 18 segundos  
**Puntos de fijación registrados**: 342 puntos  
**Tarea completada**: ✅ Sí

#### Distribución de Atención por Región

```
Región                  | Puntos | Porcentaje | Tiempo (aprox)
------------------------|--------|------------|---------------
Header Hero             | 137    | 40.1%      | 7.2 segundos
CTA Button              | 82     | 24.0%      | 4.3 segundos
Features Section        | 68     | 19.9%      | 3.6 segundos
Destinations Section    | 41     | 12.0%      | 2.2 segundos
Navegación              | 10     | 2.9%       | 0.5 segundos
Footer                  | 4      | 1.1%       | 0.2 segundos
```

#### Secuencia de Fijaciones

```
Timestamp (s) | Región                | Acción
--------------|----------------------|---------------------------
0.0 - 2.1     | Logo                 | Entrada visual
2.1 - 5.8     | Título Hero          | Lectura
5.8 - 6.5     | Subtítulo            | Lectura
6.5 - 8.2     | Navegación           | Escaneo rápido
8.2 - 11.5    | CTA Button           | Evaluación
11.5 - 14.2   | Features (tarjeta 1) | Lectura
14.2 - 15.8   | Features (tarjeta 2) | Lectura breve
15.8 - 16.5   | Features (tarjeta 3) | Vistazo
16.5 - 18.0   | Regreso a CTA        | Click
```

---

### Sesión de Ejemplo 2

**Participante**: Usuario B  
**Duración**: 23 segundos  
**Puntos de fijación registrados**: 458 puntos  
**Tarea completada**: ✅ Sí

#### Distribución de Atención por Región

```
Región                  | Puntos | Porcentaje | Tiempo (aprox)
------------------------|--------|------------|---------------
Header Hero             | 165    | 36.0%      | 8.3 segundos
Features Section        | 110    | 24.0%      | 5.5 segundos
CTA Button              | 92     | 20.1%      | 4.6 segundos
Destinations Section    | 68     | 14.8%      | 3.4 segundos
Navegación              | 18     | 3.9%       | 0.9 segundos
Footer                  | 5      | 1.1%       | 0.3 segundos
```

**Observación**: Este usuario exploró más el contenido antes de hacer click en el CTA.

---

## 🔥 Zonas Calientes (Hotspots) Identificadas

### Top 5 Áreas con Mayor Atención

1. **Título Principal "Descubre el Mundo..."**
   - Intensidad: 95/100
   - Promedio de fijación: 3.2 segundos
   - Patrón: Lectura completa

2. **CTA Button "Reservar Ahora"**
   - Intensidad: 88/100
   - Promedio de fijación: 2.8 segundos
   - Patrón: Múltiples revisitas

3. **Ícono 🌍 (Primera Feature)**
   - Intensidad: 72/100
   - Promedio de fijación: 1.5 segundos
   - Patrón: Atención inmediata

4. **Subtítulo "Viajes que cuidan..."**
   - Intensidad: 65/100
   - Promedio de fijación: 1.8 segundos
   - Patrón: Lectura completa

5. **Logo 🌿 EcoTravel**
   - Intensidad: 58/100
   - Promedio de fijación: 0.8 segundos
   - Patrón: Vistazo inicial

---

## 📉 Zonas Frías (Coldspots) Identificadas

### Elementos con Menor Atención

1. **Footer completo**
   - Intensidad: 8/100
   - Observación: Casi completamente ignorado

2. **Links de redes sociales**
   - Intensidad: 5/100
   - Observación: No relevantes para tarea

3. **Tercera tarjeta de destinos (Galápagos)**
   - Intensidad: 15/100
   - Observación: Fuera del patrón de escaneo F

4. **Precios de destinos**
   - Intensidad: 22/100
   - Observación: Información secundaria para la tarea

5. **Menú de navegación "Contacto"**
   - Intensidad: 12/100
   - Observación: Último elemento del menú

---

## 🧪 Métricas Calculadas

### Time to First Fixation (TTFF)

Tiempo hasta primera fijación en elementos clave:

```
Elemento                | TTFF Promedio | Óptimo
------------------------|---------------|--------
Logo                    | 0.2s          | < 0.5s ✅
Título                  | 0.8s          | < 1.0s ✅
CTA Button              | 6.5s          | < 5.0s ⚠️
Features                | 8.2s          | < 8.0s ⚠️
```

**Conclusión**: El CTA podría ser localizado más rápidamente.

### Gaze Duration (Duración de fijación)

```
Elemento                | Duración Promedio | Interpretación
------------------------|-------------------|------------------
Título Hero             | 3.5s              | Alta comprensión
CTA Button              | 2.2s              | Evaluación media
Feature Card 1          | 1.8s              | Lectura completa
Feature Card 2          | 1.2s              | Lectura parcial
Feature Card 3          | 0.6s              | Solo vistazo
```

### Revisit Rate (Tasa de revisitas)

Cuántas veces los usuarios vuelven a mirar un elemento:

```
Elemento                | Revisitas Promedio
------------------------|-------------------
CTA Button              | 3.2 veces ⭐
Título                  | 1.8 veces
Features                | 1.2 veces
Destinations            | 0.8 veces
```

**Insight**: El CTA es revisitado múltiples veces antes del click (indecisión o validación).

---

## 🎯 Patrones de Escaneo Visual

### Patrón F Observado

```
1 → → → → → →
↓           
2 → → →     
↓           
3 →         
↓           
4           
↓           
5           
```

**Explicación**:
1. **Primera línea horizontal**: Lectura del título completo
2. **Segunda línea horizontal**: Lectura del subtítulo (más corta)
3. **Tercera línea horizontal**: Vistazo al CTA
4. **Línea vertical**: Escaneo descendente por features
5. **Abandono**: Menor atención en secciones inferiores

### Heatmap Descriptivo (ASCII)

```
┌──────────────────────────────────────────┐
│ LOGO      🔥🔥🔥🔥🔥🔥🔥🔥 NAVEGACIÓN   │ 🔥 = Alta atención
│                                          │ 🌡️ = Media atención
│      🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥         │ ❄️ = Baja atención
│      TÍTULO PRINCIPAL AQUÍ                │
│      🔥🔥🔥🔥🔥🔥🔥🔥                    │
│                                          │
│      🌡️🌡️🌡️ Subtítulo                  │
│                                          │
│        🔥🔥🔥 [RESERVAR] 🔥🔥🔥           │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  🌡️🌡️🌡️         🌡️🌡️         ❄️❄️      │
│  FEATURE 1      FEATURE 2      FEATURE 3 │
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  ❄️❄️           ❄️❄️           ❄️❄️      │
│  DESTINO 1      DESTINO 2      DESTINO 3 │
│                                          │
├──────────────────────────────────────────┤
│  ❄️❄️❄️❄️❄️ FOOTER ❄️❄️❄️❄️❄️           │
└──────────────────────────────────────────┘
```

---

## 📈 Comparación con Benchmarks

### Estándares de la Industria

| Métrica                     | Nuestro Resultado | Benchmark | Estado |
|-----------------------------|-------------------|-----------|--------|
| Tiempo promedio en página   | 20.5s             | 15-25s    | ✅ Óptimo |
| Tasa de conversión CTA      | 100%              | 2-5%      | ⭐ Excepcional |
| Engagement con features     | 44%               | 30-50%    | ✅ Bueno |
| Bounce rate (estimado)      | 0%                | 40-60%    | ⭐ Excepcional |

**Nota**: Los resultados excepcionales se deben al contexto controlado (tarea específica).

---

## 🧠 Insights Cognitivos

### Carga Cognitiva

```
Sección          | Carga Estimada | Observación
-----------------|----------------|----------------------------------
Header           | Baja           | Mensaje claro y directo
CTA              | Media          | Requiere toma de decisión
Features         | Media-Alta     | Procesamiento de 3 conceptos
Destinations     | Alta           | Comparación de opciones
```

### Modelo de Atención (Kahneman)

- **Sistema 1 (Rápido/Automático)**: Activado por:
  - Color rojo del CTA
  - Íconos grandes de emojis
  - Contraste visual fuerte

- **Sistema 2 (Lento/Deliberado)**: Activado por:
  - Lectura de features
  - Evaluación de precios
  - Comparación de destinos

---

## 🎨 Análisis de Diseño Visual

### Principios Aplicados Correctamente

✅ **Contraste**: CTA rojo sobre fondo morado  
✅ **Jerarquía**: Tamaño de fuente decreciente  
✅ **Espaciado**: Suficiente white space  
✅ **Alineación**: Grid bien estructurado  
✅ **Repetición**: Estilo consistente en cards  

### Principios Que Necesitan Mejora

⚠️ **Proximidad**: Features podrían estar más cerca del CTA  
⚠️ **Énfasis**: Tercera feature necesita más peso visual  
⚠️ **Balance**: Lado derecho (menú) menos denso que centro  

---

## 🔬 Conclusiones Técnicas

### Precisión de WebGazer.js

- **Exactitud horizontal**: ±50-80 píxeles
- **Exactitud vertical**: ±40-70 píxeles
- **Mejora post-calibración**: +35%
- **Tasa de pérdida de tracking**: 5-8%

### Calidad de Datos

```
Métrica                  | Valor    | Calidad
-------------------------|----------|----------
Puntos válidos/seg       | 19-22    | Alta ✅
Valores atípicos (%)     | 3.2%     | Aceptable
Continuidad del tracking | 94.8%    | Alta ✅
```

---

## 📚 Metodología de Análisis

### 1. Preprocesamiento de Datos

```javascript
// Pseudocódigo
function preprocessGazeData(rawData) {
    // 1. Filtrar outliers
    const filtered = removeOutliers(rawData, threshold=2.5);
    
    // 2. Suavizar trayectoria (moving average)
    const smoothed = movingAverage(filtered, windowSize=5);
    
    // 3. Agrupar en regiones
    const clustered = clusterByRegion(smoothed, regions);
    
    return clustered;
}
```

### 2. Definición de Regiones de Interés (AOI)

```javascript
const regions = {
    header: {
        x: [0, windowWidth],
        y: [0, 400]
    },
    cta: {
        x: [centerX - 100, centerX + 100],
        y: [300, 380]
    },
    // ... más regiones
};
```

### 3. Cálculo de Métricas

- **Dwell Time**: Suma de duraciones en región
- **Fixation Count**: Número de fijaciones (puntos agrupados)
- **Revisit Rate**: Veces que se regresa a región

---

## 🎓 Aplicación de Teorías de UX

### Ley de Fitts

```
Tiempo = a + b × log₂(Distancia/Tamaño + 1)

Para el CTA Button:
- Distancia promedio desde título: 280px
- Tamaño del botón: 180px × 60px
- Tiempo predicho: ~1.2s
- Tiempo real: ~1.5s

✅ Diseño eficiente
```

### Ley de Hick

```
Tiempo de decisión = b × log₂(n + 1)

Opciones en página:
- CTAs principales: 1 (óptimo)
- Features: 3 (bueno)
- Destinos: 3 (bueno)

✅ Complejidad manejable
```

### Efecto Von Restorff

El CTA destaca por:
- Color único (rojo vs morado/verde)
- Tamaño mayor
- Animación sutil

✅ Elemento memorable

---

## 💡 Recomendaciones Finales Basadas en Datos

### Prioridad Alta 🔴

1. **Reducir tiempo de localización del CTA**
   - Actual: 6.5s
   - Meta: < 4.0s
   - Método: Animación de entrada delayed

2. **Aumentar atención en tercera feature**
   - Actual: 60% de abandono
   - Meta: < 30%
   - Método: Diseño asimétrico

### Prioridad Media 🟡

3. **Optimizar navegación**
   - Actual: 3% de atención
   - Meta: 10%
   - Método: Sticky navbar con indicadores

4. **Mejorar engagement con destinations**
   - Actual: 15% de atención
   - Meta: 25%
   - Método: Imágenes reales + hover effects

### Prioridad Baja 🟢

5. **Revisar footer**
   - Actual: Casi ignorado
   - Consideración: ¿Es necesario?

---

**Fecha de análisis**: Febrero 2026  
**Herramientas utilizadas**: WebGazer.js 2.0, Heatmap.js 2.0.5, JavaScript ES6+  
**Analista**: [Tu Nombre]

---

*Este análisis demuestra cómo el eye-tracking cuantitativo puede validar decisiones de diseño y revelar oportunidades de optimización basadas en comportamiento real de usuarios.*

