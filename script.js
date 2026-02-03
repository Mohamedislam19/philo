// ===================================
// تهيئة عامة
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initProgressBar();
    initSmoothScroll();
    initScrollToTop();
    initFallingObjectsSimulation();
    initPlanetsSimulation();
    initElectronSimulation();
    initRadioactiveSimulation();
    initQuiz();
});

// ===================================
// شريط التقدم
// ===================================

function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    });
}

// ===================================
// التمرير السلس
// ===================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navHeight = document.querySelector('.main-nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight - 10;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// زر العودة للأعلى
// ===================================

function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// محاكاة 1: سقوط الأجسام
// ===================================

function initFallingObjectsSimulation() {
    const canvas = document.getElementById('fallingObjectsCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startFalling');
    const stopBtn = document.getElementById('stopFalling');
    const resetBtn = document.getElementById('resetFalling');
    const heightDisplay = document.getElementById('heightDisplay');
    const speedDisplay = document.getElementById('speedDisplay');
    
    let animationId = null;
    let isRunning = false;
    
    // خصائص المحاكاة
    const gravity = 0.5;
    const maxHeight = 100; // متر
    const canvasHeight = canvas.height;
    const groundY = canvasHeight - 50;
    const startY = 50;
    
    let ball1 = {
        x: 150,
        y: startY,
        radius: 15,
        velocity: 0,
        color: '#3b82f6'
    };
    
    let ball2 = {
        x: 450,
        y: startY,
        radius: 15,
        velocity: 0,
        color: '#ef4444'
    };
    
    function draw() {
        // مسح الشاشة
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الأرض
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        
        // رسم خطوط الارتفاع
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 1; i <= 4; i++) {
            const y = startY + (groundY - startY) * i / 4;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // رسم الكرة 1
        ctx.fillStyle = ball1.color;
        ctx.beginPath();
        ctx.arc(ball1.x, ball1.y, ball1.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // رسم الكرة 2
        ctx.fillStyle = ball2.color;
        ctx.beginPath();
        ctx.arc(ball2.x, ball2.y, ball2.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // عرض النصوص
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('كرة 1', ball1.x, ball1.y - 25);
        ctx.fillText('كرة 2', ball2.x, ball2.y - 25);
    }
    
    function update() {
        if (!isRunning) return;
        
        // تحديث الكرة 1
        if (ball1.y + ball1.radius < groundY) {
            ball1.velocity += gravity;
            ball1.y += ball1.velocity;
        } else {
            ball1.y = groundY - ball1.radius;
            ball1.velocity = 0;
        }
        
        // تحديث الكرة 2
        if (ball2.y + ball2.radius < groundY) {
            ball2.velocity += gravity;
            ball2.y += ball2.velocity;
        } else {
            ball2.y = groundY - ball2.radius;
            ball2.velocity = 0;
        }
        
        // حساب الارتفاع والسرعة
        const currentHeight = Math.max(0, Math.round((groundY - ball1.y - ball1.radius) / (groundY - startY) * maxHeight));
        const currentSpeed = Math.round(ball1.velocity * 2);
        
        heightDisplay.textContent = currentHeight + 'm';
        speedDisplay.textContent = currentSpeed + ' m/s';
        
        draw();
        animationId = requestAnimationFrame(update);
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            update();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function reset() {
        stop();
        ball1.y = startY;
        ball1.velocity = 0;
        ball2.y = startY;
        ball2.velocity = 0;
        heightDisplay.textContent = '100m';
        speedDisplay.textContent = '0 m/s';
        draw();
    }
    
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
    
    // رسم أولي
    draw();
}

// ===================================
// محاكاة 2: حركة الكواكب
// ===================================

function initPlanetsSimulation() {
    const canvas = document.getElementById('planetsCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startPlanets');
    const stopBtn = document.getElementById('stopPlanets');
    const resetBtn = document.getElementById('resetPlanets');
    const timeDisplay = document.getElementById('planetTime');
    
    let animationId = null;
    let isRunning = false;
    let time = 0;
    
    const sun = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 30,
        color: '#fbbf24'
    };
    
    const planets = [
        { name: 'عطارد', distance: 60, radius: 6, speed: 0.04, angle: 0, color: '#94a3b8' },
        { name: 'الزهرة', distance: 90, radius: 10, speed: 0.03, angle: 0, color: '#fbbf24' },
        { name: 'الأرض', distance: 120, radius: 10, speed: 0.02, angle: 0, color: '#3b82f6' },
        { name: 'المريخ', distance: 150, radius: 8, speed: 0.015, angle: 0, color: '#ef4444' }
    ];
    
    function draw() {
        // مسح الشاشة
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم النجوم
        ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const x = (i * 123) % canvas.width;
            const y = (i * 456) % canvas.height;
            ctx.fillRect(x, y, 2, 2);
        }
        
        // رسم المدارات
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        planets.forEach(planet => {
            ctx.beginPath();
            ctx.arc(sun.x, sun.y, planet.distance, 0, Math.PI * 2);
            ctx.stroke();
        });
        
        // رسم الشمس
        ctx.fillStyle = sun.color;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // توهج الشمس
        const gradient = ctx.createRadialGradient(sun.x, sun.y, sun.radius, sun.x, sun.y, sun.radius * 1.5);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.5)');
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // رسم الكواكب
        planets.forEach(planet => {
            const x = sun.x + Math.cos(planet.angle) * planet.distance;
            const y = sun.y + Math.sin(planet.angle) * planet.distance;
            
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // اسم الكوكب
            ctx.fillStyle = 'white';
            ctx.font = '12px Cairo';
            ctx.textAlign = 'center';
            ctx.fillText(planet.name, x, y - planet.radius - 8);
        });
    }
    
    function update() {
        if (!isRunning) return;
        
        planets.forEach(planet => {
            planet.angle += planet.speed;
        });
        
        time++;
        timeDisplay.textContent = Math.round(time / 2);
        
        draw();
        animationId = requestAnimationFrame(update);
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            update();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function reset() {
        stop();
        time = 0;
        planets.forEach(planet => {
            planet.angle = 0;
        });
        timeDisplay.textContent = '0';
        draw();
    }
    
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
    
    // رسم أولي
    draw();
}

// ===================================
// محاكاة 3: سحابة احتمال الإلكترون
// ===================================

function initElectronSimulation() {
    const canvas = document.getElementById('electronCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startElectron');
    const stopBtn = document.getElementById('stopElectron');
    const resetBtn = document.getElementById('resetElectron');
    const countDisplay = document.getElementById('electronCount');
    
    let animationId = null;
    let isRunning = false;
    let electrons = [];
    let particleCount = 0;
    
    const nucleus = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        color: '#ef4444'
    };
    
    const maxElectrons = 1000;
    const orbitalRadius = 80;
    
    function draw() {
        // مسح الشاشة مع أثر باهت
        ctx.fillStyle = 'rgba(30, 41, 59, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم دوائر الاحتمال
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(nucleus.x, nucleus.y, orbitalRadius * i * 0.6, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // رسم النواة
        ctx.fillStyle = nucleus.color;
        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // توهج النواة
        const gradient = ctx.createRadialGradient(nucleus.x, nucleus.y, nucleus.radius, nucleus.x, nucleus.y, nucleus.radius * 1.5);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(nucleus.x, nucleus.y, nucleus.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // رسم الإلكترونات
        electrons.forEach((electron, index) => {
            ctx.fillStyle = `rgba(139, 92, 246, ${electron.opacity})`;
            ctx.beginPath();
            ctx.arc(electron.x, electron.y, electron.size, 0, Math.PI * 2);
            ctx.fill();
            
            // تقليل العتامة تدريجياً
            electrons[index].opacity -= 0.005;
        });
        
        // إزالة الإلكترونات الباهتة
        electrons = electrons.filter(e => e.opacity > 0);
        
        // نص
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('النواة', nucleus.x, nucleus.y + nucleus.radius + 25);
    }
    
    function addElectron() {
        if (electrons.length >= maxElectrons) {
            electrons.shift();
        }
        
        // توزيع احتمالي غاوسي حول النواة
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.abs(randomGaussian(0, orbitalRadius));
        
        const electron = {
            x: nucleus.x + Math.cos(angle) * distance,
            y: nucleus.y + Math.sin(angle) * distance,
            size: 2,
            opacity: 0.8
        };
        
        electrons.push(electron);
        particleCount++;
        countDisplay.textContent = particleCount;
    }
    
    function randomGaussian(mean, stdDev) {
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + z0 * stdDev;
    }
    
    function update() {
        if (!isRunning) return;
        
        // إضافة إلكترونات جديدة
        for (let i = 0; i < 5; i++) {
            addElectron();
        }
        
        draw();
        animationId = requestAnimationFrame(update);
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            update();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function reset() {
        stop();
        electrons = [];
        particleCount = 0;
        countDisplay.textContent = '0';
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        draw();
    }
    
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
    
    // رسم أولي
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
}

// ===================================
// محاكاة 4: التحلل الإشعاعي
// ===================================

function initRadioactiveSimulation() {
    const canvas = document.getElementById('radioactiveCanvas');
    const ctx = canvas.getContext('2d');
    const startBtn = document.getElementById('startRadioactive');
    const stopBtn = document.getElementById('stopRadioactive');
    const resetBtn = document.getElementById('resetRadioactive');
    const remainingDisplay = document.getElementById('atomsRemaining');
    const decayedDisplay = document.getElementById('atomsDecayed');
    const timeDisplay = document.getElementById('decayTime');
    
    let animationId = null;
    let isRunning = false;
    let time = 0;
    let atoms = [];
    
    const totalAtoms = 100;
    const decayProbability = 0.015; // احتمال التحلل في كل إطار
    const gridCols = 10;
    const gridRows = 10;
    const atomSize = 8;
    const spacing = 50;
    const offsetX = (canvas.width - spacing * (gridCols - 1)) / 2;
    const offsetY = (canvas.height - spacing * (gridRows - 1)) / 2;
    
    function initAtoms() {
        atoms = [];
        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                atoms.push({
                    x: offsetX + col * spacing,
                    y: offsetY + row * spacing,
                    decayed: false,
                    decayTime: 0
                });
            }
        }
    }
    
    function draw() {
        // مسح الشاشة
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // رسم الذرات
        atoms.forEach(atom => {
            if (!atom.decayed) {
                // ذرات نشطة
                ctx.fillStyle = '#22c55e';
                ctx.beginPath();
                ctx.arc(atom.x, atom.y, atomSize, 0, Math.PI * 2);
                ctx.fill();
                
                // توهج
                const gradient = ctx.createRadialGradient(atom.x, atom.y, atomSize, atom.x, atom.y, atomSize * 2);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.5)');
                gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(atom.x, atom.y, atomSize * 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // ذرات متحللة
                const age = time - atom.decayTime;
                const opacity = Math.max(0, 1 - age / 100);
                
                ctx.fillStyle = `rgba(239, 68, 68, ${opacity})`;
                ctx.beginPath();
                ctx.arc(atom.x, atom.y, atomSize * 0.5, 0, Math.PI * 2);
                ctx.fill();
                
                // رسم الإشعاع
                if (age < 30) {
                    ctx.strokeStyle = `rgba(251, 191, 36, ${opacity})`;
                    ctx.lineWidth = 2;
                    for (let i = 0; i < 3; i++) {
                        const angle = (Math.PI * 2 / 3) * i + age * 0.1;
                        const length = age * 0.5;
                        ctx.beginPath();
                        ctx.moveTo(atom.x, atom.y);
                        ctx.lineTo(atom.x + Math.cos(angle) * length, atom.y + Math.sin(angle) * length);
                        ctx.stroke();
                    }
                }
            }
        });
        
        // النصوص
        ctx.fillStyle = 'white';
        ctx.font = 'bold 16px Cairo';
        ctx.textAlign = 'center';
        ctx.fillText('☢️ مادة مشعة', canvas.width / 2, 30);
    }
    
    function update() {
        if (!isRunning) return;
        
        // تحديث الذرات
        atoms.forEach(atom => {
            if (!atom.decayed && Math.random() < decayProbability) {
                atom.decayed = true;
                atom.decayTime = time;
            }
        });
        
        // تحديث العدادات
        const remaining = atoms.filter(a => !a.decayed).length;
        const decayed = totalAtoms - remaining;
        
        remainingDisplay.textContent = remaining;
        decayedDisplay.textContent = decayed;
        timeDisplay.textContent = (time / 60).toFixed(1);
        
        time++;
        draw();
        animationId = requestAnimationFrame(update);
    }
    
    function start() {
        if (!isRunning) {
            isRunning = true;
            update();
        }
    }
    
    function stop() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    }
    
    function reset() {
        stop();
        time = 0;
        initAtoms();
        remainingDisplay.textContent = totalAtoms;
        decayedDisplay.textContent = '0';
        timeDisplay.textContent = '0';
        draw();
    }
    
    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
    resetBtn.addEventListener('click', reset);
    
    // تهيئة أولية
    initAtoms();
    draw();
}

// ===================================
// الاختبار النهائي (Quiz)
// ===================================

function initQuiz() {
    const quizIntro = document.getElementById('quizIntro');
    const quizQuestions = document.getElementById('quizQuestions');
    const quizResults = document.getElementById('quizResults');
    const startQuizBtn = document.getElementById('startQuiz');
    const nextQuestionBtn = document.getElementById('nextQuestion');
    const retryQuizBtn = document.getElementById('retryQuiz');
    const questionContainer = document.getElementById('questionContainer');
    const currentQuestionDisplay = document.getElementById('currentQuestion');
    const totalQuestionsDisplay = document.getElementById('totalQuestions');
    const quizProgressFill = document.getElementById('quizProgressFill');
    
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let score = 0;
    let userAnswers = [];
    
    const questions = [
        {
            question: "ما هو الإشكال الفلسفي الرئيسي في هذا الموضوع؟",
            answers: [
                "هل العلم أهم من الفلسفة؟",
                "هل تخضع الظواهر الطبيعية لقوانين حتمية صارمة أم لقوانين احتمالية؟",
                "هل الإنسان حر أم مقيد؟",
                "هل الكون أزلي أم مخلوق؟"
            ],
            correct: 1
        },
        {
            question: "ما سبب ظهور هذا الإشكال الفلسفي؟",
            answers: [
                "رغبة الفلاسفة في الجدل",
                "نجاح العلم الكلاسيكي ثم عجزه عن تفسير بعض الظواهر",
                "الصراع بين الدين والعلم",
                "تطور التكنولوجيا"
            ],
            correct: 1
        },
        {
            question: "من هو العالم الذي وضع قوانين الحركة الثلاثة؟",
            answers: [
                "لابلاس",
                "هايزنبرغ",
                "نيوتن",
                "بور"
            ],
            correct: 2
        },
        {
            question: "ما هي الفكرة الأساسية للحتمية؟",
            answers: [
                "كل شيء عشوائي ولا يمكن التنبؤ به",
                "لكل ظاهرة سبب، ونفس الأسباب تؤدي إلى نفس النتائج",
                "القوانين الفيزيائية نسبية",
                "الكون فوضوي"
            ],
            correct: 1
        },
        {
            question: "ما هي فكرة 'عقل لابلاس'؟",
            answers: [
                "العقل البشري محدود",
                "لو امتلك كائن معرفة كاملة بكل جسيم، لاستطاع التنبؤ بالمستقبل بدقة تامة",
                "العقل يخلق الواقع",
                "التفكير أهم من التجربة"
            ],
            correct: 1
        },
        {
            question: "صح أم خطأ: الفيزياء الكلاسيكية نجحت في تفسير سلوك الإلكترون داخل الذرة.",
            answers: [
                "صح",
                "خطأ"
            ],
            correct: 1
        },
        {
            question: "من هو العالم صاحب مبدأ اللايقين (عدم التحديد)؟",
            answers: [
                "نيوتن",
                "هايزنبرغ",
                "لابلاس",
                "أينشتاين"
            ],
            correct: 1
        },
        {
            question: "ماذا ينص مبدأ اللايقين لهايزنبرغ؟",
            answers: [
                "يمكن قياس موضع وسرعة الجسيم بدقة تامة معاً",
                "لا يمكن قياس موضع وسرعة جسيم دقيق بدقة تامة في نفس الوقت",
                "الجسيمات ليس لها موضع",
                "القياس يخلق الواقع"
            ],
            correct: 1
        },
        {
            question: "ما هي ازدواجية موجة/جسيم؟",
            answers: [
                "الضوء موجة فقط",
                "الإلكترون جسيم فقط",
                "الإلكترون والضوء يظهران سلوكاً موجياً وجسيمياً",
                "الموجات والجسيمات منفصلة تماماً"
            ],
            correct: 2
        },
        {
            question: "صح أم خطأ: اللاحتمية تعني الفوضى التامة وغياب القوانين.",
            answers: [
                "صح",
                "خطأ"
            ],
            correct: 1
        },
        {
            question: "ما هو مجال تطبيق الحتمية حسب التركيب (الحل)؟",
            answers: [
                "العالم المجهري (الذرات والجسيمات)",
                "العالم العياني (الأجسام الكبيرة)",
                "كل الظواهر بدون استثناء",
                "لا توجد حتمية في الطبيعة"
            ],
            correct: 1
        },
        {
            question: "ما هي الخلاصة النهائية للموضوع؟",
            answers: [
                "الحتمية أُلغيت تماماً بفضل الفيزياء الحديثة",
                "لا إلغاء للحتمية بل تحديد مجالها، والعلم يتطور",
                "اللاحتمية خاطئة",
                "لا يمكن التوفيق بين الحتمية واللاحتمية"
            ],
            correct: 1
        }
    ];
    
    totalQuestionsDisplay.textContent = questions.length;
    
    function showQuestion() {
        const question = questions[currentQuestionIndex];
        selectedAnswer = null;
        
        currentQuestionDisplay.textContent = currentQuestionIndex + 1;
        
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        quizProgressFill.style.width = progress + '%';
        
        questionContainer.innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="answers-grid">
                ${question.answers.map((answer, index) => `
                    <div class="answer-option" data-index="${index}">
                        ${answer}
                    </div>
                `).join('')}
            </div>
        `;
        
        const answerOptions = questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach(option => {
            option.addEventListener('click', function() {
                answerOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedAnswer = parseInt(this.getAttribute('data-index'));
                nextQuestionBtn.disabled = false;
            });
        });
        
        nextQuestionBtn.disabled = true;
    }
    
    function checkAnswer() {
        const question = questions[currentQuestionIndex];
        const isCorrect = selectedAnswer === question.correct;
        
        if (isCorrect) {
            score++;
        }
        
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            selectedAnswer: selectedAnswer,
            correct: isCorrect
        });
        
        // تظليل الإجابة
        const answerOptions = questionContainer.querySelectorAll('.answer-option');
        answerOptions.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });
    }
    
    function nextQuestion() {
        checkAnswer();
        
        setTimeout(() => {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                showResults();
            }
        }, 1500);
    }
    
    function showResults() {
        quizQuestions.style.display = 'none';
        quizResults.style.display = 'block';
        
        const percentage = Math.round((score / questions.length) * 100);
        const correctAnswers = score;
        const wrongAnswers = questions.length - score;
        
        document.getElementById('finalScore').textContent = score;
        document.getElementById('totalScore').textContent = questions.length;
        document.getElementById('scorePercentage').textContent = percentage + '%';
        document.getElementById('correctAnswers').textContent = correctAnswers;
        document.getElementById('wrongAnswers').textContent = wrongAnswers;
        
        const resultsIcon = document.getElementById('resultsIcon');
        const scoreMessage = document.getElementById('scoreMessage');
        
        if (percentage >= 90) {
            resultsIcon.textContent = '🎉';
            scoreMessage.textContent = 'ممتاز جداً! لديك فهم عميق للموضوع';
            scoreMessage.style.background = 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)';
            scoreMessage.style.color = '#065f46';
        } else if (percentage >= 70) {
            resultsIcon.textContent = '👏';
            scoreMessage.textContent = 'جيد جداً! لديك فهم جيد للموضوع';
            scoreMessage.style.background = 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)';
            scoreMessage.style.color = '#1e40af';
        } else if (percentage >= 50) {
            resultsIcon.textContent = '👍';
            scoreMessage.textContent = 'جيد! يمكنك تحسين فهمك بمراجعة الشرح';
            scoreMessage.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
            scoreMessage.style.color = '#92400e';
        } else {
            resultsIcon.textContent = '📚';
            scoreMessage.textContent = 'راجع الشرح مرة أخرى وحاول من جديد';
            scoreMessage.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
            scoreMessage.style.color = '#991b1b';
        }
    }
    
    function resetQuiz() {
        currentQuestionIndex = 0;
        selectedAnswer = null;
        score = 0;
        userAnswers = [];
        
        quizIntro.style.display = 'block';
        quizQuestions.style.display = 'none';
        quizResults.style.display = 'none';
    }
    
    function startQuiz() {
        quizIntro.style.display = 'none';
        quizQuestions.style.display = 'block';
        showQuestion();
    }
    
    startQuizBtn.addEventListener('click', startQuiz);
    nextQuestionBtn.addEventListener('click', nextQuestion);
    retryQuizBtn.addEventListener('click', resetQuiz);
}
