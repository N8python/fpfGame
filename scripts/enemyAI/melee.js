class MeleeEnemyAI extends EnemyAI {
    constructor(enemy) {
        super(enemy, 100);
        this.enemy.animation.play('Idle');
        this.enemy.cooldown = 0;
    }
    update(target, ground) {
        //console.log(this.enemy.body.position);
        super.update(target, ground);
        this.stayUp(1);
        if (this.enemy.health === 0) {
            if (!this.enemy.dead) {
                resetButton.style.display = "block";
                gameOverMessage.innerHTML = "You Won!";
                shopButton.style.display = "block";
                playerWin();
                this.enemy.dead = true;
                this.enemy.animation.play("Death", 120, false);
            }
        }
        if (this.enemy.dead) {
            return;
        }
        /*const raycaster = new THREE.Raycaster();
        raycaster.set(this.enemy.position.clone().add(new THREE.Vector3(2 * Math.sin(this.enemy.body.rotation.y), 1, 2 * Math.cos(this.enemy.body.rotation.y))), new THREE.Vector3(0, -Math.PI / 2, 0));
        let closeToEdge = false;
        if (raycaster.intersectObject(ground).length === 0) {
            closeToEdge = true;
        }
        raycaster.set(this.enemy.position.clone().add(new THREE.Vector3(-1 * Math.sin(this.enemy.body.rotation.y), 1, -1 * Math.cos(this.enemy.body.rotation.y))), new THREE.Vector3(0, -Math.PI / 2, 0));
        let edgeBehind = false;
        if (raycaster.intersectObject(ground).length === 0) {
            edgeBehind = true;
        }*/
        this.enemy.cooldown--;
        if (this.enemy.cooldown === 0) {
            if (this.enemy.position.distanceTo(target.position) > 3 && this.enemy.aggro && target.health > 0) {
                this.enemy.animation.play("Running");
                this.enemy.attacking = false;
            }
        }
        if ((this.enemy.position.distanceTo(target.position) < 5 || this.enemy.health < this.enemy.maxHealth || this.enemy.aggro) && !this.enemy.attacking && target.health > 0) {
            if (!this.enemy.aggro) {
                this.enemy.animation.play("Running");
            }
            this.enemy.aggro = true;
            //const theta = Math.atan2(target.position.x - this.enemy.position.x, target.position.z - this.enemy.position.z);
            //this.enemy.body.setVelocity((this.enemy.body.velocity.x + (edgeBehind ? 0.2 : 0.15) * Math.sin(this.enemy.body.rotation.y)) * (edgeBehind ? 0.9 : 0.975), this.enemy.body.velocity.y, (this.enemy.body.velocity.z + (edgeBehind ? 0.2 : 0.15) * Math.cos(this.enemy.body.rotation.y)) * (edgeBehind ? 0.9 : 0.975));
            //console.log(this.enemy.body);
            //console.log((theta - this.enemy.rotation.y));
            //this.enemy.body.setAngularVelocityY(-angleDifference(theta, this.enemy.body.rotation.y) * 4);
            this.rotateTowards(player.position.x, player.position.z);
            this.moveYDir();
        }
        //return;
        if (Math.abs(target.position.y - this.enemy.position.y) > 8 || target.health === 0) {
            if (this.enemy.aggro) {
                if (target.health === 0) {
                    this.enemy.animation.play("Celebrate");
                } else {
                    this.enemy.animation.play("Idle");
                }
            }
            this.enemy.aggro = false;
            this.enemy.attacking = false;
        }
        if (this.enemy && this.enemy.body && this.enemy.position.distanceTo(target.position) < 3 && this.enemy.cooldown < 0 && target.health > 0) {
            if (!this.enemy.attacking) {
                this.enemy.animation.play("Slashing");
            }
            this.enemy.attacking = true;
            this.enemy.cooldown = 90;
            setTimeout(() => {
                soundManager.slashLong.setVolume(soundManager.random(0.4, 0.6) * localProxy.sfxVolume);
                soundManager.slashLong.rate(soundManager.random(0.75, 1.25));
                soundManager.slashLong.play();
                if (this.enemy.position.distanceTo(target.position) < 3.5) {
                    if (blocking && target === player && cooldown < 10) {
                        targetCooldown = 100;
                    } else {
                        target.body.setVelocity(target.body.velocity.x + 5 * Math.sin(this.enemy.body.rotation.y), target.body.velocity.y + 4, target.body.velocity.z + 5 * Math.cos(this.enemy.body.rotation.y));
                        if (target.health) {
                            playerTakeDamage(Math.floor(Math.random() * 7 + 5), "melee");
                        }
                    }
                }
            }, 500);
        }
    }
    static loadEnemy(instance) {
        instance.enemy = new ExtendedObject3D();
        instance.third.load.fbx('melee-enemy').then(object => {
            //object.scale.set(0.0075, 0.0075, 0.0075);
            instance.enemy.add(object);
            instance.enemy.position.set(0, 1, 5);
            instance.enemy.scale.set(0.0075, 0.0075, 0.0075);
            instance.third.animationMixers.add(instance.enemy.animation.mixer);
            instance.enemy.animation.add('Idle', object.animations[0]);
            instance.third.load.fbx("melee-sword").then(object => {
                object.children.pop();
                object.children.pop();
                object.children.pop();
                object.scale.set(0.03, 0.03, 0.03);
                //this.third.add.existing(object);
                instance.enemy.traverse(child => {
                    if (child.name === 'mixamorig6RightHand') {
                        //console.log("YAY")
                        //this.third.add.box({ width: 20, height: 20, depth: 20 })
                        child.add(object);
                    }
                })
            });
            instance.third.add.existing(instance.enemy);
            instance.third.physics.add.existing(instance.enemy, { shape: 'box', ignoreScale: true, offset: { y: -0.5 } });
            objects.push(instance.enemy);
            instance.enemy.loaded = true;
            //animations.slice(1).forEach(key => {
            /*this.third.load.fbx(`Warrior Running.fbx`).then(object => {
                //console.log(JSON.stringify(object.animations[0]));
                this.enemy.animation.add("R", THREE.AnimationClip.parse(JSON.parse(JSON.stringify(object.animations[0].toJSON()))));
                //this.enemy.animation.play('R');
                //this.enemy.animation.mixer._actions[0].setEffectiveWeight(1);
                //this.enemy.animation.mixer._actions[1].setEffectiveWeight(0);
                this.third.load.fbx("Warrior Slash.fbx").then(object => {
                    this.enemy.animation.add("S", object.animations[0]);
                    //this.enemy.animation.play('S');
                    //this.enemy.animation.mixer._actions[2].setEffectiveWeight(0);
                    this.third.load.fbx("Warrior Death.fbx").then(object => {
                        this.enemy.animation.add("D", object.animations[0]);
                        this.enemyAI = new EnemyAI(this.enemy);
                    })
                });
            });*/
            const animsToLoad = ["running", "slashing", "death", "celebrate"];
            (async() => {
                loading.innerHTML = `Loading Enemy Animations (0/${animsToLoad.length})...`;
                for (const anim of animsToLoad) {
                    loading.innerHTML = `Loading Enemy Animations (${animsToLoad.indexOf(anim)}/${animsToLoad.length})...`;
                    const animText = await fetch(`./assets/enemies/meleeEnemy/animations/warrior-${anim}.json`);
                    const animJson = await animText.json();
                    instance.enemy.animation.add(anim[0].toUpperCase() + anim.slice(1).toLowerCase(), THREE.AnimationClip.parse(animJson));
                }
                instance.enemyAI = new MeleeEnemyAI(instance.enemy);
                loading.innerHTML = `Loaded!`;
                setTimeout(() => {
                    loading.innerHTML = "";
                })
            })();
            //})
            //this.third.add.existing(object);
            //this.third.physics.add.existing(object);
        });
    }
}