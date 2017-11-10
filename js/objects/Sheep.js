class Sheep extends Element
{
	
	constructor(x, y, z, name = '') 
	{
		super(x, y, z, name);
    
		this.geomPath = "models/Shirley/";
		this.geomFile = "Shirley.obj";
		this.matFile = "Shirley.mtl";
		
		this.elevation = 0;
		this.maxElevation = 5/2;
		this.scale = 0.1;  
		this.timeFlying = 0;
		this.isFlying=0;
		this.speakCountDown = Math.random()* 120;
		this.turnCountDown = 0;
	}
	
	initGeometry( mesh )
	{
		// position
		mesh.position.x = this.x;
		mesh.position.y = this.y;
		mesh.position.z = this.z;
		mesh.scale.set(this.scale, this.scale, this.scale);
		mesh.rotation.y = Math.random()* 2 * Math.PI;
				
		// axis helper
		var axisHelper = new THREE.AxisHelper(1);	
		axisHelper.visible=this.displayAxisHelpers;
		mesh.add(axisHelper);				
		
		// add to scene
		this.geometry = mesh;
	}
	
	elevate( delta )
	{
		if(!this.isFlying) 
		{
			if(this.y == this.maxElevation && this.elevation == 1)
			{ 
				this.isFlying=1;
				this.speak();
			}
			else 
			{
				var diff = this.y + (delta * this.elevation);
				if(this.elevation > 0){ diff = Math.min(this.maxElevation, diff); }
				this.y = Math.max(0, diff);
			}
		}
		if(this.isFlying)
		{
			this.timeFlying+=delta;
			this.y += Math.cos(this.timeFlying)/100;
		}
		if(this.y==0) this.elevation = 0;
		
		this.geometry.position.y = this.y;
	}
	
	animate(delta)
	{
		if(typeof this.geometry == 'object' && this.geometry!=null) 
		{
			if(!this.isFlying)
			{
				this.elevate(delta);
				if(this.turnCountDown>0) this.turn(delta);
				this.moveForward(delta);
			}
		}
				
		this.speakCountDown-=delta;
		if(this.speakCountDown<=0)
		{
			this.speak( 0.8 /this.distanceTo(spaceship));
			this.speakCountDown = Math.random()* 120;
		}
		
		if(this.turnCountDown == 0 && Math.ceil(Math.random() * 100) == 100) this.turnCountDown = Math.random() * Math.PI;
	}
	
	distanceTo(iElement)
	{
		var dist = -1;
		if(typeof iElement == 'object' && iElement!=null)
		{
			var dX = iElement.x - this.x;
			var dZ = iElement.z - this.z;
			dist = Math.sqrt(Math.pow(dX,2)+Math.pow(dZ,2));
		}
		return dist;
		
	}
	
	speak(iVolume = 0.8)
	{
		// create a global audio source
		var sound = new THREE.Audio( audioListener );

		var audioLoader = new THREE.AudioLoader();
		var soundArray = ['sounds/sheep.wav', 'sounds/sheep01.wav'];

		//Load a sound and set it as the Audio object's buffer
		audioLoader.load( soundArray[Math.ceil(Math.random()* 2)-1], function( buffer ) {
			sound.setBuffer( buffer );
		//	sound.setLoop( true );
			sound.setVolume(iVolume);
			sound.play();
		});
	}
	
	moveForward(iDelta)
	{
		var vector = new THREE.Vector3( 0, 0, iDelta );
		vector.applyQuaternion( this.geometry.quaternion );
		this.moveX(vector.x);
		this.moveY(vector.y);
		this.moveZ(vector.z);
	}
	
	turn(iDelta)
	{
		var turnSpeed = Math.PI/4; // PI/4 = 1 sec
		var angle = turnSpeed * iDelta;
		if(angle > this.turnCountDown) angle = this.turnCountDown;
		this.geometry.rotation.y += angle;
		this.turnCountDown-=angle;
	}
}