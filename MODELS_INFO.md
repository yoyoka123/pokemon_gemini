# 3D模型资源说明

本游戏需要以下3D模型资源：

## 必需的模型

1. 宝可梦模型（放在 `models/` 目录下）：
   - `bulbasaur.glb` - 妙蛙种子
   - `charmander.glb` - 小火龙
   - `squirtle.glb` - 杰尼龟
   - `pikachu.glb` - 皮卡丘
   - `eevee.glb` - 伊布

2. 游戏物品模型：
   - `pokeball.glb` - 精灵球
   - `tree.glb` - 树木
   - `rock.glb` - 岩石

3. 纹理：
   - `textures/grass.jpg` - 地面草地纹理
   - `textures/pokemon/1.png` - 妙蛙种子图标
   - `textures/pokemon/4.png` - 小火龙图标
   - `textures/pokemon/7.png` - 杰尼龟图标
   - `textures/pokemon/25.png` - 皮卡丘图标
   - `textures/pokemon/133.png` - 伊布图标
   - `textures/pokemon/unknown.png` - 未知宝可梦图标

4. 天空盒纹理（放在 `textures/skybox/` 目录下）：
   - `px.jpg`, `nx.jpg`, `py.jpg`, `ny.jpg`, `pz.jpg`, `nz.jpg`

## 模型获取方式

您可以从以下途径获取所需的3D模型：

1. **公共3D模型资源网站**：
   - [Sketchfab](https://sketchfab.com/) - 搜索"Pokemon"或具体宝可梦名称
   - [CGTrader](https://www.cgtrader.com/) - 提供免费和付费的3D模型
   - [TurboSquid](https://www.turbosquid.com/) - 提供高质量3D模型

2. **GitHub宝可梦模型开源项目**：
   - 搜索"Pokemon 3D models"或"Pokemon GLB"可以找到开源的3D模型库

3. **自行创建**：
   - 使用Blender等3D建模软件创建简化版宝可梦模型
   - 导出为.glb格式（这是Three.js推荐的格式）

## 模型转换

如果您找到的模型不是.glb格式，可以使用以下工具进行转换：

- [Blender](https://www.blender.org/) - 可以导入多种格式并导出为.glb
- [Online 3D Converter](https://www.online-convert.com/3d-converter) - 在线转换工具

## 注意事项

- 确保模型尺寸合适，推荐在Blender中将宝可梦模型调整为约1单位高
- 简化模型以提高性能，减少多边形数量
- 确保模型包含合适的UV贴图和材质
- 调整模型的原点，使其位于宝可梦脚下中心
- 导出时请正确设置模型的向上方向（通常为Y轴）

## 法律提示

请确保您使用的模型符合版权规定。如果用于学习和个人使用，通常没有问题，但如果用于商业目的，请确保获得适当的许可。 