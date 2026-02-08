// Eye-Tracking System with WebGazer.js and Heatmap.js
class EyeTrackingSystem {
    constructor() {
        this.gazeData = [];
        this.isTracking = false;
        this.isCalibrated = false;
        this.taskStartTime = null;
        this.taskCompleted = false;
        this.heatmapInstance = null;
        this.timerInterval = null;
        this.elapsedTime = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeWebGazer();
    }

    setupEventListeners() {
        document.getElementById('start-calibration').addEventListener('click', () => this.startCalibration());
        document.getElementById('start-task').addEventListener('click', () => this.startTask());
        document.getElementById('show-heatmap').addEventListener('click', () => this.showHeatmap());
        document.getElementById('test-webgazer').addEventListener('click', () => this.testWebGazer());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        
        // CTA Button click tracking
        document.getElementById('main-cta').addEventListener('click', () => this.onCTAClick());
    }

    initializeWebGazer() {
        console.log('🚀 Initializing WebGazer...');
        
        // Initialize WebGazer with error handling
        try {
            webgazer.setGazeListener((data, elapsedTime) => {
                if (data == null || data.x == null || data.y == null) {
                    return;
                }
                
                if (this.isTracking) {
                    this.recordGazePoint(data.x, data.y);
                }
            }).begin();

            // Configure WebGazer with better settings
            webgazer.showVideoPreview(true)
                    .showPredictionPoints(false) // Start with predictions off
                    .applyKalmanFilter(true)
                    .setRegression('ridge') // Use ridge regression for better accuracy
                    .saveDataAcrossSessions(false);

            // Important: Don't pause immediately, let it warm up
            setTimeout(() => {
                console.log('✅ WebGazer warmed up');
                webgazer.pause(); // Now pause after initial setup
                this.updateStatus('Sistema inicializado. Haz clic en "Iniciar Calibración"');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error initializing WebGazer:', error);
            alert('Error al inicializar el sistema de eye-tracking. Recarga la página.');
        }
    }

    async startCalibration() {
        this.updateStatus('Preparando calibración...');
        
        // Resume WebGazer
        webgazer.resume();
        
        // Show calibration instructions
        const proceed = confirm(
            '🎯 CALIBRACIÓN DE SEGUIMIENTO OCULAR\n\n' +
            'INSTRUCCIONES:\n' +
            '1. Mantén la cabeza quieta y centrada\n' +
            '2. Mira directamente cada punto rojo\n' +
            '3. HAZ CLIC en cada punto mientras lo miras\n' +
            '4. Aparecerán 9 puntos en total\n' +
            '5. No te muevas durante la calibración\n\n' +
            '¿Listo para comenzar?'
        );

        if (!proceed) {
            this.updateStatus('Calibración cancelada');
            webgazer.pause();
            return;
        }

        this.updateStatus('Calibrando... Espera el primer punto rojo');
        
        // Show progress indicator
        const progressDiv = document.getElementById('calibration-progress');
        if (progressDiv) {
            progressDiv.style.display = 'block';
        }
        
        // Wait a moment for WebGazer to stabilize
        setTimeout(() => {
            this.performCalibration();
        }, 1000);
    }

    performCalibration() {
        // Create calibration points
        const calibrationPoints = [
            { x: '10%', y: '10%' },
            { x: '90%', y: '10%' },
            { x: '50%', y: '50%' },
            { x: '10%', y: '90%' },
            { x: '90%', y: '90%' },
            { x: '30%', y: '30%' },
            { x: '70%', y: '30%' },
            { x: '30%', y: '70%' },
            { x: '70%', y: '70%' }
        ];

        let currentPoint = 0;
        const pointElement = document.createElement('div');
        pointElement.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            background: red;
            border-radius: 50%;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.9), 0 0 10px rgba(255, 255, 255, 0.8);
            animation: pulse 0.8s infinite;
            border: 4px solid white;
            pointer-events: auto;
        `;
        
        pointElement.id = 'calibration-point';

        // Create overlay to prevent clicking other elements
        const overlay = document.createElement('div');
        overlay.id = 'calibration-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 999998;
            pointer-events: auto;
        `;
        
        // Add pulse animation
        if (!document.getElementById('pulse-animation-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation-style';
            style.textContent = `
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.3); }
                }
            `;
            document.head.appendChild(style);
        }

        const showNextPoint = (event) => {
            console.log(`✅ Calibration point ${currentPoint + 1} clicked at position ${pointElement.style.left}, ${pointElement.style.top}`);
            
            // Prevent event bubbling
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }
            
            // Store current click position for WebGazer
            const rect = pointElement.getBoundingClientRect();
            const clickX = rect.left + rect.width / 2;
            const clickY = rect.top + rect.height / 2;
            
            // Manually store calibration data
            webgazer.recordScreenPosition(clickX, clickY, 'click');
            
            console.log(`📍 Registered calibration at (${Math.round(clickX)}, ${Math.round(clickY)})`);
            
            // Give WebGazer MORE time to register the click location
            setTimeout(() => {
                currentPoint++;
                
                if (currentPoint >= calibrationPoints.length) {
                    console.log('🎉 All calibration points completed!');
                    // Remove point, overlay and complete calibration
                    if (pointElement.parentNode) {
                        document.body.removeChild(pointElement);
                    }
                    const overlay = document.getElementById('calibration-overlay');
                    if (overlay && overlay.parentNode) {
                        document.body.removeChild(overlay);
                    }
                    this.completeCalibration();
                    return;
                }

                // Update progress for next point
                if (progressText) {
                    progressText.textContent = `${currentPoint + 1}/9`;
                }
                if (progressBar) {
                    progressBar.style.width = `${((currentPoint + 1) / 9 * 100)}%`;
                }

                // Show next point
                const point = calibrationPoints[currentPoint];
                pointElement.style.left = point.x;
                pointElement.style.top = point.y;
                
                this.updateStatus(`Calibrando... Punto ${currentPoint + 1} de ${calibrationPoints.length}. HAZ CLICK en el punto rojo.`);
                console.log(`→ Moving to point ${currentPoint + 1} at ${point.x}, ${point.y}`);
            }, 500); // Increased from 300ms to 500ms
        };

        // Add click listener
        pointElement.addEventListener('click', showNextPoint);
        
        // Add overlay and point to page
        document.body.appendChild(overlay);
        document.body.appendChild(pointElement);
        
        // Show first point
        const firstPoint = calibrationPoints[0];
        pointElement.style.left = firstPoint.x;
        pointElement.style.top = firstPoint.y;
        
        // Initialize progress display
        const progressText = document.getElementById('progress-text');
        const progressBar = document.getElementById('progress-bar');
        if (progressText) {
            progressText.textContent = `1/9`;
        }
        if (progressBar) {
            progressBar.style.width = `${(1 / 9 * 100)}%`;
        }
        
        this.updateStatus(`Calibrando... Punto 1 de ${calibrationPoints.length}. HAZ CLICK en el punto rojo.`);
        console.log('Calibration started. Click the red dots.');
    }

    completeCalibration() {
        this.isCalibrated = true;
        
        // Hide progress indicator
        const progressDiv = document.getElementById('calibration-progress');
        if (progressDiv) {
            progressDiv.style.display = 'none';
        }
        
        this.updateStatus('✅ Calibración completada. Listo para comenzar la tarea');
        document.getElementById('start-task').disabled = false;
        document.getElementById('start-calibration').disabled = true;
        
        console.log('Calibration completed successfully!');
    }

    startTask() {
        if (!this.isCalibrated) {
            alert('⚠️ Primero debes completar la calibración');
            return;
        }
        
        console.log('🎬 Starting task...');
        
        // CRITICAL: Force WebGazer to resume
        webgazer.resume();
        
        // Double-check it's running
        setTimeout(() => {
            if (!webgazer.isReady()) {
                console.error('❌ WebGazer is not ready!');
                webgazer.begin(); // Force restart
            }
        }, 500);
        
        this.isTracking = true;
        this.taskStartTime = Date.now();
        this.gazeData = [];
        this.elapsedTime = 0;
        
        // Verify WebGazer is working after 2 seconds
        setTimeout(() => {
            console.log('🔍 Checking WebGazer status after 2 seconds...');
            console.log('Is tracking:', this.isTracking);
            console.log('Gaze data collected so far:', this.gazeData.length);
            console.log('WebGazer ready:', webgazer.isReady());
            
            if (this.gazeData.length === 0) {
                console.warn('⚠️ No gaze data being collected after 2 seconds!');
                console.warn('Attempting to restart WebGazer...');
                
                // Try to fix it
                webgazer.resume();
                webgazer.showPredictionPoints(true);
            } else {
                console.log('✅ WebGazer is collecting data successfully!');
            }
        }, 2000);
        
        // Show task description
        document.getElementById('task-description').style.display = 'block';
        this.updateStatus('🎯 Tarea en curso... Encuentra el botón "Reservar Ahora"');
        
        // Disable start button
        document.getElementById('start-task').disabled = true;

        // Start timer
        this.startTimer();

        // Show prediction points (important for visual feedback)
        webgazer.showPredictionPoints(true);
        
        console.log('✅ Task started! WebGazer should be tracking now.');
        console.log('👁️ Look around the page and you should see red prediction dots.');
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.elapsedTime++;
            document.getElementById('timer').textContent = `Tiempo: ${this.elapsedTime}s`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    recordGazePoint(x, y) {
        // Validate coordinates
        if (!x || !y || isNaN(x) || isNaN(y)) {
            return;
        }
        
        // Record gaze point with timestamp
        this.gazeData.push({
            x: Math.round(x),
            y: Math.round(y),
            timestamp: Date.now() - this.taskStartTime
        });

        // Log data collection progress
        if (this.gazeData.length % 50 === 0) {
            console.log(`📊 Collected ${this.gazeData.length} gaze points`);
        }
        
        // Log first few points for debugging
        if (this.gazeData.length <= 3) {
            console.log(`👁️ Gaze point ${this.gazeData.length}: (${Math.round(x)}, ${Math.round(y)})`);
        }
    }

    onCTAClick() {
        if (this.isTracking && !this.taskCompleted) {
            this.taskCompleted = true;
            this.stopTimer();
            this.updateStatus(`✅ Tarea completada en ${this.elapsedTime}s. ${this.gazeData.length} puntos registrados`);
            
            // Stop tracking
            this.isTracking = false;
            webgazer.showPredictionPoints(false);
            
            // Enable heatmap button
            document.getElementById('show-heatmap').disabled = false;
            
            // Show success modal
            document.getElementById('success-modal').classList.add('active');
            
            // Log summary
            console.log('Task Summary:');
            console.log(`- Duration: ${this.elapsedTime} seconds`);
            console.log(`- Gaze points collected: ${this.gazeData.length}`);
            console.log(`- Average points per second: ${(this.gazeData.length / this.elapsedTime).toFixed(2)}`);
        }
    }

    closeModal() {
        document.getElementById('success-modal').classList.remove('active');
    }

    testWebGazer() {
        console.log('🧪 Testing WebGazer...');
        
        // Resume WebGazer
        webgazer.resume();
        webgazer.showPredictionPoints(true);
        
        // Test data collection for 5 seconds
        const testData = [];
        const testStartTime = Date.now();
        
        const testListener = (data, elapsedTime) => {
            if (data) {
                testData.push({ x: data.x, y: data.y });
            }
        };
        
        // Temporarily add test listener
        webgazer.setGazeListener(testListener);
        
        alert('🧪 PRUEBA DE WEBGAZER\n\n' +
              'Durante los próximos 5 segundos:\n' +
              '1. Mueve tus ojos por la pantalla\n' +
              '2. Mira diferentes partes de la página\n' +
              '3. Observa los puntos rojos que siguen tu mirada\n\n' +
              'Presiona OK para comenzar');
        
        setTimeout(() => {
            // Restore original listener
            webgazer.setGazeListener((data, elapsedTime) => {
                if (data && this.isTracking) {
                    this.recordGazePoint(data.x, data.y);
                }
            });
            
            webgazer.showPredictionPoints(false);
            webgazer.pause();
            
            console.log(`✅ Test complete! Collected ${testData.length} points in 5 seconds`);
            
            if (testData.length > 0) {
                alert(`✅ WebGazer está funcionando!\n\n` +
                      `Puntos recopilados: ${testData.length}\n` +
                      `Promedio: ${(testData.length / 5).toFixed(1)} puntos/segundo\n\n` +
                      `Ahora puedes comenzar la tarea con confianza.`);
            } else {
                alert(`❌ WebGazer NO está recopilando datos!\n\n` +
                      `Posibles problemas:\n` +
                      `- Tu rostro no está visible en la cámara\n` +
                      `- Iluminación insuficiente\n` +
                      `- La calibración no fue exitosa\n\n` +
                      `Solución: Repite la calibración y asegúrate de que\n` +
                      `tu cara esté bien visible en el video de abajo.`);
            }
        }, 5000);
    }

    showHeatmap() {
        console.log('🔥 Attempting to show heatmap...');
        console.log('Gaze data points available:', this.gazeData.length);
        
        if (this.gazeData.length === 0) {
            alert('❌ No hay datos de seguimiento visual disponibles.\n\n' +
                  'Posibles causas:\n' +
                  '1. WebGazer no detectó tu mirada durante la tarea\n' +
                  '2. La cámara no tiene buena vista de tus ojos\n' +
                  '3. La iluminación es insuficiente\n\n' +
                  'Sugerencias:\n' +
                  '- Asegúrate de que tu rostro esté bien visible en el video (esquina inferior izquierda)\n' +
                  '- Mejora la iluminación de tu habitación\n' +
                  '- Repite la calibración con más cuidado\n' +
                  '- Mira la consola (F12) para más detalles');
            console.error('⚠️ No gaze data recorded during task!');
            return;
        }
        
        if (this.gazeData.length < 20) {
            const proceed = confirm(`⚠️ Solo se registraron ${this.gazeData.length} puntos de mirada.\n\n` +
                                  'Esto es muy poco para un mapa de calor útil.\n\n' +
                                  '¿Deseas continuar de todos modos?');
            if (!proceed) {
                return;
            }
        }

        this.updateStatus('📊 Generando mapa de calor...');

        // Hide WebGazer video
        const videoFeed = document.getElementById('webgazerVideoFeed');
        if (videoFeed) {
            videoFeed.style.display = 'none';
        }

        // Create heatmap container if not exists
        const heatmapContainer = document.getElementById('heatmap-container');
        heatmapContainer.classList.add('active');
        heatmapContainer.innerHTML = ''; // Clear previous

        // Initialize heatmap.js
        this.heatmapInstance = h337.create({
            container: heatmapContainer,
            radius: 50,
            maxOpacity: 0.6,
            minOpacity: 0.1,
            blur: 0.75,
            gradient: {
                '.0': 'blue',
                '.25': 'cyan',
                '.5': 'lime',
                '.75': 'yellow',
                '1.0': 'red'
            }
        });

        // Prepare data for heatmap
        const heatmapData = {
            max: this.calculateMaxIntensity(),
            data: this.prepareHeatmapData()
        };

        // Set heatmap data
        this.heatmapInstance.setData(heatmapData);

        this.updateStatus(`✅ Mapa de calor generado con ${this.gazeData.length} puntos`);

        // Log heatmap statistics
        this.analyzeGazeData();

        // Add close button for heatmap
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕ Cerrar Mapa de Calor';
        closeBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10002;
            padding: 12px 24px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        `;
        closeBtn.addEventListener('click', () => {
            heatmapContainer.classList.remove('active');
            if (videoFeed) videoFeed.style.display = 'block';
            closeBtn.remove();
        });
        document.body.appendChild(closeBtn);
    }

    prepareHeatmapData() {
        // Convert gaze points to heatmap format
        const data = [];
        const pointCounts = {};

        // Count occurrences at each location (clustering nearby points)
        this.gazeData.forEach(point => {
            const key = `${Math.round(point.x / 10) * 10},${Math.round(point.y / 10) * 10}`;
            pointCounts[key] = (pointCounts[key] || 0) + 1;
        });

        // Convert to heatmap data format
        for (const [key, count] of Object.entries(pointCounts)) {
            const [x, y] = key.split(',').map(Number);
            data.push({
                x: x,
                y: y,
                value: count
            });
        }

        return data;
    }

    calculateMaxIntensity() {
        // Calculate max value for heatmap normalization
        const pointCounts = {};
        
        this.gazeData.forEach(point => {
            const key = `${Math.round(point.x / 10) * 10},${Math.round(point.y / 10) * 10}`;
            pointCounts[key] = (pointCounts[key] || 0) + 1;
        });

        return Math.max(...Object.values(pointCounts));
    }

    analyzeGazeData() {
        console.log('\n=== ANÁLISIS DE DATOS DE MIRADA ===');
        
        // Define regions of interest
        const regions = {
            header: { name: 'Header/Hero', xMin: 0, xMax: window.innerWidth, yMin: 0, yMax: 400 },
            cta: { name: 'CTA Button', xMin: window.innerWidth/2 - 100, xMax: window.innerWidth/2 + 100, yMin: 300, yMax: 380 },
            features: { name: 'Features Section', xMin: 0, xMax: window.innerWidth, yMin: 400, yMax: 800 },
            destinations: { name: 'Destinations', xMin: 0, xMax: window.innerWidth, yMin: 800, yMax: 1200 }
        };

        const regionCounts = {};
        Object.keys(regions).forEach(key => regionCounts[key] = 0);

        // Count points in each region
        this.gazeData.forEach(point => {
            for (const [key, region] of Object.entries(regions)) {
                if (point.x >= region.xMin && point.x <= region.xMax &&
                    point.y >= region.yMin && point.y <= region.yMax) {
                    regionCounts[key]++;
                }
            }
        });

        // Calculate percentages
        const total = this.gazeData.length;
        console.log('\nDistribución de atención visual:');
        for (const [key, count] of Object.entries(regionCounts)) {
            const percentage = ((count / total) * 100).toFixed(2);
            console.log(`- ${regions[key].name}: ${count} puntos (${percentage}%)`);
        }

        // Calculate average gaze duration
        const duration = this.elapsedTime;
        console.log(`\nDuración total: ${duration} segundos`);
        console.log(`Puntos por segundo: ${(total / duration).toFixed(2)}`);

        // Identify hotspots
        console.log('\n✨ Zonas de mayor atención visual identificadas ✨');
    }

    updateStatus(message) {
        document.getElementById('status').textContent = `Estado: ${message}`;
    }

    reset() {
        // Stop tracking
        this.isTracking = false;
        this.stopTimer();
        
        // Reset data
        this.gazeData = [];
        this.isCalibrated = false;
        this.taskCompleted = false;
        this.elapsedTime = 0;
        
        // Reset UI
        document.getElementById('start-calibration').disabled = false;
        document.getElementById('start-task').disabled = true;
        document.getElementById('show-heatmap').disabled = true;
        document.getElementById('task-description').style.display = 'none';
        document.getElementById('timer').textContent = 'Tiempo: 0s';
        
        // Hide heatmap
        document.getElementById('heatmap-container').classList.remove('active');
        
        // Hide modal
        document.getElementById('success-modal').classList.remove('active');
        
        // Show video feed
        const videoFeed = document.getElementById('webgazerVideoFeed');
        if (videoFeed) {
            videoFeed.style.display = 'block';
        }
        
        // Pause WebGazer
        webgazer.pause();
        webgazer.showPredictionPoints(false);
        
        this.updateStatus('Sistema reiniciado. Listo para nueva calibración');
        
        console.log('Sistema reiniciado');
    }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔬 Eye-Tracking System Initialized');
    console.log('Creado para análisis de usabilidad e Interacción Persona-Computador');
    
    const eyeTracker = new EyeTrackingSystem();
    
    // Make it globally accessible for debugging
    window.eyeTracker = eyeTracker;
});
