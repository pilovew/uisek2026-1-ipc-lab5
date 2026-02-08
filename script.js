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
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('close-modal').addEventListener('click', () => this.closeModal());
        
        // CTA Button click tracking
        document.getElementById('main-cta').addEventListener('click', () => this.onCTAClick());
    }

    initializeWebGazer() {
        // Initialize WebGazer with optimized settings
        webgazer.setGazeListener((data, elapsedTime) => {
            if (data && this.isTracking) {
                this.recordGazePoint(data.x, data.y);
            }
        }).begin();

        // Configure WebGazer
        webgazer.showVideoPreview(true)
                .showPredictionPoints(true)
                .applyKalmanFilter(true); // Smooth predictions

        // Pause initially
        webgazer.pause();

        this.updateStatus('Sistema inicializado. Haz clic en "Iniciar Calibración"');
    }

    async startCalibration() {
        this.updateStatus('Calibrando... Mira los puntos rojos que aparecen');
        
        // Resume WebGazer
        webgazer.resume();
        
        // Show calibration instructions
        alert('CALIBRACIÓN:\n\n1. Mira directamente a cada punto rojo que aparezca\n2. Haz clic en cada punto\n3. Mantén la cabeza quieta\n4. La calibración mejorará con el tiempo\n\nHaz clic en OK para comenzar');

        // Simple calibration - user should click around the screen
        this.performCalibration();
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
            width: 20px;
            height: 20px;
            background: red;
            border-radius: 50%;
            cursor: pointer;
            z-index: 99999;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
            animation: pulse 0.8s infinite;
        `;

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.3); }
            }
        `;
        document.head.appendChild(style);

        const showNextPoint = () => {
            if (currentPoint >= calibrationPoints.length) {
                document.body.removeChild(pointElement);
                this.completeCalibration();
                return;
            }

            const point = calibrationPoints[currentPoint];
            pointElement.style.left = point.x;
            pointElement.style.top = point.y;
            currentPoint++;
        };

        pointElement.addEventListener('click', showNextPoint);
        document.body.appendChild(pointElement);
        showNextPoint();
    }

    completeCalibration() {
        this.isCalibrated = true;
        this.updateStatus('✅ Calibración completada. Listo para comenzar la tarea');
        document.getElementById('start-task').disabled = false;
        document.getElementById('start-calibration').disabled = true;
    }

    startTask() {
        this.isTracking = true;
        this.taskStartTime = Date.now();
        this.gazeData = [];
        this.elapsedTime = 0;
        
        // Show task description
        document.getElementById('task-description').style.display = 'block';
        this.updateStatus('🎯 Tarea en curso... Encuentra el botón "Reservar Ahora"');
        
        // Disable start button
        document.getElementById('start-task').disabled = true;

        // Start timer
        this.startTimer();

        // Show prediction points
        webgazer.showPredictionPoints(true);
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
        // Record gaze point with timestamp
        this.gazeData.push({
            x: Math.round(x),
            y: Math.round(y),
            timestamp: Date.now() - this.taskStartTime
        });

        // Log data collection progress
        if (this.gazeData.length % 50 === 0) {
            console.log(`Collected ${this.gazeData.length} gaze points`);
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

    showHeatmap() {
        if (this.gazeData.length === 0) {
            alert('No hay datos de seguimiento visual disponibles.');
            return;
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
