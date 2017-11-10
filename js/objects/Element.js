class Element
{
	constructor(x, y, z, name = '') 
	{
		this.x = x;
		this.y = y;
		this.z = z;
		this.geometry = null;
		this.displayAxesHelpers = false;
		this.scene = null;
		
		this.geomPath = "models/Box/";
		this.geomFile = "Box.obj";
		this.matFile = "Box.mtl";
	}
	
	removeFromScene( scene )
	{
		var selectedObject = scene.getObjectByName(this.name);
		scene.remove( selectedObject );
	}
	
	moveX(delta)
	{
		this.x+=delta;
		this.geometry.position.x = this.x;
	}
	
	moveY(delta)
	{
		this.y+=delta;
		this.geometry.position.y = this.y;
	}
	
	moveZ(delta)
	{
		this.z+=delta;
		this.geometry.position.z = this.z;
	}
	
	rotate(delta)
	{
		this.geometry.rotation.y -= (delta);
	}
	
	animate(delta){}
	
	/* Create geometry and add to scene */
	addToScene( scene )
	{
		this.scene = scene;
		var elem = this;
		// generate name if necessary
		if(name == '') this.name = Element.generateName(10);
		
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( elem.geomPath );		
		mtlLoader.load(elem.matFile, function( material ) {
			material.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( material );
			objLoader.setPath( elem.geomPath );
			objLoader.load( elem.geomFile, function ( mesh ) 
			{			
				elem.initGeometry(mesh)
				elem.geometry.name=elem.name;
			
				scene.add( elem.geometry );
			});
		});
		
	}
	
	initGeometry( mesh )
	{
		// position
		mesh.position.x = this.x;
		mesh.position.y = this.y + 0.5;
		mesh.position.z = this.z;
				
		// axes helper
		var axesHelper = new THREE.AxesHelper(1);	
		axesHelper.visible=this.displayAxesHelpers;
		mesh.add(axesHelper);				
		
		// add to scene
		this.geometry = new THREE.Group();				
		this.geometry.add(mesh);
	}
	
	displayHelper( display )
	{
		this.displayAxesHelpers = display;
	}
	
	static generateName(len)
	{
		var text = " ";
		var charset = "abcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < len; i++ ) text += charset.charAt(Math.floor(Math.random() * charset.length));
		return text;
	}
}


	