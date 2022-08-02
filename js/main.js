main();

function loadJSON( json ) {
    // load json
    var promise = fetch( json + "?nocache=" + new Date().getTime() )
	.then( response => {
	    if ( !response.ok ) {
		if ( response.status == '404' ) {
		    throw new Error( 'File not found' );
		} else {
		    throw new Error( response.statusText );
		}
	    }
	    return response.json();
	} );
	// .catch(e => {
	//     // console.log(e);
	//     alert( e );
	//     throw new Error( e ); //console.error(e)
	// });

  return promise;
}

function myFunction() {
    alert('holi');
}

function main() {
    // alert('holi');
    loadJSON('./js/mesh_coord.json').then(
	json => {
	    alert(json);
	}
    );
}
