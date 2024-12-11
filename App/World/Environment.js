import * as THREE from 'three';
import App from '../App';
import assetStore from '../Utils/AssetStore';
import Portal from './Portal';
import ModalContentProvider from '../UI/ModalContentProvider';

export default class Environment {
  constructor() {
    this.app = new App();
    this.scene = this.app.scene;
    this.physics = this.app.world.physics;
    //this.pane = this.app.gui.pane;

    this.assetStore = assetStore.getState();
    this.enviroment = this.assetStore.loadedAssets.enviroment;

    this.loadEnvironment();
    this.addLight();
    this.addPortals();
    this.addMeshes();
    this.addColliderCub();
  }

  loadEnvironment() {
    const enviromentScene = this.enviroment.scene;
    this.scene.add(enviromentScene);
    //

    enviromentScene.position.set(1, 0, -3);
    enviromentScene.rotation.set(0, -1, 0);
    enviromentScene.scale.set(1, 1, 1);

    enviromentScene.traverse((obj) => {
      if (obj.isMesh) {
        this.physics.add(obj, 'fixed', 'trimesh');
      }
    });
  }

  addLight() {
    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.7);
    this.scene.add(ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    this.directionalLight.position.set(1, 1, 1);

    this.scene.add(this.directionalLight);
  }

  addMeshes() {
    const geometry = new THREE.SphereGeometry(0.15, 32, 32);

    for (let i = 0; i < 100; i++) {
      // Генерируем случайный цвет
      const color = new THREE.Color(Math.random(), Math.random(), Math.random()); // RGB от 0 до 1

      const material = new THREE.MeshStandardMaterial({
        color: color,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() + 0.5) * 20,
        (Math.random() - 0.5) * 20,
      );
      mesh.scale.setScalar(Math.random() + 0.5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(mesh);
      this.physics.add(mesh, 'dynamic', 'ball');
    }
  }

  addColliderCub() {
    const geometry = new THREE.PlaneGeometry(100, 10, 10);
    const geometry2 = new THREE.PlaneGeometry(100, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 'red',
      opacity: 0,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 13);
    mesh.rotation.x = Math.PI / 8;

    ////
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.position.set(-11, 0, 0);
    mesh2.rotation.x = Math.PI / 2;
    mesh2.rotation.y = Math.PI / 2;

    ////
    const mesh3 = new THREE.Mesh(geometry2, material);
    mesh3.position.set(10, 0, 0);
    mesh3.rotation.x = Math.PI / 2;
    mesh3.rotation.y = Math.PI / 2;

    this.scene.add(mesh);
    this.physics.add(mesh, 'fixed', 'cuboid');
    this.scene.add(mesh2);
    this.physics.add(mesh2, 'fixed', 'cuboid');
    this.scene.add(mesh3);
    this.physics.add(mesh3, 'fixed', 'cuboid');
  }

  addPortals() {
    const portalMesh1 = this.enviroment.scene.getObjectByName('Contact');

    const modalContentProvider = new ModalContentProvider();

    this.portal1 = new Portal(portalMesh1, modalContentProvider.getModalInfo('contactMe'));
    // this.portal2 = new Portal('hii2i');
    //this.portal3 = new Portal('hiii3');
  }

  loop() {
    this.portal1.loop();
  }
}
