import * as THREE from '../build/three.module.js';


function createCustomTetrahedron( coords ) {
    /**
     * create a custom tetrahedron
     * @param {[array]} coords [vertices' coordinates]
     */
    
    // geometry
    const geometry = createCustomTetrahedronGeometry( coords );

    // material
    const material = new THREE.MeshBasicMaterial( { } );
    material.vertexColors = true;

    // mesh
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.setZ( -0.3 );

    return mesh;
}

function createCustomTetrahedronGeometry( coords ) {
    /**
     * create a custom tetrahedron geometry
     * @param {[array]} coords [vertices' coordinates]
     */

    // positions
    const positions = [ ].concat(
	coords[0], coords[1], coords[2],
	coords[1], coords[0], coords[3],
	coords[2], coords[3], coords[0],
	coords[3], coords[2], coords[1]
    );

    // geometry
    const geometry = new THREE.BufferGeometry( );
    geometry.setAttribute(
	'position',
	new THREE.BufferAttribute( new Float32Array( positions ), 3 )
    );
    geometry.setAttribute(
	'color',
	new THREE.BufferAttribute( new Float32Array( positions ), 3 )
    );

    return geometry;
}

async function loadJSON( filepath ) {
    /**
     * load JSON file
     * @param  {[string]} filepath [filpath string]
     * @return {[object]}          [file content]
     */

    // load json
    var response = await fetch( filepath + "?nocache=" + new Date().getTime() );

    if ( response.ok ) {
	return await response.json();
    } else {
	if ( response.status == '404' ) {
	    throw new Error( 'File not found' );
	} else {
	    throw new Error( response.statusText );
	}
    }
}

async function main( scene ) {
    /**
     * 1. load mesh
     * 2. recreate the mesh
     * 2.1 add custom tetrahedron to the scene
    */

    // 1. load mesh
    var mesh_coords = await loadJSON( './data/mesh_coord.json' );
    var mesh_top    = await loadJSON( './data/mesh_top.json' );
    var values      = await loadJSON( './data/values.json' );

    // array lengths
    var no_coords = mesh_coords.length;
    var no_elems  = mesh_top.length;
    var no_values = values.length;

    // elemNodes, elemCoords, no_elemNodes
    var elemNodes, elemCoords, elemValues;
    var no_elemNodes;

    // 2. recreate the mesh
    for ( var i = 0; i < no_elems; i++ ) {
	elemNodes = mesh_top[ i ];
	no_elemNodes = elemNodes.length;

	elemCoords = [];
	elemValues = [];
	for ( var j = 0; j < no_elemNodes; j++ ) {
	    elemCoords.push( mesh_coords[ elemNodes[ j ] ] );
	    elemValues.push( values[ elemNodes[ j ] ] );
	}
	// add custom tetrahedron to scene
	scene.add( createCustomTetrahedron( elemCoords ) );
    }
}

export { main };
