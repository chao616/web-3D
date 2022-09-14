<template>
    <div class="home">
        <!-- <HelloWorld :msg="msg" /> -->
        <div class="container" ref="container"></div>
        <div class="map" ref="cesiumViewer"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
// import HelloWorld from '@/components/HelloWorld'

export default {
    name: 'home',
    components: {
        // HelloWorld,
    },
    data () {
        return {
            msg: '第一个three.js 案例--立方体',
            camera: null,
            scene: null,
            renderer: null,
            container: null,
            cube: null
        }
    },
    methods: {
        // 初始化画布
        initCanvas() {
            this.$nextTick(() => {
                this.container = this.$refs.container;

                //初始化场景
                this.scene = new THREE.Scene();

                //初始化相机
                this.camera = new THREE.PerspectiveCamera( 75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000 );

                //初始化渲染器
                this.renderer = new THREE.WebGLRenderer();

                //渲染器渲染器的大小尺寸
                this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

                this.container.appendChild(this.renderer.domElement)

                //立方体创建
                // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
                var geometry = new THREE.BufferGeometry(); //声明一个空几何体对象
                //类型数组创建顶点位置position数据
                var vertices = new Float32Array([
                    0, 0, 0, //顶点1坐标
                    50, 0, 0, //顶点2坐标
                    0, 100, 0, //顶点3坐标

                    0, 0, 0, //顶点4坐标
                    0, 0, 100, //顶点5坐标
                    50, 0, 0, //顶点6坐标

                ]);
                // 创建属性缓冲区对象
                var attribue = new THREE.BufferAttribute(vertices, 3); //3个为一组
                // 设置几何体attributes属性的位置position属性
                geometry.attributes.position = attribue

                var normals = new Float32Array([
                    0, 0, 1, //顶点1法向量
                    0, 0, 1, //顶点2法向量
                    0, 0, 1, //顶点3法向量

                    0, 1, 0, //顶点4法向量
                    0, 1, 0, //顶点5法向量
                    0, 1, 0, //顶点6法向量
                ]);
                geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);
                //立方体材质设置
                var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                this.cube = new THREE.Mesh( geometry, material );

                //给场景中添加立方体
                this.scene.add( this.cube );

                this.camera.position.z = 5;

                this.animate();
            })
        },
        initMap(){
            let viewer = new Cesium.Viewer(this.$refs.cesiumViewer, {
                baseLayerPicker: false,
                fullscreenButton: false,
                geocoder: false,
                homeButton: false,
                animation: false,
                infoBox: false,
                sceneModePicker: false,
                selectionIndicator: false,
                // creditContainer: "creditBar",
                skyBox: false,
                skyAtmosphere: false,
                timeline: false,
                navigationHelpButton: false,
                scene3DOnly: true,
                allowDataSourcesToSuspendAnimation: false
            })
            // window.viewer = viewer
        }
    },
    created() {
        // this.initCanvas();
        // this.initMap();
    }
}
</script>

<style scoped>
    .container {
        width: 100vw;
        height: 100vh;
        margin: 0 auto;
    }
    .map {
        width: 100vw;
        height: 100vh;
        margin: 0 auto;
    }
</style>
