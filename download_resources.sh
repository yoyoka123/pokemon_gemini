#!/bin/bash

# 创建目录
mkdir -p models
mkdir -p textures/pokemon

# 定义一些基本模型 - 从Khronos示例库
BASIC_MODELS=(
  "Duck:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb"
  "Avocado:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb"
  "CesiumMilkTruck:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb"
  "BrainStem:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BrainStem/glTF-Binary/BrainStem.glb"
  "Fox:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF-Binary/Fox.glb"
  "Flamingo:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Flamingo/glTF-Binary/Flamingo.glb"
  "BarramundiFish:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BarramundiFish/glTF-Binary/BarramundiFish.glb"
  "Corset:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Corset/glTF-Binary/Corset.glb"
  "Lantern:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb"
  "WaterBottle:https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/WaterBottle/glTF-Binary/WaterBottle.glb"
)

# 下载基本模型
echo "开始下载基本3D模型..."
for model in "${BASIC_MODELS[@]}"; do
  name="${model%%:*}"
  url="${model#*:}"
  echo "下载 $name 模型..."
  curl -s -o "models/${name}.glb" "$url"
  echo "完成: $name"
done

# 创建宝可梦模型链接 - 使用更简单的方式
echo "创建宝可梦模型链接..."

# 草系宝可梦 - 使用Avocado模型
GRASS_POKEMONS=("bulbasaur" "ivysaur" "venusaur" "oddish" "gloom" "vileplume")
for pokemon in "${GRASS_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Avocado.glb"
  cp "models/Avocado.glb" "models/${pokemon}.glb"
done

# 圆形宝可梦 - 使用圆形模型
ROUND_POKEMONS=("jigglypuff" "wigglytuff")
for pokemon in "${ROUND_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Avocado.glb"
  cp "models/Avocado.glb" "models/${pokemon}.glb"
done

# 火系/狐狸型宝可梦 - 使用Fox模型
FOX_POKEMONS=("charmander" "charmeleon" "vulpix" "ninetales" "eevee" "flareon" "jolteon" "vaporeon")
for pokemon in "${FOX_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Fox.glb"
  cp "models/Fox.glb" "models/${pokemon}.glb"
done

# 水系宝可梦 - 使用Duck模型
WATER_POKEMONS=("squirtle" "wartortle" "blastoise")
for pokemon in "${WATER_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Duck.glb"
  cp "models/Duck.glb" "models/${pokemon}.glb"
done

# 鱼类宝可梦 - 使用BarramundiFish模型
FISH_POKEMONS=("dratini" "dragonair")
for pokemon in "${FISH_POKEMONS[@]}"; do
  echo "链接 $pokemon -> BarramundiFish.glb"
  cp "models/BarramundiFish.glb" "models/${pokemon}.glb"
done

# 飞行系宝可梦 - 使用Flamingo模型
FLYING_POKEMONS=("charizard" "butterfree" "beedrill" "pidgey" "pidgeotto" "pidgeot" "zubat" "golbat" "articuno" "zapdos" "moltres" "dragonite")
for pokemon in "${FLYING_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Flamingo.glb"
  cp "models/Flamingo.glb" "models/${pokemon}.glb"
done

# 虫系宝可梦 - 使用Corset模型
BUG_POKEMONS=("caterpie" "metapod" "weedle" "kakuna")
for pokemon in "${BUG_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Corset.glb"
  cp "models/Corset.glb" "models/${pokemon}.glb"
done

# 超能力宝可梦 - 使用BrainStem模型
PSYCHIC_POKEMONS=("mewtwo" "mew" "clefairy" "clefable")
for pokemon in "${PSYCHIC_POKEMONS[@]}"; do
  echo "链接 $pokemon -> BrainStem.glb"
  cp "models/BrainStem.glb" "models/${pokemon}.glb"
done

# 鼠类/地面系宝可梦 - 使用小型动物模型
GROUND_POKEMONS=("sandshrew" "sandslash" "rattata" "raticate" "pikachu" "raichu")
for pokemon in "${GROUND_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Fox.glb" # 使用Fox作为小型动物
  cp "models/Fox.glb" "models/${pokemon}.glb"
done

# 尼多兰家族 - 使用Fox模型
NIDO_POKEMONS=("nidoran-f" "nidorina" "nidoqueen" "nidoran-m" "nidorino" "nidoking")
for pokemon in "${NIDO_POKEMONS[@]}"; do
  echo "链接 $pokemon -> Fox.glb"
  cp "models/Fox.glb" "models/${pokemon}.glb"
done

# 从Pokemon API下载宝可梦图片
echo "开始下载宝可梦图片..."
POKEMON_IDS=(1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 133 134 135 136 144 145 146 147 148 149 150 151)

for id in "${POKEMON_IDS[@]}"; do
  echo "下载宝可梦图片 #$id..."
  curl -s -o "textures/pokemon/${id}.png" "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"
  # 备用链接，以防上面的不可用
  if [ ! -s "textures/pokemon/${id}.png" ]; then
    curl -s -o "textures/pokemon/${id}.png" "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png"
  fi
  echo "完成: Pokemon #$id"
done

# 创建默认图片以备使用
echo "创建默认未知宝可梦图片..."
curl -s -o "textures/pokemon/unknown.png" "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png"

echo "所有资源下载完成!" 