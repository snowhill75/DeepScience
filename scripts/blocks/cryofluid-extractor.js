const ekstraktor = extendContent(GenericCrafter, "cryofluid-extractor", {
    load(){
        this.super$load();
        
        this.baseRegion = Core.atlas.find(this.name + "-base");
        this.region = Core.atlas.find("clear");
        this.wheelRegion = Core.atlas.find(this.name + "-wheel");
        this.plateRegion = Core.atlas.find(this.name + "-plate");
    },
    
    generateIcons(){
    return [
        Core.atlas.find(this.name),
        Core.atlas.find(this.name + "-wheel"),
        Core.atlas.find(this.name + "-plate")
    ];},    draw: function(tile){
        entity = tile.ent();
        
        Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
        Draw.blend(Blending.additive);
        Draw.alpha((0.5 + Mathf.absin(Time.time(), 5, 0.5)) * entity.heat);
        Draw.rect(this.regionLights, tile.drawx(), tile.drawy());
        Draw.blend();
        Draw.color();
    },
    
    drawLayer: function(tile){
        entity = tile.ent();
        
        Draw.rect(this.wheelRegion, tile.drawx(), tile.drawy(), entity.recoil);
		Draw.blend(Blending.additive);
        Draw.alpha((0.5 + Mathf.absin(Time.time(), 5, 0.5)) * entity.heat);
        Draw.rect(this.plateRegion, tile.drawx(), tile.drawy(), -entity.recoil);
		Draw.blend();
        Draw.color();
    },
});