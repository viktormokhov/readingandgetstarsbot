// 3D Model Renderer for Hero Character
let scene, camera, renderer, model, mixer, clock;
let animationActions = [];
let activeAction = null;
let lastAction = null;

// Initialize the 3D scene
function init3DModel() {
    // Create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    
    // Create the camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    camera.position.set(0, 1.5, 3);
    
    // Create the renderer
    const container = document.getElementById('hero-model');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
    
    // Initialize clock for animations
    clock = new THREE.Clock();
    
    // Load the 3D model
    loadModel();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Start animation loop
    animate();
}

// Load the 3D model
function loadModel() {
    // Create a placeholder geometry while the model loads
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const placeholder = new THREE.Mesh(geometry, material);
    scene.add(placeholder);
    
    // Load the actual model
    const loader = new THREE.GLTFLoader();
    
    // In a real application, you would load an actual model file
    // For this example, we'll use a URL to a sample model
    const modelUrl = 'https://threejs.org/examples/models/gltf/Soldier.glb';
    
    loader.load(
        modelUrl,
        function (gltf) {
            model = gltf.scene;
            model.traverse(function (object) {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            
            // Position the model
            model.position.set(0, 0, 0);
            model.scale.set(1, 1, 1);
            
            // Remove placeholder and add the model
            scene.remove(placeholder);
            scene.add(model);
            
            // Set up animations
            if (gltf.animations && gltf.animations.length) {
                mixer = new THREE.AnimationMixer(model);
                
                gltf.animations.forEach((clip) => {
                    const action = mixer.clipAction(clip);
                    animationActions.push(action);
                    
                    // If this is the idle animation, play it by default
                    if (clip.name.toLowerCase().includes('idle')) {
                        activeAction = action;
                        activeAction.play();
                    }
                });
                
                // If no idle animation was found, play the first one
                if (!activeAction && animationActions.length > 0) {
                    activeAction = animationActions[0];
                    activeAction.play();
                }
            }
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened while loading the model:', error);
            
            // If model loading fails, create a simple 3D character
            createFallbackCharacter();
        }
    );
}

// Create a fallback character if the model fails to load
function createFallbackCharacter() {
    // Create a simple humanoid figure
    const group = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf5d0c5 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.7;
    group.add(head);
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x3f51b5 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    group.add(body);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.7, 32);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3f51b5 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.4, 1, 0);
    leftArm.rotation.z = Math.PI / 4;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.4, 1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    group.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 32);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x303f9f });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.4, 0);
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.4, 0);
    group.add(rightLeg);
    
    // Add the character to the scene
    model = group;
    scene.add(model);
    
    // Create a simple animation
    createSimpleAnimation();
}

// Create a simple animation for the fallback character
function createSimpleAnimation() {
    // We'll just make the character bob up and down slightly
    const animateCharacter = () => {
        if (model) {
            model.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            model.rotation.y += 0.01;
        }
    };
    
    // Add the animation function to our animation loop
    animationFunctions.push(animateCharacter);
}

// Store additional animation functions
const animationFunctions = [];

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('hero-model');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update animations
    if (mixer) {
        mixer.update(clock.getDelta());
    }
    
    // Run any additional animation functions
    animationFunctions.forEach(fn => fn());
    
    // Render the scene
    renderer.render(scene, camera);
}

// Change animation
function setAnimation(index) {
    if (!mixer || !animationActions || animationActions.length === 0) return;
    
    // Make sure index is within bounds
    index = Math.max(0, Math.min(index, animationActions.length - 1));
    
    lastAction = activeAction;
    activeAction = animationActions[index];
    
    if (lastAction !== activeAction) {
        if (lastAction) {
            lastAction.fadeOut(0.5);
        }
        activeAction.reset().fadeIn(0.5).play();
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', init3DModel);

// Expose functions to the global scope
window.setAnimation = setAnimation;