class Weapon {
    constructor({ minDamage, maxDamage }) {
        this.minDamage = minDamage;
        this.maxDamage = maxDamage;
    }
    handleSwing({ rightBound, leftBound, buff = 0, reach = 3.5, knockback = 1, verticalKnockback = 2.5 }) {
        objects.forEach(object => {
            const theta = Math.atan2(object.position.x - player.position.x, object.position.z - player.position.z);
            const dist = Math.hypot(object.position.x - player.position.x, object.position.z - player.position.z);
            const direction = new THREE.Vector3();
            const rotation = mainScene.third.camera.getWorldDirection(direction)
            const cTheta = Math.atan2(rotation.x, rotation.z);
            const angleDiff = cTheta - theta;
            if (angleDiff < rightBound && angleDiff > leftBound && dist < reach && Math.abs(object.position.y - player.position.y) < 2 && !object.dead) {
                let blocked = false;
                if (object.aggroState && (object.strafeCounter !== undefined || object.isBomber)) {
                    if (slashing) {
                        if (Math.random() < 0.33 + (object.isBomber ? -0.33 : 0)) {
                            soundManager.metalBlock.setVolume(soundManager.random(0.75, 1.25) * localProxy.sfxVolume);
                            soundManager.metalBlock.rate(soundManager.random(0.75, 1.25));
                            soundManager.metalBlock.play();
                            object.animation.play("Block");
                            blocked = true;
                        }
                    } else {
                        if (Math.random() < 0.2 + (object.isBomber ? -0.2 : 0)) {
                            soundManager.metalBlock.setVolume(soundManager.random(0.75, 1.25) * localProxy.sfxVolume);
                            soundManager.metalBlock.rate(soundManager.random(0.75, 1.25));
                            soundManager.metalBlock.play();
                            object.animation.play("Block");
                            blocked = true;
                        }
                    }
                    if (blocked === true) {
                        setTimeout(() => {
                            targetXRot = 0.5;
                        }, 0);
                        if (object.isBomber) {
                            object.aggroState = "block";
                        }
                    }
                    if (Math.random() < 0.25 && !blocked) {
                        object.aggroState = "flee";
                    }
                    if (object.health < 30 && !blocked) {
                        if (Math.random() < 0.25) {
                            object.aggroState = "flee";
                        }
                    }
                }
                if (object.isBoss && object.blocking) {
                    soundManager.metalBlock.setVolume(soundManager.random(0.75, 1.25) * localProxy.sfxVolume);
                    soundManager.metalBlock.rate(soundManager.random(0.75, 1.25));
                    soundManager.metalBlock.play();
                    blocked = true;
                }
                if (!blocked) {
                    object.body.transform();
                    object.body.setVelocity(object.body.velocity.x + 3 * knockback * (1 + +slashing) * Math.sin(theta), object.body.velocity.y + verticalKnockback, object.body.velocity.z + 3 * knockback * (1 + +slashing) * Math.cos(theta));
                }
                if (object.health && !blocked) {
                    soundManager.metalHit.setVolume(soundManager.random(0.1, 0.2) * localProxy.sfxVolume);
                    soundManager.metalHit.rate(soundManager.random(0.75, 1.25));
                    soundManager.metalHit.play();
                    object.health -= Math.floor(Math.random() * (this.maxDamage - this.minDamage) + this.minDamage + 3 * +slashing) + buff;
                    object.health = Math.max(0, object.health);
                }
            }
        });
    }
}