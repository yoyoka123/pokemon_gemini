// 玩家类
class Player {
    constructor(camera, controls, scene) {
        this.camera = camera;
        this.controls = controls;
        this.scene = scene;
        
        this.moveSpeed = 0.15;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.rotation = new THREE.Vector3();
        
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = false;
        
        this.attackCooldown = 0;
        this.pokeballCooldown = 0;
        
        this.setupKeyControls();
        this.setupRaycaster();
    }
    
    setupKeyControls() {
        document.addEventListener('keydown', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'Space':
                    if (this.canJump) {
                        this.velocity.y = 2.0;
                        this.canJump = false;
                    }
                    break;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'KeyD':
                    this.moveRight = false;
                    break;
            }
        });
    }
    
    setupRaycaster() {
        this.raycaster = new THREE.Raycaster(
            new THREE.Vector3(), 
            new THREE.Vector3(0, -1, 0), 
            0, 
            10
        );
    }
    
    update() {
        if (!this.controls.isLocked) return;
        
        // 获取摄像机的方向向量
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        
        // 计算前进方向（摄像机的水平方向）
        const forward = new THREE.Vector3(cameraDirection.x, 0, cameraDirection.z).normalize();
        
        // 计算右方向（前进方向的垂直向量）
        const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
        
        // 重置速度
        this.velocity.x = 0;
        this.velocity.z = 0;

        // 根据按键状态计算移动方向
        if (this.moveForward) {
            this.velocity.add(forward.multiplyScalar(this.moveSpeed));
        }
        if (this.moveBackward) {
            this.velocity.add(forward.multiplyScalar(-this.moveSpeed));
        }
        if (this.moveRight) {
            this.velocity.add(right.multiplyScalar(this.moveSpeed));
        }
        if (this.moveLeft) {
            this.velocity.add(right.multiplyScalar(-this.moveSpeed));
        }

        // 应用重力
        this.velocity.y -= 0.15;

        // 更新位置
        this.camera.position.add(this.velocity);

        // 地面碰撞检测
        if (this.camera.position.y < 1.6) {
            this.velocity.y = 0;
            this.camera.position.y = 1.6;
            this.canJump = true;
        }

        // 移除边界检查，允许玩家自由移动
        // const boundary = 45;
        // this.camera.position.x = Math.max(-boundary, Math.min(boundary, this.camera.position.x));
        // this.camera.position.z = Math.max(-boundary, Math.min(boundary, this.camera.position.z));
    }
    
    attack() {
        if (this.attackCooldown > 0) return;
        
        // 攻击动画效果（这里简化为控制台输出）
        console.log("Attack!");
        
        // 设置攻击冷却
        this.attackCooldown = 30; // 约0.5秒（假设60fps）
    }
    
    throwPokeball(direction, onCollision) {
        // 创建精灵球几何体和材质
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
            emissive: 0xaa0000,
            metalness: 0.7,
            roughness: 0.3
        });
        
        // 创建上半部分 (红色)
        const topSphere = new THREE.Mesh(geometry, material);
        
        // 创建下半部分 (白色)
        const bottomMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.2
        });
        const bottomSphere = new THREE.Mesh(geometry, bottomMaterial);
        bottomSphere.position.y = -0.01;
        bottomSphere.scale.y = 0.9;
        
        // 创建中间的带子
        const bandGeometry = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16);
        const bandMaterial = new THREE.MeshStandardMaterial({
            color: 0x333333,
            metalness: 0.8,
            roughness: 0.2
        });
        const band = new THREE.Mesh(bandGeometry, bandMaterial);
        band.rotation.x = Math.PI / 2;
        
        // 创建中间的按钮
        const buttonGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16);
        const buttonMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            emissive: 0x999999,
            metalness: 0.8,
            roughness: 0.2
        });
        const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
        button.rotation.x = Math.PI / 2;
        button.position.z = 0.2;
        
        // 组合成精灵球
        const pokeball = new THREE.Group();
        pokeball.add(topSphere);
        pokeball.add(bottomSphere);
        pokeball.add(band);
        pokeball.add(button);
        
        // 设置精灵球的初始位置和方向
        pokeball.position.copy(this.camera.position);
        pokeball.position.y -= 0.5; // 稍微低一点，表示从手中抛出
        
        // 加入到场景中
        this.scene.add(pokeball);
        
        // 设置精灵球的移动方向和速度
        const velocity = direction.clone().multiplyScalar(0.5);
        
        // 添加抛物线效果
        velocity.y += 0.1;
        
        // 保存创建时间
        const creationTime = Date.now();
        const maxLifetime = 5000; // 5秒后消失
        
        // 精灵球的更新逻辑
        const updatePokeball = () => {
            // 计算生命周期
            const lifetime = Date.now() - creationTime;
            
            // 如果超过生命周期，移除精灵球
            if (lifetime > maxLifetime) {
                this.scene.remove(pokeball);
                return;
            }
            
            // 精灵球移动
            pokeball.position.add(velocity);
            
            // 添加重力效果
            velocity.y -= 0.01;
            
            // 添加旋转效果
            pokeball.rotation.x += 0.1;
            pokeball.rotation.z += 0.1;
            
            // 碰撞检测 (可以在这里添加与其他对象的碰撞检测)
            if (onCollision) {
                onCollision(pokeball);
            }
            
            // 如果精灵球落到地面以下，就让它弹起
            if (pokeball.position.y <= 0.2) {
                pokeball.position.y = 0.2;
                velocity.y = Math.abs(velocity.y) * 0.6; // 反弹，但损失一些能量
                
                // 如果反弹力太小，就停止
                if (velocity.y < 0.03) {
                    velocity.y = 0;
                    velocity.x *= 0.95;
                    velocity.z *= 0.95;
                }
            }
            
            // 继续下一帧更新
            requestAnimationFrame(updatePokeball);
        };
        
        // 开始更新
        updatePokeball();
        
        // 返回精灵球对象，以便外部代码可以跟踪它
        return pokeball;
    }
} 