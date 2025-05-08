// 游戏世界类
class World {
    constructor(scene) {
        this.scene = scene;
        
        // 地图块设置
        this.chunkSize = 100; // 每个地图块的大小
        this.renderDistance = 2; // 玩家周围渲染的地图块距离
        this.chunks = new Map(); // 存储已加载的地图块
        this.chunkObjects = new Map(); // 存储每个地图块中的对象
        
        // 移除边界墙
        // this.createBoundaries();
    }

    // 根据玩家位置更新地图块
    updateChunks(playerPosition) {
        // 计算玩家所在的地图块坐标
        const playerChunkX = Math.floor(playerPosition.x / this.chunkSize);
        const playerChunkZ = Math.floor(playerPosition.z / this.chunkSize);
        
        // 需要加载的地图块范围
        const minX = playerChunkX - this.renderDistance;
        const maxX = playerChunkX + this.renderDistance;
        const minZ = playerChunkZ - this.renderDistance;
        const maxZ = playerChunkZ + this.renderDistance;
        
        // 记录需要保留的地图块
        const chunksToKeep = new Set();
        
        // 加载新的地图块
        for (let x = minX; x <= maxX; x++) {
            for (let z = minZ; z <= maxZ; z++) {
                const chunkKey = `${x},${z}`;
                chunksToKeep.add(chunkKey);
                
                // 如果地图块未加载，则创建新的地图块
                if (!this.chunks.has(chunkKey)) {
                    this.createChunk(x, z);
                }
            }
        }
        
        // 卸载不需要的地图块
        for (const chunkKey of this.chunks.keys()) {
            if (!chunksToKeep.has(chunkKey)) {
                this.unloadChunk(chunkKey);
            }
        }
    }
    
    // 创建新的地图块
    createChunk(x, z) {
        const chunkKey = `${x},${z}`;
        console.log(`创建地图块: ${chunkKey}`);
        
        // 创建地面
        const chunkX = x * this.chunkSize;
        const chunkZ = z * this.chunkSize;
        
        // 创建地面
        const groundGeometry = new THREE.PlaneGeometry(this.chunkSize, this.chunkSize);
        const groundTexture = new THREE.TextureLoader().load('textures/grass.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(chunkX + this.chunkSize/2, 0, chunkZ + this.chunkSize/2);
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // 存储地图块的对象
        const chunkObjects = {
            ground: ground,
            trees: [],
            rocks: []
        };
        
        // 添加树木
        const treeCount = 5 + Math.floor(Math.random() * 5); // 每个区块5-10棵树
        for (let i = 0; i < treeCount; i++) {
            // 在地图块内随机位置
            const treeX = chunkX + Math.random() * this.chunkSize;
            const treeZ = chunkZ + Math.random() * this.chunkSize;
            
            const tree = this.createSimpleTree();
            tree.position.set(treeX, 0, treeZ);
            this.scene.add(tree);
            chunkObjects.trees.push(tree);
        }
        
        // 添加岩石
        const rockCount = 3 + Math.floor(Math.random() * 4); // 每个区块3-7块岩石
        for (let i = 0; i < rockCount; i++) {
            // 在地图块内随机位置
            const rockX = chunkX + Math.random() * this.chunkSize;
            const rockZ = chunkZ + Math.random() * this.chunkSize;
            
            const rock = this.createSimpleRock();
            rock.position.set(rockX, 0, rockZ);
            this.scene.add(rock);
            chunkObjects.rocks.push(rock);
        }
        
        // 存储地图块
        this.chunks.set(chunkKey, { x, z });
        this.chunkObjects.set(chunkKey, chunkObjects);
        
        return chunkObjects;
    }
    
    // 卸载地图块
    unloadChunk(chunkKey) {
        console.log(`卸载地图块: ${chunkKey}`);
        
        if (this.chunkObjects.has(chunkKey)) {
            const chunkObjects = this.chunkObjects.get(chunkKey);
            
            // 移除地面
            if (chunkObjects.ground) {
                this.scene.remove(chunkObjects.ground);
                chunkObjects.ground.geometry.dispose();
                chunkObjects.ground.material.dispose();
            }
            
            // 移除树木
            chunkObjects.trees.forEach(tree => {
                this.scene.remove(tree);
                this.disposeObject(tree);
            });
            
            // 移除岩石
            chunkObjects.rocks.forEach(rock => {
                this.scene.remove(rock);
                this.disposeObject(rock);
            });
            
            // 从地图块列表中移除
            this.chunks.delete(chunkKey);
            this.chunkObjects.delete(chunkKey);
        }
    }
    
    // 释放对象及其子对象的资源
    disposeObject(object) {
        if (!object) return;
        
        if (object.children && object.children.length > 0) {
            // 复制子对象数组以避免遍历时修改原数组
            const children = [...object.children];
            for (const child of children) {
                this.disposeObject(child);
            }
        }
        
        if (object.geometry) object.geometry.dispose();
        
        if (object.material) {
            if (Array.isArray(object.material)) {
                for (const material of object.material) {
                    this.disposeMaterial(material);
                }
            } else {
                this.disposeMaterial(object.material);
            }
        }
    }
    
    // 释放材质资源
    disposeMaterial(material) {
        if (!material) return;
        
        if (material.map) material.map.dispose();
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        
        material.dispose();
    }
    
    // 保留天空盒创建方法
    createTerrain() {
        // 添加天空盒
        const skyboxGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
        const skyboxMaterials = [];
        
        const skyboxTextures = [
            'textures/skybox/px.jpg', // right
            'textures/skybox/nx.jpg', // left
            'textures/skybox/py.jpg', // top
            'textures/skybox/ny.jpg', // bottom
            'textures/skybox/pz.jpg', // front
            'textures/skybox/nz.jpg'  // back
        ];
        
        for (let i = 0; i < 6; i++) {
            skyboxMaterials.push(new THREE.MeshBasicMaterial({
                map: new THREE.TextureLoader().load(skyboxTextures[i]),
                side: THREE.BackSide
            }));
        }
        
        const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterials);
        this.scene.add(skybox);
    }

    // 保留创建树木的方法，但改为返回树木对象而不是直接添加到场景
    createSimpleTree() {
        const tree = new THREE.Group();
        
        // 树干
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.9,
            metalness: 0.1
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);
        
        // 树叶 (圆锥形)
        const leavesGeometry = new THREE.ConeGeometry(2.5, 6, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({
            color: 0x228B22,
            roughness: 1.0,
            metalness: 0.0
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 6.5;
        leaves.castShadow = true;
        leaves.receiveShadow = true;
        tree.add(leaves);
        
        // 随机旋转
        tree.rotation.y = Math.random() * Math.PI * 2;
        
        return tree;
    }
    
    createSimpleRock() {
        const rock = new THREE.Group();
        
        // 创建不规则的岩石
        const rockGeometry = new THREE.DodecahedronGeometry(1 + Math.random() * 0.5, 0);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080, // 灰色
            roughness: 0.9,
            metalness: 0.2
        });
        
        const mainRock = new THREE.Mesh(rockGeometry, rockMaterial);
        mainRock.scale.set(1, 0.7 + Math.random() * 0.6, 1);
        mainRock.position.y = 0.5;
        mainRock.castShadow = true;
        mainRock.receiveShadow = true;
        rock.add(mainRock);
        
        // 随机添加1-3个小石头
        const smallRocksCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < smallRocksCount; i++) {
            const smallRockGeometry = new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.3, 0);
            const smallRock = new THREE.Mesh(smallRockGeometry, rockMaterial);
            
            // 随机位置在主岩石周围
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.8 + Math.random() * 0.4;
            smallRock.position.x = Math.cos(angle) * distance;
            smallRock.position.z = Math.sin(angle) * distance;
            smallRock.position.y = 0.2;
            
            // 随机缩放和旋转
            smallRock.scale.set(
                0.6 + Math.random() * 0.4,
                0.4 + Math.random() * 0.3,
                0.6 + Math.random() * 0.4
            );
            smallRock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            smallRock.castShadow = true;
            smallRock.receiveShadow = true;
            rock.add(smallRock);
        }
        
        // 随机旋转整个岩石组
        rock.rotation.y = Math.random() * Math.PI * 2;
        
        return rock;
    }
} 