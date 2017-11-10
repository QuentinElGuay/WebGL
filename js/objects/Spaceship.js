class SpaceShip extends Element
{
	constructor(x, y, z, name = 'spaceship') 
	{
		super(x, y, z, name);
		
		this.isRotating = true;
		this.animateRay = false;
		this.rayRadius = 0.3;
		this.passenger = null;
	}
	
	addToScene( scene )
	{
		var sship = this;
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setPath( 'models/' );		
		mtlLoader.load('ufo.mtl', function( material ) {
			material.preload();
			var objLoader = new THREE.OBJLoader();
			objLoader.setMaterials( material );
			objLoader.setPath( 'models/' );
			objLoader.load( 'ufo.obj', function ( mesh ) 
			{
				mesh.position.x = sship.x;
				mesh.position.y = sship.y;
				mesh.position.z = sship.z;
							
				mesh.scale.set(0.0005, 0.0002, 0.0005);
				mesh.rotation.z += Math.PI;
				
				var axesHelper = new THREE.AxesHelper(10000);	
				axesHelper.visible=sship.displayAxesHelpers;
				mesh.add(axesHelper);
				
				sship.geometry = new THREE.Group();
				sship.geometry.add(mesh);
				sship.geometry.name=sship.name;
			
				scene.add( sship.geometry );
			});
		});
		
	};
	
	removeFromScene( scene )
	{
		var selectedObject = scene.getObjectByName(this.name);
		scene.remove( selectedObject );
	};
	
	moveX(delta)
	{
		this.x+=delta;
		this.geometry.position.x = this.x;
		if(!!this.passenger) this.passenger.moveX(delta);
	};
	
	moveY(delta)
	{
		this.y+=delta;
		this.geometry.position.y = this.y;		
		if(!!this.passenger) this.passenger.moveY(delta);
	};
	
	moveZ(delta)
	{
		this.z+=delta;
		this.geometry.position.z = this.z;
		if(!!this.passenger) this.passenger.moveZ(delta);
	};	
	
	rotate(delta)
	{
		this.geometry.rotation.y -= (delta);
	};
	
	animate(delta)
	{
		if(typeof this.geometry == 'object' && this.geometry!=null) 
		{
			if(this.isRotating) this.rotate(delta/2);
									
			if(this.animateRay == true)
			{			
				if(this.animateRay) this.geometry.remove(this.geometry.getObjectByName("ray"));
				this.rayRadius = Math.min(this.rayRadius + delta, 1);
				this.displayRay();
			}
		}
	}
	
	displayRay()
	{
		var geometry = new THREE.CylinderGeometry( this.rayRadius/2, this.rayRadius, this.y + 0.5, 32 );				
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.name="ray";
		cylinder.position.y = this.y/2+0.5;
		material.transparent = true;
		material.opacity = 0.5;
		material.opacity = 0.5;
		this.geometry.add( cylinder );
	}
	
	changeRayStatus()
	{
		this.animateRay=!this.animateRay;
		if(!this.animateRay)
		{
			this.geometry.remove(this.geometry.getObjectByName("ray"));
			this.release();
			this.rayRadius = 0;
		}
		
		else{ this.rayRadius = 0; }
	}
	
	kidnap( object )
	{
		if(this.passenger == null)
		{
			var dist = Math.sqrt(Math.pow(this.x - object.x, 2) + Math.pow(this.z - object.z, 2));
			if(dist < this.rayRadius/2)
			{	
				object.elevation = 1; 
				this.passenger = object;
			}
		}
	}
	
	release()
	{
		if(!!this.passenger)
		{
			this.passenger.elevation = - 4;
			this.passenger.timeFlying = 0;
			this.passenger.isFlying = 0;
			this.passenger = null;
		}
	}
	
}