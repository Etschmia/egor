# Sprite Rendering

<cite>
**Referenced Files in This Document**   
- [App.tsx](file://src/App.tsx)
- [raycasting.ts](file://src/raycasting.ts)
- [textures.ts](file://src/textures.ts)
- [types.ts](file://src/types.ts)
</cite>

## Table of Contents
1. [Sprite Coordinate Transformation](#sprite-coordinate-transformation)
2. [Depth Sorting Mechanism](#depth-sorting-mechanism)
3. [View Frustum Culling](#view-frustum-culling)
4. [Rendering Order by Sprite Type](#rendering-order-by-sprite-type)
5. [Special Object Type Implementation](#special-object-type-implementation)
6. [Color Variant Application](#color-variant-application)
7. [Sprite Filtering Logic](#sprite-filtering-logic)

## Sprite Coordinate Transformation

The sprite rendering system transforms sprite coordinates from world space to camera space using inverse determinant matrix mathematics. This transformation is critical for correctly positioning sprites relative to the player's viewpoint in the 3D environment. The process begins by calculating the inverse determinant value, which serves as a scaling factor for the transformation. This value is derived from the plane and direction vectors of the camera using the formula `1.0 / (planeX * dirY - dirX * planeY)`.

Each sprite's position is first converted to a relative coordinate system by subtracting the player's position from the sprite's world coordinates. These relative coordinates are then transformed into camera space using matrix multiplication. The transformation equations are:
- `transformX = invDet * (dirY * spriteX - dirX * spriteY)`
- `transformY = invDet * (-planeY * spriteX + planeX * spriteY)`

The resulting `transformX` and `transformY` values represent the sprite's position in camera space, where `transformY` also serves as the distance from the camera. This mathematical approach ensures that sprites are properly aligned with the camera's perspective, creating the illusion of depth in the 2D rendering context.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L123-L166)

## Depth Sorting Mechanism

The depth sorting mechanism ensures correct visual layering by rendering sprites from furthest to closest to the camera. This painter's algorithm approach prevents visual artifacts by ensuring that distant objects are drawn first, allowing closer objects to properly overlap them. The sorting is implemented after all sprites have been transformed into camera space and passed the view frustum culling check.

The sorting operation uses the `transformY` value (which represents distance from the camera) as the sorting criterion. Sprites are sorted in descending order of distance, meaning that sprites with greater `transformY` values are rendered first. The implementation uses JavaScript's built-in sort method with a custom comparator function: `sprites.sort((a, b) => b.distance - a.distance)`.

This sorting mechanism is applied to all sprite types, including enemies, items, and decorative objects, ensuring consistent visual layering across the entire scene. The sorting occurs once per frame after all sprites have been processed for transformation and culling, providing an efficient way to maintain proper depth ordering in the rendered output.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L225-L227)

## View Frustum Culling

The view frustum culling optimization excludes off-screen sprites from rendering calculations to improve performance. This optimization checks whether a sprite is within the camera's field of view before including it in the rendering pipeline. The culling process evaluates three conditions to determine if a sprite should be rendered:

1. **Behind camera check**: Sprites with `transformY <= 0` are behind the camera and excluded
2. **Distance check**: Sprites beyond a maximum distance threshold (default 20 units) are excluded
3. **Horizontal field of view check**: Sprites outside the horizontal viewing angle are excluded using the condition `Math.abs(transformX) > transformY * 1.5`

The function `isInViewFrustum` implements this culling logic and is called for each sprite during the transformation process. Only sprites that pass all three checks are added to the rendering queue. This optimization significantly reduces the number of sprites that need to be processed in subsequent rendering stages, improving overall performance especially in scenes with many objects.

The culling parameters are designed to match the game's field of view, ensuring that sprites near the edge of the screen are still rendered while efficiently eliminating those that are completely outside the visible area.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L105-L121)

## Rendering Order by Sprite Type

The rendering system follows a specific order for different sprite types to ensure proper visual hierarchy and layering. The primary rendering sequence is: decorative objects (background), enemies, items, and decorative objects (foreground). However, the implementation includes a special case for enemy death states that modifies this order.

The rendering order is determined through a two-step filtering and sorting process. First, sprites are separated into two groups: dead enemies and all other sprites. Dead enemies (corpses) are rendered first, followed by all other sprites including living enemies, items, and decorative objects. This ensures that enemy corpses appear beneath other game elements, creating a natural layering effect.

Within each group, sprites are sorted by distance from the camera, with more distant sprites rendered first. This combination of type-based and distance-based sorting creates a visually coherent scene where objects appear in their proper spatial relationships. The rendering order is implemented in the main rendering loop where sprites are processed according to this prioritized sequence.

**Section sources**
- [App.tsx](file://src/App.tsx#L613-L638)

## Special Object Type Implementation

The rendering system implements specific positioning logic for special object types to create varied visual effects and proper spatial relationships within the game world. These implementations modify the standard sprite rendering behavior to accommodate unique visual requirements for different decorative objects.

**Ceiling lights** are rendered with a vertical offset to appear at the top of the screen, simulating their position on the ceiling. This is achieved by reducing the sprite height to 60% of normal and adjusting the draw start position upward by 80% of the sprite height. The implementation ensures these lights appear fixed to the ceiling regardless of distance.

**Floor skeletons** are positioned lower in the visual field to simulate their placement on the ground. These sprites have their height reduced to 40% of normal and are drawn with a downward offset of 30% of the sprite height, placing them in the lower portion of the screen.

**Table items** use relative parent positioning through the `renderHeight` property and `parentId` reference. Objects like wine bottles are positioned relative to their parent table, with their vertical position calculated based on the `renderHeight` value. This creates the illusion that items are sitting on top of furniture rather than floating at ground level.

These special implementations are handled in the rendering loop where the draw position and dimensions are adjusted based on the sprite's type and properties before the actual drawing operation.

**Section sources**
- [App.tsx](file://src/App.tsx#L689-L707)
- [types.ts](file://src/types.ts#L148-L154)

## Color Variant Application

Color variants are applied to sprites through HSL (Hue, Saturation, Lightness) modulation in the texture pipeline, allowing for visual diversity without requiring multiple texture assets. This system uses a color variant parameter (ranging from 0 to 1) to shift the hue of the base texture, creating different color appearances for identical object types.

The color modulation process begins by creating a temporary canvas and drawing the original texture onto it. The pixel data is then extracted and processed to convert from RGB to HSL color space. The hue value is shifted based on the color variant parameter using the formula `(colorVariant - 0.5) * 60`, which maps the 0-1 range to a -30 to +30 degree hue shift. This shifted hue value is then converted back to RGB and applied to the pixel data.

The implementation preserves the original saturation and lightness values while only modifying the hue, ensuring that the color variation maintains the intended visual characteristics of the texture. Gray pixels (where R=G=B) are skipped to prevent unintended colorization of neutral tones. This approach allows for a wide range of color variations from a single base texture, reducing memory usage while increasing visual variety in the game world.

**Section sources**
- [textures.ts](file://src/textures.ts#L896-L967)

## Sprite Filtering Logic

The rendering system implements filtering logic to exclude certain sprites from rendering based on their state, ensuring that only relevant objects are processed and drawn. This filtering occurs during the sprite collection phase and applies different criteria based on sprite type and state.

For **items**, the system filters out collected items by checking the `collected` property. Only items with `collected: false` are included in the rendering queue, preventing already-collected items from appearing in the game world. This filtering is implemented in the items processing loop with the condition `if (!item.collected)`.

For **enemies**, the system applies different filtering based on the enemy's state. Living and dying enemies are rendered normally, while dead enemies are handled separately. The implementation includes both living/dying enemies and dead enemies in the rendering process, but dead enemies are filtered into a separate rendering pass to ensure proper layering.

The filtering logic is integrated into the `getSpritesToRender` function, where each sprite type is processed with its specific filtering criteria before transformation and culling. This approach ensures that unnecessary rendering calculations are avoided for sprites that should not be visible, optimizing performance while maintaining visual consistency.

**Section sources**
- [raycasting.ts](file://src/raycasting.ts#L123-L227)