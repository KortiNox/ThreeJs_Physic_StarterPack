import * as THREE from 'three';
import App from './App';
import { sizesStore } from './Utils/Store';

export default class Renderer {
  constructor() {
    this.app = new App();
    this.canvas = this.app.canvas;
    this.camera = this.app.camera;
    this.scene = this.app.scene;
    this.sizesStore = sizesStore;
    this.sizes = sizesStore.getState();

    this.init();

    this.setInstance();
    this.setResizeListner();
  }

  init() {
    let initialized = false; // Флаг для предотвращения многократной инициализации
    this.sizesStore.subscribe((sizes) => {
      if (!initialized) {
        // Инициализируем только один раз
        this.setInstance(sizes);
        initialized = true;
      }
    });
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true, // убираем эффект лестницы из коробки
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio); // убираем эффект лестницы вручную
    //this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.shadowMap.enabled = true;
  }

  setResizeListner() {
    this.sizesStore.subscribe((sizes) => {
      this.instance.setSize(sizes.width, sizes.height);
      this.instance.setPixelRatio(sizes.pixelRatio);
    });
  }

  loop() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
