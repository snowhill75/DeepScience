const bruhash = extendContent(LaserTurret, "ash", {
  load(){
    this.super$load() 
    this.baseRegion = Core.atlas.find(this.name + "-base");
  },
  generateIcons(){
		return [
			Core.atlas.find(this.name + "-base"),
			Core.atlas.find(this.name)
		];
	}
});

//Normally takes 30/sec to cool. Change this to multiply that amount.
var fluidCostMultiplier = 2;

//Editable stuff for custom laser.
//4 colors from outside in. Normal meltdown laser has trasnparrency 55 -> aa -> ff (no transparrency) -> ff(no transparrency)
var colors = [Color.valueOf("BC545255"), Color.valueOf("C45F5Faa"), Color.valueOf("D06B53"), Color.valueOf("E07155")];
//Number of beams
var lasers = 1;

//The number of values in the next 4 arrays is the number of beams you have. First values in each go to the first beam, second values go to the second, etc.
//Beam angles in degrees
const spread = [0];
//Shift beam left or right. Negative is left, 0 is middle.
const spacing = [0];
//Shift beam foward or backward. Negative is backward, 0 is middle. Note that it counts from the start of the widest section.
const position = [-6];
//Length of beam. Uses same 8 per tile rule.
var length = [220];

//Stuff you probably shouldn't edit unless you know what you're doing.
//Width of each section of the beam from thickest to thinnest
var tscales = [1, 0.7, 0.5, 0.2];
//Overall width of each color
var strokes = [4, 3, 2, 0.6];
//Determines how far back each section in the start should be pulled
var pullscales = [1, 1.12, 1.15, 1.17];
//Determines how far each section of the end should extend past the main thickest section
var lenscales = [1, 1.12, 1.15, 1.17];

var tmpColor = new Color();
const vec = new Vec2();

bruhash.consumes.add(new ConsumeLiquidFilter(boolf(liquid=>liquid.temperature<=0.5&&liquid.flammability<0.1), 0.5 * fluidCostMultiplier)).update(false);
bruhash.coolantMultiplier = 1 / fluidCostMultiplier;

bruhash.shootType = extend(BasicBulletType, {
  update: function(b){
    if(b.timer.get(1, 5)){
      for(var v = 0; v < lasers; v++){
        vec.trns(b.rot() - 90, spacing[v], position[v]);
        Tmp.v1.trns(b.rot() + angleB + 180.0, (pullscales[4] - 1.0) * 55.0);
        var angleB = spread[v];
        var baseLen = length[v] * b.fout();
        Damage.collideLine(b, b.getTeam(), this.hitEffect, b.x + vec.x, b.y + vec.y, b.rot() + angleB, length[v] + length[v]/8.75, true);
      }
    }
  },
  draw: function(b){
    
    for(var s = 0; s < 4; s++){
      Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time(), 1.0, 0.3)));
      for(var i = 0; i < 4; i++){
        for(var v = 0; v < lasers; v++){
          vec.trns(b.rot() - 90, spacing[v], position[v]);
          Tmp.v1.trns(b.rot() + angleB + 180.0, (pullscales[i] - 1.0) * 55.0);
          var angleB = spread[v];
          var baseLen = length[v] * b.fout();
          Lines.stroke((4 + Mathf.absin(Time.time(), 0.8, 1.5)) * b.fout() * strokes[s] * tscales[i]);
          Lines.lineAngle(b.x + Tmp.v1.x + vec.x, b.y + Tmp.v1.y + vec.y, b.rot() + angleB, baseLen * b.fout() * lenscales[i], CapStyle.none);
        }
      }
    };
    Draw.reset();
  }
});

bruhash.shootType.hitEffect = Fx.hitMeltdown;
bruhash.shootType.despawnEffect = Fx.none;
bruhash.shootType.damage = 107; //Multiply by 12 for dps
bruhash.shootType.hitSize = 4;
bruhash.shootType.lifetime = 16;
bruhash.shootType.drawSize = 420;
bruhash.shootType.pierce = true;
bruhash.shootType.speed = 0.001;