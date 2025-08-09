// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initHeroAnimations();
    initFeatureInteractions();
    initScrollAnimations();
    initCopyFunctionality();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Hero section animations
function initHeroAnimations() {
    const heroMockup = document.querySelector('.hero-mockup');
    const mockupTabs = document.querySelectorAll('.mockup-tab');
    
    // Track dynamic tasks
    window.dynamicTaskCount = 0;
    window.maxDynamicTasks = 1;
    
    // Tab switching with full mockup flip animation
    mockupTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const viewType = this.getAttribute('data-view');
            const heroMockupFlipper = document.querySelector('.hero-mockup-flipper');
            const heroVisual = document.querySelector('.hero-visual');
            
            // Update active tabs on both sides
            document.querySelectorAll('.mockup-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll(`[data-view="${viewType}"]`).forEach(t => t.classList.add('active'));
            
            // Trigger flip animation and hide/show floating tasks
            if (viewType === 'calendar') {
                heroMockupFlipper.classList.add('flipped');
                heroVisual.classList.add('calendar-mode');
            } else if (viewType === 'free') {
                heroMockupFlipper.classList.remove('flipped');
                heroVisual.classList.remove('calendar-mode');
            }
            
            // Add tab press animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add button interaction - only works in free view
    const addBtn = document.querySelector('.hero-mockup-front .mockup-add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            // Only create task if under limit
            if (window.dynamicTaskCount < window.maxDynamicTasks) {
                // Create ripple effect
                this.style.transform = 'scale(0.9)';
                
                // Create a floating task
                createTempNote();
                
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
    
    // Floating tasks random movement
    animateFloatingTasks();
}

// Create new floating task around the widget
function createTempNote() {
    // Increment counter
    window.dynamicTaskCount++;
    
    const heroVisual = document.querySelector('.hero-visual');
    const taskData = [
        { emoji: '🎵', task: 'Practice Piano', due: 'Due: 3pm' },
        { emoji: '🍳', task: 'Cook Dinner', due: 'Due: 6pm' },
        { emoji: '📖', task: 'Read Chapter 5', due: 'Due: Tonight' },
        { emoji: '🏃', task: 'Morning Run', due: 'Due: 7am' },
        { emoji: '📞', task: 'Team Meeting', due: 'Due: 2pm' },
        { emoji: '🛒', task: 'Grocery Shopping', due: 'Due: Weekend' },
        { emoji: '✏️', task: 'Finish Essay', due: 'Due: Monday' },
        { emoji: '🎯', task: 'Project Review', due: 'Due: Friday' }
    ];
    
    const colors = ['#DDA0DD', '#98FB98', '#F0A0A0', '#FFDAB9', '#E6E6FA', '#F0FFF0'];
    
    // Safe position that avoids existing tasks, mockup buttons AND the + add button
    // Existing tasks are at:
    // - floating-task-1: top: 20px, right: -30px
    // - floating-task-2: top: 150px, right: 200px  
    // - floating-task-3: bottom: 100px, right: -20px
    // Mockup Free/Calendar buttons are in the center-top area of mockup
    // Mockup + add button is at bottom-right corner of mockup (around right: 100-150px area)
    const position = { top: '280px', right: '200px' };   // Bottom center-left, clear of all elements
    const randomTask = taskData[Math.floor(Math.random() * taskData.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomDelay = Math.random() * 2;
    
    // Create floating task element
    const floatingTask = document.createElement('div');
    floatingTask.className = 'floating-task floating-task-dynamic';
    
    const taskContent = document.createElement('div');
    taskContent.className = 'task-content';
    
    const taskTitle = document.createElement('h4');
    taskTitle.textContent = `${randomTask.emoji} ${randomTask.task}`;
    
    const taskMeta = document.createElement('span');
    taskMeta.className = 'task-meta';
    taskMeta.textContent = randomTask.due;
    
    taskContent.appendChild(taskTitle);
    taskContent.appendChild(taskMeta);
    floatingTask.appendChild(taskContent);
    
    // Create task exactly like existing floating tasks - simple and clean
    floatingTask.style.cssText = `
        position: absolute;
        background: ${randomColor};
        border-radius: 15px;
        padding: 15px 20px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
        animation: float 3s ease-in-out infinite;
        animation-delay: ${randomDelay}s;
        z-index: 10;
        top: ${position.top};
        right: ${position.right};
        transform: scale(0);
        opacity: 0;
    `;
    
    heroVisual.appendChild(floatingTask);
    
    // Simple scale-in entrance - no transition conflicts with animation
    requestAnimationFrame(() => {
        floatingTask.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease';
        floatingTask.style.transform = 'scale(1)';
        floatingTask.style.opacity = '1';
        
        // Clear transition after entrance to avoid conflicts
        setTimeout(() => {
            floatingTask.style.transition = '';
        }, 400);
    });
    
    // Remove after 12 seconds with smooth fade out
    setTimeout(() => {
        floatingTask.style.transition = 'opacity 1s ease-out';
        floatingTask.style.opacity = '0';
        
        setTimeout(() => {
            if (floatingTask.parentNode) {
                floatingTask.parentNode.removeChild(floatingTask);
                window.dynamicTaskCount--;
            }
        }, 1000);
    }, 12000);
}

// Animate floating tasks
function animateFloatingTasks() {
    const floatingTasks = document.querySelectorAll('.floating-task');
    
    floatingTasks.forEach((task, index) => {
        // Add random subtle movements
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            task.style.transform = `translate(${randomX}px, ${randomY}px)`;
            
            setTimeout(() => {
                task.style.transform = 'translate(0, 0)';
            }, 2000);
        }, 3000 + index * 1000);
    });
}

// Feature interactions
function initFeatureInteractions() {
    // AI demo interaction
    const aiDemo = document.querySelector('.ai-demo');
    if (aiDemo) {
        const demoStatus = aiDemo.querySelector('.demo-status');
        
        setInterval(() => {
            if (demoStatus) {
                demoStatus.style.opacity = demoStatus.style.opacity === '0.5' ? '1' : '0.5';
            }
        }, 1000);
    }
    
    // Calendar demo interaction
    const calendarDays = document.querySelectorAll('.demo-cal-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            calendarDays.forEach(d => d.classList.remove('active'));
            this.classList.add('active');
            
            // Add task dots randomly
            if (Math.random() > 0.5 && !this.querySelector('.demo-task-dot')) {
                const dot = document.createElement('span');
                dot.className = 'demo-task-dot';
                this.appendChild(dot);
            }
        });
    });
    
    // Demo notes interaction
    const demoNotes = document.querySelectorAll('.demo-note');
    demoNotes.forEach(note => {
        note.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        note.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Break timer demo
    initBreakTimerDemo();
    
    // Stats counter animation
    initStatsCounter();
}

// Break timer demo
function initBreakTimerDemo() {
    const demoTimer = document.querySelector('.demo-timer');
    if (!demoTimer) return;
    
    let minutes = 25;
    let seconds = 0;
    
    const updateTimer = () => {
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        demoTimer.textContent = display;
        
        if (seconds === 0) {
            if (minutes === 0) {
                minutes = 25;
            } else {
                minutes--;
                seconds = 59;
            }
        } else {
            seconds--;
        }
    };
    
    // Update every 3 seconds for demo purposes
    setInterval(updateTimer, 3000);
}

// Stats counter animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        const start = 0;
        const increment = target / 50;
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    };
    
    // Trigger animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = target.textContent;
                
                if (value.includes('h')) {
                    animateCounter(target, 3);
                    setTimeout(() => target.textContent = '3h', 1500);
                } else {
                    animateCounter(target, parseInt(value));
                }
                
                observer.unobserve(target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Scroll animations
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .step, .install-step');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroVisual && scrolled < window.innerHeight) {
            heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
}

// Copy to clipboard functionality
function initCopyFunctionality() {
    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success feedback
            showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };
}

function showCopySuccess() {
    // Find the clone repository card to position relative to it
    const cloneCard = document.querySelector('.download-card:not(.primary)');
    if (!cloneCard) return;
    
    const feedback = document.createElement('div');
    feedback.textContent = 'Copied to clipboard!';
    feedback.style.cssText = `
        position: absolute;
        background: #28a745;
        color: white;
        padding: 6px 12px;
        border-radius: 4px;
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 0.8rem;
        animation: copyFeedback 2s ease-in-out forwards;
        left: 50%;
        transform: translateX(-50%);
        top: 100%;
        margin-top: 8px;
    `;
    
    // Add animation keyframes for the new positioning
    if (!document.querySelector('#copy-feedback-style')) {
        const style = document.createElement('style');
        style.id = 'copy-feedback-style';
        style.textContent = `
            @keyframes copyFeedback {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.9); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0px) scale(1); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px) scale(0.9); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Position relative to clone card
    cloneCard.style.position = 'relative';
    cloneCard.appendChild(feedback);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
        }
    }, 2000);
}

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu button if screen is small
    function createMobileMenu() {
        if (window.innerWidth <= 768) {
            const navbar = document.querySelector('.nav-container');
            const navMenu = document.querySelector('.nav-menu');
            
            if (!document.querySelector('.mobile-menu-btn')) {
                const mobileBtn = document.createElement('button');
                mobileBtn.className = 'mobile-menu-btn';
                mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileBtn.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #6495ED;
                    cursor: pointer;
                    display: block;
                `;
                
                navbar.appendChild(mobileBtn);
                
                // Toggle menu
                mobileBtn.addEventListener('click', () => {
                    navMenu.classList.toggle('mobile-active');
                    
                    if (navMenu.classList.contains('mobile-active')) {
                        navMenu.style.cssText = `
                            display: flex;
                            position: absolute;
                            top: 100%;
                            left: 0;
                            width: 100%;
                            background: white;
                            flex-direction: column;
                            padding: 20px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                            animation: slideDown 0.3s ease;
                        `;
                        mobileBtn.innerHTML = '<i class="fas fa-times"></i>';
                    } else {
                        navMenu.style.display = 'none';
                        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            }
        }
    }
    
    // Add slideDown animation
    if (!document.querySelector('#mobile-menu-style')) {
        const style = document.createElement('style');
        style.id = 'mobile-menu-style';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createMobileMenu();
    window.addEventListener('resize', createMobileMenu);
}

// Add some interactive particles for visual enhancement
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createParticle(particleContainer);
        }, i * 100);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(100, 149, 237, 0.1);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: particleFloat ${duration}s linear infinite;
    `;
    
    // Add particle animation
    if (!document.querySelector('#particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        // Create new particle
        createParticle(container);
    }, duration * 1000);
}

// Initialize particles after page load
window.addEventListener('load', () => {
    setTimeout(createParticles, 1000);
});

// Add installation step hover effects
document.addEventListener('DOMContentLoaded', function() {
    const installSteps = document.querySelectorAll('.install-step');
    
    installSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            // Add a subtle glow effect
            this.style.boxShadow = '0 15px 40px rgba(173, 216, 230, 0.3)';
            
            // Animate the step number
            const stepNumber = this.querySelector('.install-step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1.1) rotate(360deg)';
                stepNumber.style.transition = 'transform 0.5s ease';
            }
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            
            const stepNumber = this.querySelector('.install-step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});

// Add download button interactions
document.addEventListener('DOMContentLoaded', function() {
    const downloadBtns = document.querySelectorAll('.btn-download, .btn-primary');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            `;
            
            // Add ripple animation
            if (!document.querySelector('#ripple-style')) {
                const style = document.createElement('style');
                style.id = 'ripple-style';
                style.textContent = `
                    @keyframes rippleEffect {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
});

// Add feature card tilt effect
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});