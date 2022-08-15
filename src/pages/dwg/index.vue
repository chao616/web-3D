<template>
    <div class="home">
        <div id="inset"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import { GUI } from '../../utils/lil-gui.module.min.js'; //交互UI，获取一个对象和该对象上的属性名，并根据属性的类型自动生成一个界面组件来操作该属性，使用它后，我们可以通过界面组件来控制场景中的物体，提高调试效率
import { OrbitControls } from '../../utils/OrbitControls.js'; //轨道控制器
import { NRRDLoader } from '../../utils/NRRDLoader.js';
import { VolumeRenderShader1 } from '../../utils/VolumeShader.js';
import WebGL from '../../utils/WebGL.js';
if ( WebGL.isWebGL2Available() === false ) {
    document.body.appendChild( WebGL.getWebGL2ErrorMessage() );
}
let renderer,
    scene,
    camera,
    controls,
    material,
    volconfig,
    cmtextures;
export default {
    name: 'home',
    components: {
        
    },
    data () {
        return {
            url: require('@/models/stent.nrrd'),
            cm_viridis: require('@/assets/img/cm_viridis.png'),
            cm_gray: require('@/assets/img/cm_gray.png'),
            nrrd:require('@/models/creatNrrd.nrrd'),
        }
    },
    methods: {
        init(){
            this.$nextTick(() => {
                // 创建场景
                scene = new THREE.Scene();
                // 创建渲染器
                renderer = new THREE.WebGLRenderer();
                //设置像素比率
                renderer.setPixelRatio( window.devicePixelRatio );
                //设置像素比率
                renderer.setSize( window.innerWidth, window.innerHeight );
                document.getElementById("inset").appendChild( renderer.domElement );

                //创建相机（体渲染器在透视方面还不能很好地工作）
                const h = 512; // 截面体高度
                const aspect = window.innerWidth / window.innerHeight;
                camera = new THREE.OrthographicCamera( - h * aspect / 2, h * aspect / 2, h / 2, - h / 2, 1, 1000 );
                camera.position.set( - 64, - 64, 128 );
                camera.up.set( 0, 0, 1 ); // In our data, z is up
                // 创建控制器
                controls = new OrbitControls( camera, renderer.domElement );
                controls.addEventListener( 'change', this.render );
                controls.target.set( 64, 64, 128 );
                controls.minZoom = 0.5;
                controls.maxZoom = 4;
                controls.enablePan = false;
                controls.update();

                // scene.add( new AxesHelper( 128 ) );

                // Lighting is baked into the shader a.t.m.
                // let dirLight = new DirectionalLight( 0xffffff );

                // The gui for interaction
                volconfig = { clim1: 0, clim2: 1, renderstyle: 'iso', isothreshold: 0.15, colormap: 'viridis' };
                const gui = new GUI();
                gui.add( volconfig, 'clim1', 0, 1, 0.01 ).onChange( this.updateUniforms );
                gui.add( volconfig, 'clim2', 0, 1, 0.01 ).onChange( this.updateUniforms );
                gui.add( volconfig, 'colormap', { gray: 'gray', viridis: 'viridis' } ).onChange( this.updateUniforms );
                gui.add( volconfig, 'renderstyle', { mip: 'mip', iso: 'iso' } ).onChange( this.updateUniforms );
                gui.add( volconfig, 'isothreshold', 0, 1, 0.01 ).onChange( this.updateUniforms );
                let _this = this;
                // Load the data ...
                new NRRDLoader().load( this.url, function ( volume ) { //https://threejs.org/examples/models/nrrd/stent.nrrd
                    // Texture to hold the volume. We have scalars, so we put our data in the red channel.
                    // THREEJS will select R32F (33326) based on the THREE.RedFormat and THREE.FloatType.
                    // Also see https://www.khronos.org/registry/webgl/specs/latest/2.0/#TEXTURE_TYPES_FORMATS_FROM_DOM_ELEMENTS_TABLE
                    // TODO: look the dtype up in the volume metadata 在体数据的metadata中找dtype
                    console.log(volume);
                    const texture = new THREE.Data3DTexture( volume.data, volume.xLength, volume.yLength, volume.zLength );
                    texture.format = THREE.RedFormat;
                    texture.type = THREE.FloatType;
                    texture.minFilter = texture.magFilter = THREE.LinearFilter;
                    texture.unpackAlignment = 1;
                    texture.needsUpdate = true;

                    // Colormap textures 颜色图纹理
                    cmtextures = {
                        viridis: new THREE.TextureLoader().load( _this.cm_viridis, _this.render ),
                        gray: new THREE.TextureLoader().load( _this.cm_gray, _this.render )
                    };


                    // Material 材质
                    const shader = VolumeRenderShader1;

                    const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

                    uniforms[ 'u_data' ].value = texture;
                    uniforms[ 'u_size' ].value.set( volume.xLength, volume.yLength, volume.zLength );
                    uniforms[ 'u_clim' ].value.set( volconfig.clim1, volconfig.clim2 );
                    uniforms[ 'u_renderstyle' ].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
                    uniforms[ 'u_renderthreshold' ].value = volconfig.isothreshold; // For ISO renderstyle
                    uniforms[ 'u_cmdata' ].value = cmtextures[ volconfig.colormap ];

                    material = new THREE.ShaderMaterial( {
                        uniforms: uniforms,
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader,
                        side: THREE.BackSide // The volume shader uses the backface as its "reference point"
                    } );

                    // THREE.Mesh
                    const geometry = new THREE.BoxGeometry( volume.xLength, volume.yLength, volume.zLength );
                    geometry.translate( volume.xLength / 2 - 0.5, volume.yLength / 2 - 0.5, volume.zLength / 2 - 0.5 );

                    const mesh = new THREE.Mesh( geometry, material );

                    console.log(mesh);

                    scene.add( mesh );

                    _this.render();

                });
            })
			window.addEventListener( 'resize', this.onWindowResize );
        },
        updateUniforms() {
			material.uniforms[ 'u_clim' ].value.set( volconfig.clim1, volconfig.clim2 );
			material.uniforms[ 'u_renderstyle' ].value = volconfig.renderstyle == 'mip' ? 0 : 1; // 0: MIP, 1: ISO
			material.uniforms[ 'u_renderthreshold' ].value = volconfig.isothreshold; // For ISO renderstyle
			material.uniforms[ 'u_cmdata' ].value = cmtextures[ volconfig.colormap ];
			this.render();
		},
		onWindowResize() {
			renderer.setSize( window.innerWidth, window.innerHeight );

			const aspect = window.innerWidth / window.innerHeight;

			const frustumHeight = camera.top - camera.bottom;

			camera.left = - frustumHeight * aspect / 2;
			camera.right = frustumHeight * aspect / 2;

			camera.updateProjectionMatrix();
			this.render();

		},
        render() {
			renderer.render( scene, camera );
		}
    },
    created() {
        this.init();
    }
}
</script>

<style scoped>
    .mxcad {
        width: 100%;
        height: calc(100vh);
        margin: 0 auto;
    }
</style>
