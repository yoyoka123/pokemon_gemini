// 模型加载和管理工具
class ModelLoader {
    constructor() {
        this.loader = new THREE.GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.loadedModels = {};
        this.loadedTextures = {};
    }
    
    // 加载GLTF模型
    loadModel(path, callback) {
        // 检查是否已经加载过这个模型
        if (this.loadedModels[path]) {
            callback(this.loadedModels[path].clone());
            return;
        }
        
        this.loader.load(
            path,
            (gltf) => {
                // 成功加载模型
                this.loadedModels[path] = gltf.scene;
                callback(gltf.scene.clone());
            },
            (xhr) => {
                // 加载进度
                console.log(`${path} ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                // 加载错误
                console.error(`Error loading model ${path}:`, error);
                callback(null);
            }
        );
    }
    
    // 加载纹理
    loadTexture(path, callback) {
        // 检查是否已经加载过这个纹理
        if (this.loadedTextures[path]) {
            callback(this.loadedTextures[path]);
            return;
        }
        
        this.textureLoader.load(
            path,
            (texture) => {
                // 成功加载纹理
                this.loadedTextures[path] = texture;
                callback(texture);
            },
            (xhr) => {
                // 加载进度
                console.log(`${path} ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                // 加载错误
                console.error(`Error loading texture ${path}:`, error);
                callback(null);
            }
        );
    }
    
    // 预加载一组模型
    preloadModels(paths, onComplete) {
        let loadedCount = 0;
        const totalCount = paths.length;
        
        paths.forEach(path => {
            this.loadModel(path, () => {
                loadedCount++;
                if (loadedCount === totalCount && onComplete) {
                    onComplete();
                }
            });
        });
    }
    
    // 预加载一组纹理
    preloadTextures(paths, onComplete) {
        let loadedCount = 0;
        const totalCount = paths.length;
        
        paths.forEach(path => {
            this.loadTexture(path, () => {
                loadedCount++;
                if (loadedCount === totalCount && onComplete) {
                    onComplete();
                }
            });
        });
    }
    
    // 创建一个简单的加载屏幕
    createLoadingScreen(container, resourceCount) {
        const loadingScreen = document.createElement('div');
        loadingScreen.style.position = 'absolute';
        loadingScreen.style.width = '100%';
        loadingScreen.style.height = '100%';
        loadingScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.flexDirection = 'column';
        loadingScreen.style.justifyContent = 'center';
        loadingScreen.style.alignItems = 'center';
        loadingScreen.style.zIndex = '1000';
        
        const loadingText = document.createElement('h2');
        loadingText.textContent = '正在加载游戏资源...';
        loadingText.style.color = 'white';
        loadingText.style.marginBottom = '20px';
        
        const progressContainer = document.createElement('div');
        progressContainer.style.width = '80%';
        progressContainer.style.maxWidth = '400px';
        progressContainer.style.height = '20px';
        progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        progressContainer.style.borderRadius = '10px';
        
        const progressBar = document.createElement('div');
        progressBar.style.width = '0%';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#3a6ba5';
        progressBar.style.borderRadius = '10px';
        progressBar.style.transition = 'width 0.3s ease';
        
        progressContainer.appendChild(progressBar);
        loadingScreen.appendChild(loadingText);
        loadingScreen.appendChild(progressContainer);
        container.appendChild(loadingScreen);
        
        let loadedResources = 0;
        
        return {
            updateProgress: () => {
                loadedResources++;
                const progress = (loadedResources / resourceCount) * 100;
                progressBar.style.width = `${progress}%`;
            },
            complete: () => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    container.removeChild(loadingScreen);
                }, 500);
            }
        };
    }
} 