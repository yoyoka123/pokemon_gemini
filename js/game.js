// 游戏主逻辑
class Game {
    constructor() {
        this.initialize();
        this.setupEventListeners();
        this.animate();
    }

    initialize() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // 天空蓝色

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.6, 0); // 人眼高度

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // 添加十字准星
        const crosshair = document.createElement('div');
        crosshair.className = 'crosshair';
        document.getElementById('game-container').appendChild(crosshair);

        // 设置第一人称控制
        this.controls = new THREE.PointerLockControls(this.camera, this.renderer.domElement);
        
        // 初始化世界、玩家、宝可梦和背包
        this.world = new World(this.scene);
        this.world.createTerrain(); // 创建天空盒
        
        this.player = new Player(this.camera, this.controls, this.scene);
        this.pokemonManager = new PokemonManager(this.scene);
        
        // 将宝可梦管理器添加到场景的userData中，以便Pokemon实例可以访问
        this.scene.userData.pokemonManager = this.pokemonManager;
        
        // 设置宝可梦管理器的game引用为当前Game实例
        this.pokemonManager.setGame(this);
        
        this.bag = new Bag();

        // 添加环境光和定向光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // 游戏状态
        this.gameStarted = false;
        this.isCapturing = false;
        this.isBagOpen = false;
        
        // 确保背包和HUD的初始状态
        const bagElement = document.getElementById('bag');
        const hudElement = document.getElementById('hud');
        
        // 强制设置初始状态
        bagElement.style.display = 'none';
        bagElement.classList.add('hidden');
        hudElement.style.display = 'none';
        
        // 移除加载屏幕
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
        // 初始化世界块
        this.world.updateChunks(this.camera.position);
    }

    setupEventListeners() {
        // 锁定鼠标点击事件
        this.renderer.domElement.addEventListener('click', () => {
            if (!this.gameStarted) {
                this.controls.lock();
            }
        });

        // 鼠标锁定/解锁事件
        this.controls.addEventListener('lock', () => {
            this.gameStarted = true;
            document.getElementById('hud').style.display = 'block';
        });

        this.controls.addEventListener('unlock', () => {
            if (!this.isBagOpen) {
                document.getElementById('hud').style.display = 'none';
            }
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 鼠标左键攻击
        document.addEventListener('mousedown', (event) => {
            if (!this.gameStarted || !this.controls.isLocked) return;
            
            if (event.button === 0) { // 左键
                this.player.attack();
                this.checkAttackHit();
            } else if (event.button === 2) { // 右键
                this.throwPokeball();
            }
        });

        // 禁用右键菜单
        document.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // 按B键打开/关闭背包
        document.addEventListener('keydown', (event) => {
            if (event.key === 'b' || event.key === 'B') {
                this.toggleBag();
            }
        });

        // 关闭背包按钮
        const closeBagButton = document.getElementById('close-bag');
        if (closeBagButton) {
            closeBagButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.toggleBag();
                console.log("通过关闭按钮关闭背包");
            });
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        if (this.gameStarted && this.controls.isLocked) {
            this.player.update();
            this.pokemonManager.update();
            this.checkPokemonProximity();
            
            // 更新世界块
            this.world.updateChunks(this.camera.position);
        }
        
        this.renderer.render(this.scene, this.camera);
    }

    checkAttackHit() {
        // 获取玩家视线方向
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        // 创建射线检测器
        const raycaster = new THREE.Raycaster(this.camera.position, direction);
        
        // 获取所有活跃宝可梦
        const activePokemons = this.pokemonManager.getActivePokemons();
        
        // 对每个活跃宝可梦进行检测
        for (let pokemon of activePokemons) {
            if (pokemon.isVisible) {
                // 检查是否命中宝可梦
                const intersects = raycaster.intersectObject(pokemon.model, true);
                
                if (intersects.length > 0 && intersects[0].distance < 10) {
                    pokemon.damage(20);
                    this.updateHealthBar(pokemon.health);
                    // 只检测第一个命中的宝可梦，避免一次攻击伤害多个
                    return;
                }
            }
        }
        
        // 如果没有命中任何宝可梦，重置健康条
        this.updateHealthBar(0);
    }

    throwPokeball() {
        if (this.isCapturing) return;

        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        this.player.throwPokeball(direction, (pokeball) => {
            // 获取精灵球的位置
            const pokeballPosition = new THREE.Vector3();
            pokeball.getWorldPosition(pokeballPosition);
            
            // 检测离精灵球最近的宝可梦
            const nearbyPokemon = this.pokemonManager.getPokemonAtPosition(pokeballPosition);
            
            if (nearbyPokemon) {
                this.capturePokemon(nearbyPokemon);
            }
        });
    }

    capturePokemon(pokemon) {
        this.isCapturing = true;
        
        // 捕获几率基于宝可梦剩余生命值
        const captureChance = 1 - (pokemon.health / 100);
        
        if (Math.random() < captureChance) {
            // 成功捕获
            this.showCaptureMessage(`成功捕获了 ${pokemon.name}!`);
            this.bag.addPokemon(pokemon);
            this.pokemonManager.removePokemon(pokemon);
        } else {
            // 捕获失败
            this.showCaptureMessage(`${pokemon.name} 挣脱了精灵球!`);
        }
        
        setTimeout(() => {
            this.hideCaptureMessage();
            this.isCapturing = false;
        }, 2000);
    }

    showCaptureMessage(message) {
        const captureMessage = document.getElementById('capture-message');
        captureMessage.textContent = message;
        captureMessage.classList.remove('hidden');
    }

    hideCaptureMessage() {
        document.getElementById('capture-message').classList.add('hidden');
    }

    updateHealthBar(health) {
        const healthBar = document.getElementById('pokemon-health');
        const percentage = Math.max(0, health);
        healthBar.style.width = `${percentage}%`;
    }

    toggleBag() {
        const bagElement = document.getElementById('bag');
        const hudElement = document.getElementById('hud');
        
        try {
            // 检查游戏状态
            if (!this.gameStarted) {
                console.log("游戏尚未开始，不能打开背包");
                return;
            }

            if (bagElement.classList.contains('hidden')) {
                // 打开背包
                bagElement.classList.remove('hidden');
                bagElement.style.display = 'flex';
                this.controls.unlock();
                hudElement.style.display = 'none';
                this.bag.displayPokemon();
                this.isBagOpen = true;
                
                console.log("背包已打开");
            } else {
                // 关闭背包
                bagElement.classList.add('hidden');
                bagElement.style.display = 'none';
                hudElement.style.display = 'block';
                this.isBagOpen = false;
                
                // 只有当游戏已经开始时才重新锁定控制
                if (this.gameStarted) {
                    setTimeout(() => {
                        this.controls.lock();
                    }, 100);
                }
                
                console.log("背包已关闭");
            }
        } catch (error) {
            console.error("切换背包时出错:", error);
        }
    }

    checkPokemonProximity() {
        // 获取玩家位置
        const playerPosition = this.camera.position.clone();
        
        // 获取所有活跃宝可梦
        const activePokemons = this.pokemonManager.getActivePokemons();
        
        // 初始化最近的宝可梦和距离
        let closestPokemon = null;
        let closestDistance = Infinity;
        
        // 找到最近的宝可梦
        for (let pokemon of activePokemons) {
            if (pokemon.isVisible) {
                const distance = playerPosition.distanceTo(pokemon.model.position);
                if (distance < closestDistance && distance < 15) {
                    closestPokemon = pokemon;
                    closestDistance = distance;
                }
            }
        }
        
        // 更新HUD显示最近宝可梦的健康值
        if (closestPokemon) {
            this.updateHealthBar(closestPokemon.health);
        } else {
            this.updateHealthBar(0);
        }
    }
}

// 当文档加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
}); 