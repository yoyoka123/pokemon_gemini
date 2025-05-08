// 宝可梦管理器类
class PokemonManager {
    constructor(scene) {
        this.scene = scene;
        this.pokemons = [];
        this.activePokemons = []; // 改为数组，支持多个活跃宝可梦
        this.maxActivePokemons = 20; // 将最大同时显示的宝可梦数量从10增加到20
        this.pokemonData = [
            // 第一世代 - 御三家及其进化链
            { id: 1, name: "妙蛙种子", model: "models/bulbasaur.glb", scale: 0.5, color: 0x7CFC00 },
            { id: 2, name: "妙蛙草", model: "models/ivysaur.glb", scale: 0.6, color: 0x32CD32 },
            { id: 3, name: "妙蛙花", model: "models/venusaur.glb", scale: 0.7, color: 0x228B22 },
            { id: 4, name: "小火龙", model: "models/charmander.glb", scale: 0.5, color: 0xFF4500 },
            { id: 5, name: "火恐龙", model: "models/charmeleon.glb", scale: 0.6, color: 0xFF6347 },
            { id: 6, name: "喷火龙", model: "models/charizard.glb", scale: 0.7, color: 0xFF8C00 },
            { id: 7, name: "杰尼龟", model: "models/squirtle.glb", scale: 0.5, color: 0x1E90FF },
            { id: 8, name: "卡咪龟", model: "models/wartortle.glb", scale: 0.6, color: 0x4169E1 },
            { id: 9, name: "水箭龟", model: "models/blastoise.glb", scale: 0.7, color: 0x000080 },

            // 常见宝可梦 - 移除了没有真实模型的宝可梦
            { id: 10, name: "绿毛虫", model: "models/caterpie.glb", scale: 0.3, color: 0x90EE90 },
            { id: 11, name: "铁甲蛹", model: "models/metapod.glb", scale: 0.3, color: 0x006400 },
            { id: 13, name: "独角虫", model: "models/weedle.glb", scale: 0.3, color: 0x8B4513 },
            { id: 14, name: "铁壳蛹", model: "models/kakuna.glb", scale: 0.3, color: 0xDAA520 },

            // 电系家族
            { id: 25, name: "皮卡丘", model: "models/pikachu.glb", scale: 0.4, color: 0xFFD700 },
            { id: 26, name: "雷丘", model: "models/raichu.glb", scale: 0.5, color: 0xFFA500 },
            
            // 特殊进化链
            { id: 133, name: "伊布", model: "models/eevee.glb", scale: 0.4, color: 0xA0522D },
            { id: 134, name: "水伊布", model: "models/vaporeon.glb", scale: 0.5, color: 0x4169E1 },
            { id: 135, name: "雷伊布", model: "models/jolteon.glb", scale: 0.5, color: 0xFFFF00 },
            { id: 136, name: "火伊布", model: "models/flareon.glb", scale: 0.5, color: 0xFF4500 },

            // 传说中的宝可梦 - 只保留有真实模型的
            { id: 147, name: "迷你龙", model: "models/dratini.glb", scale: 0.4, color: 0x4169E1 },
            { id: 148, name: "哈克龙", model: "models/dragonair.glb", scale: 0.6, color: 0x000080 },
            { id: 150, name: "超梦", model: "models/mewtwo.glb", scale: 0.7, color: 0x800080 },
            { id: 151, name: "梦幻", model: "models/mew.glb", scale: 0.4, color: 0xFFB6C1 },

            // 额外的常见宝可梦 - 只保留有真实模型的
            { id: 39, name: "胖丁", model: "models/jigglypuff.glb", scale: 0.4, color: 0xFFC0CB },
            { id: 40, name: "胖可丁", model: "models/wigglytuff.glb", scale: 0.5, color: 0xFF69B4 },
            { id: 43, name: "走路草", model: "models/oddish.glb", scale: 0.3, color: 0x32CD32 },
            { id: 44, name: "臭臭花", model: "models/gloom.glb", scale: 0.4, color: 0x228B22 },
            { id: 45, name: "霸王花", model: "models/vileplume.glb", scale: 0.5, color: 0x006400 },
            
            // 添加新的可用宝可梦
            { id: 495, name: "藤蛇", model: "models/snivy.glb", scale: 0.5, color: 0x32CD32 },
            { id: 587, name: "电飞鼠", model: "models/emolga.glb", scale: 0.4, color: 0xFFD700 },
            { id: 674, name: "顽皮熊猫", model: "models/pancham.glb", scale: 0.4, color: 0x808080 },
            { id: 696, name: "宝宝暴龙", model: "models/tyrunt.glb", scale: 0.6, color: 0xA52A2A }
        ];
        
        this.spawnInterval = 1000; // 将生成间隔从3秒减少到1秒
        this.lastSpawnTime = Date.now();
        this.spawnBatchSize = 3; // 每次刷新生成3只宝可梦
        this.debugMode = true; // 添加调试模式
        
        this.loadPokemons();
        
        // 添加调试信息
        console.log("宝可梦管理器初始化完成");
    }
    
    loadPokemons() {
        // 加载所有宝可梦模型但不立即添加到场景
        if (!THREE.GLTFLoader) {
            console.error("GLTFLoader未定义，请确保已正确加载THREE.js库");
            return;
        }
        
        this.loader = new THREE.GLTFLoader();
        
        let loadedCount = 0;
        const totalModels = this.pokemonData.length;
        
        this.pokemonData.forEach(data => {
            console.log(`开始加载宝可梦模型: ${data.name} (${data.model})`);
            
            // 尝试加载GLTF模型
            this.loader.load(
                data.model, 
                (gltf) => {
                    console.log(`成功加载宝可梦模型: ${data.name}`);
                    
                    const pokemon = new Pokemon(
                        data.id,
                        data.name,
                        gltf.scene,
                        data.scale,
                        this.scene,
                        false,
                        data.color
                    );
                    
                    this.pokemons.push(pokemon);
                    loadedCount++;
                    this.checkAndSpawnInitialPokemons(loadedCount, totalModels);
                },
                (xhr) => {
                    console.log(`${data.name} 加载进度: ${Math.round(xhr.loaded / xhr.total * 100)}%`);
                },
                (error) => {
                    console.error(`加载宝可梦模型失败 ${data.name}:`, error);
                    console.log(`为 ${data.name} 创建备用模型`);
                    
                    // 创建一个备用模型 - 彩色立方体
                    const pokemon = new Pokemon(
                        data.id,
                        data.name,
                        this.createFallbackModel(data.color),
                        data.scale,
                        this.scene,
                        true,
                        data.color
                    );
                    
                    this.pokemons.push(pokemon);
                    loadedCount++;
                    this.checkAndSpawnInitialPokemons(loadedCount, totalModels);
                }
            );
        });
    }
    
    // 辅助方法：检查是否应该生成初始宝可梦
    checkAndSpawnInitialPokemons(loadedCount, totalModels) {
        // 当加载了足够多的宝可梦时，开始生成多个宝可梦
        if (loadedCount >= 15 && this.activePokemons.length < this.maxActivePokemons) {
            // 生成初始的宝可梦群
            this.fillPokemonPool();
        }
        
        // 当所有模型加载完成后，确保有足够的活跃宝可梦
        if (loadedCount === totalModels) {
            console.log("所有宝可梦加载完成，确保有足够的活跃宝可梦");
            this.fillPokemonPool();
        }
    }
    
    // 填充宝可梦池，直到达到最大数量
    fillPokemonPool() {
        const missingCount = this.maxActivePokemons - this.activePokemons.length;
        
        console.log(`需要生成 ${missingCount} 只宝可梦来填充池`);
        
        // 分批生成宝可梦，每批最多生成spawnBatchSize只
        for (let i = 0; i < missingCount; i++) {
            if (this.pokemons.length > 0) {
                this.spawnRandomPokemon();
            }
        }
    }
    
    // 创建备用模型
    createFallbackModel(color) {
        const group = new THREE.Group();
        
        // 创建一个随机形状 - 有50%几率是立方体，50%几率是球体
        let mainGeometry;
        if (Math.random() > 0.5) {
            // 创建一个立方体作为主体
            mainGeometry = new THREE.BoxGeometry(1, 1, 1);
        } else {
            // 创建一个球体作为主体
            mainGeometry = new THREE.SphereGeometry(0.6, 16, 16);
        }
        
        const mainMaterial = new THREE.MeshStandardMaterial({ color: color });
        const mainMesh = new THREE.Mesh(mainGeometry, mainMaterial);
        mainMesh.position.y = 0.5;
        mainMesh.castShadow = true;
        mainMesh.receiveShadow = true;
        group.add(mainMesh);
        
        // 添加眼睛
        const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(0.25, 0.7, 0.5);
        group.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(-0.25, 0.7, 0.5);
        group.add(rightEye);
        
        return group;
    }
    
    update() {
        // 检查是否需要生成新的宝可梦
        const currentTime = Date.now();
        
        // 强制保持活跃宝可梦数量
        if (this.activePokemons.length < this.maxActivePokemons / 2) {
            const neededPokemons = Math.min(this.spawnBatchSize * 2, this.maxActivePokemons - this.activePokemons.length);
            if (this.debugMode) console.log(`活跃宝可梦数量过少 (${this.activePokemons.length})，强制生成 ${neededPokemons} 只宝可梦`);
            
            // 获取玩家位置
            const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
            let playerPosition = new THREE.Vector3(0, 0, 0);
            if (camera) {
                playerPosition = camera.position.clone();
            }
            
            // 强制批量生成
            for (let i = 0; i < neededPokemons; i++) {
                this.spawnPokemonForced(playerPosition);
            }
            
            this.lastSpawnTime = currentTime;
        }
        // 正常的定时生成
        else if (currentTime - this.lastSpawnTime > this.spawnInterval && this.activePokemons.length < this.maxActivePokemons) {
            // 批量生成多只宝可梦
            const spawnCount = Math.min(this.spawnBatchSize, this.maxActivePokemons - this.activePokemons.length);
            if (this.debugMode) console.log(`定时生成 ${spawnCount} 只宝可梦，当前活跃: ${this.activePokemons.length}/${this.maxActivePokemons}`);
            
            // 获取玩家位置
            const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
            let playerPosition = new THREE.Vector3(0, 0, 0);
            if (camera) {
                playerPosition = camera.position.clone();
            }
            
            for (let i = 0; i < spawnCount; i++) {
                this.spawnPokemonForced(playerPosition);
            }
            this.lastSpawnTime = currentTime;
        }
        
        // 获取玩家位置
        const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
        let playerPosition = new THREE.Vector3(0, 0, 0);
        if (camera) {
            playerPosition = camera.position.clone();
        }
        
        // 创建一个包含需要移除的宝可梦的数组
        const pokemonsToRemove = [];
        
        // 检查宝可梦距离
        for (let i = 0; i < this.activePokemons.length; i++) {
            const pokemon = this.activePokemons[i];
            pokemon.update();
            
            // 检查宝可梦是否距离玩家太远
            if (pokemon.isVisible && pokemon.model.position.distanceTo(playerPosition) > 30) {
                pokemonsToRemove.push(pokemon);
            }
        }
        
        // 移除远离玩家的宝可梦并在玩家周围重新生成
        for (let pokemon of pokemonsToRemove) {
            const index = this.activePokemons.indexOf(pokemon);
            if (index !== -1) {
                pokemon.despawn();
                this.activePokemons.splice(index, 1);
                
                console.log(`移除宝可梦: ${pokemon.name} (远离玩家)`);
                
                // 获取玩家位置
                const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
                let playerPosition = new THREE.Vector3(0, 0, 0);
                if (camera) {
                    playerPosition = camera.position.clone();
                }
                
                // 立即在玩家周围重新生成一个新的宝可梦
                this.spawnNearPlayer(playerPosition);
            }
        }
    }
    
    // 在玩家附近生成宝可梦的新方法
    spawnNearPlayer(playerPosition) {
        if (this.pokemons.length === 0) return;
        
        // 随机选择一个宝可梦
        const randomIndex = Math.floor(Math.random() * this.pokemons.length);
        const pokemon = this.pokemons[randomIndex];
        
        // 确保宝可梦当前不是活跃状态
        if (this.activePokemons.includes(pokemon)) {
            // 尝试最多5次找到未激活的宝可梦
            let attempts = 0;
            let foundPokemon = false;
            
            while (attempts < 5 && !foundPokemon) {
                const newIndex = Math.floor(Math.random() * this.pokemons.length);
                const candidate = this.pokemons[newIndex];
                
                if (!this.activePokemons.includes(candidate)) {
                    // 在玩家前方生成宝可梦
                    this.spawnPokemonAtPosition(candidate, playerPosition);
                    foundPokemon = true;
                }
                
                attempts++;
            }
            
            // 如果5次尝试都没找到可用的宝可梦，跳过这次生成
            if (!foundPokemon) {
                console.log("无法找到未激活的宝可梦，跳过生成");
            }
            
            return;
        }
        
        // 在玩家前方生成宝可梦
        this.spawnPokemonAtPosition(pokemon, playerPosition);
    }
    
    // 在指定位置生成特定宝可梦
    spawnPokemonAtPosition(pokemon, playerPosition) {
        // 计算玩家前方的位置
        // 获取玩家的朝向（如果相机有朝向）
        let angle;
        const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
        if (camera && camera.rotation) {
            // 使用相机的Y轴旋转作为玩家的朝向
            angle = camera.rotation.y + (Math.random() - 0.5) * Math.PI * 0.5; // 前方120度扇形范围
        } else {
            angle = Math.random() * Math.PI * 2; // 如果无法获取朝向，使用随机角度
        }
        
        // 计算生成距离 - 减小距离以确保在可视范围内
        const minDistance = 5;  // 从10减少到5，确保更近
        const maxDistance = 15; // 从25减少到15，确保更近
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        
        // 计算位置
        const x = playerPosition.x + Math.cos(angle) * distance;
        const z = playerPosition.z + Math.sin(angle) * distance;
        
        // 获取地形高度（如果有地形系统）或使用固定的Y高度
        let y = 0.5; // 默认高度稍微增加，避免陷入地面
        
        if (this.debugMode) {
            // 使用彩色标记显示宝可梦位置（调试模式）
            const markerGeometry = new THREE.SphereGeometry(0.5, 8, 8);
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000, transparent: true, opacity: 0.7 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
            marker.position.set(x, y + 2, z); // 位置标记放在宝可梦上方
            this.scene.add(marker);
            
            // 5秒后移除标记
            setTimeout(() => {
                this.scene.remove(marker);
            }, 5000);
        }
        
        // 生成宝可梦
        pokemon.spawn(x, y, z);
        this.activePokemons.push(pokemon);
        
        console.log(`在玩家前方生成宝可梦: ${pokemon.name} 在位置 (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);
        console.log(`当前活跃宝可梦数量: ${this.activePokemons.length}`);
    }
    
    // 强制生成宝可梦的方法 - 始终确保能找到一只可用的宝可梦
    spawnPokemonForced(playerPosition) {
        if (this.pokemons.length === 0) {
            if (this.debugMode) console.log("宝可梦池为空，无法生成");
            return;
        }
        
        // 创建一个可用宝可梦候选列表（未激活的宝可梦）
        const availablePokemon = this.pokemons.filter(p => !this.activePokemons.includes(p));
        
        if (availablePokemon.length === 0) {
            if (this.debugMode) console.log("所有宝可梦都已激活，无法生成新的宝可梦");
            return;
        }
        
        // 从可用列表中随机选择一个
        const randomIndex = Math.floor(Math.random() * availablePokemon.length);
        const pokemon = availablePokemon[randomIndex];
        
        // 在玩家前方生成宝可梦
        this.spawnPokemonAtPosition(pokemon, playerPosition);
    }
    
    spawnRandomPokemon() {
        // 使用更可靠的强制生成方法
        const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
        let playerPosition = new THREE.Vector3(0, 0, 0);
        if (camera) {
            playerPosition = camera.position.clone();
        }
        
        this.spawnPokemonForced(playerPosition);
    }
    
    // 获取所有活跃宝可梦
    getActivePokemons() {
        return this.activePokemons;
    }
    
    // 获取特定位置的宝可梦（用于检测碰撞）
    getPokemonAtPosition(position, maxDistance = 2) {
        for (let pokemon of this.activePokemons) {
            if (pokemon.isVisible) {
                const distance = position.distanceTo(pokemon.model.position);
                if (distance < maxDistance) {
                    return pokemon;
                }
            }
        }
        return null;
    }
    
    removePokemon(pokemon) {
        const index = this.activePokemons.indexOf(pokemon);
        if (index !== -1) {
            pokemon.despawn();
            this.activePokemons.splice(index, 1);
            
            console.log(`移除宝可梦: ${pokemon.name}`);
            console.log(`剩余活跃宝可梦数量: ${this.activePokemons.length}`);
            
            // 获取玩家位置
            const camera = this.scene.getObjectByProperty('type', 'PerspectiveCamera');
            let playerPosition = new THREE.Vector3(0, 0, 0);
            if (camera) {
                playerPosition = camera.position.clone();
            }
            
            // 立即在玩家周围重新生成一个新的宝可梦
            this.spawnNearPlayer(playerPosition);
        }
    }
}

// 单个宝可梦类
class Pokemon {
    constructor(id, name, model, scale, scene, isFallback = false, color = 0xFFFFFF) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.scale = scale;
        this.scene = scene;
        this.isFallback = isFallback;
        this.color = color;
        
        this.health = 100;
        this.isVisible = false;
        this.movement = {
            direction: new THREE.Vector3(),
            velocity: 0.02,
            changeDirectionTime: 0
        };
        
        this.setupModel();
    }
    
    setupModel() {
        // 设置模型
        this.model.scale.set(this.scale, this.scale, this.scale);
        
        // 为模型设置阴影
        this.model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        
        // 将模型从场景中移除，直到需要时再添加
        if (this.model.parent) {
            this.model.parent.remove(this.model);
        }
    }
    
    spawn(x, y, z) {
        // 设置位置 - 现在接受Y坐标参数
        this.model.position.set(x, y, z);
        
        // 添加到场景
        this.scene.add(this.model);
        this.isVisible = true;
        this.health = 100;
        
        // 设置随机移动方向
        this.setRandomDirection();
    }
    
    despawn() {
        this.scene.remove(this.model);
        this.isVisible = false;
    }
    
    update() {
        if (!this.isVisible) return;
        
        // 随机更改方向
        if (Date.now() > this.movement.changeDirectionTime) {
            this.setRandomDirection();
        }
        
        // 移动宝可梦
        this.model.position.add(
            this.movement.direction.clone().multiplyScalar(this.movement.velocity)
        );
        
        // 让宝可梦面向移动方向
        if (this.movement.direction.length() > 0) {
            const angle = Math.atan2(this.movement.direction.x, this.movement.direction.z);
            this.model.rotation.y = angle;
        }
    }
    
    setRandomDirection(avoidBoundary = false) {
        if (avoidBoundary) {
            // 如果接近边界，朝向中心移动
            const toCenter = new THREE.Vector3()
                .subVectors(new THREE.Vector3(0, 0, 0), this.model.position)
                .normalize();
            
            // 添加一些随机性
            toCenter.x += (Math.random() - 0.5) * 0.5;
            toCenter.z += (Math.random() - 0.5) * 0.5;
            toCenter.normalize();
            
            this.movement.direction = toCenter;
        } else {
            // 完全随机方向
            const angle = Math.random() * Math.PI * 2;
            this.movement.direction.set(Math.sin(angle), 0, Math.cos(angle));
        }
        
        // 随机移动速度
        this.movement.velocity = 0.01 + Math.random() * 0.03;
        
        // 设置下一次改变方向的时间（2-5秒）
        this.movement.changeDirectionTime = Date.now() + 2000 + Math.random() * 3000;
    }
    
    damage(amount) {
        this.health = Math.max(0, this.health - amount);
        console.log(`${this.name} 受到伤害! 剩余生命: ${this.health}`);
        
        // 如果生命值为0，宝可梦会逃跑
        if (this.health <= 0) {
            console.log(`${this.name} 逃跑了!`);
            this.despawn();
            return true;
        }
        return false;
    }
    
    getInfo() {
        return {
            id: this.id,
            name: this.name,
            health: this.health,
            image: `textures/pokemon/${this.id}.png`
        };
    }
} 