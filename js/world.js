// 游戏世界类
class World {
    constructor(scene) {
        this.scene = scene;
        this.createTerrain();
        this.addTrees();
        this.addRocks();
        this.createBoundaries();
    }

    createTerrain() {
        // 创建地面
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundTexture = new THREE.TextureLoader().load('textures/grass.jpg');
        groundTexture.wrapS = THREE.RepeatWrapping;
        groundTexture.wrapT = THREE.RepeatWrapping;
        groundTexture.repeat.set(25, 25);
        
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.8,
            metalness: 0.2
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = true;
        this.scene.add(this.ground);
        
        // 添加天空盒
        const skyboxGeometry = new THREE.BoxGeometry(500, 500, 500);
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

    addTrees() {
        // 使用GLTF模型加载器加载树模型
        const treeLoader = new THREE.GLTFLoader();
        const treeCount = 10; // 减少树的数量以提高性能
        let loadedTrees = 0;
        
        // 当模型加载失败时使用备用模型
        const fallbackTree = () => {
            console.log("使用备用树模型");
            return this.createSimpleTree();
        };
        
        // 添加树，随机分布
        for (let i = 0; i < treeCount; i++) {
            // 随机位置
            const x = Math.random() * 80 - 40;
            const z = Math.random() * 80 - 40;
            
            treeLoader.load('models/tree.glb', 
                (gltf) => {
                    const tree = gltf.scene;
                    
                    // 缩放模型
                    tree.scale.set(0.5, 0.5, 0.5);
                    tree.position.set(x, 0, z);
                    
                    // 给树木添加阴影
                    tree.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    this.scene.add(tree);
                    loadedTrees++;
                    
                    // 若所有模型都加载失败，则使用备用树
                    if (loadedTrees === treeCount) {
                        console.log("所有树模型加载完成");
                    }
                },
                undefined,
                (error) => {
                    console.error("树模型加载失败", error);
                    // 使用备用树模型
                    const tree = fallbackTree();
                    tree.position.set(x, 0, z);
                    this.scene.add(tree);
                    
                    loadedTrees++;
                }
            );
        }
        
        // 再添加一些备用树，确保场景足够丰富
        for (let i = 0; i < 10; i++) {
            const tree = this.createSimpleTree();
            const x = Math.random() * 80 - 40;
            const z = Math.random() * 80 - 40;
            tree.position.set(x, 0, z);
            this.scene.add(tree);
        }
    }
    
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

    addRocks() {
        // 使用GLTF模型加载器加载岩石模型
        const rockLoader = new THREE.GLTFLoader();
        const rockCount = 8; // 减少岩石数量以提高性能
        let loadedRocks = 0;
        
        // 当模型加载失败时使用备用模型
        const fallbackRock = () => {
            console.log("使用备用岩石模型");
            return this.createSimpleRock();
        };
        
        // 添加岩石，随机分布
        for (let i = 0; i < rockCount; i++) {
            // 随机位置
            const x = Math.random() * 80 - 40;
            const z = Math.random() * 80 - 40;
            
            rockLoader.load('models/rock.glb', 
                (gltf) => {
                    const rock = gltf.scene;
                    
                    // 缩放模型
                    const scale = 0.3 + Math.random() * 0.3;
                    rock.scale.set(scale, scale, scale);
                    rock.position.set(x, 0, z);
                    
                    // 随机旋转
                    rock.rotation.y = Math.random() * Math.PI * 2;
                    
                    // 给岩石添加阴影
                    rock.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    
                    this.scene.add(rock);
                    loadedRocks++;
                    
                    // 若所有模型都加载完成
                    if (loadedRocks === rockCount) {
                        console.log("所有岩石模型加载完成");
                    }
                },
                undefined,
                (error) => {
                    console.error("岩石模型加载失败", error);
                    // 使用备用岩石模型
                    const rock = fallbackRock();
                    rock.position.set(x, 0, z);
                    this.scene.add(rock);
                    
                    loadedRocks++;
                }
            );
        }
        
        // 再添加一些备用岩石，确保场景足够丰富
        for (let i = 0; i < 7; i++) {
            const rock = this.createSimpleRock();
            const x = Math.random() * 80 - 40;
            const z = Math.random() * 80 - 40;
            rock.position.set(x, 0, z);
            this.scene.add(rock);
        }
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

    createBoundaries() {
        // 创建边界防止玩家离开游戏区域
        const wallGeometry = new THREE.BoxGeometry(100, 10, 2);
        const wallMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 1,
            metalness: 0
        });
        
        // 北墙
        const northWall = new THREE.Mesh(wallGeometry, wallMaterial);
        northWall.position.set(0, 5, -50);
        northWall.castShadow = true;
        northWall.receiveShadow = true;
        this.scene.add(northWall);
        
        // 南墙
        const southWall = new THREE.Mesh(wallGeometry, wallMaterial);
        southWall.position.set(0, 5, 50);
        southWall.castShadow = true;
        southWall.receiveShadow = true;
        this.scene.add(southWall);
        
        // 东墙
        const eastWall = new THREE.Mesh(wallGeometry, wallMaterial);
        eastWall.rotation.y = Math.PI / 2;
        eastWall.position.set(50, 5, 0);
        eastWall.castShadow = true;
        eastWall.receiveShadow = true;
        this.scene.add(eastWall);
        
        // 西墙
        const westWall = new THREE.Mesh(wallGeometry, wallMaterial);
        westWall.rotation.y = Math.PI / 2;
        westWall.position.set(-50, 5, 0);
        westWall.castShadow = true;
        westWall.receiveShadow = true;
        this.scene.add(westWall);
    }
} 