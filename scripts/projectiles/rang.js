class Rang {
    constructor({
        scene,
        model,
        x,
        y,
        z,
        xVel,
        yVel,
        zVel
    }) {
        this.rang = new ExtendedObject3D();
        this.rang.add(model.clone());
        this.rang.position.set(x, y, z);
        this.rang.scale.set(0.25, 0.25, 0.25);
        this.rang.lookAt(new THREE.Vector3(x + xVel, y + yVel, z + zVel));
        scene.third.add.existing(this.rang);
        scene.third.physics.add.existing(this.rang, { shape: 'hull', color: 'brown' });
        objects.push(this.rang);
        setTimeout(() => {
            this.rang.body.transform();
            this.rang.body.setFriction(0.5);
            this.rang.body.setVelocity(xVel, yVel, zVel);
            this.rang.body.on.collision((otherObject, event) => {
                if (otherObject === mainScene.enemy && event === "collision" && this.rang.damageCooldown < 1) {
                    mainScene.enemy.health -= 5 + Math.random() * 8;
                    mainScene.enemy.health = Math.max(mainScene.enemy.health, 0);
                    this.rang.damageCooldown = 15;
                }
            });
        });
        this.rang.tick = 0;
        this.rang.damageCooldown = 0;
    }
    update() {
        this.rang.tick++;
        this.rang.damageCooldown--;
        this.rang.body.setAngularVelocityY(this.rang.body.angularVelocity.y * 0.9 + 2.5);
        if (this.rang.tick > 75) {
            const angleToPlayer = Math.atan2(player.position.x - this.rang.position.x, player.position.z - this.rang.position.z);
            this.rang.body.setVelocity(this.rang.body.velocity.x * 0.9 + 2.5 * Math.sin(angleToPlayer), this.rang.body.velocity.y + (this.rang.position.y < player.position.y ? 0.05 : -0.05), this.rang.body.velocity.z * 0.9 + 2.5 * Math.cos(angleToPlayer));
        }
    }
    get body() {
        return this.rang;
    }
}