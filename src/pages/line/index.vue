<template>
    <div class="home">
        <HelloWorld :msg="msg" />
        <div class="container" ref="container"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import HelloWorld from '@/components/HelloWorld'

export default {
    name: 'home',
    components: {
        HelloWorld,
    },
    data () {
        return {
            msg: 'three.js 案例 -- 画线',
            camera: null,
            scene: null,
            renderer: null,
            container: null,
            line: null
        }
    },
    methods: {
        // 初始化画布
        initCanvas() {
            this.$nextTick(() => {
                this.container = this.$refs.container;

                //初始化场景
                this.scene = new THREE.Scene();

                //初始化渲染器
                this.renderer = new THREE.WebGLRenderer();

                //初始化相机
                this.camera = new THREE.PerspectiveCamera( 45, this.container.clientWidth / this.container.clientHeight, 1, 500 );
                this.camera.position.set( 0, 0, 100 );
                this.camera.lookAt( 0, 0, 0 );

                //渲染器渲染器的大小尺寸
                this.renderer.setSize( this.container.clientWidth, this.container.clientHeight );

                this.container.appendChild(this.renderer.domElement);

                //线创建
                let vertices = [
                    new THREE.Vector3( -10, 0, 0),
                    new THREE.Vector3( 0, 10, 0),
                    new THREE.Vector3( 10, 0, 0)
                ]
                var geometry = new THREE.BufferGeometry();
                geometry.vertices = vertices;

                // const vertices = new Float32Array(arr);
                // geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

                //立方体材质设置
                var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
                this.line = new THREE.Line( geometry, material );

                //给场景中添加立方体
                this.scene.add( this.line );
                this.renderer.render(this.scene, this.camera);
                // this.camera.position.z = 5;

                // this.animate();
            })
        },
        animate() {
            requestAnimationFrame(this.animate);
            this.line.rotation.x += 0.01;
            this.line.rotation.y += 0.02;
            this.renderer.render(this.scene, this.camera);
        }
    },
    created() {
        this.initCanvas();
    }
}
</script>

<style scoped>
    .container {
        width: 100%;
        height: calc(100vh - 38px);
        margin: 0 auto;
    }
</style>
