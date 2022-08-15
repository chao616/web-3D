import { Vector2, Vector3 } from 'three';
/**
 * Simple test shader
 */

 const BasicShader = {

	uniforms: {
        'u_size': { value: new Vector3( 1, 1, 1 ) },
		'u_renderstyle': { value: 0 },
		'u_renderthreshold': { value: 0.5 },
		'u_clim': { value: new Vector2( 1, 1 ) },
		'u_data': { value: null },
		'u_cmdata': { value: null }
    },

	vertexShader: /* glsl */`
		void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		void main() {
			gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );
		}`

};

export { BasicShader };