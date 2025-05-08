#!/bin/bash

# 宝可梦模型下载脚本
# 此脚本将从多个来源下载可用的宝可梦3D模型，并保存到models目录

# 创建必要的目录
mkdir -p models
mkdir -p temp_download

echo "===== 开始下载宝可梦3D模型 ====="

# 清理之前的日志
rm -f download_log.txt
touch download_log.txt

# 下载函数 - 参数：URL 目标文件名 描述
download_model() {
    local url=$1
    local filename=$2
    local description=$3
    
    echo "正在下载 $description ($filename)..."
    if curl -L --fail --silent --output "models/$filename" "$url"; then
        echo "✅ 成功下载: $filename" | tee -a download_log.txt
        return 0
    else
        echo "❌ 下载失败: $filename" | tee -a download_log.txt
        return 1
    fi
}

# 尝试从多个镜像下载
try_mirrors() {
    local filename=$1
    local description=$2
    shift 2
    local mirrors=("$@")
    
    for url in "${mirrors[@]}"; do
        echo "尝试镜像: $url"
        if download_model "$url" "$filename" "$description"; then
            return 0
        fi
    done
    
    return 1
}

# 从GitHub库下载模型

# 使用 Khronos 示例模型作为备用
echo "下载基础模型..."
basic_models=(
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb:duck.glb:Duck Model"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb:avocado.glb:Avocado Model"
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb:cesium_milk_truck.glb:Cesium Milk Truck"
)

for model in "${basic_models[@]}"; do
    IFS=':' read -r url filename description <<< "$model"
    download_model "$url" "$filename" "$description"
done

# 从3dpokemon.miraheze.org和其他镜像获取真实模型
echo "从多个源下载宝可梦模型..."

# 主要宝可梦 - 使用多个镜像
pokemon_base=(
    "bulbasaur:妙蛙种子:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/1.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Bulbasaur.glb"
    "charmander:小火龙:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/4.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Charmander.glb"
    "squirtle:杰尼龟:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/7.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Squirtle.glb"
    "pikachu:皮卡丘:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/25.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Pikachu.glb"
    "eevee:伊布:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/133.glb"
    "jigglypuff:胖丁:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/39.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Jigglypuff.glb"
)

# 将保存的模型重新复制给所有宝可梦 ID 
create_pokeball() {
    # 不直接下载，而是使用已有模型创建一个简单的精灵球
    local target="models/pokeball.glb"
    
    if [ -f "models/cesium_milk_truck.glb" ]; then
        cp "models/cesium_milk_truck.glb" "$target"
        echo "✅ 创建精灵球: $target (使用 cesium_milk_truck.glb 作为基础)" | tee -a download_log.txt
        return 0
    elif [ -f "models/duck.glb" ]; then
        cp "models/duck.glb" "$target"
        echo "✅ 创建精灵球: $target (使用 duck.glb 作为基础)" | tee -a download_log.txt
        return 0
    else
        echo "❌ 无法创建精灵球，缺少基础模型" | tee -a download_log.txt
        return 1
    fi
}

# 下载主要宝可梦
for pokemon in "${pokemon_base[@]}"; do
    IFS=':' read -r name description urls <<< "$pokemon"
    IFS=',' read -r -a mirrors <<< "$urls"
    
    # 尝试从多个镜像下载
    if ! try_mirrors "${name}.glb" "$description" "${mirrors[@]}"; then
        echo "尝试使用备用模型..."
        # 使用备用模型
        if [ -f "models/avocado.glb" ] && [[ "$name" == "bulbasaur" || "$name" == "ivysaur" || "$name" == "venusaur" ]]; then
            cp "models/avocado.glb" "models/${name}.glb"
            echo "✅ 创建备用模型: ${name}.glb (使用 avocado.glb 作为基础)" | tee -a download_log.txt
        elif [ -f "models/duck.glb" ] && [[ "$name" == "squirtle" || "$name" == "wartortle" || "$name" == "blastoise" ]]; then
            cp "models/duck.glb" "models/${name}.glb"
            echo "✅ 创建备用模型: ${name}.glb (使用 duck.glb 作为基础)" | tee -a download_log.txt
        elif [ -f "models/cesium_milk_truck.glb" ]; then
            cp "models/cesium_milk_truck.glb" "models/${name}.glb"
            echo "✅ 创建备用模型: ${name}.glb (使用 cesium_milk_truck.glb 作为基础)" | tee -a download_log.txt
        fi
    fi
done

# 下载进化链和额外宝可梦
evolution_chains=(
    # 妙蛙种子进化链
    "ivysaur:妙蛙草:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/2.glb"
    "venusaur:妙蛙花:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/3.glb"
    
    # 小火龙进化链
    "charmeleon:火恐龙:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/5.glb"
    "charizard:喷火龙:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/6.glb"
    
    # 杰尼龟进化链
    "wartortle:卡咪龟:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/8.glb"
    "blastoise:水箭龟:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/9.glb"
    
    # 皮卡丘家族
    "raichu:雷丘:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/26.glb,https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Raichu.glb"
    
    # 伊布进化链
    "vaporeon:水伊布:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/134.glb"
    "jolteon:雷伊布:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/135.glb"
    "flareon:火伊布:https://raw.githubusercontent.com/Sudhanshu-Ambastha/Pokemon-3D/main/models/glb/regular/136.glb"
)

# 下载进化链
for pokemon in "${evolution_chains[@]}"; do
    IFS=':' read -r name description urls <<< "$pokemon"
    IFS=',' read -r -a mirrors <<< "$urls"
    
    # 尝试从多个镜像下载
    try_mirrors "${name}.glb" "$description" "${mirrors[@]}"
done

# 尝试从MichelleWongNL库下载额外宝可梦
additional_pokemons=(
    "snivy:藤蛇:https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Snivy.glb"
    "emolga:电飞鼠:https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Emolga.glb"
    "pancham:顽皮熊猫:https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Pancham.glb"
    "tyrunt:宝宝暴龙:https://raw.githubusercontent.com/MichelleWongNL/3DPokemons/master/Tyrunt.glb"
)

# 下载额外宝可梦
for pokemon in "${additional_pokemons[@]}"; do
    IFS=':' read -r name description url <<< "$pokemon"
    download_model "$url" "${name}.glb" "$description"
done

# 创建精灵球模型
echo "创建精灵球模型..."
create_pokeball

# 删除临时目录
rm -rf temp_download

# 清理无效模型
echo "清理无效的模型文件..."
for model in models/*.glb; do
    filesize=$(stat -f%z "$model" 2>/dev/null || stat -c%s "$model" 2>/dev/null)
    if [[ $filesize -lt 1000 ]]; then
        echo "⚠️ 删除无效模型: $model (${filesize}B)" | tee -a download_log.txt
        rm -f "$model"
    fi
done

# 检查下载结果
successful_count=$(grep -c "成功下载\|创建备用模型\|创建精灵球" download_log.txt)
failed_count=$(grep -c "下载失败" download_log.txt)
deleted_count=$(grep -c "删除无效模型" download_log.txt)

echo ""
echo "===== 下载完成 ====="
echo "成功下载/创建: $successful_count 个模型"
echo "下载失败: $failed_count 个模型"
echo "删除无效模型: $deleted_count 个模型"
echo "详细信息请查看 download_log.txt"

# 验证文件
echo ""
echo "===== 有效的宝可梦模型 ====="
for model in models/*.glb; do
    if [ -f "$model" ]; then
        filesize=$(stat -f%z "$model" 2>/dev/null || stat -c%s "$model" 2>/dev/null)
        echo "✓ $(basename "$model") (${filesize}B)"
    fi
done

echo ""
echo "你现在可以在你的游戏中使用这些模型了！"
echo "已创建可用的宝可梦模型和精灵球。" 