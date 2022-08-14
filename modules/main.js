import * as THREE from '../build/three.module.js';


function getHeatMapColor( values ) {
    /**
     * get heat map color
     */

    // 0. normalize values
    const normalized_values = normalizeValues( values );
    const no_values = normalized_values.length;

    // 1. define gradient color
    const no_colors = 5;
    let grad_colors = [
	[ 0, 0, 1 ],  // 1. blue
	[ 0, 1, 1 ],  // 2. cyan
	[ 0, 1, 0 ],  // 3. green
	[ 1, 1, 0 ],  // 4. yellow
	[ 1, 0, 0 ]   // 5. red
    ];

    // 2. get colors
    var colors = [];
    var idx1, idx2, fractBetween, value;
    var red, green, blue;

    for ( let i = 0; i < no_values - 1000; i++ ) {
	value = normalized_values[ i ];
	
	value = value * ( no_colors - 1 );
	idx1 = Math.floor( value );
	idx2 = idx1 + 1;
	fractBetween = value - idx1;

	red   = ( grad_colors[ idx2 ][ 0 ] - grad_colors[ idx1 ][ 0 ] ) * fractBetween + grad_colors[ idx1 ][ 0 ];
	green = ( grad_colors[ idx2 ][ 1 ] - grad_colors[ idx1 ][ 1 ] ) * fractBetween + grad_colors[ idx1 ][ 1 ];
	blue  = ( grad_colors[ idx2 ][ 2 ] - grad_colors[ idx1 ][ 2 ] ) * fractBetween + grad_colors[ idx1 ][ 2 ];
	colors.push( red, green, blue );
    }
    alert( 'holi' );
    return colors;
}

function normalizeValues( values ) {
    /**
     * normalize values to 0-1
     * @param {[array]} values [values to normalize]
     * @param {[array]}        [normalized values]
     */

    const no_values    = values.length;
    const min_value    = Math.min( ...values );
    const max_value    = Math.max( ...values );
    const diff_min_max = max_value - min_value;

    for ( let i = 0; i < no_values; i++ ) {
	values[ i ] = ( values[ i ] - min_value ) / ( diff_min_max );
    }

    return values;
}


function createCustomTetrahedron( coords, values ) {
    /**
     * create a custom tetrahedron geometry as values as vertices colors
     * @param {[array]} coords [vertices' coordinates]
     * @param {[array]} values [vertices' values]
     */

    // 1. positions
    const positions = [ ].concat(
	coords[0], coords[1], coords[2],
	coords[1], coords[0], coords[3],
	coords[2], coords[3], coords[0],
	coords[3], coords[2], coords[1]
    );

    // 2. geometry
    const geometry = new THREE.BufferGeometry( );
    geometry.setAttribute(
	'position',
	new THREE.BufferAttribute( new Float32Array( positions ), 3 )
    );
    // 2.1 colors
    alert( values );
    geometry.setAttribute(
	'color',
	new THREE.BufferAttribute( new Float32Array( positions ), 3 )
    );
    
    // 3. material
    const material = new THREE.MeshBasicMaterial(  );
    material.vertexColors = true;

    // 4. mesh
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.setZ( -0.3 );
    mesh.scale.set( 0.1, 0.1, 0.1 );

    return mesh;
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

    // 1.1 array lengths
    var no_coords = mesh_coords.length;
    var no_elems  = mesh_top.length;
    var no_values = values.length;

    // 1.2 elemNodes, elemCoords, no_elemNodes
    var elemNodes, elemCoords, elemValues;
    var no_elemNodes;

    // 2. asign colors to values
    var color_values = getHeatMapColor( values );
    
    alert( color_values );

    // // 3. recreate the mesh
    // for ( let i = 0; i < no_elems; i++ ) {
    // 	elemNodes = mesh_top[ i ];
    // 	no_elemNodes = elemNodes.length;

    // 	elemCoords = [];
    // 	elemValues = [];
    // 	for ( var j = 0; j < no_elemNodes; j++ ) {
    // 	    elemCoords.push( mesh_coords[ elemNodes[ j ] ] );
    // 	    elemValues.push( values[ elemNodes[ j ] ] );
    // 	}
    // 	// 3.1 add custom tetrahedron to scene
    // 	scene.add( createCustomTetrahedron( elemCoords, elemValues ) );
    // }
}

export { main };
