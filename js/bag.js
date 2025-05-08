// 背包类
class Bag {
    constructor() {
        this.capturedPokemons = [];
        this.pokemonListElement = document.getElementById('pokemon-list');
        this.initialized = false;
    }
    
    addPokemon(pokemon) {
        // 获取宝可梦信息
        const pokemonInfo = pokemon.getInfo();
        
        // 检查是否已捕获
        const exists = this.capturedPokemons.find(p => p.id === pokemonInfo.id);
        if (!exists) {
            this.capturedPokemons.push(pokemonInfo);
            
            // 按ID排序
            this.capturedPokemons.sort((a, b) => a.id - b.id);
            
            // 如果背包是打开的，立即更新显示
            if (!document.getElementById('bag').classList.contains('hidden')) {
                this.displayPokemon();
            }
        }
    }
    
    displayPokemon() {
        // 清空列表
        this.pokemonListElement.innerHTML = '';
        
        // 如果背包是隐藏的，不显示内容
        if (document.getElementById('bag').classList.contains('hidden')) {
            return;
        }

        // 标记为已初始化
        this.initialized = true;
        
        // 显示空背包信息或宝可梦列表
        if (this.capturedPokemons.length === 0) {
            this.pokemonListElement.innerHTML = '<div class="empty-bag">还没有捕获任何宝可梦！</div>';
            return;
        }
        
        // 为每个捕获的宝可梦创建一个元素
        this.capturedPokemons.forEach(pokemon => {
            const pokemonElement = document.createElement('div');
            pokemonElement.className = 'pokemon-item';
            
            // 创建宝可梦图像
            const imgElement = document.createElement('img');
            imgElement.src = pokemon.image;
            imgElement.alt = pokemon.name;
            imgElement.onerror = () => {
                // 如果图像加载失败，使用默认图像
                imgElement.src = 'textures/pokemon/unknown.png';
            };
            
            // 创建宝可梦名称
            const nameElement = document.createElement('div');
            nameElement.className = 'pokemon-name';
            nameElement.textContent = `#${pokemon.id} ${pokemon.name}`;
            
            // 将元素添加到宝可梦项目
            pokemonElement.appendChild(imgElement);
            pokemonElement.appendChild(nameElement);
            
            // 添加点击事件以查看详情
            pokemonElement.addEventListener('click', () => {
                this.showPokemonDetails(pokemon);
            });
            
            // 将宝可梦项目添加到列表
            this.pokemonListElement.appendChild(pokemonElement);
        });
    }
    
    showPokemonDetails(pokemon) {
        // 创建一个模态对话框而不是使用alert
        const modal = document.createElement('div');
        modal.className = 'pokemon-modal';
        modal.id = 'pokemon-detail-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'pokemon-modal-content';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'modal-close-button';
        closeButton.textContent = '×';
        closeButton.onclick = (event) => {
            // 阻止事件冒泡，确保点击关闭按钮时不会触发其他事件
            event.stopPropagation();
            
            // 从DOM中移除模态框
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            console.log("详情弹窗已关闭");
        };
        
        const pokemonImage = document.createElement('img');
        pokemonImage.src = pokemon.image;
        pokemonImage.alt = pokemon.name;
        pokemonImage.onerror = () => {
            pokemonImage.src = 'textures/pokemon/unknown.png';
        };
        
        const pokemonDetails = document.createElement('div');
        pokemonDetails.className = 'pokemon-details';
        pokemonDetails.innerHTML = `
            <h3>#${pokemon.id} ${pokemon.name}</h3>
            <p>您已成功捕获此宝可梦！</p>
        `;
        
        modalContent.appendChild(closeButton);
        modalContent.appendChild(pokemonImage);
        modalContent.appendChild(pokemonDetails);
        modal.appendChild(modalContent);
        
        // 点击模态框背景也可以关闭
        modal.addEventListener('click', (event) => {
            // 当点击的是模态框背景而不是内容区域时关闭
            if (event.target === modal) {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                console.log("点击背景关闭详情弹窗");
            }
        });
        
        document.body.appendChild(modal);
    }
    
    getCount() {
        return this.capturedPokemons.length;
    }
} 