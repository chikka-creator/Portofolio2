/* 3D WebGL Helix Spiral Gallery Engine */
/* Inspired by taqy.tech & Pacome Pertant exact mathematical formulation */

const WorkSpiral = (function () {
  // Geometry & spiral constants
  const PLANE_ASPECT_X = 1.7;
  const PLANE_ASPECT_Y = 1.0;
  const RADIUS_BASE = 2.0;
  const VERTICAL_STEP = 0.5;
  const ROTATION_STEP = 0.85;
  const DAMPING = 0.1;
  const MIN_VELOCITY = 0.002;

  // Vertex Shader
  const VERTEX_SHADER = `
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    #define PI 3.14159265359

    uniform float uScrollSpeed;

    void main() {
      vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      vec3 newPosition = position;

      // 1. Lengkungan pita kertas silindris pada sumbu X
      newPosition.z = sin(uv.x * PI) * 0.2;

      vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;

      // 2. Lengkungan parabola horizontal vertikal sepanjang sumbu Y
      viewPosition.x += pow(worldPosition.y, 2.0) * 0.1;

      // 3. Distorsi gelombang dinamis berbasis kecepatan scroll
      viewPosition.x += sin(uv.y * PI) * uScrollSpeed * 2.0;

      gl_Position = projectionMatrix * viewPosition;
      vUv = uv;
      vWorldPosition = worldPosition;
    }
  `;

  // Fragment Shader
  const FRAGMENT_SHADER = `
    uniform sampler2D uTexture;
    uniform float uColorStrength;
    uniform float uZoom;
    uniform vec2 uPlaneSizes;
    uniform vec2 uImageSizes;
    uniform float uRevealProgress;
    uniform vec2 uSunDirection;

    varying vec2 vUv;

    float roundedRectSDF(vec2 uv, vec2 size, float radius) {
      vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
      return length(max(d, 0.0)) - radius;
    }

    void main() {
      vec2 ratio = vec2(
        min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
        min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
      );

      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      vec2 zoomedUv = (uv - 0.5) / uZoom + 0.5;
      vec4 color;

      if (gl_FrontFacing) {
        color = texture2D(uTexture, zoomedUv);
        color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), uColorStrength);

        // Edge facing sunlight catches subtle natural highlight
        float sunFacing = clamp(dot(vUv - 0.5, -uSunDirection) * 1.5 + 0.5, 0.0, 1.0);
        color.rgb += color.rgb * (sunFacing * 0.1);
      } else {
        // Light paper backface on white background
        vec4 c = texture2D(uTexture, uv);
        float rim = clamp(dot(vUv - 0.5, -uSunDirection) * 1.2 + 0.5, 0.0, 1.0);
        c.rgb = mix(c.rgb, vec3(0.94, 0.94, 0.95), 0.82);
        c.rgb -= vec3(0.06) * (1.0 - rim);
        color = c;
      }

      float reveal = clamp(uRevealProgress, 0.0, 1.0);
      vec2 revealSize = vec2(reveal);
      float baseRadius = 0.05;
      float radius = baseRadius * reveal;

      // Soft rounded card borders via signed distance field
      float sdf = roundedRectSDF(vUv, revealSize, radius);
      float edge = 0.003;
      float alpha = 1.0 - smoothstep(0.0, edge, sdf);
      alpha *= smoothstep(0.1, 1.0, uRevealProgress);

      if (alpha < 0.01) discard;

      // Subtle crisp card border stroke so cards pop against the white canvas
      float innerBorder = 1.0 - smoothstep(0.0, 0.005, -sdf);
      color.rgb = mix(color.rgb, vec3(0.85, 0.85, 0.87), innerBorder * 0.75);

      gl_FragColor = vec4(color.rgb, color.a * alpha);
    }
  `;

  // Internal State
  let canvas = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let textureLoader = null;
  let defaultTexture = null;
  let sharedGeometry = null;

  let meshes = [];
  let textureCache = new Map();

  let isActive = true;
  let isZooming = false;
  let zoomingMesh = null;
  let isRunning = false;
  let isTabHidden = false;
  let animFrameId = null;

  // Responsive scale factors
  let scaleFactor = 1.0;
  let radiusParam = RADIUS_BASE;
  let vertParam = VERTICAL_STEP;
  let rotParam = ROTATION_STEP;

  // Motion dynamics
  let scrollOffset = 0;
  let scrollVelocity = 0;
  let targetVelocity = 0;
  let scrollDirection = 1;
  let viewProgress = 0; // 0 = fully active spiral, 1 = hidden/swapped

  // Raycasting & Pointer
  const pointer = new THREE.Vector2(-9999, -9999);
  const raycaster = new THREE.Raycaster();
  const faceNormal = new THREE.Vector3();
  const sunDirection = new THREE.Vector2(0, 1);
  const targetSun = new THREE.Vector2(0, 1);
  let hoveredMesh = null;

  // Touch & Drag state
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let lastMoveY = 0;

  // Callbacks
  let onHoverCallback = null;
  let onSelectCallback = null;

  function createFallbackTexture(color = "#f2efe9") {
    const cv = document.createElement("canvas");
    cv.width = 256;
    cv.height = 256;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(cv);
    tex.needsUpdate = true;
    return tex;
  }

  function init(canvasEl, cards, options = {}) {
    canvas = canvasEl;
    if (!canvas || typeof THREE === "undefined") return;

    onHoverCallback = options.onHover || null;
    onSelectCallback = options.onSelect || null;

    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: width > 640,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, width <= 640 ? 1.5 : 1.7));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = "anonymous";
    defaultTexture = createFallbackTexture("#f2efe9");

    sharedGeometry = new THREE.PlaneGeometry(1, 1, 8, 1);

    buildMeshes(cards);
    updateResponsiveDimensions();
    attachEventListeners();

    startLoop();
  }

  function buildMeshes(cards) {
    if (!scene) return;

    // Clear existing meshes
    meshes.forEach((m) => {
      scene.remove(m);
      if (m.material) m.material.dispose();
    });
    meshes.length = 0;
    hoveredMesh = null;
    isZooming = false;
    zoomingMesh = null;

    if (!cards || cards.length === 0) return;

    // Helix requires a continuous loop of at least 16 cards
    const repeatCount = Math.max(1, Math.ceil(16 / cards.length));
    const totalCount = cards.length * repeatCount;

    for (let i = 0; i < totalCount; i++) {
      const card = cards[i % cards.length];
      const uniforms = {
        uTexture: { value: defaultTexture },
        uColorStrength: { value: 0 },
        uZoom: { value: 1 },
        uPlaneSizes: { value: new THREE.Vector2(PLANE_ASPECT_X, PLANE_ASPECT_Y) },
        uImageSizes: { value: new THREE.Vector2(16, 9) },
        uRevealProgress: { value: 1 },
        uScrollSpeed: { value: 0 },
        uSunDirection: { value: new THREE.Vector2(0, 1) }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: uniforms,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: true
      });

      if (card.image) {
        if (textureCache.has(card.image)) {
          const cached = textureCache.get(card.image);
          material.uniforms.uTexture.value = cached;
          if (cached.image) {
            material.uniforms.uImageSizes.value.set(cached.image.width || 16, cached.image.height || 9);
          }
        } else {
          textureLoader.load(
            card.image,
            (tex) => {
              tex.generateMipmaps = true;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              textureCache.set(card.image, tex);
              material.uniforms.uTexture.value = tex;
              if (tex.image) {
                material.uniforms.uImageSizes.value.set(tex.image.width || 16, tex.image.height || 9);
              }
              material.needsUpdate = true;
            },
            undefined,
            () => {
              material.uniforms.uTexture.value = createFallbackTexture(card.tint || "#f2efe9");
            }
          );
        }
      } else {
        material.uniforms.uTexture.value = createFallbackTexture(card.tint || "#f2efe9");
      }

      const mesh = new THREE.Mesh(sharedGeometry, material);
      mesh.scale.set(PLANE_ASPECT_X * scaleFactor, PLANE_ASPECT_Y * scaleFactor, 1);
      mesh.userData = {
        card: card,
        index: i,
        hoverProgress: 0,
        hoverTarget: 0,
        centerBoost: 0
      };

      scene.add(mesh);
      meshes.push(mesh);
    }
  }

  function updateResponsiveDimensions() {
    if (typeof window === "undefined" || !camera || !renderer) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    let s = 1.0;
    let rad = RADIUS_BASE;
    let vert = VERTICAL_STEP;
    let rot = ROTATION_STEP;
    let camZ = 8.0;

    if (width <= 640) {
      s = 0.8;
      rad = 1.65;
      vert = 0.47;
      rot = 0.82;
      camZ = 8.1;
    } else if (width <= 1024) {
      s = 0.92;
      rad = 1.9;
      vert = 0.46;
      rot = 0.84;
      camZ = 8.0;
    }

    scaleFactor = s;
    radiusParam = rad;
    vertParam = vert;
    rotParam = rot;

    camera.aspect = width / height;
    camera.position.z = camZ;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    meshes.forEach((m) => {
      m.scale.set(PLANE_ASPECT_X * s, PLANE_ASPECT_Y * s, 1);
      if (m.material && m.material.uniforms && m.material.uniforms.uPlaneSizes) {
        m.material.uniforms.uPlaneSizes.value.set(PLANE_ASPECT_X * s, PLANE_ASPECT_Y * s);
      }
    });
  }

  function attachEventListeners() {
    window.addEventListener("resize", onWindowResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (canvas) {
      canvas.addEventListener("wheel", onWheel, { passive: true });
      canvas.addEventListener("click", onClick);
      canvas.addEventListener("touchstart", onTouchStart, { passive: true });
      canvas.addEventListener("touchmove", onTouchMove, { passive: true });
      canvas.addEventListener("touchend", onTouchEnd, { passive: true });
      canvas.addEventListener("mousedown", onMouseDown);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("keydown", onKeyDown);
  }

  function onWindowResize() {
    updateResponsiveDimensions();
  }

  function onVisibilityChange() {
    isTabHidden = document.hidden;
    if (!isTabHidden && isActive && !isRunning) {
      startLoop();
    }
  }

  function onWheel(e) {
    if (!isActive || isZooming) return;
    targetVelocity += e.deltaY * 0.00015;
    targetVelocity = Math.max(-1.8, Math.min(1.8, targetVelocity));
    scrollDirection = e.deltaY > 0 ? 1 : -1;
  }

  function onMouseMove(e) {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

    // Sunlight direction subtle shift
    targetSun.set((e.clientX / window.innerWidth - 0.5) * 1.5, (e.clientY / window.innerHeight - 0.5) * 1.5);

    if (isPointerDown && isActive && !isZooming) {
      const deltaY = lastMoveY - e.clientY;
      lastMoveY = e.clientY;
      targetVelocity += deltaY * 0.0006;
      targetVelocity = Math.max(-1.8, Math.min(1.8, targetVelocity));
      if (Math.abs(deltaY) > 0.5) {
        scrollDirection = deltaY > 0 ? 1 : -1;
      }
    }
  }

  function onMouseDown(e) {
    if (!isActive || isZooming || e.button !== 0) return;
    isPointerDown = true;
    startX = e.clientX;
    startY = e.clientY;
    lastMoveY = e.clientY;
  }

  function onMouseUp(e) {
    isPointerDown = false;
  }

  function onTouchStart(e) {
    if (!isActive || isZooming || e.touches.length === 0) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    lastMoveY = startY;
    pointer.x = (startX / window.innerWidth) * 2 - 1;
    pointer.y = -(startY / window.innerHeight) * 2 + 1;
  }

  function onTouchMove(e) {
    if (!isActive || isZooming || e.touches.length === 0) return;
    const curY = e.touches[0].clientY;
    const deltaY = lastMoveY - curY;
    lastMoveY = curY;

    pointer.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(curY / window.innerHeight) * 2 + 1;

    targetVelocity += deltaY * 0.0006;
    targetVelocity = Math.max(-1.8, Math.min(1.8, targetVelocity));
    if (Math.abs(deltaY) > 0.5) {
      scrollDirection = deltaY > 0 ? 1 : -1;
    }
  }

  function onTouchEnd(e) {
    if (!isActive || isZooming || e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    if (Math.hypot(touch.clientX - startX, touch.clientY - startY) < 10) {
      pointer.x = (touch.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      handlePointerSelect();
    }
  }

  function onClick(e) {
    if (!isActive || isZooming) return;
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    handlePointerSelect();
  }

  function onKeyDown(e) {
    if (!isActive || isZooming) return;
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      targetVelocity += 0.08;
      scrollDirection = 1;
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      targetVelocity -= 0.08;
      scrollDirection = -1;
    }
  }

  function handlePointerSelect() {
    if (hoveredMesh && hoveredMesh.userData && hoveredMesh.userData.card) {
      triggerCardZoom(hoveredMesh.userData.card);
      return;
    }

    if (!camera || !scene) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(meshes);
    if (intersects.length > 0 && intersects[0].face && intersects[0].object) {
      const hit = intersects[0];
      faceNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
      if (faceNormal.dot(raycaster.ray.direction) < -0.1) {
        triggerCardZoom(hit.object.userData.card);
      }
    }
  }

  function triggerCardZoom(card, onComplete) {
    if (isZooming || !meshes.length || !camera) {
      if (onComplete) onComplete();
      return;
    }

    // Find the mesh matching this card that is closest to center
    const matches = meshes.filter((m) => m.userData.card && m.userData.card.id === card.id);
    if (!matches.length) {
      if (onComplete) onComplete();
      return;
    }

    let targetMesh = hoveredMesh && hoveredMesh.userData.card && hoveredMesh.userData.card.id === card.id ? hoveredMesh : null;
    if (!targetMesh) {
      let minDistance = Infinity;
      for (const m of matches) {
        if ((m.material.uniforms.uRevealProgress.value || 0) < 0.2) continue;
        const dist = Math.hypot(m.position.x, m.position.y);
        if (dist < minDistance) {
          minDistance = dist;
          targetMesh = m;
        }
      }
      if (!targetMesh) targetMesh = matches[0];
    }

    zoomingMesh = targetMesh;
    isZooming = true;
    targetVelocity = 0;
    scrollVelocity = 0;

    if (window.WorkAudio) {
      window.WorkAudio.playCardOpen();
    }

    const currentY = targetMesh.rotation.y;
    const fullCircle = Math.PI * 2;
    const diff = (((0 - currentY) % fullCircle) + Math.PI * 3) % fullCircle - Math.PI;
    const targetRotY = currentY + diff;

    targetMesh.material.uniforms.uZoom.value = 1;
    targetMesh.material.uniforms.uColorStrength.value = 0;
    targetMesh.material.uniforms.uRevealProgress.value = 1;

    const posX = targetMesh.position.x;
    const posY = targetMesh.position.y;
    const posZ = targetMesh.position.z;
    const camZ = camera.position.z;
    const targetZ = camZ - 0.7;
    const ratio = (camZ - targetZ) / Math.max(0.001, camZ - posZ);
    const endX = posX * ratio;
    const endY = posY * ratio;

    if (typeof gsap !== "undefined") {
      gsap.to(targetMesh.position, {
        x: endX,
        y: endY,
        z: targetZ,
        duration: 0.38,
        ease: "power2.inOut"
      });
      gsap.to(targetMesh.rotation, {
        x: 0,
        y: targetRotY,
        z: 0,
        duration: 0.34,
        ease: "power2.out"
      });
      gsap.to(targetMesh.scale, {
        x: PLANE_ASPECT_X * 6.5,
        y: PLANE_ASPECT_Y * 6.5,
        duration: 0.38,
        ease: "power2.inOut",
        onComplete: () => {
          if (onSelectCallback) onSelectCallback(card);
          if (onComplete) onComplete();
        }
      });
    } else {
      if (onSelectCallback) onSelectCallback(card);
      if (onComplete) onComplete();
    }
  }

  function resetZoom() {
    if (zoomingMesh) {
      const meshToReset = zoomingMesh;
      if (typeof gsap !== "undefined") {
        gsap.to(meshToReset.scale, {
          x: PLANE_ASPECT_X * scaleFactor,
          y: PLANE_ASPECT_Y * scaleFactor,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            isZooming = false;
            zoomingMesh = null;
          }
        });
      } else {
        meshToReset.scale.set(PLANE_ASPECT_X * scaleFactor, PLANE_ASPECT_Y * scaleFactor, 1);
        isZooming = false;
        zoomingMesh = null;
      }
    } else {
      isZooming = false;
      zoomingMesh = null;
    }
  }

  function startLoop() {
    if (isRunning) return;
    isRunning = true;
    renderLoop();
  }

  function renderLoop() {
    if (isTabHidden) {
      isRunning = false;
      return;
    }

    // Smooth transition between active spiral (0) and hidden list (1)
    const targetProgress = !isActive ? 1 : 0;
    viewProgress += (targetProgress - viewProgress) * 0.065;

    if (!isActive && viewProgress >= 0.995) {
      isRunning = false;
      return;
    }

    animFrameId = requestAnimationFrame(renderLoop);

    // Momentum Physics
    scrollVelocity += (targetVelocity - scrollVelocity) * DAMPING;
    scrollOffset += scrollVelocity;

    if (isActive && Math.abs(scrollVelocity) > 0.004 && window.WorkAudio) {
      window.WorkAudio.playRatchet(Math.abs(scrollVelocity) * 20);
    }

    if (Math.abs(targetVelocity) < MIN_VELOCITY) {
      targetVelocity = scrollDirection * MIN_VELOCITY;
    }
    targetVelocity *= 0.92;

    const total = meshes.length;
    if (total === 0) return;

    sunDirection.lerp(targetSun, 0.05);

    const zoomFactor = 1 + viewProgress * 0.45;
    const baseW = (1 - viewProgress * 0.65) * scaleFactor;
    const tanFov = camera ? Math.tan((camera.fov * Math.PI) / 360) : 0.315;
    const halfH = 0.55 * baseW;
    const globalReveal = Math.max(0, 1 - viewProgress * viewProgress * (3 - 2 * viewProgress));

    const halfCount = total / 2;
    const halfCountLimit = total * 0.5;

    for (let i = 0; i < total; i++) {
      const mesh = meshes[i];
      if (mesh === zoomingMesh) continue;

      if (isZooming) {
        // Fade out other cards during zoom
        if (mesh.material && mesh.material.uniforms && mesh.material.uniforms.uRevealProgress) {
          mesh.material.uniforms.uRevealProgress.value = Math.max(0, mesh.material.uniforms.uRevealProgress.value - 0.14);
        }
        continue;
      }

      let offset = mesh.userData.index - scrollOffset;
      offset = ((offset % total) + total) % total;
      const relIdx = offset - halfCount;

      const posY = relIdx * vertParam * zoomFactor - 0.8;
      const currentRadius = radiusParam * zoomFactor;
      const angle = relIdx * rotParam;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      mesh.position.set(cosA * currentRadius, posY, sinA * currentRadius);
      mesh.rotation.y = -angle + Math.PI / 2;

      // Center proximity zoom boost
      let centerFactor = 0;
      if (sinA > 0.15 && camera) {
        const distZ = camera.position.z - sinA * currentRadius;
        const normX = (cosA * currentRadius + posY * posY * 0.1) / (tanFov * distZ * camera.aspect);
        const normY = posY / (tanFov * distZ);
        const radiusSq = normX * normX + normY * normY;
        if (radiusSq < 0.1936) {
          const r = Math.sqrt(radiusSq);
          centerFactor = 0.5 * (1 + Math.cos(Math.PI * r * 2.2727));
        }
      }

      mesh.userData.centerBoost += (centerFactor - mesh.userData.centerBoost) * 0.07;
      const boostScale = 1 + 0.05 * mesh.userData.centerBoost;
      const finalScale = baseW * boostScale;
      const scaleX = PLANE_ASPECT_X * finalScale;
      const scaleY = PLANE_ASPECT_Y * finalScale;
      mesh.scale.set(scaleX, scaleY, 1);

      if (mesh.material && mesh.material.uniforms) {
        if (mesh.material.uniforms.uPlaneSizes) {
          mesh.material.uniforms.uPlaneSizes.value.set(scaleX, scaleY);
        }

        // Depth & screen boundary reveal calculation
        const camDist = Math.max(1, camera.position.z - mesh.position.z);
        const viewBoundY = tanFov * camDist;
        const topRatio = Math.max(0, Math.min(1, (posY - (-viewBoundY - halfH)) / (2 * halfH)));
        const smoothTop = topRatio * topRatio * (3 - 2 * topRatio);
        const bottomRatio = Math.max(0, Math.min(1, (viewBoundY + halfH - posY) / (2 * halfH)));
        const smoothBottom = bottomRatio * bottomRatio * (3 - 2 * bottomRatio);
        const edgeClip = Math.min(smoothTop, smoothBottom);

        const countRatio = Math.max(0, Math.min(1, (1 - Math.abs(relIdx) / halfCountLimit) / 0.16));
        const finalReveal = Math.min(edgeClip, countRatio);

        const isHovered = hoveredMesh === mesh && !isZooming && finalReveal >= 0.35 && isActive;
        mesh.userData.hoverTarget = isHovered ? 1 : 0;
        mesh.userData.hoverProgress += (mesh.userData.hoverTarget - mesh.userData.hoverProgress) * 0.12;

        const uniforms = mesh.material.uniforms;
        uniforms.uScrollSpeed.value = scrollVelocity;
        uniforms.uZoom.value = 1 + 0.05 * mesh.userData.hoverProgress;
        uniforms.uColorStrength.value = 0.55 * mesh.userData.hoverProgress;
        uniforms.uRevealProgress.value = finalReveal * (1 - 0.05 * mesh.userData.hoverProgress) * globalReveal;
        uniforms.uSunDirection.value.copy(sunDirection);
      }
    }

    // Raycasting for interactive hover
    if (isActive && !isZooming && camera && scene) {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(meshes);
      let hitMesh = null;

      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.face && hit.object && (hit.object.material?.uniforms?.uRevealProgress?.value ?? 1) >= 0.25) {
          faceNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld);
          if (faceNormal.dot(raycaster.ray.direction) < -0.1) {
            hitMesh = hit.object;
          }
        }
      }

      if (hitMesh) {
        if (hoveredMesh !== hitMesh) {
          hoveredMesh = hitMesh;
          if (canvas) canvas.style.cursor = "pointer";
          if (onHoverCallback) onHoverCallback(hoveredMesh.userData.card);
          if (window.WorkAudio) window.WorkAudio.playHover();
        }
      } else if (hoveredMesh) {
        hoveredMesh = null;
        if (canvas) canvas.style.cursor = "";
        if (onHoverCallback) onHoverCallback(null);
      }
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  function setActive(active) {
    isActive = Boolean(active);
    if (isActive) {
      if (viewProgress >= 0.99) viewProgress = 1;
      startLoop();
    } else {
      if (hoveredMesh) {
        hoveredMesh = null;
        if (onHoverCallback) onHoverCallback(null);
        if (canvas) canvas.style.cursor = "";
      }
    }
  }

  function destroy() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    window.removeEventListener("resize", onWindowResize);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("keydown", onKeyDown);

    if (canvas) {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      canvas.removeEventListener("mousedown", onMouseDown);
    }

    meshes.forEach((m) => {
      if (m.material) m.material.dispose();
    });
    meshes.length = 0;
    textureCache.forEach((tex) => tex.dispose());
    textureCache.clear();

    if (defaultTexture) defaultTexture.dispose();
    if (sharedGeometry) sharedGeometry.dispose();
    if (renderer) renderer.dispose();

    scene = null;
    camera = null;
    renderer = null;
  }

  return {
    init,
    setActive,
    triggerCardZoom,
    resetZoom,
    destroy
  };
})();

if (typeof window !== "undefined") {
  window.WorkSpiral = WorkSpiral;
}
