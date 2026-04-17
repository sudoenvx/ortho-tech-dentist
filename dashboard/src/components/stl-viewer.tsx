import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three-stdlib'
import { OrbitControls } from 'three-stdlib'

interface StlViewerProps {
  filePath: string
  autoRotate?: boolean
}

export const StlViewer: React.FC<StlViewerProps> = ({ filePath, autoRotate = false }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    // Initialize scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)
    sceneRef.current = scene

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000)
    camera.position.set(0, 0, 100)

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.left = -100
    directionalLight.shadow.camera.right = 100
    directionalLight.shadow.camera.top = 100
    directionalLight.shadow.camera.bottom = -100
    directionalLight.shadow.camera.near = 0.1
    directionalLight.shadow.camera.far = 500
    scene.add(directionalLight)

    // Add secondary light for better depth perception
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4)
    fillLight.position.set(-5, 5, -7)
    scene.add(fillLight)

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 4
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableRotate = true
    controls.dispose = () => {
      // Custom dispose to ensure cleanup
      controls.removeEventListener('change', onControlsChange)
    }
    controlsRef.current = controls

    // Load STL file
    const loader = new STLLoader()
    loader.load(
      filePath,
      (geometry) => {
        try {
          // Store geometry reference for cleanup
          geometryRef.current = geometry

          // Create material
          const material = new THREE.MeshPhongMaterial({
            color: 0x4f46e5,
            specular: 0x111111,
            shininess: 200,
            emissive: 0x1f2937,
          })

          // Create mesh
          const mesh = new THREE.Mesh(geometry, material)
          mesh.castShadow = true
          mesh.receiveShadow = true

          // Center geometry
          geometry.center()
          geometry.computeBoundingBox()

          // Calculate bounding box
          const boundingBox = geometry.boundingBox
          if (boundingBox) {
            const size = boundingBox.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 50 / maxDim
            mesh.scale.multiplyScalar(scale)

            // Position camera to view the model
            const distance = maxDim * 2.5
            camera.position.z = distance
            controls.target.set(0, 0, 0)
            controls.update()
          }

          scene.add(mesh)
          meshRef.current = mesh
          setIsLoading(false)
          setError(null)
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to create mesh'
          setError(errorMessage)
          setIsLoading(false)
        }
      },
      undefined,
      (err) => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load STL file'
        setError(errorMessage)
        setIsLoading(false)
      }
    )

    // Animation loop
    let animationId: number
    const onControlsChange = () => {
      renderer.render(scene, camera)
    }
    controls.addEventListener('change', onControlsChange)

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight

      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animationId)
      controls.removeEventListener('change', onControlsChange)
      controls.dispose()
      renderer.dispose()
      if (geometryRef.current) {
        geometryRef.current.dispose()
      }
      if (meshRef.current) {
        ;(meshRef.current.material as THREE.Material).dispose()
      }
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [filePath, autoRotate])

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
          <div className="bg-white px-4 py-2 rounded shadow-lg">
            <p className="text-sm font-medium text-text">Loading STL model...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-20 rounded">
          <div className="bg-red-50 px-4 py-2 rounded shadow-lg border border-red-200">
            <p className="text-sm font-medium text-red-800">Error: {error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
