import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

import assetStore from './AssetStore.js';

export default class AssetLoader {
  constructor() {
    this.assetStore = assetStore.getState();
    this.assetsToLoad = this.assetStore.assetsToLoad;
    this.addLoadedAsset = this.assetStore.addLoadedAsset;

    this.instantiateLoaders();
    this.startLoading();
  }

  instantiateLoaders() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    this.gltfLoader = new GLTFLoader();
    this.gltfLoader.setDRACOLoader(dracoLoader);
    this.textureLoader = new THREE.TextureLoader();
  }
  startLoading() {
    this.assetsToLoad.forEach((asset) => {
      console.log('Загружаю актив:', asset);
      if (asset.type === 'texture') {
        this.textureLoader.load(
          asset.path,
          (loadedAsset) => {
            loadedAsset.encoding = THREE.sRGBEncoding;
            this.addLoadedAsset(loadedAsset, asset.id);
            console.log('Текстура загружена:', asset.id);
          },
          undefined,
          (error) => {
            console.error('Ошибка загрузки текстуры:', asset.path, error);
          },
        );
      } else if (asset.type === 'model') {
        this.gltfLoader.load(
          asset.path,
          (loadedAsset) => {
            this.handleModelTextures(loadedAsset);
            this.addLoadedAsset(loadedAsset, asset.id);
            console.log('Модель загружена:', asset.id);
          },
          undefined,
          (error) => {
            console.error('Ошибка загрузки модели:', asset.path, error);
          },
        );
      }
    });
  }

  handleModelTextures(gltf) {
    gltf.scene.traverse((child) => {
      if (child.material && child.material.map) {
        child.material.map.encoding = THREE.sRGBEncoding;
      }
    });
  }
}
//
//
